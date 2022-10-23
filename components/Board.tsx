import NumberCell from "./NumberCell"
import { SubGridOverlay } from "./Overlays";

export default function Board(){

function buildCellArray (){
    const cellArray = [];
    for (let i = 0; i < 81; i++) {
            cellArray.push(<NumberCell assignment={8}/>)
            
        }
        return cellArray
}

    return(
    <div className='grid grid-cols-9 place-items-center'>
        
        {buildCellArray()}
    </div>)
}