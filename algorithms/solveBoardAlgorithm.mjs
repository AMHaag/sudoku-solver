'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  checkFullMatrix,
  checkGroupForDuplicate,
  checkCellForConflicts,
} from './validateSolution.mjs';
import { Board, BoardOfPossibleValues, emptyStringMatrix } from './classes.mjs';
import { testCases } from './testCases.mjs';
Object.freeze(testCases);

function generateEmptyBoPV() {
  const x = emptyStringMatrix.slice(0);
  return x;
}

function findFirstSolution(matrix, guesses = 0, cycles = 0) {
  //* Set runtime behaviors *//
  let showDetailsInConsole = true;
  //* =====function's variables===== *//
  let board = new Board(matrix.slice(0));
  /** Board of Possible Values */
  let BoPV = new BoardOfPossibleValues();
  let guessDepth = guesses;
  let cycleCount = cycles;
  let solutionImpossible = false;
  let report = {
    solution: false,
    returnBoard: null,
    iterations: null,
  };
  //* =====Subfunctions===== *//
  function iterateCellsAndGroups() {
    let valuesFound = 0;
    let failCell = '';
    cycleCount++;
    console.log(
      `*** Iterations: ${cycleCount}, Guesses: ${guessDepth}, Missing Values: ${
        board.missingValues || 'n/a'
      }`
    );
    // console.table(board.grid);
    function iterateCells() {
      if (solutionImpossible) {
        return;
      }
      board.missingValues = 0;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (cycleCount === 1 && board.grid[x][y] > 0) {
            let n = board.grid[x][y];
            board.numsAvail.decrementNumAvail(n);
            if (showDetailsInConsole) {
              console.log(
                `Cell: ${x}${y} is ${n} I:${cycleCount} G:${guessDepth}`
              );
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
              solutionImpossible = true;
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
                console.log(
                  `Cell: ${x}${y} assigned value ${answer} I:${cycleCount} G:${guessDepth}`
                );
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
        if (solutionImpossible) {
          break;
        }
      }
    }
    function iterateGroups() {
      if (solutionImpossible) {
        return;
      }
      let a = board.numsAvail.returnArrayOfAvailableNums();
      a.forEach((cv) => {
        let n = cv;
        for (let g = 0; g < 9; g++) {
          let groupVF = 0;
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
              BoPV.remove

              BoPV.overwriteCell('', g, indexOfN);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              groupVF++;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${g}${indexOfN} assigned value ${n} via row g.e. I:${cycleCount} G:${guessDepth}`
                );
                console.log(BoPV.returnRowArray(g));
              }
              if (checkGroupForDuplicate(board.returnRowArray(g))) {
                console.table(board.grid);
                console.error(`This cannot be assigned, causes duplicate!`);
                solutionImpossible = true;
                break;
              }
              continue;
            }
          }
          if (!subject.col.includes(n)) {
            if (groupVF > 0) {
              subject = {
                row: board.returnRowArray(g),
                col: board.returnColArray(g),
                sub: board.returnSubgridArray(g),
                rowOptions: BoPV.returnRowArray(g),
                colOptions: BoPV.returnColArray(g),
                subOptions: BoPV.returnSubgridArray(g),
              };
              groupVF = 0;
            }
            let cellsThatCanContainN = 0;
            let indexOfN = 10;
            subject.colOptions.forEach((cv, i) => {
              if (cv.includes(n)) {
                cellsThatCanContainN++;
                indexOfN = i;
              }
            });
            if (cellsThatCanContainN == 1) {
              if (board.grid[indexOfN][g] !== 0) {
                throw 'ERROR: CELL ALREADY FULL :col';
              }
              if (checkCellForConflicts(indexOfN, g, board)) {
                solutionImpossible = true;
                break;
              }
              board.updateCell(n, indexOfN, g);
              BoPV.overwriteCell('', indexOfN, g);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              groupVF++;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${indexOfN}${g} assigned value${n} via col g.e. I:${cycleCount} G:${guessDepth}`
                );
                console.log(BoPV.returnColArray(g));
              }
              if (checkGroupForDuplicate(board.returnColArray(g))) {
                console.table(board.grid);
                console.error(`This cannot be assigned, causes duplicate!`);
                solutionImpossible = true;
              }
              continue;
            }
          }
          if (!subject.sub.includes(n)) {
            if (groupVF > 0) {
              subject = {
                row: board.returnRowArray(g),
                col: board.returnColArray(g),
                sub: board.returnSubgridArray(g),
                rowOptions: BoPV.returnRowArray(g),
                colOptions: BoPV.returnColArray(g),
                subOptions: BoPV.returnSubgridArray(g),
              };
            }
            let cellsThatCanContainN = 0;
            let indexOfN = 10;
            subject.subOptions.forEach((cv, i) => {
              if (cv.includes(n)) {
                cellsThatCanContainN++;
                indexOfN = i;
              }
            });
            if (cellsThatCanContainN == 1) {
              if (board.returnCellViaSubgridIndex(g, indexOfN) !== 0) {
                throw 'ERROR: CELL ALREADY FULL :sub';
              }
              let { x, y } = BoPV.getCellCoordinateViaSubgridIndex(g, indexOfN);
              if (checkCellForConflicts(x, y, board)) {
                solutionImpossible = true;
              }
              board.updateCellViaSubgridIndex(g, indexOfN, n);
              let xy = BoPV.updateCellViaSubgridIndex(g, indexOfN, '');
              BoPV.updateCellViaSubgridIndex(g, indexOfN, n.toString());
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${xy} assigned value ${n} via sub g.e. I:${cycleCount} G:${guessDepth}`
                );
                console.log(BoPV.returnSubgridArray(g));
              }
              if (checkGroupForDuplicate(board.returnSubgridArray(g))) {
                console.error(`This cannot be assigned, causes duplicate!`);
                solutionImpossible = true;
                break;
              }
            }
          }
        }
      });
    }
    iterateCells();
    if (solutionImpossible) {
      return false;
    }
    if (board.missingValues > 0) {
      iterateGroups();
    }
    if (valuesFound > 0) {
      // console.table(BoPV.grid);
      iterateCellsAndGroups();
    }
  }
  function makeGuess() {
    if (solutionImpossible) {
      return;
    }
    guessDepth++;
    let end = false;
    for (let x = 0; x < 9; x++) {
      if (end) {
        break;
      }
      for (let y = 0; y < 9; y++) {
        if (end) {
          break;
        }
        let cell = BoPV.returnCell(x, y);
        let cellArrStr = cell.split(' ');
        let cellArr = cellArrStr.map((v) => {
          return Number.parseInt(v);
        });
        if (cellArr.length > 1) {
          for (let i = 0; i < cellArr.length; i++) {
            if (end) {
              break;
            }
            // console.log(typeof cellArr[i]);
            // console.log(BoPV.grid[x][y]);
            // console.table(BoPV.grid);
            if (showDetailsInConsole) {
              console.log(`Does ${x}${y} = ${cellArr[i]}`);
            }
            const theoryBoard = board.returnBoard();
            let testValue = cellArr[i];
            theoryBoard[x][y] = testValue;
            BoPV.removeOptionFromCell(cellArr[i], x, y);
            if (showDetailsInConsole) {
              console.table(theoryBoard);
            }
            report = findFirstSolution(theoryBoard, guessDepth, cycleCount);
            if (report.solution) {
              end = true;
              if (showDetailsInConsole) {
                console.log(`${x}${y} = ${cellArr[i]}`);
              }
              // console.log(`Solution found in guess #${guessDepth}`);
              board = new Board(report.returnBoard);
              cycleCount = report.iterations;
              report.solution = true;
              break;
            }
            if (end) {
              break;
            }
            if (!report.solution) {
              if (end) {
                break;
              }
              console.log(`${x}${y} =/= ${cellArr[i]}`);
              continue;
            }
          }
          if (end) {
            break;
          }
        }
      }
      if (end) {
        break;
      }
    }
    return;
  }
  function checkForFinishedBoard() {
    if (report.solution) {
      return report;
    }
    if (board.missingValues == 0) {
      let solved = checkFullMatrix(board.grid);
      console.log(`Solution Valid:${solved}`);
      if (solved) {
        report.solution = true;
        report.returnBoard = board.grid;
        report.iterations = cycleCount;
        console.table(board.grid);
        return report;
      } else {
        report.solution = false;
        return report;
      }
    }
  }

  //* =====Control Flow===== *//
  iterateCellsAndGroups();
  if (solutionImpossible) {
    console.log('Branch end');
    report.solution = false;
    return report;
  }
  checkForFinishedBoard();
  if (report.solution) {
    return report;
  }
  makeGuess();
  return report;
}

console.time('Time to Solve');
findFirstSolution(testCases.extreme3);
console.timeEnd('Time to Solve');
