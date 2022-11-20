export default function borderStyle(x:number,y:number){
    let output = 'border-black';
    if(x==0||x==3||x==6){output +=' border-t-4'}else{output+=' border-t-2'}
    if(x==8){output+=' border-b-4'}else{output+=' border-b-2'}
    if(y==0||y==3||y==6){output+=' border-l-4'}else{output+=' border-l-2'}
    if(y==8){output+=' border-r-4'}else{output+=' border-r-2'}
    return output;
}