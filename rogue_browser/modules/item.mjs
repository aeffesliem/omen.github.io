/**
 * Item.mjs
 * 0.0.0
 * omen
 * 
 * Itemization in this game is based around the idea that your armor and
 * weapons aren't just sources of improved stats, instead simply providing
 * basic functions such as defense or offense. Trinkets, talismans, charms,
 * and perhaps a few more can alter your abilities, damage, and defense based
 * on the idea that your skill as a fighter is all you need and these things
 * are just tools to help you achieve that.
 * 
 * Items add to an Entity's Effects object and the Entity simply incorporates
 * whatever buff or debuff the item provides when equipped or consumed.
 */

/*
Weapon = {
  name: 'Sword',
  id: 5,
  amount: 1,
  max_stack: 1,
  category: 'Weapon',
  subcategory: 'Straight Sword',
  effects: {
    use: () => {},
    equip: () => {},
    attack: modifier => {return roll(6) + modifier;},
    defend: () => {},
    throw: () => {}
  }
}
*/

class Item {
  #name; #id;
  #category; #subcategory;
  #effects;
  #portrait; #position; #equippable;

  constructor(basic = {}, detail = {}, effects = [], position) {
    this.#name      = basic.name;
    this.#id        = basic.id;
    this.#portrait  = basic.portrait;
    this.#position  = position;

    this.#category    = detail.category;
    this.#subcategory = detail.subcategory;
    this.#equippable  = detail.equippable

    this.#effects = new Map();

    effects.forEach(e => {
      this.#effects.set(e[0], e[1]);
    });
  }

  get name() {
    return this.#name;
  };

  get id() {
    return this.#id;
  }
  get category() {
    return this.#category;
  }

  get subcategory() {
    return this.#subcategory;
  }

  get equippable() {
    return this.#equippable;
  }

  get position() {
    return this.#position;
  }

  set position(new_position) {
    this.#position.x = new_position.x;
    this.#position.y = new_position.y;
  }

  get portrait() {
    return this.#portrait;
  }

  get actions() {
    return this.#effects.keys();
  }

  perform(action) {
    return this.#effects.get(action);
  }
}

export {
  Item
}