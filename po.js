var initial_tableau = [
  [1, -2, -3, 0, 0, 0, 0, 0],
  [0, -3, 1, 1, 0, 0, 0, 1],
  [0, 4, 2, 0, 1, 0, 0, 20],
  [0, 4, -1, 0, 0, 1, 0, 10],
  [0, -1, 2, 0, 0, 0, 1, 5]
];

var standard_vars = ["z", "x1", "x2", "xf3", "xf4", "xf5", "xf6", "b"];
var base_vars = ["xf3", "xf4", "xf5", "xf6"];
var hasArtificialVariables = false;

let quadro = new Tableau(initial_tableau, standard_vars, base_vars);

let iterations = 1;

console.log("Quadro 1");
quadro.print();

while (isOptimal == false) {
  iterations++;
  let enteringVar = quadro.chooseEnteringVar();
  let toBePivotRow = quadro.choosePivotRow(enteringVar);
  quadro.makePivotRow(toBePivotRow, enteringVar);
  quadro.replaceBase()
  quadro.makeVarBasic(toBePivotRow, enteringVar);
  console.log("Quadro ", iterations);
  quadro.print();
}
