import { ChangeEvent, useState } from 'react';
import { testCases } from '../algorithms/testCases.mjs';
import {
  checkBoardForDuplicates_client,
  countNumberOfClues_client,
} from '../algorithms/validateSolution.mjs';
import borderStyle from './borderStyleFunction';

export default function BoardForm() {
  const [board, setBoard] = useState(emptyBoard());
  const [solutionReport, setSolutionReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState({
    type: null,
    duplicateText: null,
    clueCount: 25,
    invalidCharacterText: null,
  });
  function emptyBoard() {
    const cellStyles =
      'w-8 h-8 text-center text-3xl m-0 p-0 md:w-12 md:h-12 md:text-4xl leading-none z-10';
    const tableArr = [];
    for (let i = 0; i < 9; i++) {
      const cellRowArr = [];
      for (let j = 0; j < 9; j++) {
        const cellId = `${i}${j}`;
        const border = borderStyle(i, j);
        cellRowArr.push(
          <td key={cellId} className={`${cellStyles} ${border}`}>
            <input
              id={`${cellId}`}
              className=' w-8 h-8 m-0 md:w-12 md:h-12 text-center text-2xl md:text-4xl font-light md:font-normal leading-none md:leading-snug focus:bg-cyan-300  invalid:bg-red-300 valid:bg-emerald-200 placeholder-gray-500 placeholder:bg-white b-0'
              type='number'
              maxLength={1}
              size={1}
              min={0}
              max={9}
              placeholder='0'
              required={true}
            />
          </td>
        );
      }
      const rowId = `row${i}`;
      tableArr.push(
        <tr id={rowId} key={rowId}>
          {cellRowArr}
        </tr>
      );
    }
    return (
      <table key={Math.random()} className='bg-white pb-1'>
        <tbody>{tableArr}</tbody>
      </table>
    );
  }

  function returnBoard(matrix: number[][]) {
    const cellStyles =
      'w-8 h-8 text-center text-3xl m-0 p-0 md:w-12 md:h-12 md:text-4xl leading-none';
    const subject = matrix;
    const tableArr = [];
    for (let x = 0; x < 9; x++) {
      const cellRowArr = [];
      for (let y = 0; y < 9; y++) {
        const cellId = `${x}${y}`;
        const border = borderStyle(x, y);
        const bg = subject[x][y] == 0 ? 'bg-red-300 bg-opacity-50' : '';
        cellRowArr.push(
          <td
            id={`${cellId}`}
            key={cellId}
            className={`${cellStyles} ${border} ${bg}`}
          >
            {subject[x][y]}
          </td>
        );
      }
      const rowId = `row${x}`;
      tableArr.push(
        <tr id={rowId} key={rowId}>
          {cellRowArr}
        </tr>
      );
    }
    return (
      <div className='grid place-items-center'>
        <table key={Math.random()} className='mb-2'>
          <tbody className='mb-2'>{tableArr}</tbody>
        </table>
      </div>
    );
  }

  async function solveBoard() {
    function createMatrix() {
      const matrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      let invalidInput = false;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          const cellDOM = document.getElementById(
            `${x}${y}`
          ) as HTMLInputElement;
          if (cellDOM?.validity?.badInput) {
            invalidInput = true;
            break;
          }
          const cell =
            Number.parseInt(cellDOM?.value) ||
            Number.parseInt(cellDOM?.textContent) ||
            Number.parseInt(cellDOM?.placeholder) ||
            0;
          matrix[x][y] = cell;
        }
      }
      if (invalidInput) {
        return false;
      }
      return matrix;
    }
    const board = createMatrix();
    //?Error handling, show modal instead of send bad requests to server
    const errors = {
      type: null,
      duplicateText: null,
      clueCount: 0,
      invalidCharacterText: null,
    };
    if (board === false) {
      errors.invalidCharacterText =
        'Invalid character found, only numbers 1-9 are valid.';
      errors.type = 'Error';
      setErrorMessage({
        type: errors.type,
        duplicateText: errors.duplicateText,
        clueCount: errors.clueCount,
        invalidCharacterText: errors.invalidCharacterText,
      });
      return;
    }
    const clueCount = countNumberOfClues_client(board);
    if (clueCount === 81) {
      errors.invalidCharacterText = 'This board has no empty spaces!';
      errors.type = 'Error';
      setErrorMessage({
        type: errors.type,
        duplicateText: errors.duplicateText,
        clueCount: errors.clueCount,
        invalidCharacterText: errors.invalidCharacterText,
      });
    }
    const duplicateCheck = checkBoardForDuplicates_client(board);
    if (duplicateCheck !== false || clueCount < 25) {
      if (clueCount < 25) {
        errors.clueCount = clueCount;
        errors.type = 'Warning';
      }
      if (duplicateCheck !== false) {
        errors.duplicateText = duplicateCheck.join();
        errors.type = 'Error';
      }
      setErrorMessage({
        type: errors.type,
        duplicateText: errors.duplicateText,
        clueCount: errors.clueCount,
        invalidCharacterText: errors.invalidCharacterText,
      });
      return;
    }
    //send valid board to server to solve
    const solution = await fetch('./api/solveboard', {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(board),
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res));
    setBoard(returnBoard(solution.report.returnBoard));
    setSolutionReport(solution);
  }

  function showReport() {
    if (!solutionReport) {
      return (
        <div className='flex justify-center'>
          <h2 className='px-2 text-sm invisible'>
            This is here to stop layout shift.
          </h2>
        </div>
      );
    }
    return (
      <div className='flex justify-between'>
        <h2 className='px-2 text-sm'>
          Solved in:{' '}
          {Math.round(solutionReport ? solutionReport.timeToSolve : '')}ms
        </h2>
        <h2 className='px-2 text-sm'>
          Guessed Made:{' '}
          {solutionReport ? solutionReport.report.maxGuessDepth : ''}
        </h2>
        <h2 className='px-2 text-sm'>
          Iterations: {solutionReport ? solutionReport.report.iterations : ''}
        </h2>
      </div>
    );
  }

  function displayExampleBoard(e: ChangeEvent<HTMLSelectElement>) {
    const example = e.target.value;
    setSolutionReport(null);
    switch (example) {
      case 'easy':
        setBoard(returnBoard(testCases.veryEasy));
        break;
      case 'medium':
        setBoard(returnBoard(testCases.easy));
        break;
      case 'hard':
        setBoard(returnBoard(testCases.medium));
        break;
      case 'extremeOne':
        setBoard(returnBoard(testCases.extreme1));
        break;
      case 'extremeTwo':
        setBoard(returnBoard(testCases.extreme2));
        break;
      case 'extremeThree':
        setBoard(returnBoard(testCases.extreme3));
        break;
      case 'extremeFour':
        setBoard(returnBoard(testCases.extreme4));
        break;
      default:
        break;
    }
    e.target.selectedIndex = 0;
  }

  function resetBoard() {
    const newBoard = emptyBoard();
    setSolutionReport(null);
    setBoard(newBoard);
    setErrorMessage({
      type: null,
      duplicateText: null,
      clueCount: 0,
      invalidCharacterText: null,
    });
  }

  function Modal(props: {
    type: string | null;
    duplicateText?: string | null;
    invalidCharacterText?: string | null;
    clueCount: number;
  }) {
    const Header = (
      <h2 className='text-lg uppercase font-red-700'>{props.type}</h2>
    );
    const ClueWarning = (
      <p className='font-size-xs  font-thin leading-snug italic'>
        Puzzles must contain at least 25 clues before being submitted.{' '}
      </p>
    );
    const Errors = [];
    if (props.duplicateText) {
      Errors.push(
        <div>
          <h3>Duplicate Numbers Found:</h3>
          <p className='font-size-xs  font-thin leading-snug'>
            {props.duplicateText}
          </p>
        </div>
      );
    }
    if (props.invalidCharacterText) {
      Errors.push(
        <div>
          <h3>Invalid board:</h3>
          <p className='font-size-xs  font-thin leading-snug'>
            {props.invalidCharacterText}
          </p>
        </div>
      );
    }

    return (
      <div
        className={
          'fixed flex justify-center align-middle  left-0  w-full z-10' +
          ` ${props.type ? '' : 'hidden'}`
        }
      >
        <div className='text-center border-2 p-2 w-[288px] md:w-[400px] backdrop-blur backdrop-brightness-95 rounded-xl shadow-xl bg-opacity-30 bg-white border-gray-300'>
          {Header}
          {props.clueCount < 25 ? ClueWarning : ''}
          {Errors}
          <button
            className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg  bg-white bg-opacity-50'
            onClick={() => {
              setErrorMessage({
                type: null,
                duplicateText: null,
                clueCount: 25,
                invalidCharacterText: null,
              });
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal
        type={errorMessage.type}
        duplicateText={errorMessage.duplicateText}
        invalidCharacterText={errorMessage.invalidCharacterText}
        clueCount={errorMessage.clueCount}
      />
      {board}
      <div id='control-panel' className='flex justify-evenly'>
        <button
          className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg hover:bg-sky-400 bg-emerald-300'
          onClick={solveBoard}
        >
          Solve Board!
        </button>
        <select
          name='test-cases'
          id='tests'
          className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg hover:bg-sky-400 bg-emerald-300'
          onChange={displayExampleBoard}
          defaultValue=''
        >
          <option value='' disabled>
            Test puzzles:
          </option>
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
          <option value='extremeOne'>Extreme 1</option>
          <option value='extremeTwo'>Extreme 2</option>
          <option value='extremeThree'>Extreme 3</option>
          <option value='extremeFour'>Extreme 4</option>
        </select>
        <button
          className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg hover:bg-red-500  bg-red-300'
          onClick={resetBoard}
        >
          Reset Board
        </button>
      </div>
      <div>{showReport()}</div>
    </div>
  );
}
