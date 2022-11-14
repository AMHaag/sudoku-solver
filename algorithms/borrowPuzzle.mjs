
export default async function fetchPuzzle(difficulty) {
  if (difficulty < 1 || difficulty > 4) {
    console.error('invalid difficulty, must be between 1-4');
    return;
  }
  console.log(`This is a difficulty ${difficulty} puzzle`);
  const blob = await fetch(
    `https://nine.websudoku.com/?level=${difficulty}`
  ).then((res) => {
    return res.text();
  });
  const solvedBoardIndex = blob.indexOf(
    'INPUT NAME=cheat ID="cheat" TYPE=hidden VALUE="'
  );
  const solvedBoardString = blob.slice(
    solvedBoardIndex + 47,
    solvedBoardIndex + 128
  );
  const boardMaskIndex = blob.indexOf('editmask" TYPE=hidden VALUE="');
  const boardMaskString = blob.slice(boardMaskIndex + 29, boardMaskIndex + 110);
  console.log(solvedBoardString)
  console.log(boardMaskString)
  const puzzleBoard = [
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
  let i = 0;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (Number.parseInt(boardMaskString.charAt(i)) > 0) {
        puzzleBoard[x][y] = 0;
        if (puzzleBoard[x][y] !== 0) {
          throw 'err';
        }
      } else {
        puzzleBoard[x][y] = Number.parseInt(solvedBoardString.charAt(i));
      }
      i++;
    }
  }
  // console.table(puzzleBoard)
  let puzzle = {
    puzzleBoard: puzzleBoard,
    solvedBoardString: solvedBoardString,
  };
  return puzzle;
}
