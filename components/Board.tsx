import { useQuery } from "@tanstack/react-query";
import NumberCell from "./NumberCell";


export default function Board(){

// function buildCellArray (){
//     const cellArray = [];
//     for (let i = 0; i < 81; i++) {
//             cellArray.push(<NumberCell assignment={8}/>)
            
//         }
//         return cellArray
// }
function fetchPuzzleBoard(){
    return fetch('https://sugoku.herokuapp.com/board?difficulty=easy').then(res=>res.json())
}
const puzzle: Array<React.ReactNode> = []

function buildBoard(data){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matrix:any = data.board
    console.log(matrix[0][0])
for(let x = 0;x<9;x++){
    console.log('x'+x)
    for(let y=0;y<9;y++){
        console.log('y'+y)
        puzzle.push(<NumberCell assignment={matrix[x][y]>0?matrix[x][y]:null} row={x} col={y}/>)
    }
}
return puzzle
}
function waitOnQuery(){
    const {data,isError,error,isLoading}= useQuery(['puzzle'],fetchPuzzleBoard);
if(isLoading){return <></>}
if(isError){return<p>Error: {error.message}</p>}
return buildBoard(data);
}

    return(
    <div className='grid grid-cols-9 place-items-center'>
        
        {waitOnQuery()}
    </div>)
}