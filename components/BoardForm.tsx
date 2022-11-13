import { useState } from "react";
import { testCases } from "../algorithms/testCases.mjs";

export default function BoardForm(){
const cellStyles= "border-gray-900 border-2 w-12 h-12 text-center text-4xl m-0"
const [board,setBoard] = useState(returnBoard(testCases.easy))
const [solutionReport,setSolutionReport] = useState(null)

// function emptyBoard(){
//     const tableArr =[];
//     for(let i=0;i<9;i++){
//         const cellRowArr = []
//         for (let j=0;j<9;j++){
//             const cellId = `${i}${j}`
//             cellRowArr.push(<td id={`${cellId}`} key={cellId} className={`${cellStyles}`} ><input className='w-12 h-12 text-center' type='number' maxLength={1} size={1} placeholder='0' min={0} max={9} required={true}/></td>)
//         }
//         const rowId = `row${i}`
//         tableArr.push(<tr id={rowId} key={rowId}>{cellRowArr}</tr>)
//     }
//     return <table>{tableArr}</table>;

// }
// function returnBoard(matrix){
//         const tableArr =[];
//     for(let i=0;i<9;i++){
//         const cellRowArr = []
//         for (let j=0;j<9;j++){
//             const cellId = `${i}${j}`
//             cellRowArr.push(<td id={`${cellId}`} key={cellId} className={`${cellStyles}`} >{matrix[x][y]}</td>)
//         }
//         const rowId = `row${i}`
//         tableArr.push(<tr id={rowId} key={rowId}>{cellRowArr}</tr>)
//     }
//     return tableArr;
// }
function returnBoard(matrix:number[][]){
    const subject = matrix
        const tableArr =[];
    for(let x=0;x<9;x++){
        const cellRowArr = []
        for (let y=0;y<9;y++){
            const cellId = `${x}${y}`
            cellRowArr.push(<td id={`${cellId}`} key={cellId} className={`${cellStyles}`} >{subject[x][y]}</td>)
        }
        const rowId = `row${x}`
        tableArr.push(<tr id={rowId} key={rowId}>{cellRowArr}</tr>)
    }
    return <table><tbody>{tableArr}</tbody></table>;}

async function solveBoard(){
    function createMatrix(){
        const matrix = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
        ];
        for(let x=0;x<9;x++){
            for (let y=0;y<9;y++){
                const cell = Number.parseInt(document.getElementById(`${x}${y}`)?.textContent)
                matrix[x][y] = cell;
            }
        }
        return matrix;
    }
    const board = createMatrix()
    const options = {
        headers:{'content-type':'application/json'},
        body:JSON.stringify(board),
        method:'POST'
    }
    const solution = await fetch('./api/solveboard',options).then(res=>res.json()).then(res=>JSON.parse(res))
    setBoard(returnBoard(solution.report.returnBoard))
    setSolutionReport(solution)
}
function showReport(){
    if (!solutionReport){return}
    return(<div className="flex justify-between">
        <h2>Solved in: {Math.round(solutionReport?solutionReport.timeToSolve:'')}ms</h2>
        <h2>Guessed Made: {solutionReport?solutionReport.report.maxGuessDepth:''}</h2>
        <h2>Iterations: {solutionReport?solutionReport.report.iterations:''}</h2>
    </div>)
}

    return(
        <div>
            {board}
        <div>{showReport()}</div>
        <button className='border-red-300 border-2' onClick={solveBoard}>Solve Board!</button>
        </div>
            )
}