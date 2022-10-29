import { Board, NumbersAvailable, BoardOfPossibleValues } from './classes.mjs';
import { testGrid } from './testCases.mjs';

const board = new Board(testGrid);

console.table(board.grid);
console.log(board.returnSubgridArrayByCoordinate(7, 1));
