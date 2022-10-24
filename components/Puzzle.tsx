import { useQuery } from "@tanstack/react-query"
import NumberCell from "./NumberCell";

export default function Puzzle(){
function fetchPuzzleBoard(){
    fetch('https://sugoku.herokuapp.com/board?difficulty=easy').then(res=>res.json()).then(res=>console.log(res))
}
const {data,error,isError,isLoading}= useQuery(['puzzle'],fetchPuzzleBoard);
console.log(data)
const puzzle: Array<React.ReactNode> = []
async function buildBoard(){
const matrix = await data
for(let x = 0;x<matrix.length;x++){
    for(let y=0;y<matrix[x].length;y++){
        puzzle.push(<NumberCell assignment={matrix[x][y]>0?matrix[x][y]:null} row={x} col={y}/>)
    }
    return puzzle
}
}

    return(
        {buildBoard()}
    )}