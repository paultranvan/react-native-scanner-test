export const papersDefinition = {
  driver: {
    front: {
      size: {
        width: 1420,
        height: 897,
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
            {regexp: /^1./},
            {regexp: /^[\^4n]/},
            {regexp: /[Aa]$/},
            {regexp: /^a|a$/g},
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
          textRules: [{regexp: /^[\^4n]/}],
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
          textRules: [{regexp: /\^4a/}, {regexp: /\^./}],
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
          textRules: [{regexp: /^4b/}, {regexp: /^\./}],
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
            top: 1341,
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
          textRules: [{regexp: /[=]/g, replace: ' '}],
        },
      ],
    },
    back: {},
  },
};
