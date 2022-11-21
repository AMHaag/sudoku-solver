import Image from 'next/image.js';
import { ChangeEvent, useState } from 'react';
import { testCases } from '../algorithm/testCases.mjs';
import {
  checkBoardForDuplicates_client,
  countNumberOfClues_client,
} from '../algorithm/validateSolution.mjs';
import borderStyle from './borderStyleFunction';
import profilePic from './profilePic.mjs';

interface ErrorObj {
  type: string | null;
  duplicateText: string | null;
  clueCount: number;
  invalidCharacterText: string | null;
}
const defaultErrorObj: ErrorObj = {
  type: null,
  duplicateText: null,
  clueCount: 25,
  invalidCharacterText: null,
};
interface SolutionReport {
  report: { maxGuessDepth: number; iterations: number };
  timeToSolve: number;
}
const defaultSolutionReport: SolutionReport = {
  report: { maxGuessDepth: 0, iterations: 0 },
  timeToSolve: 0,
};

export default function BoardForm() {
  const [board, setBoard] = useState(emptyBoard());
  const [solutionReport, setSolutionReport] = useState(defaultSolutionReport);
  const [errorMessage, setErrorMessage] = useState(defaultErrorObj);
  const [aboutModal, setAboutModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
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
              className=' w-8 h-8 m-0 md:w-12 md:h-12 text-center text-2xl md:text-4xl font-light md:font-normal leading-none md:leading-snug focus:bg-cyan-300  invalid:text-red-500  valid:bg-emerald-200 placeholder-gray-500 placeholder:bg-white b-0'
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
        const bg = subject[x][y] == 0 ? 'bg-red-300 bg-opacity-200' : '';
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
    setHelpModal(false);
    setAboutModal(false);
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
          let cell = 0;
          if (cellDOM?.textContent) {
            cell = Number.parseInt(cellDOM?.textContent);
          }
          if (cellDOM?.value) {
            cell = Number.parseInt(cellDOM?.value);
          }
          matrix[x][y] = cell;
        }
      }
      if (invalidInput) {
        return false;
      }
      return matrix;
    }
    const board = createMatrix();
    //? Error handling, show modal instead of send bad requests to server
    const errors: ErrorObj = {
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
    //? Send valid board to server to solve
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
    if (solutionReport.report.iterations === 0) {
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
          {Math.round(solutionReport ? solutionReport.timeToSolve : 0)}ms
        </h2>
        <h2 className='px-2 text-sm'>
          Guesses Made:{' '}
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
    setSolutionReport(defaultSolutionReport);
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
    setHelpModal(false);
    setAboutModal(false);
  }

  function resetBoard() {
    const newBoard = emptyBoard();
    setSolutionReport(defaultSolutionReport);
    setBoard(newBoard);
    setErrorMessage({
      type: null,
      duplicateText: null,
      clueCount: 0,
      invalidCharacterText: null,
    });
    setHelpModal(false);
    setAboutModal(false);
  }

  function ErrorModal(props: {
    type: string | null;
    duplicateText?: string | null;
    invalidCharacterText?: string | null;
    clueCount: number;
  }) {
    if (props.type) {
      setAboutModal(false);
      setHelpModal(false);
    }
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
  function AboutModal() {
    return (
      <div
        className={
          'fixed flex justify-center align-middle  left-0  w-full z-10' +
          ` ${aboutModal ? '' : 'hidden'}`
        }
      >
        <div className='text-center border-2 p-2 w-[288px] md:w-[400px] backdrop-blur backdrop-brightness-95 rounded-xl shadow-xl bg-opacity-30 bg-white border-gray-300'>
          <h2 className='text-lg '>About this page</h2>
          <Image
            src={profilePic}
            alt='Author Photo'
            className='rounded-full'
            height={150}
            width={150}
          />
          <p
            role='About the Author'
            className='font-size-xs  font-thin leading-snug '
          >
            {`Hi, my name is Aaron Haag and I'm a full-stack web developer who
            created this site.`}
            <br />
            {`
            It uses a backtracking tree-based algorithm to solve even the most
            difficult puzzles found in most apps and books.`}{' '}
            <br />
            {`If you'd like to learn more or if you'd like to reach out you can
            find me on the platforms below.`}
          </p>
          <a
            className='p-2 text-blue-800'
            href='https://amhaag.github.io/react-portfolio/'
          >
            My portfolio
          </a>
          <a
            className='p-2 text-blue-800'
            href='https://www.linkedin.com/in/aaron-haag/'
          >
            LinkedIn
          </a>
          <a className='p-2 text-blue-800' href='https://github.com/AMHaag'>
            Github
          </a>

          <button
            className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg  bg-white bg-opacity-50'
            onClick={() => {
              setAboutModal(false);
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
  function HelpModal() {
    return (
      <div
        className={
          'fixed flex justify-center align-middle  left-0  w-full z-10' +
          ` ${helpModal ? '' : 'hidden'}`
        }
      >
        <div className='text-center border-2 p-2 w-[288px] md:w-[400px] backdrop-blur backdrop-brightness-95 rounded-xl shadow-xl bg-opacity-30 bg-white border-gray-300'>
          <h2 className='text-lg uppercase font-red-700'>How to use this</h2>
          <p
            role='Instructions'
            className='font-size-xs  font-thin leading-snug '
          >
            Enter all known numbers from the puzzle you wish to solve , leaving
            zeros for unknown cells.
            <br />
            You must enter at least 25 clues in order to recieve a result, this
            constraint is to avoid potentially long waits for solutions.
            <br />
            If you would like to just see how quickly the algorithm can solve
            difficult puzzles you can choose a test puzzle below.
          </p>
          <button
            className='text-sm md:text-base border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg  bg-white bg-opacity-50'
            onClick={() => {
              setHelpModal(false);
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
  function showOptionalModals(option: string) {
    // event.preventDefault()
    console.log('button', option);
    console.log('boop');
    if (option === 'help') {
      setAboutModal(false);
      setHelpModal(true);
      console.log(`help=${helpModal}\nabout=${aboutModal}`);
    }
    if (option === 'about') {
      console.log('about');
      setAboutModal(true);
      setHelpModal(false);
      console.log(`help=${helpModal}\nabout=${aboutModal}`);
    }
  }

  return (
    <div>
      <ErrorModal
        type={errorMessage.type}
        duplicateText={errorMessage.duplicateText}
        invalidCharacterText={errorMessage.invalidCharacterText}
        clueCount={errorMessage.clueCount}
      />
      <AboutModal />
      <HelpModal />
      {board}
      <div id='control-panel-one' className='flex justify-evenly'>
        <button
          className='text-sm  border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg hover:bg-sky-400 bg-gray-200'
          onClick={() => {
            showOptionalModals('help');
          }}
        >
          Instructions
        </button>

        <button
          className='text-sm  border-slate-500 border-2 p-1 mt-1 rounded-md hover:rounded-lg  hover:bg-sky-400 bg-gray-200'
          onClick={() => {
            showOptionalModals('about');
          }}
        >
          About this page
        </button>
      </div>
      <div id='control-panel-two' className='flex justify-evenly'>
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
