/**
 * Tiles.mjs
 * omen
 * 
 * This is simply a convenient way to store all my tiles in a neat way instead
 * of burdening another file with a bunch of declarations.
 * 
 * Tile pngs are stored as data URIs (fuckin wild name change given they
 * aren't fuckin links my guy) and given that they are all going to be no more
 * than 16x16 pixel squares with, at most, minimal animation, you could
 * technically play this game entirely offline with a single html file.
 */

let Tiles = new Map();

Tiles.set(0, ['empty.png', '', 1, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAABJJREFUOI1jYBgFo2AUjAIIAAAEEAABf014jgAAAABJRU5ErkJggg==']);
Tiles.set(1, ['player.png', 'entity,obstacle', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGRJREFUOI1jYKAQMOKSOH9sx39kvqGVB1a1WAXRNeMzhAm/AwkDnAYg24bL+QwMVPACxYGIoQmX7bjkGZElCdqAxUVM6IL4nIpNnrrRSIw30NWw4FKI7lSSwgibYlwGUBwGFAMAbok2rlD5GtcAAAAASUVORK5CYII=']);
Tiles.set(2, ['goblin.png', 'entity,obstacle', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHVJREFUOI1jYKAQMOKSOH9sx39kvqGVB1a1WAXRNeMzhAm/AwkDFBORbTa08mCE8ZHZ6C6h2AsUByKGJly245JnRJYkaAM+FyEbAGMj24hNnoEBTzTi0oAOsBqALcBwBSKKAdicS0iOBZfT0G0kKZDxuYDqAAC5pmDTVH7GsAAAAABJRU5ErkJggg==']);
Tiles.set(3, ['dungeon_wall.png', 'obstacle,opaque', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADxJREFUOI1jYKAQMDIwMDCcP7bjP7qEoZUHI0wcmY2uholSF1AMULyAy6nIAN1rg8wLyGA0FugIhkEsAABoqzwQHA2bawAAAABJRU5ErkJggg==']);
Tiles.set(4, ['dungeon_floor.png', 'walkable', 1, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG9JREFUOI1jYKA2qHLx+k+KOCMxBrXt2YZTHQs2Tdg04DKQCZfJhADMQBYYB58zsbkKxserCZuN6Aaw4FOAL0xggOwwgAG4ybicSBGocvH6D8PIfGQLmZA56BrwAZgLmSh1Ll6NxCZnvBqJEacIAAAxnEpmZMLkswAAAABJRU5ErkJggg==']);
Tiles.set(5, ['empty.png', 'obstacle', 1, Tiles.get(0)[3]]);
Tiles.set(6, ['empty.png', 'ispawn', 0, Tiles.get(0)[3]]);
Tiles.set(7, ['empty.png', 'mspawn', 0, Tiles.get(0)[3]]);
Tiles.set(8, ['empty.png', 'nspawn', 0, Tiles.get(0)[3]]);

Tiles.set(9, ['sword.png', 'item', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGJJREFUOI1jYBgIcP7Yjv/nj+34z8DAwMBEjmZkPiO5mg2tPBhJMgCbZqINwKWZKAPwaWZgQAtE9AAipBmvjbCoQjeUoGZkTcRoxnAWqc5GUYDNRrL8jo0mSTPJgOTQpiYAAEjSXfvBnBYpAAAAAElFTkSuQmCC'])
Tiles.set(10, ['player.png', 'entity,obstacle', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGRJREFUOI1jYKAQMOKSOH9sx39kvqGVB1a1WAXRNeMzhAm/AwkDnAYg24bL+QwMVPACxYGIoQmX7bjkGZElCdqAxUVM6IL4nIpNnrrRSIw30NWw4FKI7lSSwgibYlwGUBwGFAMAbok2rlD5GtcAAAAASUVORK5CYII=']);
Tiles.set(11, ['goblin.png', 'entity,obstacle', 0, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHVJREFUOI1jYKAQMOKSOH9sx39kvqGVB1a1WAXRNeMzhAm/AwkDFBORbTa08mCE8ZHZ6C6h2AsUByKGJly245JnRJYkaAM+FyEbAGMj24hNnoEBTzTi0oAOsBqALcBwBSKKAdicS0iOBZfT0G0kKZDxuYDqAAC5pmDTVH7GsAAAAABJRU5ErkJggg==']);

export {
  Tiles
};