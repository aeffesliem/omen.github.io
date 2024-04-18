/**
 * The database of items that will use the Item class.
 */
let Items = new Map();

Items.set(0, {
  basic: {
    name: 'Sword',
    id: 0,
    amount: 1,
    max_stack: 1,
    portrait: 91
  },
  detail: {
    category: 'weapon',
    subcategory: 'straight sword',
    equippable: {
      equipped: false,
      slot: 'armaments'
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

export {
  Items
}