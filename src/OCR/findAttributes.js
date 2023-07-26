import {papersDefinition} from './papers';

const MAX_TEXT_SHIFT_THRESHOLD = 5; // in %
const MAX_LINE_SHIFT_THRESHOLD = 5; // in px

const normalizeReferenceText = text => {
  // TODO: strip weird character & co ?
  return text
    .toUpperCase()
    .replace(/\s/g, '')
    .replace(/ç/g, 'c')
    .replace(/'/g, '');
};

const removeSpaces = text => {
  return text.replace(/\s/g, '');
};

const computeEuclideanDistance = (box1, box2) => {
  let xDist = Math.pow(box1.left - box2.left, 2);
  let yDist = Math.pow(box1.top - box2.top, 2);
  return Math.sqrt(xDist + yDist);
};

const computeDistanceByBoxRatio = (
  boxBounding,
  templateBounding,
  shiftBounding,
  imgSize,
) => {
  const normalizedBox = {
    left: (boxBounding.left - shiftBounding.left) / imgSize.width,
    top: (boxBounding.top - shiftBounding.top) / imgSize.height,
  };

  return computeEuclideanDistance(normalizedBox, templateBounding);
};

const transformDate = (attribute, text) => {
  const defaultDateFormat = 'ddMMyyyy';
  const dateFormat = attribute.dateFormat || defaultDateFormat;
  const dateLength = dateFormat.length;

  const newText = text.replace(/[.,-/]/g, '');
  const dateRegex = new RegExp(`\\d{${dateLength}}$`);
  const match = newText.match(dateRegex);
  if (!match) {
    return '';
  }
  const date = match[0];
  const newDate =
    date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4);

  return newDate;
};

const postTextProcessingRules = (attribute, str) => {
  let newStr = str;
  if (attribute.postTextRules) {
    for (const rule of attribute.postTextRules) {
      if (rule.regex) {
        // Default is removing
        newStr = newStr.replace(rule.regex, rule.replace || '');
        console.log('new str : ', newStr);
      }
    }
  }
  newStr =
    attribute.type === 'date' ? transformDate(attribute, newStr) : newStr;

  return newStr;
};

const postProcessing = attributes => {
  const textProcessed = attributes.map(attr => {
    return {
      ...attr,
      value: postTextProcessingRules(attr, attr.value),
    };
  });

  const groups = {};
  for (const attr of textProcessed) {
    if (attr.group) {
      if (groups[attr.group.name]) {
        groups[attr.group.name].push(attr);
      } else {
        groups[attr.group.name] = [attr];
      }
    }
  }
  console.log('group : ', groups);
  const mergedGroups = [];
  for (const group of Object.values(groups)) {
    const sortedGroup = group.sort((a, b) => a.group.order - b.group.order);
    console.log({sortedGroup});
    const groupedText = sortedGroup.reduce((acc, attr) => {
      acc += attr.value;
      return acc;
    }, '');
    mergedGroups.push({
      ...group[0],
      value: groupedText,
      name: group[0].group.name,
    });
  }
  const processed = textProcessed
    .filter(attr => !attr.group)
    .map(attr => {
      const attribute = {
        name: attr.name,
        value: attr.value,
      };
      if (attr.distance) {
        attribute.distance = attr.distance;
      }
      return attribute;
    })
    .concat(mergedGroups);
  return processed;
};

const findTextBounds = OCRResult => {
  let {left, top} = OCRResult[0].bounding; // init
  let bottom = top;
  let right = left;
  for (const block of OCRResult) {
    if (block.bounding.top < top) {
      top = block.bounding.top;
    }
    if (block.bounding.left < left) {
      left = block.bounding.left;
    }
    if (block.bounding.top + block.bounding.height > bottom) {
      bottom = block.bounding.top + block.bounding.height;
    }
    if (block.bounding.left + block.bounding.width > right) {
      right = block.bounding.left + block.bounding.width;
    }
  }
  return {left, top, right, bottom};
};

