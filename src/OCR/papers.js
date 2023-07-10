export const papersDefinition = {
  passport: {
    front: {
      size: {
        width: 415,
        height: 254,
      },
      referenceBox: {
        bounding: {
          height: 16,
          left: 104,
          top: 4,
          width: 153,
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
            height: 13,
            left: 142,
            top: 52,
          },
          textRules: [{regexp: /^[\^4n]/}],
        },
        {
          type: 'date',
          name: 'issueDate',
          mandatory: true,
          bounding: {
            height: 13,
            left: 129,
            top: 96,
            width: 57,
          },
          textRules: [{regexp: /\^4a/}, {regexp: /\^./}],
        },
        {
          type: 'date',
          name: 'expirationDate',
          mandatory: true,
          fixedSize: true,
          bounding: {
            height: 16,
            left: 129,
            top: 115,
            width: 57,
          },
          textRules: [{regexp: /^4b/}, {regexp: /^\./}],
        },
        {
          type: 'string',
          name: 'bottomTest',
          mandatory: true,
          fullLine: true,
          fixedSize: true,
          bounding: {
            height: 22,
            left: 10,
            top: 215,
            width: 268,
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
          height: 45,
          left: 52,
          top: 16,
          width: 1260,
        },
        text: 'RÉPUBLIQUEFRANCAISE',
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
