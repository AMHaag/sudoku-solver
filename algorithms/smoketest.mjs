import findFirstSolution from './solveBoardAlgorithm.mjs';
import fetchPuzzle from './borrowPuzzle.mjs';
import { appendFileSync } from 'node:fs';

async function smokeTest(difficulty,count) {
  let puzzle = await fetchPuzzle(difficulty);
  const { puzzleBoard, solvedBoardString } = await puzzle;
  let output = `*************************
    Test #${count} - Difficulty:${difficulty}
    Puzzle Recieved has ${countClues(puzzleBoard)} clues
    ${puzzleBoard}\n
    Solution Given: ${solvedBoardString}\n\n`
    appendFile(output);
    output =''
  let start = performance.now();
  let {solution,returnBoard,iterations,maxGuessDepth} = await findFirstSolution( puzzleBoard)
  let end = performance.now();
  let duration = end - start;
   output = `
    Solution Found:${solution},
    Iterations:${iterations} 
    Duration:${Math.round(duration)} ms, 
    MaxGuessDepth:${maxGuessDepth}
    My solution:${returnBoard} \n\n\n`;
  appendFile(output);
  return;
}

function appendFile(text) {
  try {
    appendFileSync('./algorithms/Smoke-Test-Results.txt', text);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}
function countClues(matrix){
    let mV = 0
    for (let x=0;x<9;x++){
        for(let y=0;y<9;y++){
            if(!matrix[x][y]){mV++}
        }
    }
    return 81-mV
}




    await smokeTest(4, 100)