const isDocumentCropped = (paper, textBounding, imgSize) => {
  const shiftBoundingPercent = {
    left: (textBounding.left / imgSize.width) * 100,
    top: (textBounding.top / imgSize.height) * 100,
  };
  const shiftAttrBoundingPercent = {
    left: (paper.textBounding.left / paper.size.width) * 100,
    top: (paper.textBounding.top / paper.size.height) * 100,
  };
  console.log({shiftBoundingPercent});
  console.log({shiftAttrBoundingPercent});

  const leftDiff = Math.abs(
    shiftBoundingPercent.left - shiftAttrBoundingPercent.left,
  );
  const topDiff = Math.abs(
    shiftBoundingPercent.top - shiftAttrBoundingPercent.top,
  );

  // This threshold is purely arbitrary and open to debate
  if (
    leftDiff < MAX_TEXT_SHIFT_THRESHOLD &&
    topDiff < MAX_TEXT_SHIFT_THRESHOLD
  ) {
    return true;
  }
  return false;
};

const findAttributesByBox = (OCRResult, paper, imgSize) => {
  const attributesToFind = paper.attributesBoxes
    ? paper.attributesBoxes.filter(att => !(att.enabled === false))
    : [];

  const textShiftBounding = {top: 0, left: 0};
  const textAreaSize = {...imgSize};

  let handleNotCentered = false;
  const canHandleNotCentered = paper.textBounding ? true : false;
  if (canHandleNotCentered) {
    const textBounds = findTextBounds(OCRResult);
    console.log('text bounds : ', textBounds);
    textAreaSize.width = textBounds.right - textBounds.left;
    textAreaSize.height = textBounds.bottom - textBounds.top;

    const isCropped = isDocumentCropped(paper, textBounds, imgSize);
    console.log('is doc cropped: ', isCropped);
    handleNotCentered = !isCropped;
    if (handleNotCentered) {
      textShiftBounding.left = textBounds.left;
      textShiftBounding.top = textBounds.top;
    }
  }

  // We apply a different strategy depending on if the doc is correctly cropped or not
  // If the doc is not properly cropped, we use the text bounds to normalize the coordinates
  // However, it is not clear how useful it is, as the tests seem rather satisfying even when
  // applying the text bounds strategy on cropped docs. Furthermore, establishing a "cropped threshold"
  // is not an easy task and might result is false positive/negative...
  // Nevertheless, our intuition is the cropped strategy will achieve better results, so we prefer to
  // keep it like this to avoid potentially degrading the experience when the document is properly cropped.
  // Must that might be challenged in the future.

  const foundAttributes = [];

  for (const attr of attributesToFind) {
    console.log('------attr : ', attr);
    const normalizedAttrBouding = {left: 0, top: 0};
    if (handleNotCentered) {
      normalizedAttrBouding.left =
        (attr.bounding.left - paper.textBounding.left) /
        (paper.textBounding.right - paper.textBounding.left);
      normalizedAttrBouding.top =
        (attr.bounding.top - paper.textBounding.top) /
        (paper.textBounding.bottom - paper.textBounding.top);
    } else {
      normalizedAttrBouding.left = attr.bounding.left / paper.size.width;
      normalizedAttrBouding.top = attr.bounding.top / paper.size.height;
    }

    let minDistance = 100000;
    let matchingEl;
    const size = handleNotCentered ? textAreaSize : imgSize;
    console.log('size : ', size);

    for (const block of OCRResult) {
      for (const line of block.lines) {
        let cptLineElements = 0;
        for (const el of line.elements) {
          let distance;
          distance = computeDistanceByBoxRatio(
            el.bounding,
            normalizedAttrBouding,
            textShiftBounding,
            size,
          );
          // console.log('dist', distance);
          // console.log('el', el);

          if (distance < minDistance) {
            console.log(' min dist : ', distance);
            //console.log('found min dist for el ', el);

            matchingEl = {...el};
            minDistance = distance;

            if (attr.fullLine && line.elements.length > cptLineElements + 1) {
              // Let's try to find more text on the right
              for (let i = cptLineElements + 1; i < line.elements.length; i++) {
                const nextEl = line.elements[i];
                matchingEl.text += nextEl.text;
              }
            }
          }
          cptLineElements++;
        }
      }
    }
    if (matchingEl) {
      console.log('value matched : ', matchingEl.text);
      console.log('dist matched : ', minDistance);

      const isValid = checkValidationRules(attr, matchingEl.text);
      if (isValid) {
        foundAttributes.push({
          ...attr,
          value: matchingEl.text,
          distance: minDistance,
        });
      }
    }
  }

  return foundAttributes;
};

