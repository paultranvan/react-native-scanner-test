export const papersDefinition = {
  driver: {
    front: {
      size: {
        width: 1420,
        height: 897,
      },
      textShift: {
        left: 18,
        top: 26,
        right: 36,
        bottom: 66,
      },
      referenceBox: {
        bounding: {
          height: 46,
          left: 334,
          top: 28,
          width: 526,
        },
        text: 'PERMISDECONDUIRE',
      },
      attributesBoxes: [
        {
          type: 'string',
          name: 'lastName',
          mandatory: true,
          fullLine: true,
          bounding: {
            height: 57,
            left: 379,
            top: 115,
          },
          textRules: [
            {regex: /^1./},
            {regex: /^[\^4n]/},
            {regex: /[Aa]$/},
            {regex: /^a|a$/g},
          ],
        },
        {
          type: 'string',
          name: 'firstName',
          mandatory: true,
          bounding: {
            height: 47,
            left: 428,
            top: 201,
          },
          textRules: [{regex: /^[\^4n]/}],
        },
        {
          type: 'date',
          name: 'issueDate',
          mandatory: true,
          bounding: {
            height: 44,
            left: 426,
            top: 362,
            width: 198,
          },
          textRules: [{regex: /\^4a/}, {regex: /\^./}],
        },
        {
          type: 'date',
          name: 'expirationDate',
          mandatory: true,
          fixedSize: true,
          bounding: {
            height: 48,
            left: 419,
            top: 429,
            width: 204,
          },
          textRules: [{regex: /^4b/}, {regex: /^\./}],
        },
        {
          type: 'string',
          name: 'bottomTest',
          mandatory: false,
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
      attributesBoxes: [
        {
          type: 'string',
          name: 'cardNumberLine1',
          mandatory: true,
          fixedSize: true,
          group: {
            name: 'cardNumber',
            order: 1,
          },
          bounding: {
            height: 9,
            left: 40,
            top: 34,
            width: 36,
          },
        },
        {
          type: 'string',
          name: 'cardNumberLine2',
          mandatory: true,
          fixedSize: true,
          group: {
            name: 'cardNumber',
            order: 2,
          },
          bounding: {
            height: 10,
            left: 41,
            top: 52,
            width: 35,
          },
        },
      ],
    },
  },
  identityCard: {
    front: {
      size: {
        width: 1333,
        height: 909,
      },
      textShift: {
        left: 48,
        top: 20,
        right: 33,
        bottom: 71,
      },
      referenceBox: {
        bounding: {
          height: 39,
          left: 41,
          top: 103,
          width: 284,
        },
        text: 'CARTENATIONALE',
      },
      attributesBoxes: [
        {
          type: 'string',
          name: 'cardNumber',
          mandatory: true,
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
          mandatory: true,
          bounding: {
            height: 42,
            left: 519,
            top: 158,
          },
          textRules: [{regex: /[=]/g, replace: ' '}],
        },
      ],
    },
    back: {},
  },
  passport: {
    front: {
      size: {
        width: 1529,
        height: 1077,
      },
      referenceBox: {
        bounding: {
          height: 32,
          left: 33,
          top: 69,
          width: 257,
        },
        text: 'PASSEPORT',
      },
      attributesBoxes: [
        {
          type: 'string',
          name: 'passportNumber',
          mandatory: true,
          fixedSize: true,
          bounding: {
            height: 28,
            left: 1071,
            top: 118,
            width: 163,
          },
        },
        {
          type: 'string',
          name: 'expirationDate',
          mandatory: true,
          fixedSize: true,
          fullLine: true,
          bounding: {
            height: 25,
            left: 466,
            top: 736,
          },
        },
      ],
    },
    back: {},
  },
  IBAN: {
    front: {
      atttributesregex: [
        {
          name: 'IBAN',
          regex: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/,
        },
        {
          name: 'BIC',
          regex: /^[A-Z]{4}([A-Z]{2})[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          oneWord: true,
          validationRules: [
            {
              regexGroupIdx: 1,
              validationType: 'ISOCountry',
            },
          ],
        },
      ],
    },
  },
};
