import React from 'react';

import {papersDefinition} from './papers';
import {ISOCountries} from './consts';

const DISTANCE_TOLERANCE = 40;
const SAME_LINE_MAX_Y_DIFF = 5;

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

const computeDistance = (box1, box2, yWeight = 1) => {
  // Euclidean dist
  let xDist = Math.pow(box1.left - box2.left, 2);
  let yDist = Math.pow(box1.top - box2.top, 2) * yWeight;
  return Math.sqrt(xDist + yDist);
};

const computeDistanceWithRefDist = (box1, box2, distX, distY) => {
  const kX = (box2.left + distX) / box1.left;
  const kY = (box2.top + distY) / box1.top;

  // const kX = 1;
  // const kY = 2.23;
  let xDist = Math.pow(box1.left * kX - distX - box2.left, 2);
  let yDist = Math.pow(box1.top * kY - distY - box2.top, 2);

  console.log({xDist, yDist});
  return Math.sqrt(xDist + yDist);
};

const computeDistance2 = (box1, box2, distX, distY, ratio) => {
  const xNorm = (box1.left - distX) * ratio;
  const yNorm = (box1.top - distY) * ratio;

  console.log({xNorm, yNorm});

  let xDist = Math.pow(xNorm - box2.left, 2);
  let yDist = Math.pow(yNorm - box2.top, 2);

  return Math.sqrt(xDist + yDist);
};

const computeDistance3 = (box1, box2, distX, distY, ratioX, ratioY) => {
  let xNorm = box1.left - distX;
  if (ratioX > 1) {
    //xNorm / ratioX;
    xNorm = xNorm / ratioX;
  } else {
    xNorm = xNorm * ratioX;
  }
  let yNorm = box1.top - distY;
  if (ratioY > 1) {
    //yNorm / ratioY;
    yNorm = yNorm / ratioY;
  } else {
    yNorm = yNorm * ratioY;
  }
  //const yNorm = (box1.top - distY) / ratioY;

  console.log({xNorm, yNorm});

  let xDist = Math.pow(xNorm - box2.left, 2);
  let yDist = Math.pow(yNorm - box2.top, 2);

  console.log({xDist, yDist});

  return Math.sqrt(xDist + yDist);
};

const computeDistanceByBoxRatio = (
  box1,
  imgWidth,
  imgHeight,
  attrImgRatioX,
  attrImgRatioY,
  leftShift,
  topShift,
) => {
  // left and top shift are probably only necessary for non centered elements (if the attrImgRatio does not include the text shift )
  const boxImgRatioX = (box1.left - leftShift) / imgWidth;
  const boxImgRatioY = (box1.top - topShift) / imgHeight;

  console.log({boxImgRatioX, boxImgRatioY});
  console.log({attrImgRatioX, attrImgRatioY});

  const xDist = Math.pow(boxImgRatioX - attrImgRatioX, 2);
  const yDist = Math.pow(boxImgRatioY - attrImgRatioY, 2);

  return Math.sqrt(xDist + yDist);
};

const getImageRatio = (refBounds, templateBounds) => {
  const heightRatio =
    refBounds.height > templateBounds.height
      ? templateBounds.height / refBounds.height
      : refBounds.height / templateBounds.height;

  const widthRatio =
    refBounds.width > templateBounds.width
      ? templateBounds.width / refBounds.width
      : refBounds.width / templateBounds.width;

  return {heightRatio, widthRatio};
};

const compareRefBoundsWithTemplate = (refBounds, templateBounds) => {
  const {heightRatio, widthRatio} = getImageRatio(refBounds, templateBounds);

  console.log('top ratio : ', refBounds.top * heightRatio);
  console.log('left ratio : ', refBounds.left * widthRatio);
  console.log('heightRatio : ', refBounds.height * heightRatio);
  console.log('widthRatio : ', refBounds.width * widthRatio);
};

const matchingLocationWithTolerance = (refLocation, location, tolerance) => {
  return Math.abs(refLocation - location) <= tolerance;
};

const boxesAreCloseEnough = (box, refBox, tolerance) => {
  const distance = computeDistance(box, refBox);
  console.log('distance : ', distance);
  return distance < tolerance;
};