const checkValidationRules = (attribute, text) => {
  if (!attribute.validationRules) {
    return true;
  }
  if (!text) {
    return false;
  }
  let isValid = true;
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid;
    }
    if (rule.regex) {
      isValid = rule.regex.test(text);
    }
  }
  return isValid;
};

const checkValidationRulesFn = (attribute, match) => {
  if (!attribute.validationRules) {
    return true;
  }
  let isValid = true;
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid;
    }
    if (rule.validationFn) {
      isValid = rule.validationFn(match[rule.regexGroupIdx]);
    }
  }
  return isValid;
};

const findAttributeInText = (searchedAttribute, text) => {
  const normalizedText = searchedAttribute.oneWord ? text : removeSpaces(text);
  const result = normalizedText.match(searchedAttribute.regex);
  if (result?.length > 0) {
    console.log('----------GOTCHA : ', result);
    if (searchedAttribute.validationRules?.length > 0) {
      if (!checkValidationRulesFn(searchedAttribute, result)) {
        return null;
      }
    }
    return {
      name: searchedAttribute.name,
      value: result[0],
      postTextRules: searchedAttribute.postTextRules,
    };
  }
  return null;
};

/**
 * In some situations, the matching text will be incomplete, because of
 * how the OCR will split the elements.
 * For instance, the regex on IBAN is not a fixed length, as it can vary up to 34 chars.
 * If the OCR splits the IBAN in several blocks, the left one might be considered as valid,
 * even though some chars are missing.
 * To cope with this, we add this step to try to find the most chars on the right, on the same
 * line, i.e. with the same Y coordinate but with a greater X.

 */
const findMatchingTextOnSameLine = (
  OCRResult,
  matchingBox,
  matchText,
  searchedAttribute,
) => {
  const top = matchingBox.bounding.top;
  const right = matchingBox.bounding.left + matchingBox.bounding.width;
  let finalMatchText = matchText;

  let rightText = '';
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        if (
          Math.abs(el.bounding.top - top) < MAX_LINE_SHIFT_THRESHOLD &&
          el.bounding.left > right
        ) {
          // find other element on same line, on the right
          rightText += el.text;
          const mergedText = matchText + rightText;
          if (findAttributeInText(searchedAttribute, mergedText)) {
            finalMatchText = mergedText;
          }
        }
      }
    }
  }

  console.log('--------final text : ', finalMatchText);

  return finalMatchText;
};

const findAttribute = (OCRResult, box, searchedAttribute) => {
  const attr = findAttributeInText(searchedAttribute, box.text);
  if (attr) {
    // Extra step to find splitted text
    const newMatchText = findMatchingTextOnSameLine(
      OCRResult,
      box,
      attr.value,
      searchedAttribute,
    );
    attr.value = newMatchText;
    return attr;
  }
  return null;
};

const findAttributeInLines = (OCRResult, searchedAttribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      const attr = findAttribute(OCRResult, line, searchedAttribute);
      if (attr) {
        return attr;
      }
    }
  }
  return null;
};

const findAttributeInElements = (OCRResult, searchedAttribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        const attr = findAttribute(OCRResult, el, searchedAttribute);
        if (attr) {
          return attr;
        }
      }
    }
  }
};

