const testGrid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function checkGroup(group) {
  const sum = group.reduce((a, v) => {
    return a + v;
  }, 0);
  if (sum !== 45) {
    return false;
  }
  const uniqSet = new Set(group);
  if (uniqSet.size !== 9) {
    return false;
  }
  let properRange = true;
  group.forEach((v) => {
    if (v < 1 || v > 9) {
      properRange = false;
    }
  });
  if (!properRange) {
    return false;
  }
  return true;
}
function createSubgrid(matrix, x, y) {
  return [
    matrix[x][y],
    matrix[x][y + 1],
    matrix[x][y + 2],
    matrix[x + 1][y],
    matrix[x + 1][y + 1],
    matrix[x + 1][y + 2],
    matrix[x + 2][y],
    matrix[x + 2][y + 1],
    matrix[x + 2][y + 2],
  ];
}
function createCol(matrix, y) {
  const col= [
    matrix[0][y],
    matrix[1][y],
    matrix[2][y],
    matrix[3][y],
    matrix[4][y],
    matrix[5][y],
    matrix[6][y],
    matrix[7][y],
    matrix[8][y],
  ];
  return col;
}

function checkFullMatrix(matrix) {
  let solutionIsValid = true;
    for (let i = 0; i < 9; i++) {
        if (!checkGroup(matrix[i])) {
          solutionIsValid = false;
          console.log(`error in row ${i}`, matrix[i]);
          break;
        }
        if (!checkGroup(createCol(matrix, i))) {
          solutionIsValid = false;
          console.log(`error in col ${i}`, createCol(matrix, i));
          break;
        }
  }
  for (let x = 0; x < 9; x += 3) {
    for (let y = 0; y < 9; y += 3) {
      let subgrid = createSubgrid(matrix, x, y);
      if (!checkGroup(subgrid)) {
        solutionIsValid = false;
        console.log(`error in subgrid ${x},${y}`, subgrid);
        break;
      }
    }
    if (!solutionIsValid) {
      break;
    }
  }

  return solutionIsValid;
}

export {createSubgrid,createCol,checkFullMatrix}