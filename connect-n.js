const { argv } = require('yargs')
  .usage('Usage: node $0 [options]')
  .describe('width', 'width of the board (defaults to 7)')
  .describe('height', 'height of the board (defaults to 6)')
  .describe('length', 'row length required to win (defaults to 4)')
  .alias('w', 'width')
  .alias('l', 'length')
  .alias('h', 'height');

const width = argv.width || 7;
const height = argv.height || 6;
const length = argv.length || 4;

function createArray(w, h) {
  const array = new Array(h);
  for (let n = 0; n < w; n++) {
    array[n] = new Array(w);
  }

  return array;
}

const board = createArray(width, height);

function printBoard(array) {
  const indexRow = [];
  for (let i = 0; i < width; i++) {
    indexRow[i] = (i + 1).toString();
  }
  array.push(indexRow);

  array.forEach((row) => {
    for (let i = 0; i < width; i++) {
      if (row[i] === undefined) {
        row[i] = '.';
      }
    }
    console.log(row);
  });
}

printBoard(board);
