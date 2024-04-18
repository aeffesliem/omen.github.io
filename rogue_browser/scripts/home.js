/**
 * Home.js
 * 0.0.0
 * omen
 * 
 * This is the main script file for Rogue Browser where all the magic happens
 * as far as attaching all of it up and running the game. Initialization and
 * Instantiation is the name of this...game.
 */
import { Schemas } from '../data/schemas.mjs';
import { Items }   from '../data/items.mjs';
import { Chunk }   from '../modules/cartography.mjs';
import { Entity }  from '../modules/entity.mjs';
import { Item }    from '../modules/item.mjs';

let header, footer, main, left_pane, main_pane, right_pane,
    chunk, entities, items;

let Inputs = {
  UP: 'w',
  DOWN: 's',
  LEFT: 'a',
  RIGHT: 'd'
}

let BASE_STATS = ['Strength', 'Dexterity', 'Intelligence', 'Wisdom', 'Will', 'Charisma'];
let GUAGE_STATS = ['Health', 'Stamina', 'Aura'];

function initialize() {
  header = document.getElementsByTagName('header')[0];
  footer = document.getElementsByTagName('footer')[0];
  main   = document.getElementsByTagName('main')[0];

  left_pane  = document.getElementById('left-pane');
  main_pane  = document.getElementById('main-pane');
  right_pane = document.getElementById('right-pane');

  let new_schema = Schemas.get(0);

  let test_base = [];
  let test_guage = [];

  BASE_STATS.forEach(e => {
    test_base.push([e, 10]);
  });

  GUAGE_STATS.forEach(e => {
    test_guage.push([e, 10, 10]);
  });

  entities = new Map();
  items    = new Map();

  chunk = new Chunk({schema: new_schema}, main_pane);

  entities.set('Player', new Entity({name: 'Player', id: 0}, {position: {x: 2, y: 2}, portrait: 1}, {actions: ['pick up', 'equip', 'attack'], base: test_base, guage: test_guage}));
  entities.set('Goblin', new Entity({name: 'Goblin', id: 1}, {position: {x: 8, y: 1}, portrait: 2}, {actions: ['pick up'], base: test_base, guage: test_guage}));

  items.set('Sword', new Item(Items.get(0).basic, Items.get(0).detail, Items.get(0).effects, {x: 2, y: 3}));

  chunk.preload();

  chunk.tile(items.get('Sword').position).change_content(items.get('Sword').portrait, 0, true, items.get('Sword'));
  chunk.tile(entities.get('Player').position).change_content(entities.get('Player').portrait, 0, true, entities.get('Player'));
  chunk.tile(entities.get('Goblin').position).change_content(entities.get('Goblin').portrait, 0, true, entities.get('Goblin'));

  chunk.load();

  document.addEventListener('keydown', get_input);
}

function move_entity(entity, new_position) {

  if (chunk.has_tile(new_position)) {
    let target = chunk.tile(new_position);

    if (!target.has_tag('obstacle') && chunk.tile(entity.position).next_to(target)) {
      if (target.has_tag('item')) {
        entity.perform('pick up', target.tenant);

        if (target.tenant.name === 'Sword') entity.perform('equip', target.tenant);
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

export {
  initialize
}