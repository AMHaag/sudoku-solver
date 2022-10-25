import {
  createSubgrid,
  createCol,
  checkFullMatrix,
} from './validateSolution.mjs';

const testGrid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 0, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 0, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 0],
];
const veryEasy = [
  [0, 0, 7, 0, 0, 0, 0, 2, 0],
  [4, 1, 9, 6, 0, 0, 0, 0, 8],
  [2, 3, 8, 0, 0, 0, 6, 9, 5],
  [3, 0, 4, 2, 0, 9, 8, 1, 0],
  [1, 0, 2, 8, 7, 0, 0, 4, 9],
  [8, 0, 5, 1, 6, 4, 2, 7, 3],
  [0, 0, 3, 5, 0, 1, 4, 0, 7],
  [0, 0, 0, 0, 0, 6, 3, 5, 0],
  [5, 0, 6, 7, 3, 2, 9, 0, 1],
];
const easy = [
  [2, 4, 0, 0, 0, 0, 0, 0, 3],
  [0, 0, 1, 6, 0, 0, 4, 2, 0],
  [8, 0, 0, 0, 4, 0, 0, 0, 1],
  [0, 6, 0, 9, 7, 0, 0, 0, 0],
  [9, 7, 0, 1, 8, 0, 0, 0, 5],
  [1, 0, 4, 3, 5, 6, 0, 9, 2],
  [0, 0, 0, 8, 2, 3, 0, 0, 6],
  [0, 0, 3, 0, 9, 5, 8, 1, 7],
  [0, 5, 0, 7, 0, 0, 2, 0, 0],
];
const medium = [
  [0, 5, 0, 0, 0, 7, 0, 0, 8],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 3, 8, 0, 5, 6, 1, 0, 0],
  [1, 0, 0, 0, 0, 9, 7, 0, 0],
  [9, 0, 0, 0, 6, 0, 4, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 6, 2],
  [2, 4, 0, 0, 0, 0, 0, 0, 9],
  [0, 6, 7, 0, 9, 0, 3, 2, 0],
  [0, 1, 0, 5, 8, 0, 0, 0, 4],
];
const hard = [
  [0, 1, 0, 0, 2, 0, 0, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, 0, 7, 0, 6, 3, 0, 0],
  [0, 0, 6, 0, 0, 1, 0, 8, 9],
  [0, 0, 0, 0, 8, 0, 4, 6, 0],
  [0, 0, 9, 0, 0, 2, 5, 1, 0],
  [5, 0, 0, 0, 4, 0, 0, 0, 0],
  [0, 0, 0, 6, 5, 0, 7, 0, 0],
  [0, 6, 0, 0, 7, 0, 1, 9, 0],
];

function findSubgrid(matrix, x, y) {
  if (x < 3 && y < 3) {
    return createSubgrid(matrix, 0, 0);
  }
  if (x < 3 && y < 6) {
    return createSubgrid(matrix, 0, 3);
  }
  if (x < 3 && y < 9) {
    return createSubgrid(matrix, 0, 6);
  }
  if (x < 6 && y < 3) {
    return createSubgrid(matrix, 3, 0);
  }
  if (x < 6 && y < 6) {
    return createSubgrid(matrix, 3, 3);
  }
  if (x < 6 && y < 9) {
    return createSubgrid(matrix, 3, 6);
  }
  if (x < 9 && y < 3) {
    return createSubgrid(matrix, 6, 0);
  }
  if (x < 9 && y < 6) {
    return createSubgrid(matrix, 6, 3);
  }
  if (x < 9 && y < 9) {
    return createSubgrid(matrix, 6, 6);
  }
  return null;
}

function iterateThroughEmptyCells(matrix, cycles, guesses) {
  let iterations = cycles ? cycles : 1;
  let guessDepth = guesses ? guesses : 0;
  let possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let board = matrix;
  let impossibleSolution = false;
  //?bgc = best guess candidate, the cell with fewest possiblities
  let bgc = {
    possibilities: [, , , , , , , , , , , , ,],
    x: 0,
    y: 0,
  };
  let valuesFound = 0;
  let missingValues = 0;
  console.log(
    `Iterations: ${iterations}, Guesses: ${guessDepth}, Missing Values: ${missingValues}`
  );
  //! Iterate through empty spaces
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (!board[x][y]) {
        missingValues++;
        let options = new Set(possibilities);
        let row = board[x];
        let col = createCol(board, y);
        let subgrid = findSubgrid(board, x, y);
        row.forEach((e) => {
          if (options.has(e)) {
            options.delete(e);
          }
        });
        col.forEach((e) => {
          if (options.has(e)) {
            options.delete(e);
          }
        });
        subgrid.forEach((e) => {
          if (options.has(e)) {
            options.delete(e);
          }
        });
        if (options.size === 0) {
          impossibleSolution = true;
          break;
        }
        if (options.size === 1) {
          valuesFound++;
          let answer;
          options.forEach((e) => (answer = e));
          board[x][y] = answer;
        }
        if (options.size < bgc.possibilities.length) {
          bgc.possibilities = [];
          options.forEach((e) => {
            bgc.possibilities.push(e);
          });
          console.log(
            `cell: ${x}${y} has ${options.size} possibilities: ${bgc.possibilities}`
          );
          bgc.x = x;
          bgc.y = y;
        }
      }
    }
    if (impossibleSolution) {
      break;
    }
  }
  //! next action
  let report = {
    returnBoard: board,
    impossible: impossibleSolution,
    solved: false,
  };
  //?if any cell has no possibilites return report
  if (impossibleSolution) {
    console.error('solution false, acell has no possible values');
    console.table(report.returnBoard);
    return report;
  }
  //? if a cell is filled in iterate again
  if (valuesFound > 0) {
    console.table(board);
    console.log();
    iterations++;
    iterateThroughEmptyCells(board, iterations, guessDepth);
  }
  //? if no new values are found and there are no empty cells left check solution
  if (valuesFound == 0 && missingValues == 0) {
    let solutionFound = checkFullMatrix(board);
    if (solutionFound) {
      console.log('solution found:' + solutionFound);
      console.table(report.returnboard);
      report.solved = true;
      return report;
    }
    console.error('no possible solution found');
    console.table(report.returnBoard);
    return report;
  }
  //? if no new values are found, try guessing best candidates
  if (valuesFound == 0) {
    guessDepth++;
    for (const e in bgc.possibilities) {
      const hypotheticalBoard = board;
      hypotheticalBoard[bgc.x][bgc.y] = bgc.possibilities[e];
      let { solved } = iterateThroughEmptyCells(
        hypotheticalBoard,
        iterations,
        guessDepth
      );
      if (solved) {
        report.returnBoard = hypot;
        return hypotheticalBoard;
      }
    }
  }

  return report;
}
console.time();
iterateThroughEmptyCells(hard);
console.timeEnd();