const isMatchingZoneAttribute = (
  templateAttributeZone,
  bounding,
  leftShift,
  topShift,
) => {
  if (
    matchingLocationWithTolerance(
      templateAttributeZone.bounding.left,
      bounding.left, //+ leftShift,
      DISTANCE_TOLERANCE,
    ) &&
    matchingLocationWithTolerance(
      templateAttributeZone.bounding.top,
      bounding.top, // + topShift,
      DISTANCE_TOLERANCE,
    )
  ) {
    if (templateAttributeZone.fixedSize) {
      if (
        matchingLocationWithTolerance(
          templateAttributeZone.bounding.height,
          bounding.height,
          DISTANCE_TOLERANCE,
        ) &&
        matchingLocationWithTolerance(
          templateAttributeZone.bounding.width,
          bounding.width,
          DISTANCE_TOLERANCE,
        )
      ) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
};

const isMatchingBox = (templateAttributeZone, bounding) => {
  return boxesAreCloseEnough(
    templateAttributeZone.bounding,
    bounding, //+ leftShift,
    DISTANCE_TOLERANCE,
  );
};

const normalizeBounds = (
  bounds,
  xScalingFactor,
  yScalingFactor,
  topShift = 0,
  leftShift = 0,
) => {
  return {
    //top: bounds.top * yScalingFactor + topShift,
    top: (bounds.top + 0) * yScalingFactor,
    //left: bounds.left * xScalingFactor + leftShift,
    left: (bounds.left + 0) * xScalingFactor,
    width: bounds.width * xScalingFactor,
    height: bounds.height * yScalingFactor,
  };
};

// const isNextBoxSameLine = (bounds, nextBounds) => {
//   const diffX = Math.abs(bounds.top - nextBounds.top)
//   return diffX < SAME_LINE_MAX_Y_DIFF
// }

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
      value: postTextProcessingRules(attr.textRules, attr.value),
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
  console.log('text bounds')
  console.log({left, top, bottom, right});
  return {left, top, right, bottom};
};

const findAttributesByBox = (
  OCRResult,
  paper,
  refBounds,
  xScalingFactor,
  yScalingFactor,
  imgWidth,
  imgHeight,
) => {
  const attributesToFind = paper.attributesBoxes.filter(
    att => !(att.mandatory === false),
  );

  // could be used for cases where the paper is not well centered
  let leftShift = 0;
  let topShift = 0;
  let refDist = 0;
  let refDistX = 0;
  let refDistY = 0;
  let widthRatio = 0;
  let heightRatio = 0;
  if (refBounds) {
    const scaleRefBounds = normalizeBounds(
      refBounds,
      xScalingFactor,
      yScalingFactor,
    );
    // leftShift = paper.referenceBox.bounding.left - scaleRefBounds.left;
    // topShift = paper.referenceBox.bounding.top - scaleRefBounds.top;

    leftShift =
      refBounds.left * xScalingFactor - paper.referenceBox.bounding.left;
    topShift = refBounds.top * yScalingFactor - paper.referenceBox.bounding.top;

    leftShift =
      refBounds.left - paper.referenceBox.bounding.left / xScalingFactor;
    topShift = refBounds.top - paper.referenceBox.bounding.top / yScalingFactor;

    widthRatio = refBounds.width / paper.referenceBox.bounding.width;
    heightRatio = refBounds.height / paper.referenceBox.bounding.height;
    leftShift = refBounds.left - paper.referenceBox.bounding.left * widthRatio;
    topShift = refBounds.top - paper.referenceBox.bounding.top * heightRatio;

    console.log('unscale ref bounds : ', refBounds);
    console.log('scaleRefBounds : ', scaleRefBounds);
    console.log('left shift : ', leftShift);
    console.log('top shift : ', topShift);
    console.log({widthRatio, heightRatio});

    refDistX = Math.abs(scaleRefBounds.left - paper.referenceBox.bounding.left);
    refDistY = Math.abs(scaleRefBounds.top - paper.referenceBox.bounding.top);
    console.log('ref dist X: ', refDistX);
    console.log('ref dist Y: ', refDistY);
  }

  // leftShift = 0;
  // topShift = 0;

  const {top, bottom, left, right} = findTextBounds(OCRResult);
  const textWidth = right - left;
  const textHeight = bottom - top;
  console.log({textHeight, textWidth});
  leftShift = left;
  topShift = top;
  console.log({leftShift, topShift});

  const foundAttributes = [];

  // const elements = [];
  // for (const block of OCRResult) {
  //   for (const line of block.lines) {
  //     for (const el of line.elements) {
  //       //console.log('el : ', el);
  //       elements.push(el);
  //     }
  //   }
  // }

  for (const attr of attributesToFind) {
    console.log('------attr : ', attr);
    //const attrImgRatioX = attr.bounding.left / paper.size.width;
    //const attrImgRatioY = attr.bounding.top / paper.size.height;
    // try for not centered papers. Otherwise see above.
    const attrImgRatioX =
      attr.bounding.left /
      (paper.size.width - paper.textShift.left - paper.textShift.right);
    const attrImgRatioY =
      attr.bounding.top /
      (paper.size.height - paper.textShift.top - paper.textShift.bottom);

    let minDistance = 100000;
    let matchingEl;
    for (const block of OCRResult) {
      for (const line of block.lines) {
        let cptLineElements = 0;
        for (const el of line.elements) {
          const bounds = normalizeBounds(
            el.bounding,
            xScalingFactor,
            yScalingFactor,
            topShift,
            leftShift,
          );
          //const distance = computeDistance(bounds, attr.bounding);
          // const distance = computeDistanceWithRefDist(
          //   bounds,
          //   attr.bounding,
          //   refDistX,
          //   refDistY,
          // );

          /*const distance = computeDistance3(
            el.bounding,
            attr.bounding,
            leftShift,
            topShift,
            widthRatio,
            heightRatio,
          );*/

          const notCentered = true; // TODO : détecter quand non centré ? nécessaire ? tester...
          let distance;
          if (notCentered) {
            distance = computeDistanceByBoxRatio(
              el.bounding,
              textWidth,
              textHeight,
              attrImgRatioX,
              attrImgRatioY,
              leftShift,
              topShift,
            );
          } else {
            distance = computeDistanceByBoxRatio(
              el.bounding,
              imgWidth,
              imgHeight,
              attrImgRatioX,
              attrImgRatioY,
            );
          }

          console.log('dist : ', distance);
          console.log('el : ', el);
          //console.log('el text : ', el.text);
          // console.log('normalized bounds : ', bounds);
          if (distance < minDistance) {
            console.log('found min dist');
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
        textRules: attr.textRules || [],
        group: attr.group,
      });
    }
  }

  console.log({leftShift, topShift});
  // for (const attribute of attributesToFind) {
  //   console.log('att to find : ', attribute);

  //   for (const block of OCRResult) {
  //     console.log('block : ', block);
  //     for (const line of block.lines) {
  //       console.log('line : ', line);
  //       // TODO deal with splitted zones
  //       for (const el of line.elements) {
  //         console.log('element : ', el);
  //         const isAttributeFound = isMatchingZoneAttribute(
  //           attribute,
  //           normalizeBounds(el.bounding, xScalingFactor, yScalingFactor),
  //           leftShift,
  //           topShift,
  //         );
  //         if (isAttributeFound) {
  //           const foundAtt = {
  //             name: attribute.name,
  //             value: el.text,
  //           };
  //           console.log('ITS A MATCH : ', foundAtt);
  //           foundAttributes.push(foundAtt);
  //           // TODO: continue attribute loop
  //         }
  //       }
  //     }
  //   }
  // }
  return foundAttributes;
};

const checkCountryCode = code => {
  console.log('iso country : ', ISOCountries[code]);
  return !!ISOCountries[code];
};

const checkValidationRules = (attribute, match) => {
  let isValid = true;
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid;
    }
    if (rule.validationType === 'ISOCountry') {
      isValid = checkCountryCode(match[rule.regexGroupIdx]);
    }
  }
  return isValid;
};

