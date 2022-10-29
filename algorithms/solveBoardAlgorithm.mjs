/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createSubgrid,
  createCol,
  checkFullMatrix,
} from './validateSolution.mjs';
import { Board, BoardOfPossibleValues, emptyStringMatrix } from './classes.mjs';
import { testGrid, veryEasy, easy, medium, hard } from './testCases.mjs';

function findFirstSolution(matrix) {
  const board = new Board(matrix);
  /** Board of Possible Values */
  let BoPV = new BoardOfPossibleValues(emptyStringMatrix);
  let showDetailsInConsole = true;
  let cycleCount = 0;
  function iterateCellsAndGroups() {
    let valuesFound = 0;
    let failCell = '';
    cycleCount++;
    console.log(
      `*** Iterations: ${cycleCount}, Guesses: ${0}, Missing Values: ${
        board.missingValues || 'n/a'
      }, Numbers Remaining: ${board.numsAvail.returnArrayOfAvailableNums(0)}`
    );
    console.table(board.grid);
    console.table(BoPV.grid);
    function iterateCells() {
      board.missingValues = 0;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (cycleCount === 1 && board.grid[x][y] > 0) {
            let n = board.grid[x][y];
            board.numsAvail.decrementNumAvail(n);
            if (showDetailsInConsole) {
              console.log(`Cell: ${x}${y} is ${n}`);
            }
          }
          if (!board.grid[x][y]) {
            board.missingValues++;
            let options = new Set(board.numsAvail.returnArrayOfAvailableNums());
            let row = board.returnRowArray(x);
            let col = board.returnColArray(y);
            let subgrid = board.returnSubgridArrayByCoordinate(x, y);
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
            let cellOptions = Array.from(options);

            if (options.size === 0) {
              failCell = `${x}${y}`;
              // impossibleSolution = true;
              console.error(`cell:${failCell} has no possible answers`);
              break;
            }
            if (options.size === 1) {
              let answer = Array.from(options);
              answer = answer.toString();
              answer = parseInt(answer);
              valuesFound++;
              board.numsAvail.decrementNumAvail(answer);
              board.updateCell(answer, x, y);
              BoPV.overwriteCell('', x, y);
              if (showDetailsInConsole) {
                console.log(`Cell: ${x}${y} assigned value ${answer}`);
              }
            }
            if (options.size > 1) {
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${x}${y} has ${options.size} possibilities: ${cellOptions}`
                );
              }
              BoPV.updateCellViaArray(cellOptions, x, y);
            }
          }
        }
      }
    }
    function iterateGroups() {
      let a = board.numsAvail.returnArrayOfAvailableNums();
      a.forEach((cv) => {
        let n = cv;
        for (let g = 0; g < 9; g++) {
          let subject = {
            row: board.returnRowArray(g),
            col: board.returnColArray(g),
            sub: board.returnSubgridArray(g),
            rowOptions: BoPV.returnRowArray(g),
            colOptions: BoPV.returnColArray(g),
            subOptions: BoPV.returnSubgridArray(g),
          };
          if (
            subject.row.includes(n) &&
            subject.col.includes(n) &&
            subject.sub.includes(n)
          ) {
            continue;
          }
          if (!subject.row.includes(n)) {
            let cellsThatCanContainN = 0;
            let indexOfN = 10;
            subject.rowOptions.forEach((cv, i) => {
              if (cv.includes(n)) {
                cellsThatCanContainN++;
                indexOfN = i;
              }
            });
            if (cellsThatCanContainN == 1) {
              if (board.grid[g][indexOfN] !== 0) {
                throw 'ERROR: CELL ALREADY FULL :row';
              }
              board.grid[g][indexOfN] = n;
              BoPV.overwriteCell('', g, indexOfN);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${g}${indexOfN} assigned value ${n} via row group elimination`
                );
              }
              continue;
            }
          }
          if (!subject.col.includes(n)) {
            subject = {
              row: board.returnRowArray(g),
              col: board.returnColArray(g),
              sub: board.returnSubgridArray(g),
              rowOptions: BoPV.returnRowArray(g),
              colOptions: BoPV.returnColArray(g),
              subOptions: BoPV.returnSubgridArray(g),
            };
            let cellsThatCanContainN = 0;
            let indexOfN = 10;
            subject.colOptions.forEach((cv, i) => {
              console.log(typeof cv);
              if (cv.includes(n)) {
                cellsThatCanContainN++;
                indexOfN = i;
              }
            });
            if (cellsThatCanContainN == 1) {
              if (board.grid[indexOfN][g] !== 0) {
                throw 'ERROR: CELL ALREADY FULL :col';
              }
              console.table(cycleCount, subject.col);
              console.table(subject.colOptions);
              board.updateCell(n, indexOfN, g);
              BoPV.overwriteCell('', indexOfN, g);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${indexOfN}${g} assigned value${n} via col group elimination`
                );
              }

              continue;
            }
          }
          if (!subject.sub.includes(n)) {
            subject = {
              row: board.returnRowArray(g),
              col: board.returnColArray(g),
              sub: board.returnSubgridArray(g),
              rowOptions: BoPV.returnRowArray(g),
              colOptions: BoPV.returnColArray(g),
              subOptions: BoPV.returnSubgridArray(g),
            };
            let cellsThatCanContainN = 0;
            let indexOfN = 10;
            subject.subOptions.forEach((cv, i) => {
              if (cv.includes(n)) {
                cellsThatCanContainN++;
                indexOfN = i;
              }
            });
            if (cellsThatCanContainN == 1) {
              // if (board.grid[g][indexOfN] !== 0) {
              //   throw 'ERROR: CELL ALREADY FULL :sub';
              // }
              board.updateCellViaSubgridIndex(g, indexOfN, n);
              let xy = BoPV.updateCellViaSubgridIndex(g, indexOfN, '');
              BoPV.updateCellViaSubgridIndex(g, indexOfN, n.toString());
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${xy} assigned value ${n} via subgrid group elimination`
                );
              }
            }
          }
        }
      });
    }
    iterateCells();
    if (board.missingValues > 0) {
      iterateGroups();
    }
    if (valuesFound > 0) {
      // console.table(BoPV.grid);
      iterateCellsAndGroups();
    }
  }

  iterateCellsAndGroups();
  if (board.missingValues == 0) {
    let solved = checkFullMatrix(board.grid);
    console.log(`Solution Valid:${solved}`);
    console.table(board.grid);
  }
  if (board.missingValues > 0) {
    console.table(board.grid);
    console.table(BoPV.grid);
  }
}

