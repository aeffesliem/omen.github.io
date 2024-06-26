/**
 * Home.js
 * 0.0.0
 * omen
 * 
 * This is the main script file for Rogue Browser where all the magic happens
 * as far as attaching all of it up and running the game. Initialization and
 * Instantiation is the name of this...game.
 */
import { Tiles }   from '../data/tiles.mjs';
import { Schemas } from '../data/schemas.mjs';
import { Items }   from '../data/items.mjs';
import { Chunk }   from '../modules/cartography.mjs';
import { Entity }  from '../modules/entity.mjs';
import { Item }    from '../modules/item.mjs';

let header, footer, main, left_pane, main_pane, right_pane,
    chunk, entities, items, sheet_modal, inventory_contents;

let menu_active = false;

let Inputs = {
  UP: 'w',
  DOWN: 's',
  LEFT: 'a',
  RIGHT: 'd',
  INVENTORY: 'i'
}

let BASE_STATS = ['Strength', 'Dexterity', 'Intelligence', 'Wisdom', 'Will', 'Charisma'];
let GUAGE_STATS = ['Health', 'Stamina', 'Aura'];

/**
 * !!!KLAXON BLARING!!!
 * !!!INDUSTRIAL YELLOW LIGHTS FLASHING!!!
 * !<>! TESTING ZONE !<>!
 */

let test_base = [];
  let test_guage = [];

  BASE_STATS.forEach(e => {
    test_base.push([e, 10]);
  });

  GUAGE_STATS.forEach(e => {
    test_guage.push([e, 10, 10]);
  });

let test_player = {
  basic: {
    name: 'Player One',
    id: 0
  },
  map: {
    position: {
      x: 2,
      y: 2
    },
    portrait: 1
  },
  sheet: {
    actions: ['pick up', 'equip', 'unequip', 'attack'],
    base: test_base,
    guage: test_guage,
    nat_weapon: new Item(Items.get(1).basic, Items.get(1).detail, Items.get(1).effects)
  }
};

let test_gobo = {
  basic: {
    name: 'Goblin One',
    id: 1
  },
  map: {
    position: {
      x: 8,
      y: 1
    },
    portrait: 2
  },
  sheet: {
    actions: ['attack'],
    base: test_base,
    guage: test_guage,
    nat_weapon: new Item(Items.get(1).basic, Items.get(1).detail, Items.get(1).effects)
  }
};

let test_item = Items.get(0);

// TESTING ZONE OVER

// Write nat weapon and removing old weapons and putting in new weapons. weapon swap.

function initialize() {
  sheet_modal = document.getElementById('display-grid');
  inventory_contents = document.getElementById('inventory-contents');

  header = document.getElementsByTagName('header')[0];
  footer = document.getElementsByTagName('footer')[0];
  main   = document.getElementsByTagName('main')[0];

  left_pane  = document.getElementById('left-pane');
  main_pane  = document.getElementById('main-pane');
  right_pane = document.getElementById('right-pane');

  let new_schema = Schemas.get(0);

  entities = new Map();
  items    = new Map();

  chunk = new Chunk({schema: new_schema}, main_pane);

  items.set('Sword', new Item(test_item.basic, test_item.detail, test_item.effects, {x: 2, y: 3}));
  entities.set('Player', new Entity(test_player.basic, test_player.map, test_player.sheet));
  entities.set('Goblin', new Entity(test_gobo.basic, test_gobo.map, test_gobo.sheet));


  chunk.preload();

  chunk.tile(entities.get('Player').position).change_content(entities.get('Player').portrait, 0, true, entities.get('Player'));
  chunk.tile(entities.get('Goblin').position).change_content(entities.get('Goblin').portrait, 0, true, entities.get('Goblin'));
  chunk.tile(items.get('Sword').position).change_content(items.get('Sword').portrait, 0, true, items.get('Sword'));

  chunk.load();

  document.addEventListener('keydown', get_input);
}

function move_entity(entity, new_position) {

  if (chunk.has_tile(new_position)) {
    let target = chunk.tile(new_position);

    if (!target.has_tag('obstacle') && chunk.tile(entity.position).next_to(target)) {
      if (target.has_tag('item')) {
        entity.perform('pick up', target.tenant);

        let entry = document.createElement('span');
        entry.draggable = true;
        entry.addEventListener('dragstart', equipDrag);
        entry.classList.add('item', target.tenant.category);
        entry.innerHTML = target.tenant.name;

        inventory_contents.appendChild(entry);
      }

      chunk.tile(entity.position).change_content();
      
      entity.position = new_position;
      target.change_content(entity.portrait, 0, true, entity);
    }

    if (target.has_tag('entity') && chunk.tile(entity.position).next_to(target)) {
      entity.perform('attack', target.tenant);

      if (target.tenant.check('Health') <= 0) {
        target.change_content();
      }
    }
  }
}

function get_input(event) {

  if (event.key === Inputs.INVENTORY) {
    if (sheet_modal.style.display === 'none') {
      sheet_modal.style.display = 'grid';
      menu_active = true;
    } else {
      sheet_modal.style.display = 'none';
      menu_active = false;
    }
  }

  if (menu_active) return;

  if (event.key === Inputs.UP) {

    move_entity(entities.get('Player'), chunk.tile({x: entities.get('Player').position.x - 1, y: entities.get('Player').position.y}).position);

  } else if (event.key === Inputs.DOWN) {

    move_entity(entities.get('Player'), chunk.tile({x: entities.get('Player').position.x + 1, y: entities.get('Player').position.y}).position);

  } else if (event.key === Inputs.RIGHT) {

    move_entity(entities.get('Player'), chunk.tile({x: entities.get('Player').position.x, y: entities.get('Player').position.y + 1}).position);

  } else if (event.key === Inputs.LEFT) {

    move_entity(entities.get('Player'), chunk.tile({x: entities.get('Player').position.x, y: entities.get('Player').position.y - 1}).position);
  }
}

function equipDrag(event) {
  event.target.id = 'draggedt';
  event.dataTransfer.setData('text/plain', 'draggedt');
  event.dataTransfer.dropEffect = 'move';
}

function equipDrop(event) {
  const player = entities.get('Player');
  const element = document.getElementById(event.dataTransfer.getData('text/plain'));

  let move = () => {
    element.parentNode.removeChild(element);
    element.id = '';
    event.target.appendChild(element);
  }

  if (event.target.matches('td') && event.target.matches('.gear') && event.target.parentNode.matches(`#${element.classList[1]}-row`)) {
    move();
    player.perform('equip', player.inventory.grab(element.innerHTML));
  }

  if (event.target.matches('#inventory-contents')) {
    move();
    player.perform('unequip', player.inventory.grab(element.innerHTML));
  }
}

function equipOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

export {
  initialize,
  equipOver,
  equipDrop
}