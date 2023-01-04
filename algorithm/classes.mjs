/* eslint-disable @typescript-eslint/no-unused-vars */

export class Board {
  constructor(matrix) {
    const x = matrix.slice(0);
    this.grid = x;
    this.numsAvail = new NumbersAvailable();
    this.missingValues = 0;
  }
  returnCell(x, y) {
    return this.grid[x][y];
  }
  returnBoard() {
    const copyBoard = this.grid.slice();
    return copyBoard;
  }
  returnRowArray(i) {
    return this.grid[i];
  }
  returnColArray(i) {
    const col = [
      this.grid[0][i],
      this.grid[1][i],
      this.grid[2][i],
      this.grid[3][i],
      this.grid[4][i],
      this.grid[5][i],
      this.grid[6][i],
      this.grid[7][i],
      this.grid[8][i],
    ];
    return col;
  }
  returnSubgridArray(i) {
    switch (i) {
      case 0:
        return [
          this.grid[0][0],
          this.grid[0][1],
          this.grid[0][2],
          this.grid[1][0],
          this.grid[1][1],
          this.grid[1][2],
          this.grid[2][0],
          this.grid[2][1],
          this.grid[2][2],
        ];
      case 1:
        return [
          this.grid[0][3],
          this.grid[0][4],
          this.grid[0][5],
          this.grid[1][3],
          this.grid[1][4],
          this.grid[1][5],
          this.grid[2][3],
          this.grid[2][4],
          this.grid[2][5],
        ];
      case 2:
        return [
          this.grid[0][6],
          this.grid[0][7],
          this.grid[0][8],
          this.grid[1][6],
          this.grid[1][7],
          this.grid[1][8],
          this.grid[2][6],
          this.grid[2][7],
          this.grid[2][8],
        ];
      case 3:
        return [
          this.grid[3][0],
          this.grid[3][1],
          this.grid[3][2],
          this.grid[4][0],
          this.grid[4][1],
          this.grid[4][2],
          this.grid[5][0],
          this.grid[5][1],
          this.grid[5][2],
        ];
      case 4:
        return [
          this.grid[3][3],
          this.grid[3][4],
          this.grid[3][5],
          this.grid[4][3],
          this.grid[4][4],
          this.grid[4][5],
          this.grid[5][3],
          this.grid[5][4],
          this.grid[5][5],
        ];
      case 5:
        return [
          this.grid[3][6],
          this.grid[3][7],
          this.grid[3][8],
          this.grid[4][6],
          this.grid[4][7],
          this.grid[4][8],
          this.grid[5][6],
          this.grid[5][7],
          this.grid[5][8],
        ];
      case 6:
        return [
          this.grid[6][0],
          this.grid[6][1],
          this.grid[6][2],
          this.grid[7][0],
          this.grid[7][1],
          this.grid[7][2],
          this.grid[8][0],
          this.grid[8][1],
          this.grid[8][2],
        ];
      case 7:
        return [
          this.grid[6][3],
          this.grid[6][4],
          this.grid[6][5],
          this.grid[7][3],
          this.grid[7][4],
          this.grid[7][5],
          this.grid[8][3],
          this.grid[8][4],
          this.grid[8][5],
        ];
      case 8:
        return [
          this.grid[6][6],
          this.grid[6][7],
          this.grid[6][8],
          this.grid[7][6],
          this.grid[7][7],
          this.grid[7][8],
          this.grid[8][6],
          this.grid[8][7],
          this.grid[8][8],
        ];
      default:
        break;
    }
  }
  returnSubgridArrayByCoordinate(x, y) {
    if (x < 3 && y < 3) {
      return this.returnSubgridArray(0);
    }
    if (x < 3 && y < 6) {
      return this.returnSubgridArray(1);
    }
    if (x < 3 && y < 9) {
      return this.returnSubgridArray(2);
    }
    if (x < 6 && y < 3) {
      return this.returnSubgridArray(3);
    }
    if (x < 6 && y < 6) {
      return this.returnSubgridArray(4);
    }
    if (x < 6 && y < 9) {
      return this.returnSubgridArray(5);
    }
    if (x < 9 && y < 3) {
      return this.returnSubgridArray(6);
    }
    if (x < 9 && y < 6) {
      return this.returnSubgridArray(7);
    }
    if (x < 9 && y < 9) {
      return this.returnSubgridArray(8);
    }
    return null;
  }
  updateCell(input, x, y) {
    if (!Number.isInteger(input)) {
      throw 'a Board cell can only contain a Number';
    }
    if (input < 1 || input > 10) {
      throw 'a Board cell can must be between 1 and 9';
    }
    this.grid[x][y] = input;
  }
  updateCellViaSubgridIndex(g, i, input) {
    let x, y;
    if (g === 0 || g === 3 || g === 6) {
      if (i < 3) {
        x = g;
        y = i;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 6) {
        x = g + 1;
        y = i - 3;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 9) {
        x = g + 2;
        y = i - 6;
        this.updateCell(input, x, y);
        return true;
      }
    }
    if (g === 1 || g === 4 || g === 7) {
      if (i < 3) {
        x = g - 1;
        y = i + 3;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 6) {
        x = g;
        y = i;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 9) {
        x = g + 1;
        y = i - 3;
        this.updateCell(input, x, y);
        return true;
      }
    }
    if (g === 2 || g === 5 || g === 8) {
      if (i < 3) {
        x = g - 2;
        y = i + 6;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 6) {
        x = g - 1;
        y = i + 3;
        this.updateCell(input, x, y);
        return true;
      }
      if (i < 9) {
        x = g;
        y = i;
        this.updateCell(input, x, y);
        return true;
      }
    }
  }
  returnCellViaSubgridIndex(g, i) {
    let x, y;
    if (g === 0 || g === 3 || g === 6) {
      if (i < 3) {
        x = g;
        y = i;
        return this.returnCell(x, y);
      }
      if (i < 6) {
        x = g + 1;
        y = i - 3;
        return this.returnCell(x, y);
      }
      if (i < 9) {
        x = g + 2;
        y = i - 6;
        return this.returnCell(x, y);
      }
    }
    if (g === 1 || g === 4 || g === 7) {
      if (i < 3) {
        x = g - 1;
        y = i + 3;
        return this.returnCell(x, y);
      }
      if (i < 6) {
        x = g;
        y = i;
        return this.returnCell(x, y);
      }
      if (i < 9) {
        x = g + 1;
        y = i - 3;
        return this.returnCell(x, y);
      }
    }
    if (g === 2 || g === 5 || g === 8) {
      if (i < 3) {
        x = g - 2;
        y = i + 6;
        return this.returnCell(x, y);
      }
      if (i < 6) {
        x = g - 1;
        y = i + 3;
        return this.returnCell(x, y);
      }
      if (i < 9) {
        x = g;
        y = i;
        return this.returnCell(x, y);
      }
    }
  }
  returnSetOfConflicts(x, y) {
    let row = this.returnRowArray(x);
    let col = this.returnColArray(y);
    let sub = this.returnSubgridArrayByCoordinate(x, y);
    let concat = row.concat(col, sub);
    let conflictSet = new Set(concat);
    if (conflictSet.has(0)) {
      conflictSet.delete(0);
    }
    let returnArr = Array.from(conflictSet);
    // console.log(`Cell: ${x}${y} has ${returnArr.length} conflicts ${returnArr}`)
    return returnArr;
  }
  countMissingValues(){
    for(let x=0;x<9;x++){
      for(let y=0;y<9;y++){
        if(!this.grid[x][y]){
          this.missingValues++
        }
      }
    }
  }
}

