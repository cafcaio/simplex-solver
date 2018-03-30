// var initial_tableau = [
//   [1, -2, -3, 0, 0, 0, 0, 0],
//   [0, -3, 1, 1, 0, 0, 0, 1],
//   [0, 4, 2, 0, 1, 0, 0, 20],
//   [0, 4, -1, 0, 0, 1, 0, 10],
//   [0, -1, 2, 0, 0, 0, 1, 5]
// ];
//
// var standard_vars = ["z", "x1", "x2", "xf3", "xf4", "xf5", "xf6", "b"];
// var base_vars = ["xf3", "xf4", "xf5", "xf6"];
// var artificial_vars = [];
//
// let quadro = new Tableau(initial_tableau, standard_vars, base_vars, artificial_vars);
//
// let iterations = 1;
//
// console.log("Quadro 1");
// quadro.print();

var defaultRows = 5;
var defaultCols = 8;

var iterations = 1;

var enteringVar;
var toBePivotRow;

$(document).ready(function() {

  inputSetup();

  $("#submit-button").click(function() {

    let rawTable = extractDataFromRawTable(readRawTable());
    let quadro = new Tableau(rawTable[0], rawTable[1], rawTable[2], rawTable[3]);

    while (quadro.isOptimal() == false) {

      enteringVar = quadro.chooseEnteringVar();
      toBePivotRow = quadro.choosePivotRow(enteringVar);

      printStepTableau(quadro, enteringVar, toBePivotRow, iterations);

      quadro.makePivotRow(toBePivotRow, enteringVar);
      quadro.replaceBase(toBePivotRow, enteringVar);
      quadro.makeVarBasic(toBePivotRow, enteringVar);

      if (quadro.isOptimal() && quadro.artificial == true) {
        quadro.reduceForSecondPhase();
        iterations += 1;
        printSingleTableau(quadro);
      }

      console.log("Quadro ", iterations);
      quadro.print();
      iterations++;

    }

    // prints last iteration, final tableau
    printSingleTableau(quadro, iterations);
  });


});
