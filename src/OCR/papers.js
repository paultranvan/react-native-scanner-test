import {COUNTRIES_ISO} from './consts';

/**
 * Definitions of papers' templates.
 *
 * Each entry is an object composed of a front and back (optional) describing the paper.
 * The structure of each paper is the following:
 * - size: the width and the height of the template
 * - textBouding: the bounding of the text area detected by the OCR, i.e. the smallest distance bewteen
 *   the paper bounds and a text block.
 * - referenceBox: used to detect the type of the paper. For now, only the text is useful.
 *   Note that it must be in uppercase, and without any space.
 * - attributesBoxes: an array of attributes that should be found by their position. It is composed of:
 *   - name: the attribute name
 *   - type: the attribute type, i.e., string, date, number
 *   - enabled (optional): whether the attribute search is enabled or not (for debug). Default is true.
 *   - fullLine: (optional): when the text is splitted in several elements, useful to force the detection
 *     on the whole line. Default is false.
 *   - bouding: the attribute bounds on the template
 *   - postTextRules: an array of rules to be applied on the text, in post-treatment. Note the rule position matters,
 *     as they will be applied sequentially. Each rule is composed of:
 *     - regex: the string pattern that should be found
 *     - replace (optional): how the detected string should be replaced. Default is an empty string.
 * - attributesRegex: an array of attributes that should be found by regex. It is composed of:
 *   - name: the attribute name
 *   - regex: the string pattern
 *   - wholeWord (optional): whether the attribute is always in one word, and not splitted in several elements.
 *     Default is false.
 *   - validationRules: an array of rules to apply on the match string for further validation. It is composed of:
 *     - regexGroupIdx: the index of the string in the match array by the regex.
 *     - validationFn: a validation function to apply on the string.
 * */
