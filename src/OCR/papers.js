export const papersDefinition = {
  driver: {
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
            height: 18,
            left: 130,
            top: 26,
          },
          postTextRules: [
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
            height: 13,
            left: 130,
            top: 52,
          },
          postTextRules: [{regex: /^[\^4n]/}],
        },
        {
          type: 'date',
          name: 'issueDate',
          dateFormat: 'DDMMYYYY',
          mandatory: true,
          bounding: {
            height: 13,
            left: 129,
            top: 96,
            width: 57,
          },
          postTextRules: [{regex: /\^4a/}, {regex: /\^./}, {regex: /[.,]/g}],
        },
        {
          type: 'date',
          name: 'expirationDate',
          dateFormat: 'DDMMYYYY',
          mandatory: true,
          fixedSize: true,
          bounding: {
            height: 16,
            left: 129,
            top: 115,
            width: 71,
          },
          postTextRules: [{regex: /^4b/}, {regex: /^\./}, {regex: /[.,]/g}],
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
      textShift: {bottom: 217, left: 3, right: 370, top: 6},
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
            left: 26,
            top: 24,
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
  identityCard: {
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
        bounding: {
          height: 39,
          left: 41,
          top: 103,
          width: 284,
        },
        text: 'CARTENATIONALE',
      },
      attributesRegex: [
        {
          name: 'cardNumber',
          regex: /^[0-9]{12}/,
        },
      ],
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
          postTextRules: [{regex: /[=]/g, replace: ' '}],
        },
      ],
    },
    back: {
      size: {
        width: 596,
        height: 410,
      },
      textShift: {
        bottom: 218,
        left: 12,
        right: 429,
        top: 126,
      },
      attributesBoxes: [
        {
          type: 'date',
          dateFormat: 'DDMMYYYY',
          name: 'expirationDate',
          bounding: {
            left: 175,
            top: 176,
          },
          fullLine: true,
          postTextRules: [{regex: /[.,]/g}],
        },
      ],
    },
  },
  residencePermit: {
    front: {
      size: {
        width: 614,
        height: 390,
      },
      attributesBoxes: [
        {
          type: 'date',
          dateFormat: 'DDMMYYYY',
          name: 'expirationDate',
          bounding: {
            left: 214,
            top: 171,
          },
          postTextRules: [{regex: /[.,/]/g}],
        },
      ],
    },
    back: {
      size: {
        width: 615,
        height: 384,
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
      attributesRegex: [
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
