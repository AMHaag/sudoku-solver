'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  checkFullMatrix,
  checkGroupForDuplicate,
  checkCellForConflicts,
  checkAllGroupsForDuplicates,
} from './validateSolution.mjs';
import { Board, BoardOfPossibleValues } from './classes.mjs';

let defaultReport = {
  solution: false,
  returnBoard: null,
  iterations: 0,
  maxGuessDepth: 0,
};

export default function findFirstSolution(
  matrix,
  guesses = 0,
  incomingReport = defaultReport
) {
  //* ======Set runtime behaviors===== *//
  let showDetailsInConsole = false;
  //* =====function's variables===== *//
  let board = new Board(Array.from(matrix));
  let BoPV = new BoardOfPossibleValues();
  let report = incomingReport;
  let guessDepth = guesses;
  let noSolution = false;

  //! debugger stop
  if (report.iterations > 1000) {
    throw `1k iterations reached`;
  }
  //* =====Subfunctions===== *//
  function iterateCellsAndGroups() {
    let valuesFound = 0;
    let failCell = '';
    report.iterations++;
    console.log(
      `*** Iterations: ${
        report.iterations
      }, Guesses: ${guessDepth}, Missing Values: ${
        board.missingValues || 'n/a'
      }`
    );
    function iterateCells() {
      if (noSolution) {
        return;
      }
      board.missingValues = 0;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (report.iterations === 1 && board.grid[x][y] > 0) {
            let n = board.grid[x][y];
            board.numsAvail.decrementNumAvail(n);
            if (showDetailsInConsole) {
              console.log(
                `Cell: ${x}${y} is ${n} I:${report.iterations} G:${guessDepth}`
              );
            }
          }
          if (!board.grid[x][y]) {
            board.missingValues++;
            let options = new Set(board.numsAvail.returnArrayOfAvailableNums());
            let conflicts = board.returnSetOfConflicts(x, y);
            conflicts.forEach((e) => {
              if (options.has(e)) {
                options.delete(e);
              }
            });
            let cellOptions = Array.from(options);
            if (options.size === 0) {
              failCell = `${x}${y}`;
              noSolution = true;
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
                  `Cell: ${x}${y} assigned value ${answer} I:${report.iterations} G:${guessDepth}`
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
        if (noSolution) {
          break;
        }
      }
    }
    function iterateGroups() {
      if (noSolution) {
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
              if (board.returnSetOfConflicts(g, indexOfN).includes(n)) {
                if (showDetailsInConsole) {
                  console.error(`cannot assign ${n} to cell: ${g}${indexOfN}`);
                }
                continue;
              }
              board.grid[g][indexOfN] = n;
              BoPV.removeOptionCellsparents(g, indexOfN, n);

              BoPV.overwriteCell('', g, indexOfN);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              groupVF++;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${g}${indexOfN} assigned value ${n} via row g.e. I:${report.iterations} G:${guessDepth}`
                );
              }
              if (checkGroupForDuplicate(board.returnRowArray(g))) {
                console.table(board.grid);
                console.error(`This cannot be assigned, causes duplicate!`);
                noSolution = true;
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
              if (board.returnSetOfConflicts(indexOfN, g).includes(n)) {
                if (showDetailsInConsole) {
                  console.error(`cannot assign ${n} to cell: ${g}${indexOfN}`);
                }
                continue;
              }
              if (checkCellForConflicts(indexOfN, g, board)) {
                noSolution = true;
                break;
              }
              board.updateCell(n, indexOfN, g);
              BoPV.removeOptionCellsparents(indexOfN, g, n);
              BoPV.overwriteCell('', indexOfN, g);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              groupVF++;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${indexOfN}${g} assigned value${n} via col g.e. I:${report.iterations} G:${guessDepth}`
                );
                console.log(BoPV.returnColArray(g));
              }
              if (checkGroupForDuplicate(board.returnColArray(g))) {
                console.table(board.grid);
                console.error(`This cannot be assigned, causes duplicate!`);
                noSolution = true;
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
              if (board.returnSetOfConflicts(x, y).includes(n)) {
                if (showDetailsInConsole) {
                  console.error(`cannot assign ${n} to cell: ${x}${y}`);
                }
                continue;
              }
              if (checkCellForConflicts(x, y, board)) {
                noSolution = true;
              }
              board.updateCellViaSubgridIndex(g, indexOfN, n);
              BoPV.removeOptionCellsparents(x, y, n);
              let xy = BoPV.updateCellViaSubgridIndex(g, indexOfN, '');
              BoPV.overwriteCell('', x, y);
              valuesFound++;
              board.numsAvail.decrementNumAvail(n);
              board.missingValue--;
              if (showDetailsInConsole) {
                console.log(
                  `Cell: ${xy} assigned value ${n} via sub g.e. I:${report.iterations} G:${guessDepth}`
                );
                // console.log(BoPV.returnSubgridArray(g));
              }
              if (checkGroupForDuplicate(board.returnSubgridArray(g))) {
                console.error(`This cannot be assigned, causes duplicate!`);
                noSolution = true;
                break;
              }
            }
          }
        }
      });
    }
    iterateCells();
    if (noSolution) {
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
    if (checkAllGroupsForDuplicates(board.grid)) {
      console.table(board.grid);
      throw 'something is wrong';
    }
    if (noSolution) {
      return;
    }

    guessDepth++;
    if (guessDepth > report.maxGuessDepth) {
      report.maxGuessDepth = guessDepth;
    }
    let end = false;
    let guessQueue = BoPV.returnQueueOfGuessCandidates();
    for (let q = 0; q < guessQueue.length; q++) {
      let x = guessQueue[q].x;
      let y = guessQueue[q].y;
      let p = guessQueue[q].p.split(' ').map((cv) => {
        return Number.parseInt(cv);
      });
      for (let i = 0; i < p.length; i++) {
        if (end) {
          break;
        }

        if (showDetailsInConsole) {
          console.log(
            `Does ${x}${y} = ${p[i]}, it has ${BoPV.grid[x][y]} as options`
          );
        }

        let theoryBoard = structuredClone(board);
        let testValue = p[i];
        theoryBoard.grid[x][y] = testValue;
        BoPV.removeOptionFromCell(p[i], x, y);
        if (showDetailsInConsole) {
          console.table(theoryBoard.grid);
        }
        let outgoingReport = structuredClone(report);
        report = findFirstSolution(
          theoryBoard.grid,
          guessDepth,
          outgoingReport
        );
        theoryBoard.grid = null;
        if (report.solution) {
          end = true;
          if (showDetailsInConsole) {
            console.log(`${x}${y} = ${p[i]}`);
          }
          board = new Board(report.returnBoard);
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
          if (showDetailsInConsole) {
            console.log(`${x}${y} =/= ${p[i]}`);
          }

          if (checkAllGroupsForDuplicates(board.grid)) {
            console.table(board.grid);
            throw 'something is wrong';
          }
          continue;
        }
      }
    }
    // for (let x = 0; x < 9; x++) {
    //   if (end) {
    //     break;
    //   }
    //   for (let y = 0; y < 9; y++) {
    //     if (end) {
    //       break;
    //     }
    //     let cell = BoPV.returnCell(x, y);
    //     let cellArrStr = cell.split(' ');
    //     let cellArr = cellArrStr.map((v) => {
    //       return Number.parseInt(v);
    //     });
    //     if (cellArr.length > 1) {
    //       for (let i = 0; i < cellArr.length; i++) {
    //         if (end) {
    //           break;
    //         }

    //         //! change this back to showDetailsInConsole
    //         if (true) {
    //           console.log(`Does ${x}${y} = ${cellArr[i]}, it has ${BoPV.grid[x][y]} as options`);
    //         }

    //         let theoryBoard = structuredClone(board);
    //         let testValue = cellArr[i];
    //         theoryBoard.grid[x][y] = testValue;
    //         BoPV.removeOptionFromCell(cellArr[i], x, y);
    //         if (showDetailsInConsole) {
    //           console.table(theoryBoard.grid);
    //         }
    //         let outgoingReport = structuredClone(report)
    //         report = findFirstSolution(
    //           theoryBoard.grid,
    //           guessDepth,
    //           outgoingReport
    //         );
    //         theoryBoard.grid = null;
    //         if (report.solution) {
    //           end = true;
    //           if (showDetailsInConsole) {
    //             console.log(`${x}${y} = ${cellArr[i]}`);
    //           }
    //           // console.log(`Solution found in guess #${guessDepth}`);
    //           board = new Board(report.returnBoard);
    //           report.solution = true;
    //           break;
    //         }
    //         if (end) {
    //           break;
    //         }
    //         if (!report.solution) {
    //           if (end) {
    //             break;
    //           }
    //           console.log(`${x}${y} =/= ${cellArr[i]}`);
    //           if (checkAllGroupsForDuplicates(board.grid)) {
    //             console.table(board.grid);
    //             throw 'something is wrong';
    //           }
    //           continue;
    //         }
    //       }
    //       if (end) {
    //         break;
    //       }
    //     }
    //   }
    //   if (end) {
    //     break;
    //   }
    // }
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
        console.table(board.grid);
        return report;
      } else {
        // report.solution = false;
        // return report;
        console.table(board.grid);
        throw 'Illegal Board Reached';
      }
    }
  }

  //* =====Control Flow===== *//
  board.countMissingValues();
  iterateCellsAndGroups();
  if (noSolution) {
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