export const papersDefinition = [
  {
    name: 'driver',
    front: {
      size: {
        width: 415,
        height: 254,
      },
      textBounding: {
        bottom: 237,
        left: 9,
        right: 409,
        top: 4,
      },
      referenceBox: {
        text: 'PERMISDECONDUIRE',
      },
      attributesBoxes: [
        {
          type: 'string',
          name: 'lastName',
          enabled: true,
          fullLine: true,
          bounding: {
            height: 18,
            left: 130,
            top: 26,
          },
          postTextRules: [
            {regex: /^1./},
            {regex: /^[\^4n]/},
            {regex: /^\d/g},
            {regex: /[Aa]$/},
            {regex: /^a|a$/g},
          ],
        },
        {
          type: 'string',
          name: 'firstName',
          enabled: true,
          bounding: {
            height: 13,
            left: 130,
            top: 52,
          },
          postTextRules: [
            {regex: /^[\^4n]/},
            {regex: /^\d/g},
            {regex: /^a|a$/g},
          ],
        },
        {
          type: 'date',
          name: 'issueDate',
          dateFormat: 'ddMMyyyy',
          enabled: true,
          bounding: {
            height: 13,
            left: 129,
            top: 96,
            width: 57,
          },
          postTextRules: [{regex: /\^4a/}, {regex: /\^./}],
        },
        {
          type: 'date',
          name: 'expirationDate',
          dateFormat: 'ddMMyyyy',
          enabled: true,
          fixedSize: true,
          bounding: {
            height: 16,
            left: 129,
            top: 120,
            width: 71,
          },
          postTextRules: [{regex: /^4b/}, {regex: /^\./}],
        },
        {
          type: 'string',
          name: 'bottomTest',
          enabled: false,
          fullLine: true,
          fixedSize: true,
          bounding: {
            height: 94,
            left: 129,
            top: 767,
            width: 2404,
          },
        },
      ],
    },
    back: {
      size: {
        width: 401,
        height: 253,
      },
      textBounding: {bottom: 217, left: 3, right: 370, top: 6},
      attributesBoxes: [
        {
          type: 'string',
          name: 'cardNumberLine1',
          enabled: true,
          fixedSize: true,
          group: {
            name: 'cardNumber',
            order: 1,
          },
          bounding: {
            left: 26,
            top: 24,
          },
        },
        {
          type: 'string',
          name: 'cardNumberLine2',
          enabled: true,
          fixedSize: true,
          group: {
            name: 'cardNumber',
            order: 2,
          },
          bounding: {
            left: 26,
            top: 42,
          },
        },
        {
          type: 'date',
          name: 'issueDateA',
          bounding: {
            left: 163,
            top: 51,
            width: 32,
            height: 7,
          },
        },
        {
          type: 'date',
          name: 'issueDateB',
          bounding: {
            left: 163,
            top: 75,
          },
        },
      ],
    },
  },
  {
    name: 'identityCard',
    front: {
      size: {
        width: 1333,
        height: 909,
      },
      textBounding: {
        bottom: 845,
        left: 41,
        right: 1312,
        top: 16,
      },
      referenceBox: {
        text: 'CARTENATIONALE',
      },
      attributesRegex: [
        {
          name: 'cardNumber',
          regex: /^(\d{12}|[A-Z0-9]{12}|[A-Z0-9]{9})/,
        },
      ],
      attributesBoxes: [
        {
          type: 'string',
          name: 'cardNumber',
          enabled: true,
          fixedSize: true,
          bounding: {
            height: 39,
            left: 598,
            top: 96,
            width: 252,
          },
        },
        {
          type: 'string',
          name: 'lastName',
          enabled: true,
          fullLine: true,
          bounding: {
            height: 42,
            left: 519,
            top: 158,
          },
          postTextRules: [{regex: /[=]/g, replace: ' '}],
        },
      ],
    },
    back: {
      size: {
        width: 596,
        height: 410,
      },
      textBounding: {
        bottom: 304,
        left: 12,
        right: 429,
        top: 126,
      },
      attributesBoxes: [
        {
          type: 'date',
          dateFormat: 'ddMMyyyy',
          name: 'expirationDate',
          bounding: {
            left: 174,
            top: 172,
          },
          fullLine: true,
        },
      ],
    },
  },
  {
    name: 'residencePermit',
    front: {
      size: {
        width: 614,
        height: 390,
      },
      textBounding: {
        bottom: 337,
        left: 207,
        right: 577,
        top: 27,
      },
      referenceBox: {
        text: 'TITREDESEJOUR',
      },
      attributesBoxes: [
        {
          type: 'date',
          dateFormat: 'ddMMyyyy',
          name: 'expirationDate',
          bounding: {
            left: 214,
            top: 133,
          },
        },
      ],
    },
    back: {
      size: {
        width: 615,
        height: 384,
      },
      referenceBox: {
        text: 'TITREDESEJOUR',
      },
      attributesRegex: [
        {
          name: 'cardNumber',
          regex: /<[0-9]{10}</,
          postTextRules: [{regex: /</g}],
        },
        {
          name: 'country',
          regex: /[0-9][A-Z]{3}</,
          postTextRules: [{regex: /^[0-9]/}, {regex: /<$/}],
        },
      ],
    },
  },
  {
    name: 'passport',
    front: {
      size: {
        width: 1607,
        height: 1149,
      },
      textBounding: {
        bottom: 1045,
        left: 54,
        right: 1511,
        top: 18,
      },
      referenceBox: {
        text: 'PASSEPORT',
      },
      attributesBoxes: [
        {
          type: 'string',
          name: 'passportNumber',
          bounding: {
            left: 1122,
            top: 129,
          },
          validationRules: [{regex: /^\d{2}[A-Za-z]{2}\d{5}/}],
        },
        {
          type: 'date',
          name: 'expirationDate',
          fullLine: true,
          bounding: {
            left: 506,
            top: 771,
          },
        },
      ],
    },
    back: {},
  },
  {
    name: 'IBAN',
    front: {
      referenceBox: {
        text: 'IBAN',
      },
      attributesRegex: [
        {
          name: 'IBAN',
          regex: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/,
        },
        {
          name: 'BIC',
          regex: /^[A-Z]{4}([A-Z]{2})[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          oneWord: true,
          validationRules: [
            {
              regexGroupIdx: 1,
              validationFn: code => checkCountryCode(code),
            },
          ],
        },
      ],
    },
  },
];

export const checkCountryCode = code => {
  const foundCountry = COUNTRIES_ISO.find(
    country => country.code2 === code || country.code3 === code,
  );
  return !!foundCountry;
};