const findAttributesByRegex = (OCRResult, paper) => {
  const attributesToFind = paper.attributesRegex
    ? paper.attributesRegex.filter(att => !(att.mandatory === false))
    : [];
  const foundAttributes = [];
  for (const attr of attributesToFind) {
    /**
     * Searching by line first rather than elements avoids to find false positive.
     * Typically for BIC, the regex is not very discriminative and can match other elemnts.
     * But the actual BIC is quite often a separated block in OCR, while false positive such
     * as a name will be detected alongside other attributes on the same line.
     * Note we do not search by block, at is this seems not necessary and adds complexity when
     * trying to detect other text on the same Y coordinates.
     */

    // Try to find directly by the lines
    const resultByLines = findAttributeInLines(OCRResult, attr);
    if (resultByLines) {
      foundAttributes.push(resultByLines);
      continue;
    }
    // If it failed, try to find by elements
    const resultByElements = findAttributeInElements(OCRResult, attr);
    if (resultByElements) {
      foundAttributes.push(resultByElements);
      continue;
    }
  }
  return foundAttributes;
};

const findReferenceTextBound = (blocks, paper) => {
  if (!paper.referenceBox) {
    return null;
  }

  // Useful to avoid being too aggressive on the include. Be careful of not setting it too high,
  // as you can have legitimate 2 letters, e.g. "DE"
  const minLength = 1;
  const referenceText = paper.referenceBox.text;
  console.log('ref text : ', referenceText);

  let splittedBlocksText = '';

  for (const block of blocks) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        const normalizeRefText = normalizeReferenceText(el.text);

        if (normalizeRefText === referenceText) {
          console.log('-- Found reference matching box: exact');
          return true;
        }
        if (
          normalizeRefText.length > minLength &&
          referenceText.includes(normalizeRefText)
        ) {
          splittedBlocksText += normalizeRefText;
        }
      }
    }
  }
  console.log('block text : ', splittedBlocksText);
  if (
    splittedBlocksText === referenceText ||
    splittedBlocksText.includes(referenceText)
  ) {
    console.log('-- Found reference matching box: splitted blocks');
    return true;
  }
  return false;
};

const findPaper = (OCRResult, papers) => {
  for (const paper of papers) {
    if (paper.front && findReferenceTextBound(OCRResult, paper.front)) {
      return {name: paper.name, definition: paper.front};
    }
    if (paper.back && findReferenceTextBound(OCRResult, paper.back)) {
      return {name: paper.name, definition: paper.back};
    }
  }
  return null;
};

/**
 * The paperType + face are used as fallback
 * when no paper is automatically found
 */
export const findAttributes = (
  OCRResult,
  paperName,
  paperFace,
  autoDetect,
  imgSize,
) => {
  console.log({imgSize});

  if (!OCRResult || OCRResult.length < 1) {
    return null;
  }

  let paper;
  if (autoDetect) {
    paper = findPaper(OCRResult, papersDefinition);
  } else {
    paper = papersDefinition
      .map(def => ({name: def.name, definition: def[paperFace]}))
      .find(def => def.name === paperName);
  }

  console.log('detect paper ', paper);
  if (!paper) {
    return null;
  }

  let attributesByBox = [];

  if (paper.definition.size?.width && paper.definition.size?.height) {
    attributesByBox = findAttributesByBox(OCRResult, paper.definition, imgSize);
  }
  const attributesByRegex = findAttributesByRegex(OCRResult, paper.definition);

  console.log('attributes by regex : ', attributesByRegex);
  console.log('attributes by box : ', attributesByBox);

  const foundAttributes = attributesByBox.concat(attributesByRegex);

  // TODO: when an attribute is both found by box and regex, which one should be kept?
  const processedAttributes = postProcessing(foundAttributes);
  console.log('--------------PROCESSED ATTRIBUTES : ', processedAttributes);
  return {attributes: processedAttributes, paperName: paper.name};
};
