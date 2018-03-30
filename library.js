function extractDataFromRawTable(rawTable) {
  let copy = Tableau.deepCopy(rawTable);
  let standard_vars = copy.shift();
  standard_vars.shift();

  let start;
  rawTable[0][0] == "FOA" ? start = 2 : start = 1;

  let base_vars = [];
  let aux;

  for (let i = 0; i < copy.length; i++) {
    if (i >= start) {
      base_vars.push(copy[i].shift());
    } else {
      copy[i].shift();
    }
  }

  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy[0].length; j++) {
      copy[i][j] = parseFloat(copy[i][j]);
    }
  }

  let artificial_vars = [];

  for (let i = 0; i < standard_vars.length; i++) {
    if (/a/i.test(standard_vars[i]) == true) {
      artificial_vars.push(standard_vars[i]);
    }
  }

  return [copy, standard_vars, base_vars, artificial_vars];
}

class Tableau {

  constructor(matrix, standard_vars, base_vars, artificial_vars) {
    this.tableau = Tableau.deepCopy(matrix);
    this.rows = this.tableau.length;
    this.cols = this.tableau[0].length;
    this.standard_vars = Tableau.deepCopy(standard_vars);
    this.base_vars = Tableau.deepCopy(base_vars);
    for (let i = 0; i < this.standard_vars.length; i++) this.standard_vars[i] = this.standard_vars[i].toUpperCase();
    for (let i = 0; i < this.base_vars.length; i++) this.base_vars[i] = this.base_vars[i].toUpperCase();

    if (artificial_vars.length == 0) {
      this.artificial = false;
      this.artificial_vars = [];
    } else {
      this.artificial = true;
      this.artificial_vars = deepCopy(artificial_vars);

    }
  }


  isOptimal() {
    let start;
    this.artificial == false ? start = 1 : start = 2;
    for (let i = start; i < this.tableau[0].length - 1; i++) {
      if (this.tableau[0][i] < 0) {
        return false;
      }
    }
    return true;
  }

  findRatios(var_index) {
    let start;
    this.artificial == false ? start = 1 : start = 2;
    let last = this.cols - 1
    let ratio;
    let ratios = [];
    for (let i = start; i < this.rows; i++) {
      ratio = this.tableau[i][last] / this.tableau[i][var_index];
      ratios.push(ratio);
    }
    return ratios;
  }

  replaceBase(row, column) {
    let start;
    this.artificial == false ? start = 1 : start = 2;
    let enteringBase = this.standard_vars[column];
    let pivotRowIndexInBase;
    this.artificial == false ? pivotRowIndexInBase = row - 1 : pivotRowIndexInBase = row - 2;
    this.base_vars[pivotRowIndexInBase] = enteringBase;
  }

  makePivotRow(row, col) {
    let element = this.tableau[row][col];
    for (let j = 0; j < this.cols; j++) {
      this.tableau[row][j] = this.tableau[row][j] / element;
    }
  }

  makeVarBasic(row, col) {
    for (let i = 0; i < this.rows; i++) {
      if (i != row) {
        let toBeDeleted = this.tableau[i][col];
        for (let j = 0; j < this.cols; j++) {
          this.tableau[i][j] -= toBeDeleted * this.tableau[row][j];
        }
      }
    }
  }

  choosePivotRow(col) {
    let ratios = this.findRatios(col);
    let currentMinimum = Infinity;
    let minIndex;
    for (let i = 0; i < ratios.length; i++) {
      if (ratios[i] > 0 && ratios[i] < currentMinimum) {
        currentMinimum = ratios[i];
        minIndex = i;
      }
    }
    this.artificial == true ? minIndex = minIndex + 2 : minIndex = minIndex + 1;
    return minIndex;
  }

  chooseEnteringVar() { //chooses based on fastest optimization method, use only if isOptimal = false
    let index = this.tableau[0].indexOf(Math.min.apply(null, this.tableau[0]));
    return index;
  }

  print() {
    console.table(this.tableau);
    console.log("Variáveis: ", this.standard_vars);
    console.log("Base: ", this.base_vars)
  }

  static deepCopy(input) {
    let copy = [];
    if (input[0] instanceof Array) {
      let rows1 = input.length;
      let cols1 = input[0].length;
      for (let i = 0; i < rows1; i++) {
        copy.push([]);
        for (let j = 0; j < cols1; j++) {
          copy[i].push(input[i][j]);
        }
      }
    } else {
      let size = input.length;
      for (let j = 0; j < size; j++) {
        copy.push(input[j]);
      }
    }
    return copy;
  }

  tableForHTML() {
    let readyForPrinting = Tableau.deepCopy(this.tableau);
    readyForPrinting.unshift(Tableau.deepCopy(this.standard_vars));

    readyForPrinting[0].unshift("VB");
    let start;
    if (this.artificial == true) {
      readyForPrinting[1].unshift("FOA");
      readyForPrinting[2].unshift("FO");
      start = 3;
    } else {
      readyForPrinting[1].unshift("FO");
      start = 2;
    }
    for (let i = start; i < readyForPrinting.length; i++) {
      readyForPrinting[i].unshift(this.base_vars[i - start]);
    }
    return readyForPrinting;
  }

  reduceForSecondPhase() {
    let currentIndex;
    for (let a = 0; a < this.artificial_vars.length; a++) {
      currentIndex = standard_vars.indexOf(this.artificial_vars[a]);
      this.cols -= 1;
      for (let i = 0; i < this.rows; i++) this.tableau[i].splice(currentIndex, 1);
    }

    this.tableau.shift();
    this.rows -= 1;
    this.artificial = false;
  }








}