const findAttributeInText = (attribute, text) => {
  const normalizedText = attribute.oneWord ? text : removeSpaces(text);
  console.log({normalizedText});
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
  const attributesToFind = paper.atttributesregex.filter(
    att => !(att.mandatory === false),
  );
  const foundAttributes = [];
  for (const attr of attributesToFind) {
    const resultByBlock = findAttributeInBlocks(OCRResult, attr);
    if (resultByBlock) {
      foundAttributes.push(resultByBlock);
      continue;
    }
    const resultByLines = findAttributeInLines(OCRResult, attr);
    if (resultByLines) {
      foundAttributes.push(resultByLines);
      continue;
    }
    const resultByElements = findAttributeInElements(OCRResult, attr);
    if (resultByElements) {
      foundAttributes.push(resultByElements);
      continue;
    }
  }
  return foundAttributes;
};

const findReferenceTextBound = (
  blocks,
  paper,
  xScalingFactor,
  yScalingFactor,
) => {
  if (!paper.referenceBox) {
    return null;
  }

  const minLength = 1; // évite de prendre des caractères poubelles, comme le "I" pour CI. Mais trop haut et on loupe le "DE" du passeport...
  const referenceText = paper.referenceBox.text;
  console.log('ref text : ', referenceText);

  let splittedBlocksText = '';
  let splittedBlocksBouding;

  for (const block of blocks) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        const normalizeRefText = normalizeReferenceText(el.text);

        if (normalizeRefText === referenceText) {
          console.log('-- Found reference matching box: exact');
          return el.bounding;
        }
        console.log('el text  : ', normalizeRefText);
        // if (
        //   normalizeRefText.length > minLength &&
        //   normalizeRefText.includes(referenceText)
        // ) {
        //   console.log('text el includes ref text');
        //   // find the reference text splitted into elements
        //   let splittedText = '';
        //   let bounding = {
        //     left: 0,
        //     height: 0,
        //     width: 0,
        //     top: 0,
        //   };

        //   // deal with one line for now
        //   const line = block.lines[0];

        //   let firstLineEl = true;
        //   for (const el of line.elements) {
        //     if (referenceText.includes(normalizeReferenceText(el.text))) {
        //       if (firstLineEl) {
        //         splittedText += el.text;
        //         bounding = el.bounding;
        //         firstLineEl = false;
        //       } else {
        //         splittedText += el.text;
        //         // Manually compute the width from between the latest element
        //         // and the most left.
        //         bounding.width =
        //           el.bounding.left + el.bounding.width - bounding.left;
        //       }
        //     }
        //   }
        //   console.log('splitted text : ', splittedText);
        //   if (normalizeReferenceText(splittedText) === referenceText) {
        //     console.log('-- Found reference matching box: splitted elements');
        //     console.log('-- bounding : ', bounding);
        //     console.log(
        //       'dist : ',
        //       computeDistance(
        //         normalizeBounds(bounding, xScalingFactor, yScalingFactor),
        //         paper.referenceBox.bounding,
        //       ),
        //     );
        //     return bounding;
        //   }
        // }

        if (
          normalizeRefText.length > minLength &&
          referenceText.includes(normalizeRefText)
        ) {
          splittedBlocksText += normalizeRefText;

          console.log('-- Found a possible splitted block');
          if (!splittedBlocksBouding) {
            splittedBlocksBouding = el.bounding;
          } else {
            splittedBlocksBouding.width =
              el.bounding.left + el.bounding.width - splittedBlocksBouding.left;
          }
          console.log('splitted text : ', splittedBlocksText);
          if (splittedBlocksText === referenceText) {
            return splittedBlocksBouding;
          }
        }
      }
    }
  }
  if (splittedBlocksText === referenceText) {
    console.log('-- Found reference matching box: splitted blocks');
    return splittedBlocksBouding;
  }
  return null;
};

