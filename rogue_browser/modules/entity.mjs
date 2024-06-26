/**
 * Entity.js
 * 0.0.1
 * omen
 * 
 * This is how I will define things like NPCs, monsters, creatures, and other critters.
 */

let actions = new Map();

actions.set('pick up', entity => {
  return item => {
    entity.inventory.add(item);
  }
});

actions.set('equip', entity => {
  return item => {
    entity.gear.equip(item);
  }
});

actions.set('unequip', entity => {
  return item => {
    entity.gear.unequip(item);
  }
});

actions.set('attack', entity => {
  return target => {
    target.damage('Health', entity.gear.use('weapon').perform('basic')(entity.grab('Strength')));
  }
});

actions.set('defend', () => {});
actions.set('use', () => {});
actions.set('throw', () => {});
actions.set('interact', () => {});
actions.set('drop', () => {});
actions.set('cast', () => {});

// Three types of stats: Base, Guage, and Skills
class Stat {
  #name; #value;
  #start_value;

  constructor(name = 'Stat', value = 0) {
    this.#name        = name;
    this.#value       = value;
    this.#start_value = value;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  reset() {
    this.#value = this.#start_value;
  }
}

class BaseStat extends Stat {
  constructor(name, value) {
    super(name, value);
  }

  get name() {
    return super.name;
  }

  get value() {
    return super.value;
  }

  get modifier() {
    return Math.floor((super.value - 10) / 2);
  }
}

class GuageStat extends Stat {
  #current;

  constructor(name, value, current) {
    super(name, value);

    this.#current = current;
  }

  get name() {
    return super.name;
  }

  get value() {
    return this.#current;
  }

  get max() {
    return super.value;
  }

  get current() {
    return this.#current;
  }

  damage(amount) {
    this.#current -= amount;
  }

  heal(amount) {
    this.#current += amount;
  }
}

class Inventory {
  #categories;

  constructor() {
    this.#categories = new Map();

    this.#categories.set('weapon', new Map());
    this.#categories.set('armor',  new Map());
  }

  add(item) {
    let category = this.#categories.get(item.category);
    category.has(item.subcategory) ? category.get(item.subcategory) : category.set(item.subcategory, new Map());

    let subcategory = category.get(item.subcategory);

    if (subcategory.has(item.name)) {
      subcategory.get(item.name).amount++;
    } else {
      subcategory.set(item.name, item);
    }
  }

  grab(item_name, category = false, subcategory = false) {
    let search = null;

    if (!category && !subcategory) {
      this.#categories.forEach(cat => {
        cat.forEach(scat => {
          search = scat.has(item_name) ? scat.get(item_name) : null;
        });
      });
    }

    if (!subcategory) {
      for (scat in this.#categories.get(category)) {
        search = scat.has(item_name) ? scat.get(item_name) : null;
      }
    }

    if (!!category && !!subcategory) {
      search = this.#categories.get(category).get(subcategory).get(item_name);
    }

    return search;
  }

  has(item) {
    return this.#categories.get(item.category).get(item.subcategory).has(item.name);
  }
}

class Gear {
  #slots;

  constructor() {
    this.#slots = new Map();

    this.#slots.set('weapon', new Map());
    this.#slots.set('armor',  new Map());
  }

  equip(item) {
    if (!!item.equippable) {
      let slot = this.#slots.get(item.equippable.slot);
      slot.set(item.name, item);
      slot.get(item.name).equippable.equipped = true;
    }
  }

  unequip(item) {
    if (item.equippable.equipped) {
      let slot = this.#slots.get(item.equippable.slot)
      slot.delete(item.name);
      item.equippable.equipped = false;
    }
  }

  use(slot) {
    return this.#slots.get(slot).entries().next().value[1];
  }

  has(item) {
    this.#slots.get(item.slot).has(item.name);
  }
}

class Entity {
  #name; #id; #stats;
  #position; #portrait;
  #actions; #inventory; #gear;

  constructor(basic = {}, map = {}, sheet = {}) {
    this.#name = basic.name;
    this.#id   = basic.id;

    this.#position = map.position;
    this.#portrait = map.portrait;

    this.#stats = new Map();
    this.#stats.set('base',  new Map());
    this.#stats.set('guage', new Map());
    this.#stats.set('skill', new Map());

    sheet.base.forEach(e => {
      this.#stats.get('base').set(e[0], new BaseStat(e[0], e[1]));
    });

    sheet.guage.forEach(e => {
      this.#stats.get('guage').set(e[0], new GuageStat(e[0], e[1], e[2]));
    });

    this.#inventory = new Inventory();
    this.#gear      = new Gear();

    this.#actions   = new Map();

    sheet.actions.forEach(a => {
      this.#actions.set(a, actions.get(a)(this));
    });

    if (sheet.nat_weapon) {
      this.#inventory.add(sheet.nat_weapon);
      this.#gear.equip(sheet.nat_weapon);
    }
  }

  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get position() {
    return {x: this.#position.x, y: this.#position.y};
  }

  set position(new_pos) {
    this.#position.x = new_pos.x;
    this.#position.y = new_pos.y;
  }

  get portrait() {
    return this.#portrait;
  }

  get inventory() {
    return this.#inventory;
  }

  get gear() {
    return this.#gear;
  }

  perform(action, data = null) {
    this.#actions.get(action)(data);
  }

  grab(stat) {
    return this.#stats.get('base').get(stat).modifier;
  }

  check(stat) {
    return this.#stats.get('guage').get(stat).value;
  }

  damage(stat, value) {
    this.#stats.get('guage').get(stat).damage(value);
  }
}

export {
  Entity
}