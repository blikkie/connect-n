const prompt = require('prompt-async');
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

// Add an index row to the bottom of the board so users know where to drop their stones
const indexRow = [];
for (let i = 0; i < width; i++) {
  indexRow[i] = (i + 1).toString();
}
board.push(indexRow);

function printBoard(array) {
  array.forEach((row) => {
    for (let i = 0; i < width; i++) {
      if (row[i] === undefined) {
        row[i] = '.';
      }
    }
    console.log(row);
  });
}

async function dropStone() {
  const coord = {};
  const schema = {
    properties: {
      column: {
        description: 'Enter the column you wish to drop your stone in',
        pattern: '^[1-9]\\d*$',
        message: 'Must be a positive integer',
        required: true,
      },
    },
  };
  await prompt.start();
  const { column } = await prompt.get(schema);
  console.log(column);

  // here we will need to add some logic that will attempt to drop a token down a column. If the
  // column is full we will re-prompt the player to enter their selection
}

async function gameLoop() {
  let result;
  while (!result) {
    for (let counter = 0; counter < width * height; counter++) {
      printBoard(board);
      console.log('trying ');
      const coord = await dropStone();

      // here we're going to add some logic to walk down, horizontally and diagonally to find the
      // length of the line of matching (if any) tiles in the array
    }
    result = "It's a draw!";
  }
  return result;
}

console.log(`Welcome to Connect-N! The goal of the game is to make a line that is ${length} stones long`);

async function run() {
  const result = await gameLoop();
  console.log(result);
}

run();
