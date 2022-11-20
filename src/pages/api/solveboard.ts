import findFirstSolution from "../../../algorithm/solveBoardAlgorithm.mjs";
import { NextApiResponse, NextApiRequest } from 'next'


export default function solveAPI(_req:NextApiRequest,res:NextApiResponse){
 const matrix = _req.body;
    const a = performance.now()
    const report =  findFirstSolution(matrix)
    const b = performance.now()
    const execution = b-a
    const response = JSON.stringify({
        report:report,
        timeToSolve:execution
    })
    return res.status(200).json(response)
}