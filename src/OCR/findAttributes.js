import {papersDefinition} from './papers';

const DISTANCE_TOLERANCE = 40;

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

const postTextProcessingRules = (rules, str) => {
  let newStr = str;
  if (!rules) {
    return str;
  }
  for (const rule of rules) {
    if (rule.regex) {
      // Default is removing
      newStr = newStr.replace(rule.regex, rule.replace || '');
    }
  }
  return newStr;
};

const postProcessing = attributes => {
  const textProcessed = attributes.map(attr => {
    return {
      ...attr,
      value: postTextProcessingRules(attr.postTextRules, attr.value),
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

const findAttributesByBox = (OCRResult, paper, imgSize) => {
  const attributesToFind = paper.attributesBoxes
    ? paper.attributesBoxes.filter(att => !(att.enabled === false))
    : [];

  // could be used for cases where the paper is not well centered
  const shiftBounding = {top: 0, left: 0};
  const textAreaSize = {...imgSize};

  let handleNotCentered = paper.textBounding ? true : false;
  if (handleNotCentered) {
    const textBounds = findTextBounds(OCRResult);
    textAreaSize.width = textBounds.right - textBounds.left;
    textAreaSize.height = textBounds.bottom - textBounds.top;
    shiftBounding.left = textBounds.left;
    shiftBounding.top = textBounds.top;
  }

  const foundAttributes = [];

  for (const attr of attributesToFind) {
    console.log('------attr : ', attr);
    const attrBouding = {left: 0, top: 0};
    const notCentered = true; // TODO : détecter quand non centré ? nécessaire ? tester...
    if (handleNotCentered) {
      attrBouding.left =
        attr.bounding.left /
        (paper.textBounding.right - paper.textBounding.left);
      attrBouding.top =
        attr.bounding.top /
        (paper.textBounding.bottom - paper.textBounding.top);
    } else {
      attrBouding.left = attr.bounding.left / paper.size.width;
      attrBouding.top = attr.bounding.top / paper.size.height;
    }

    let minDistance = 100000;
    let matchingEl;
    for (const block of OCRResult) {
      for (const line of block.lines) {
        let cptLineElements = 0;
        for (const el of line.elements) {
          let distance;
          const size = handleNotCentered ? textAreaSize : imgSize;
          distance = computeDistanceByBoxRatio(
            el.bounding,
            attrBouding,
            shiftBounding,
            size,
          );

          // console.log('dist : ', distance);
          //console.log('el : ', el);
          //console.log('el text : ', el.text);
          // console.log('normalized bounds : ', bounds);
          if (distance < minDistance) {
            //console.log('found min dist for el ', el);
            matchingEl = {...el};

            minDistance = distance;
            const hasElementOnright =
              line.elements.length > cptLineElements + 1;
            if (attr.fullLine && hasElementOnright) {
              // Some attributes might be unecessarely splitted, e.g. a name in 2 parts
              const nextEl = line.elements[cptLineElements + 1];
              matchingEl.text += nextEl.text;
            }
          }
          cptLineElements++;
        }
      }
    }
    if (matchingEl) {
      console.log('value matched : ', matchingEl.text);
      console.log('dist matched : ', minDistance);
      foundAttributes.push({
        name: attr.name,
        value: matchingEl.text,
        distance: minDistance,
        postTextRules: attr.postTextRules || [],
        group: attr.group,
      });
    }
  }

  return foundAttributes;
};

const checkValidationRules = (attribute, match) => {
  let isValid = true;
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid;
    }
    isValid = rule.validationFn(match[rule.regexGroupIdx]);
    // if (rule.validationType === 'ISOCountry') {
    //   isValid = checkCountryCode(match[rule.regexGroupIdx]);
    // }
  }
  return isValid;
};

const findAttributeInText = (attribute, text) => {
  const normalizedText = attribute.oneWord ? text : removeSpaces(text);
  const result = normalizedText.match(attribute.regex);
  if (result?.length > 0) {
    console.log('GOTCHA : ', result);
    if (attribute.validationRules?.length > 0) {
      if (!checkValidationRules(attribute, result)) {
        console.log('does not repsect validation rule !');
        return null;
      }
    }
    return {
      name: attribute.name,
      value: result[0],
      postTextRules: attribute.postTextRules,
    };
  }
  return null;
};

const findAttributeInBlocks = (OCRResult, attribute) => {
  for (const block of OCRResult) {
    const attr = findAttributeInText(attribute, block.text);
    if (attr) {
      return attr;
    }
  }
};

const findAttributeInLines = (OCRResult, attribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      const attr = findAttributeInText(attribute, line.text);
      if (attr) {
        return attr;
      }
    }
  }
};

const findAttributeInElements = (OCRResult, attribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        const attr = findAttributeInText(attribute, el.text);
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
    // First, try to find by the coarse-grain blocks
    const resultByBlock = findAttributeInBlocks(OCRResult, attr);
    if (resultByBlock) {
      foundAttributes.push(resultByBlock);
      continue;
    }
    // If it failed, try to find by lines
    const resultByLines = findAttributeInLines(OCRResult, attr);
    if (resultByLines) {
      foundAttributes.push(resultByLines);
      continue;
    }
    // Finally, try by elements
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

export const findAttributes = (OCRResult, paperType, paperFace, imgSize) => {
  // TODO should detect with levheinstein distance? Beware of false positive...
  console.log('OCR result : ', OCRResult);
  console.log({imgSize});

  if (!OCRResult || OCRResult.length < 1) {
    return null;
  }

  // try to auto find paper
  const foundPaper = findPaper(OCRResult, papersDefinition);
  console.log('Auto find paper : ', foundPaper);
  const paper = foundPaper
    ? foundPaper
    : papersDefinition
        .map(def => ({name: def.name, definition: def[paperFace]}))
        .find(def => def.name === paperType);
  console.log('paper : ', paper);

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
