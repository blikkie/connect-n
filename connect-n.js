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
let player = 'x';

function createArray(w, h) {
  const array = [];
  for (let n = 0; n < h; n++) {
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
    // The table will only look good if there are fewer than 10 columns
    // TODO: use a fancy curses library or something to make tables look good
    console.log(`| ${row.join(' | ')} |`.replace(/ {2}/g, ' . '));
  });
}

function testColumn(index, playerSymbol) {
  const result = {};
  if (board[0][index]) {
    console.log('Column is full, try another one');
    return false;
  }
  for (let i = 0; i < height; i++) {
    if (board[i][index]) {
      board[i - 1][index] = playerSymbol;
      return result;
    }
    result.x = index;
    result.y = i;
  }
  board[height - 1][index] = playerSymbol;
  return result;
}

async function dropStone(playerSymbol) {
  let coord;
  while (!coord) {
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
    coord = testColumn(column - 1, playerSymbol);
  }

  return coord;
}

async function gameLoop() {
  let result;
  for (let counter = 0; counter < width * height; counter++) {
    printBoard(board);
    const coord = await dropStone(player);

    const leftSpace = coord.x - 1;
    const rightSpace = board[0].length - coord.x;
    const upSpace = coord.y - 1;
    const downSpace = board.length - 2 - coord.y;

    // I know this is counter-intuitive, but to access coordinates in the board you need to call
    // `board[coord.y][coord.x]` (this is a lesson learnt from 30 minutes of debugging).
    if (downSpace + 1 >= length) {
      let checkedLength = 1;
      for (let i = 1; i <= downSpace; i++) {
        if (board[coord.y + i][coord.x] === player) {
          checkedLength++;
        } else {
          break;
        }
      }
      if (checkedLength >= length) {
        return `Player ${player} has won the game`;
      }
    }

    // here we're going to add some logic to walk down, horizontally and diagonally to find the
    // length of the line of matching (if any) tiles in the array

    if (result) {
      break;
    }

    // switch players
    player === 'x' ? player = 'o' : player = 'x';
  }
  result = "It's a draw!";
  return result;
}

console.log(`Welcome to Connect-N! The goal of the game is to make a line that is ${length} stones long`);

async function run() {
  const result = await gameLoop();
  printBoard(board);
  console.log(result);
}

run();