const logOCRElements = OCRResult => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        console.log({el});
      }
    }
  }
};

export const findAttributes = (OCRResult, paperType, width, height) => {
  // TODO should detect with levheinstein distance? Beware of false positive...
  console.log('OCR result : ', OCRResult);
  console.log({width, height});

  const paper = papersDefinition[paperType].front;
  console.log({paper});

  if (OCRResult?.length > 0) {
    let refBounding;
    // const refBounding = findReferenceTextBound(
    //   OCRResult,
    //   paper,
    //   xScalingFactor,
    //   yScalingFactor,
    // );

    // if (!refBounding) {
    //   console.log('!!!!!!!!!!!!!!!No reference zone found');
    //   return;
    // }
    //logOCRElements(OCRResult);

    let attributesByBox = [];

    if (paper.size?.width && paper.size?.height) {
      const xScalingFactor = paper.size.width / width;
      const yScalingFactor = paper.size.height / height;

      console.log({xScalingFactor, yScalingFactor});

      attributesByBox = findAttributesByBox(
        OCRResult,
        paper,
        refBounding,
        xScalingFactor,
        yScalingFactor,
        width,
        height,
      );
    }

    const attributesByRegex = findAttributesByRegex(OCRResult, paper);
    console.log('attributes by regexo : ', attributesByRegex);

    console.log({refBounding});

    const foundAttributes = attributesByBox.concat(attributesByRegex);

    console.log('FOUND ATTRIBUTES : ', foundAttributes);
    const processedAttributes = postProcessing(foundAttributes);

    console.log('--------------PROCESSED ATTRIBUTES : ', processedAttributes);

    /*if (refBounding) {
      compareRefBoundsWithTemplate(refBounding, driverLicenseBounds);
    }*/
  } else {
    return null;
  }
};