console.time('Time to Solve');
findFirstSolution(medium);
console.timeEnd('Time to Solve');

//TODO Delte these if I don't need them, they should be in the classes now
// function findSubgrid(matrix, x, y) {
//   if (x < 3 && y < 3) {
//     return createSubgrid(matrix, 0, 0);
//   }
//   if (x < 3 && y < 6) {
//     return createSubgrid(matrix, 0, 3);
//   }
//   if (x < 3 && y < 9) {
//     return createSubgrid(matrix, 0, 6);
//   }
//   if (x < 6 && y < 3) {
//     return createSubgrid(matrix, 3, 0);
//   }
//   if (x < 6 && y < 6) {
//     return createSubgrid(matrix, 3, 3);
//   }
//   if (x < 6 && y < 9) {
//     return createSubgrid(matrix, 3, 6);
//   }
//   if (x < 9 && y < 3) {
//     return createSubgrid(matrix, 6, 0);
//   }
//   if (x < 9 && y < 6) {
//     return createSubgrid(matrix, 6, 3);
//   }
//   if (x < 9 && y < 9) {
//     return createSubgrid(matrix, 6, 6);
//   }
//   return null;
// }
// function findCoordinatesOfSubgrid(i) {
//   switch (i) {
//     case 0:
//       return ['0,0', '0,1', '0,2', '1,0', '1,1', '1,2', '2,0', '2,1', '2,2'];
//     case 1:
//       return ['0,3', '0,4', '0,5', '1,3', '1,4', '1,5', '2,3', '2,4', '2,5'];
//     case 2:
//       return ['0,6', '0,7', '0,8', '1,6', '1,7', '1,8', '2,6', '2,7', '2,8'];
//     case 3:
//       return ['3,0', '3,1', '3,2', '4,0', '4,1', '4,2', '5,0', '5,1', '5,2'];
//     case 4:
//       return ['3,3', '3,4', '3,5', '4,3', '4,4', '4,5', '5,3', '5,4', '5,5'];
//     case 5:
//       return ['3,6', '3,7', '3,8', '4,6', '4,7', '4,8', '5,6', '5,7', '5,8'];
//     case 6:
//       return ['6,0', '6,1', '6,2', '7,0', '7,1', '7,2', '8,0', '8,1', '8,2'];
//     case 7:
//       return ['6,3', '6,4', '6,5', '7,3', '7,4', '7,5', '8,0', '8,1', '8,2'];
//     case 8:
//       return ['6,6', '6,7', '6,8', '7,6', '7,7', '7,8', '8,6', '8,7', '8,8'];
//     default:
//       break;
//   }
// }
// function parseSubgridSet(string, i) {
//   let x = string.charAt(0);
//   let y = string.charAt(2);
//   return { x, y };
// }

