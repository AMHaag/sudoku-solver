

interface Props  {
    assignment: number | null;
    row:number;
    col:number; 
}

export default function NumberCell (props: Props){
    const {row,col,assignment} = props;
const borderTW = ()=>{
    let borderString = '';
    if(row===0||row===3||row===6){borderString+='border-t-4 '}else{borderString+='border-t '}
    if(row===8){borderString+='border-b-4 '}
    if(col===0||col===3||col===6){borderString+='border-l-4 '}else{borderString+='border-l '}
    if(col===8){borderString+='border-r-4 '}
    return borderString;
}
const gridTW=()=>{
    return `row-start-${row+1} row-end-${row+2} col-start-${col+1} col-end-${col+2}`
}


    return(
        <div placeholder={''} contentEditable="true" tabIndex={0} id = {'r'+row.toString()+'c'+col.toString()} className={`${borderTW()} ${gridTW()} border-gray-900 w-12 h-12 grid place-items-center ${assignment?'bg-gray-400':''} focus:bg-red-400 focus:font-bold disabled:text-black text-center`}>{assignment?assignment.toString():' '}</div>
    )
}