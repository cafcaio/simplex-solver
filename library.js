class Tableau {

  constructor(matrix, standard_vars, base_vars, artificial = false) {
    this.tableau = matrix;
    this.rows = this.tableau.length;
    this.cols = this.tableau[0].length;
    this.standard_vars = standard_vars;
    this.base_vars = base_vars;
    for (let i = 0; i < this.standard_vars.length; i++) this.standard_vars[i] = this.standard_vars[i].toUpperCase();
    for (let i = 0; i < this.base_vars.length; i++) this.base_vars[i] = this.base_vars[i].toUpperCase();
    this.artificial = artificial;
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

//arrumar isso aqui
  replaceBase(column, row) {
    let start;
    this.artificial == false ? start = 1 : start = 2;
    let enteringBase = this.standard_vars[column];
    let
    let index = this.base_vars.indexOf(oldVar);
    index !== -1 ? this.base_vars[index] = newVar : this.base_vars[index] = undefined;
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
    for(let i=0; i<ratios.length; i++){
      if (ratios[i] > 0 && ratios[i] < currentMinimum){
        currentMinimum = ratios[i];
        minIndex = i;
      }
    }
    this.artificial == true ? minIndex = minIndex + 2 : minIndex = minIndex + 1;
    return minIndex;
  }

  chooseEnteringVar(){ //chooses based on fastest optimization method, use only if isOptimal = false
    let index = this.tableau[0].indexOf(Math.min.apply(null, this.tableau[0]));
    return index;
  }

  print() {
    console.table(this.tableau);
    console.log("Variáveis: ", this.standard_vars);
    console.log("Base: ", this.base_vars)
  }








}
