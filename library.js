function extractDataFromRawTable(rawTable) {
  let copy = Tableau.deepCopy(rawTable);
  let standard_vars = copy.shift();
  standard_vars.shift();

  let start;
  copy[0][0] == "FOA" ? start = 2 : start = 1;

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
    this.artificial = false;
    if (artificial_vars.length == 0) {
      this.artificial = false;
      this.artificial_vars = [];
    } else {
      this.artificial = true;
      this.artificial_vars = Tableau.deepCopy(artificial_vars);
    }
    for (let i = 0; i < this.artificial_vars.length; i++) this.artificial_vars[i] = this.artificial_vars[i].toUpperCase();
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

    let isThereValidRatios = false;
    for (let i = 0; i < ratios.length; i++) {
      if (ratios[i] > 0 && ratios[i] < Infinity) {
        isThereValidRatios = true;
        break;
      }
    }
    if (isThereValidRatios == false) return -1;

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
    let start;
    this.artificial == false ? start = 1 : start = 2;
    let index = this.tableau[0].indexOf(Math.min.apply(null, this.tableau[0].slice(start, -1)));
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

    //remove linha da FOA
    this.tableau.shift();
    this.rows -= 1;

    //remove coluna do W
    for (let i = 0; i < this.rows; i++) this.tableau[i].splice(0, 1);
    this.standard_vars.splice(0, 1); //remove coluna do W
    this.cols -= 1;

    //remove cada coluna de variável artificial
    let currentIndex;
    for (let a = 0; a < this.artificial_vars.length; a++) {

      currentIndex = this.standard_vars.indexOf(this.artificial_vars[a]); //encontra índice
      this.standard_vars.splice(currentIndex, 1); //remove entrada na lista de variáveis

      for (let i = 0; i < this.rows; i++) this.tableau[i].splice(currentIndex, 1); //remove coluna relativa ao índice
      this.cols -= 1;

    }

    this.artificial = false;
    console.log("fui executado");
  }

  isColBasic(col) {
    let label = this.standard_vars[col];
    let baseIndex = this.base_vars.indexOf(label);
    this.artificial == true ? baseIndex += 2 : baseIndex += 1;
    for (let i = 0; i < this.rows; i++) {
      if (i != baseIndex && this.tableau[i][col] != 0) {
        return false;
      }
      if (i == baseIndex && this.tableau[i][col] != 1) {
        return false;
      }
    }
    return true;
  }

  makeArtificialBasic() {
    let toMakeBasic;
    let column;
    let row;
    for (let a = 0; a < this.artificial_vars.length; a++) {
      toMakeBasic = this.artificial_vars[a];
      column = this.standard_vars.indexOf(toMakeBasic);
      row = this.base_vars.indexOf(toMakeBasic) + 2;
      this.makeVarBasic(row, column);
    }
  }

  getWValue() {
    if (this.artificial == true) {
      return this.tableau[0][this.cols - 1];
    } else {
      return undefined;
    }
  }


  getZValue() {

    if (this.artificial == true) {
      return this.tableau[1][this.cols - 1];
    } else {
      return this.tableau[0][this.cols - 1];
    }
  }



  getVarsValuesAndState() { //returns [varName, varValue, varState]
    let start;
    this.artificial == false ? start = 1 : start = 2;
    let result = [];
    let currentVar;
    let baseIndex;
    for (let i = start; i < this.standard_vars.length - 1; i++) { //starts at x1 and ends before B
      currentVar = this.standard_vars[i];
      baseIndex = this.base_vars.indexOf(currentVar);
      if (baseIndex != -1) {
        baseIndex += start;
        result.push([currentVar, this.tableau[baseIndex][this.cols - 1], "VB"]);
      } else {
        result.push([currentVar, 0, "VNB"]);
      }


    }

    return result;
  }








}
