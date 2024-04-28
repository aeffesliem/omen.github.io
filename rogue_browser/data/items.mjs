/**
 * The database of items that will use the Item class.
 */
let Items = new Map();

Items.set(0, {
  basic: {
    name: 'Sword',
    id: 10,
    portrait: 9
  },
  detail: {
    category: 'weapon',
    subcategory: 'straight sword',
    equippable: {
      equipped: false,
      slot: 'weapon'
    }
  },
  effects: [
    [
      'basic',
      modifier => {
        return Math.floor(Math.random() * 6 + 1) + modifier;
      }
    ],
    [
      'heavy',
      modifier => {
        return Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1) + modifier;
      }
    ]
  ]
});

Items.set(1, {
  basic: {
    name: 'Fist',
    id: 0,
    portrait: 0
  },
  detail: {
    category: 'weapon',
    subcategory: 'natural',
    equippable: {
      equipped: false,
      slot: 'weapon'
    }
  },
  effects: [
    [
      'basic',
      modifier => {
        return Math.floor(Math.random() * 4 + 1) + modifier;
      }
    ]
  ]
})

export {
  Items
}