// //! I think this is fucked up, but I'm tired now
// function createSubgridSet(matrix, i) {
//   let coordinates = findCoordinatesOfSubgrid(i);
//   let newset = [];
//   coordinates.forEach((e) => {
//     let { x, y } = parseSubgridSet(e);
//     newset.push(matrix[x][y]);
//   });
//   return newset;
// }

function iterateThroughEmptyCells(matrix, cycles, guesses, emptyCellsCount) {
  //! Declare variables
  totalCycles++;
  let iterations = totalCycles;
  let guessDepth = guesses ? guesses : 0;
  const possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let board = matrix;
  let impossibleSolution = false;
  //bgc = best guess candidate, the cell with fewest possiblities
  let bgc = {
    possibilities: [, , , , , , , , , , , , ,],
    x: 0,
    y: 0,
  };
  let valuesFound = 0;
  //TODO uncomment this for runtime
  console.log(
    `Iterations: ${iterations}, Guesses: ${guessDepth}, Missing Values: ${emptyCellsCount}`
  );
  let missingValues = 0;
  let failCell = '';
  let boardOfPossibleValues = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ];

  //! Iterate through empty spaces, check number of possible values
  //TODO Update iterations to add each possibility to a possibilities board
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
        let cellOptions = Array.from(options);
        //TODO uncomment this for runtime
        console.log(
          `cell: ${x}${y} has ${options.size} possibilities: ${cellOptions}`
        );

        if (options.size === 0) {
          failCell = `${x}${y}`;
          impossibleSolution = true;
          break;
        }
        if (options.size === 1) {
          valuesFound++;
          let answer = Array.from(options);
          answer = answer.toString();
          answer = parseInt(answer);
          board[x][y] = answer;
          //TODO uncomment this for runtime
          console.log(`Cell:${x}${y} assigned value ${answer}`);
        }
        boardOfPossibleValues[x][y] = cellOptions.toString();
        if (options.size < bgc.possibilities.length) {
          bgc.possibilities = Array.from(options);
          bgc.x = x;
          bgc.y = y;
        }
      }
    }
    if (impossibleSolution) {
      break;
    }
  }

  //! Iterate through sets
  function checkSetForStandAlone(set, i, setType) {
    if (!setType) {
      throw error;
    }
    //go through cell in bopv checking how many times number i appears
    let checkSet = set;
    //num = the number we are lookingfor
    for (let num = 1; num < 10; num++) {
      let countOfTestNum = 0;
      let homeOfStandAlone;
      //j= the index of current set being checked for a certain num
      for (let j = 0; j < 9; j++) {
        let possString = checkSet[j];
        if (typeof possString == Number && possString == num) {
          countOfTestNum++;
        }
        if (typeof possString == String) {
          if (possString.includes(num)) {
            countOfTestNum++;
          }
        }
      }
      // console.log(
      //   `checkSet:${checkSet} number:${num} countOfTestNum:${countOfTestNum}`
      // );

      if (countOfTestNum == 1) {
        //refind the item with a standalone value
        for (let j = 0; j < 9; j++) {
          let possString = checkSet[j];
          // console.log('possString'+possString)
          if (possString.includes(num)) {
            homeOfStandAlone = j;
            // console.log(homeOfStandAlone)
            break;
          }
        }
        //remove that value from bopv and add it to the board
        if (setType == 'row') {
          let numAsString = `${num}`;
          let oldString = boardOfPossibleValues[i][homeOfStandAlone];
          // console.error(oldString)
          let newString = oldString.replace(num, '');

          boardOfPossibleValues[i][homeOfStandAlone] = newString;
          board[i][homeOfStandAlone] = num;
          valuesFound++;
        }
        if (setType == 'col') {
          boardOfPossibleValues[homeOfStandAlone][i].replace(`${num}`, '');
          board[homeOfStandAlone][i] = num;
          valuesFound++;
        }
        if (setType == 'subgrid') {
          let coordinateArray = findCoordinatesOfSubgrid(i);
          let { x, y } = parseSubgridSet(coordinateArray, homeOfStandAlone);
          boardOfPossibleValues[x][y].replace(`$num`, '');
          board[x][y] = num;
          valuesFound++;
          console.table(board);
        }
      }
    }
    //if number i appears only once, add that value to the board and increment valuesFound
    //remove i from the rest of the row,col&subgrid bopv
  }
  //TODO iterate through each set's bop and see if any cell is the only cell to contain each number
  if (missingValues > 0) {
    for (let i = 0; i < 9; i++) {
      let currentCol = createCol(boardOfPossibleValues, i);
      let currentSubgrid = createSubgridSet(i);
      console.log(currentCol);
      checkSetForStandAlone(boardOfPossibleValues[i], i, 'row');
      checkSetForStandAlone(currentCol, i, 'col');
      checkSetForStandAlone(currentSubgrid, i, 'subgrid');
      console.table(boardOfPossibleValues[i]);
      console.table(board);
      console.log('fuck');
    }
  }

  //! next action
  let report = {
    returnBoard: board,
    impossible: impossibleSolution,
    solved: false,
    returnIterations: iterations,
    returnGuesses: guessDepth,
  };
  //?if any cell has no possibilites return report
  if (impossibleSolution) {
    console.error(
      `solution false, ${failCell} has no possible values\n Guess Depth:${guessDepth}`
    );
    return report;
  }
  //? if a cell is filled in iterate again
  if (valuesFound > 0) {
    console.warn(`${valuesFound} values have been found`);
    iterateThroughEmptyCells(board, iterations, guessDepth, missingValues);
  }
  //? if no new values are found and there are no empty cells left check solution
  if (valuesFound == 0 && missingValues < 1) {
    console.info('no empty cells remain');
    let solutionFound = checkFullMatrix(board);
    if (solutionFound) {
      console.log('solution found:' + solutionFound);
      console.table(report.returnBoard);
      report.solved = true;
      return report;
    }
    console.error('no possible solution found');
    console.table(report.returnBoard);
    return report;
  }
  //? if no new values are found, try guessing best candidates
  if (valuesFound == 0) {
    console.table(board);
    function makeGuess(matrix, bestGuess) {
      guessDepth++;
      for (let g = 0; g < bestGuess.possibilities.length; g++) {
        console.log(
          `Guess #${guessDepth} Does ${bestGuess.x}${bestGuess.y} = ${bestGuess.possibilities[g]}`
        );
        let hypotheticalBoard = matrix;
        console.table(hypotheticalBoard);
        hypotheticalBoard[bestGuess.x][bestGuess.y] =
          bestGuess.possibilities[g];
        let { solved, returnBoard } = iterateThroughEmptyCells(
          hypotheticalBoard,
          totalCycles,
          guessDepth,
          missingValues
        );
        if (solved) {
          // board = returnBoard;
          guessDepth = returnGuesses;
          missingValues = 0;
          return { solved, returnBoard, guessDepth, missingValues };
        }
        if (!solved) {
          console.log(
            `${bestGuess.x}${bestGuess.y} =/= ${bestGuess.possibilities[g]}`
          );
          missingValues = 1;
          hypotheticalBoard = matrix;
        }
      }
    }
    makeGuess(board, bgc);
    iterateThroughEmptyCells(board, iterations, guessDepth, missingValues);
  }

  // iterateThroughEmptyCells(board, totalCycles, guessDepth, missingValues);
  console.dir(report);
  return report;
}