export class BoardOfPossibleValues {
  constructor(matrix = emptyStringMatrix) {
    this.grid = [
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
    ];
  }
  returnCell(x, y) {
    return this.grid[x][y];
  }
  returnRowArray(i) {
    return this.grid[i];
  }
  returnColArray(i) {
    const col = [
      this.grid[0][i],
      this.grid[1][i],
      this.grid[2][i],
      this.grid[3][i],
      this.grid[4][i],
      this.grid[5][i],
      this.grid[6][i],
      this.grid[7][i],
      this.grid[8][i],
    ];
    return col;
  }
  returnSubgridArray(i) {
    switch (i) {
      case 0:
        return [
          this.grid[0][0],
          this.grid[0][1],
          this.grid[0][2],
          this.grid[1][0],
          this.grid[1][1],
          this.grid[1][2],
          this.grid[2][0],
          this.grid[2][1],
          this.grid[2][2],
        ];
      case 1:
        return [
          this.grid[0][3],
          this.grid[0][4],
          this.grid[0][5],
          this.grid[1][3],
          this.grid[1][4],
          this.grid[1][5],
          this.grid[2][3],
          this.grid[2][4],
          this.grid[2][5],
        ];
      case 2:
        return [
          this.grid[0][6],
          this.grid[0][7],
          this.grid[0][8],
          this.grid[1][6],
          this.grid[1][7],
          this.grid[1][8],
          this.grid[2][6],
          this.grid[2][7],
          this.grid[2][8],
        ];
      case 3:
        return [
          this.grid[3][0],
          this.grid[3][1],
          this.grid[3][2],
          this.grid[4][0],
          this.grid[4][1],
          this.grid[4][2],
          this.grid[5][0],
          this.grid[5][1],
          this.grid[5][2],
        ];
      case 4:
        return [
          this.grid[3][3],
          this.grid[3][4],
          this.grid[3][5],
          this.grid[4][3],
          this.grid[4][4],
          this.grid[4][5],
          this.grid[5][3],
          this.grid[5][4],
          this.grid[5][5],
        ];
      case 5:
        return [
          this.grid[3][6],
          this.grid[3][7],
          this.grid[3][8],
          this.grid[4][6],
          this.grid[4][7],
          this.grid[4][8],
          this.grid[5][6],
          this.grid[5][7],
          this.grid[5][8],
        ];
      case 6:
        return [
          this.grid[6][0],
          this.grid[6][1],
          this.grid[6][2],
          this.grid[7][0],
          this.grid[7][1],
          this.grid[7][2],
          this.grid[8][0],
          this.grid[8][1],
          this.grid[8][2],
        ];
      case 7:
        return [
          this.grid[6][3],
          this.grid[6][4],
          this.grid[6][5],
          this.grid[7][3],
          this.grid[7][4],
          this.grid[7][5],
          this.grid[8][3],
          this.grid[8][4],
          this.grid[8][5],
        ];
      case 8:
        return [
          this.grid[6][6],
          this.grid[6][7],
          this.grid[6][8],
          this.grid[7][6],
          this.grid[7][7],
          this.grid[7][8],
          this.grid[8][6],
          this.grid[8][7],
          this.grid[8][8],
        ];
      default:
        break;
    }
  }
  returnSubgridArrayByCoordinate(x, y) {
    if (x < 3 && y < 3) {
      return this.returnSubgridArray(0);
    }
    if (x < 3 && y < 6) {
      return this.returnSubgridArray(1);
    }
    if (x < 3 && y < 9) {
      return this.returnSubgridArray(2);
    }
    if (x < 6 && y < 3) {
      return this.returnSubgridArray(3);
    }
    if (x < 6 && y < 6) {
      return this.returnSubgridArray(4);
    }
    if (x < 6 && y < 9) {
      return this.returnSubgridArray(5);
    }
    if (x < 9 && y < 3) {
      return this.returnSubgridArray(6);
    }
    if (x < 9 && y < 6) {
      return this.returnSubgridArray(7);
    }
    if (x < 9 && y < 9) {
      return this.returnSubgridArray(8);
    }
    return null;
  }
  removeOptionFromCell(i, x, y) {
    let cell = this.grid[x][y];
    let iString = `${i}`;

    if (cell.includes(iString)) {
      let newCell = cell.replace(iString, '');
      this.overwriteCell(newCell, x, y);
    } else {
      throw `ERROR: ${i} does not exist in cell ${x}${y}`;
    }
  }
  overwriteCell(input, x, y) {
    if (!typeof input == String) {
      throw 'ERROR: a BoPV cell can only contain a string';
    } else {
      this.grid[x][y] = input.trim();
    }
  }
  updateCellViaArray(arr, x, y) {
    if (!Array.isArray(arr)) {
      throw 'ERROR: this method only takes arrays as input (BOPV.updateCellViaArray)';
    }
    let cell = arr.join(' ');
    this.overwriteCell(cell, x, y);
  }
  updateCellViaSubgridIndex(g, i, input) {
    let x, y;
    if (g === 0 || g === 3 || g === 6) {
      if (i < 3) {
        x = g;
        y = i;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 6) {
        x = g + 1;
        y = i - 3;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 9) {
        x = g + 2;
        y = i - 6;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
    }
    if (g === 1 || g === 4 || g === 7) {
      if (i < 3) {
        x = g - 1;
        y = i + 3;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 6) {
        x = g;
        y = i;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 9) {
        x = g + 1;
        y = i - 3;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
    }
    if (g === 2 || g === 5 || g === 8) {
      if (i < 3) {
        x = g - 2;
        y = i + 6;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 6) {
        x = g - 1;
        y = i + 3;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
      if (i < 9) {
        x = g;
        y = i;
        this.overwriteCell(input, x, y);
        return `${x}${y}`;
      }
    }
  }
  getCellCoordinateViaSubgridIndex(g, i) {
    let x, y;
    if (g === 0 || g === 3 || g === 6) {
      if (i < 3) {
        x = g;
        y = i;
        return { x, y };
      }
      if (i < 6) {
        x = g + 1;
        y = i - 3;
        return { x, y };
      }
      if (i < 9) {
        x = g + 2;
        y = i - 6;
        return { x, y };
      }
    }
    if (g === 1 || g === 4 || g === 7) {
      if (i < 3) {
        x = g - 1;
        y = i + 3;
        return { x, y };
      }
      if (i < 6) {
        x = g;
        y = i;
        return { x, y };
      }
      if (i < 9) {
        x = g + 1;
        y = i - 3;
        return { x, y };
      }
    }
    if (g === 2 || g === 5 || g === 8) {
      if (i < 3) {
        x = g - 2;
        y = i + 6;
        return { x, y };
      }
      if (i < 6) {
        x = g - 1;
        y = i + 3;
        return { x, y };
      }
      if (i < 9) {
        x = g;
        y = i;
        return { x, y };
      }
    }
  }
  removeOptionCellsparents(x, y, n) {
    let s = `${n}`;
    let parentRow = this.returnRowArray(x);
    let parentCol = this.returnColArray(y);
    let parentSub = this.returnSubgridArrayByCoordinate(x, y);

    parentRow.forEach((cv) => {
      if (cv.includes(s)) {
        cv.replace(s, '');
      }
    });
    parentCol.forEach((cv) => {
      if (cv.includes(s)) {
        cv.replace(s, '');
      }
    });
    parentSub.forEach((cv) => {
      if (cv.includes(s)) {
        cv.replace(s, '');
      }
    });
  }
  returnQueueOfGuessCandidates(){
    let queue =[];
    for(let x=0;x<9;x++){
      for (let y=0;y<9;y++){
        if(!this.grid[x][y].length){continue}
        let s = this.grid[x][y]
        let t = s.split(' ')
        queue.push({x:x,y:y,p:s,c:t.length})

      }
    }
    function compare(a,b){
      return a.c-b.c
    }
    queue.sort(compare)
    return queue;
  }
}

export class NumbersAvailable {
  constructor() {
    this.num = {
      n1: 9,
      n2: 9,
      n3: 9,
      n4: 9,
      n5: 9,
      n6: 9,
      n6: 9,
      n7: 9,
      n8: 9,
      n9: 9,
    };
  }
  /**This Method returns an array of numbers with at least one missing from the board
   * e.g. [1,2,4,5,6,7,9]
   */
  returnArrayOfAvailableNums() {
    let arr = [];
    if (this.num.n1 > 0) {
      arr.push(1);
    }
    if (this.num.n2 > 0) {
      arr.push(2);
    }
    if (this.num.n3 > 0) {
      arr.push(3);
    }
    if (this.num.n4 > 0) {
      arr.push(4);
    }
    if (this.num.n5 > 0) {
      arr.push(5);
    }
    if (this.num.n6 > 0) {
      arr.push(6);
    }
    if (this.num.n7 > 0) {
      arr.push(7);
    }
    if (this.num.n8 > 0) {
      arr.push(8);
    }
    if (this.num.n9 > 0) {
      arr.push(9);
    }
    return arr;
  }
  /** This Method returns an array with the number of remaining members on the board
   * for every number, even if they have zero remaining.
   */
  returnNumAvailabilityArray() {
    let arr = [];
    for (const property in this.num) {
      arr.push(this.num[property]);
    }
    return arr;
  }
  returnAvailableForNum(num) {
    for (const key in this.num) {
      if (key.includes(num)) {
        return this.num[key];
      }
    }
  }
  updateNumAvailable(num, avail) {
    if (typeof num !== Number) {
      throw 'ERROR:Invalid number';
    }
    if (num < 1 || num > 9) {
      throw 'ERROR: We only use numbers 1-9 in Sudoku bud.';
    }
    if (typeof avail !== Number) {
      throw 'ERROR: avail must be a Number';
    }
    if (avail > 9) {
      throw 'ERROR: There cannot be more than 9 of any given on the board.';
    }
    switch (num) {
      case 1:
        this.num.n1 = avail;
        break;
      case 2:
        this.num.n2 = avail;
        break;
      case 1:
        this.num.n1 = avail;
        break;
      case 2:
        this.num.n2 = avail;
        break;
      case 3:
        this.num.n3 = avail;
        break;
      case 4:
        this.num.n4 = avail;
        break;
      case 5:
        this.num.n5 = avail;
        break;
      case 6:
        this.num.n6 = avail;
        break;
      case 7:
        this.num.n7 = avail;
        break;
      case 8:
        this.num.n8 = avail;
        break;
      case 9:
        this.num.n9 = avail;
        break;
      default:
        return this;
    }
    return this;
  }
  decrementNumAvail(num) {
    if (!Number.isInteger(num)) {
      throw 'ERROR:Invalid number';
    }
    if (num < 1 || num > 9) {
      throw 'ERROR: We only use numbers 1-9 in Sudoku bud.';
    }
    switch (num) {
      case 1:
        this.num.n1--;
        break;
      case 2:
        this.num.n2--;
        break;
      case 1:
        this.num.n1--;
        break;
      case 2:
        this.num.n2--;
        break;
      case 3:
        this.num.n3--;
        break;
      case 4:
        this.num.n4--;
        break;
      case 5:
        this.num.n5--;
        break;
      case 6:
        this.num.n6--;
        break;
      case 7:
        this.num.n7--;
        break;
      case 8:
        this.num.n8--;
        break;
      case 9:
        this.num.n9--;
        break;
      default:
    }
  }
  /**
   * This method takes an array of numbers and returns whichever has the least remaining on the board
   * @param  {...Number} nums
   * @return Number
   */
  returnLeastAvailableNum(...nums) {
    let countAvailable = 10;
    let numLeastAvailable = 0;
    for (let i = 0; i <= nums.length; i++) {
      let testAvail = this.returnAvailableForNum(nums[i]);
      if (testAvail < countAvailable) {
        countAvailable = testAvail;
        numLeastAvailable = nums[i];
      }
    }

    return numLeastAvailable;
  }
}
export const emptyStringMatrix = [
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
];

export const emptyNumberMatrix = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
]
