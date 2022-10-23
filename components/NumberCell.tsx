

interface Props  {
    assignment: number | null;
    clue?: boolean;
    order: number;
    coordinate:string;  
}

export default function NumberCell (props: Props){

    return(
        <input  value={props.assignment?props.assignment.toString():''} type={'text'} placeholder={''} tabIndex={0} id = {props.assignment?props.assignment.toString():' '} className={'w-12 h-12 grid place-items-center focus:bg-red-400 focus:font-bold disabled:text-black'}/>
    )
}