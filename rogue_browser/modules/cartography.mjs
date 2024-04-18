/**
 * Cartography.js
 * 0.0.1
 * omen
 * 
 * A series of functions and classes that provide the toolkit necessary to draw
 * to the screen and keep track of where everything is in the game world. Also
 * handles moving the view of the map and provides the movement functions for
 * other modules to move things in the world.
 */
import { Tiles } from '../data/tiles.mjs';


/**
 * Tiles are contained within chunks and hold either a single item in their
 * contents or hold a contents and a background option.
 */
class Tile {
  #contents; #tags; #tenant; #default;
  #position;
  #element; #context;

  constructor(contents = [], tags = new Set(), position = {x: 0, y: 0}, tenant = {}) {
    this.#contents = contents;
    this.#default  = contents;
    this.#tags     = tags;
    this.#position = position;
    this.#tenant   = tenant;

    this.#contents.push(new Image());
    this.#contents.push(new Image());

    this.#element    = document.createElement('canvas');
    this.#context    = this.#element.getContext('2d');

    this.#element.height = 16;
    this.#element.width = 16;
  }

  get content() {
    return this.#contents[0];
  }

  get floor() {
    return this.#contents[1];
  }

  get position() {
    return {x: this.#position.x, y: this.#position.y};
  }

  get id() {
    return [this.#contents[2], this.#contents[3]];
  }

  get tags() {
    return Array.from(this.#tags.values());
  }

  get tenant() {
    return this.#tenant;
  }

  set tenant(new_tenant) {
    this.#tenant = new_tenant;
  }

  has_tag(tag_query) {
    return this.#tags.has(tag_query);
  }

  add_tag(new_tag) {
    this.#tags.add(new_tag);
  }

  remove_tag(tag_query) {
    this.#tags.delete(tag_query);
  }

  change_content(new_content = 0, which = 0, redraw = true, tenant = null) {
    let old_tags = [], new_tags = [];

    this.#tenant = tenant;

    old_tags = Tiles.get(this.#contents[which + 2])[1].split(',');
    new_tags = Tiles.get(new_content)[1].split(',');

    old_tags.forEach(e => {
      this.remove_tag(e);
    });

    new_tags.forEach(e => {
      this.add_tag(e);
    });

    this.#contents[which + 2] = new_content;
    this.#contents[which]     = Tiles.get(new_content)[3];

    this.#contents[which + 4].src = this.#contents[which];

    if (redraw) {
      this.draw();
    }
  }

  draw() {
    let that = this;
    window.requestAnimationFrame(() => {
      that.#context.clearRect(0, 0, 16, 16);
      that.#context.drawImage(that.#contents[5], 0, 0);
      that.#context.drawImage(that.#contents[4], 0, 0);
    });
  }

  preload(parent) {
    this.#element.style.display = 'none';

    this.#contents[5].src = this.#contents[1];
    this.#contents[4].src = this.#contents[0];

    parent.appendChild(this.#element);
  }

  toggle_display() {
    this.#element.style.display = this.#element.style.display == 'none' ? 'inline' : 'none';
  }

  next_to(target) {
    let pos = target.position;

    if (Math.abs(this.#position.x - pos.x) === 1 || Math.abs(this.#position.y - pos.y) === 1)
      return true;

    
    return false;
  }
}

/**
 * Rooms are generated, never prefabricated (in most cases, diablo style rooms
 * are a maybe). 
 */
class Room {
  #tiles; #height; #width;
  #center; #position; #doors;

  constructor(size, library) {
    this.#tiles = [];
    this.#doors = [];

    this.#height   = size.height;
    this.#width    = size.width;
    this.#position = size.position;
    this.#center   = {x: size.width / 2, y: size.height / 2};
  }
}

/**
 * Chunks are the actual things displayed on the screen. There will only ever
 * be a single chunk in memory at a time.
 */
class Chunk {
  #tiles;
  #schema; #screen;

  constructor(legend, screen) {
    this.#screen = screen;
    this.#schema = legend.schema;
    this.#tiles  = [];

    // Schema entries will look like: [id, id]
    this.#schema.forEach((el, ind) => {
      this.#tiles.push([]);
      
      el.forEach((e, i) => {
        if (e.length === 0) e = [0, 0]; // testing line

        let contents = [Tiles.get(e[0])[3], Tiles.get(e[1])[3], e[0], e[1]];
        let tags = Tiles.get(e[0])[1].split(',').concat(Tiles.get(e[1])[1].split(','));

        while (tags.includes('')) {
          tags.splice(tags.indexOf(''), 1);
        }

        tags = new Set(tags);

        let position = {x: ind, y: i};
        this.#tiles[ind].push(new Tile(contents, tags, position));
      });
    });
  }

  has_tile(position) {
    return !!this.#tiles[position.x][position.y];
  }

  tile(position) {
    return this.#tiles[position.x][position.y];
  }

  preload() {
    this.#tiles.forEach(el => {
      el.forEach(e => {
        e.preload(this.#screen);
      });
    });
  }

  load() {
    this.#tiles.forEach(el => {
      el.forEach(e => {
        e.toggle_display();
        e.draw();
      });
    });
  }
}

export {
  Chunk
};