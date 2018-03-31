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

var iterations = 0;

var enteringVar;
var toBePivotRow;

var quadro;


$(document).ready(function() {

  inputSetup();

  $("#submit-button").click(function() {
    $("#table_container").empty(); //limpa container
    iterations = 0;

    // let rawTable = extractDataFromRawTable(readRawTable());
    // var quadro = new Tableau(rawTable[0], rawTable[1], rawTable[2], rawTable[3]);


    var initial_tableau = [
      [-1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, -1, 2, 3, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 4, 2, -1, 1, 0, 0, 8],
      [0, 0, 3, 2, 0, 0, 0, -1, 1, 6]
    ];

    var standard_vars = ["w", "z", "x1", "x2", "x3", "xf4", "xa5", "xf6", "xa7", "b"];
    var base_vars = ["xa5", "xa7"];
    var artificial_vars = ["xa5", "xa7"];

    quadro = new Tableau(initial_tableau, standard_vars, base_vars, artificial_vars);

    //prints inserted table
    printSingleTableau(quadro, iterations);
    iterations++;

    if (quadro.artificial_vars.length != 0) {
      for (let a = 0; a < quadro.artificial_vars.length; a++) {
        let index = quadro.standard_vars.indexOf(quadro.artificial_vars[a]);
        if (quadro.isColBasic(index) == false) {
          quadro.makeArtificialBasic();
          printSingleTableau(quadro, iterations);
          $(".tableau:last-child").after("<p>As variáveis artificiais foram devidamente adicionadas à base.</p>");

          iterations++;

          break;
        };
      }
    }


    while (quadro.isOptimal() == false) {

      enteringVar = quadro.chooseEnteringVar();
      toBePivotRow = quadro.choosePivotRow(enteringVar);

      if(toBePivotRow==-1){
        //Solução ilimitada
        break;
        $(".tableau:last-child").after("<p>O problema apresenta solução ilimitada.</p>")
      }


      printStepTableau(quadro, enteringVar, toBePivotRow, iterations);

      console.log("Quadro ", iterations);
      quadro.print();

      quadro.makePivotRow(toBePivotRow, enteringVar);
      quadro.replaceBase(toBePivotRow, enteringVar);
      quadro.makeVarBasic(toBePivotRow, enteringVar);

      if (quadro.artificial == true && quadro.getWValue() == 0) {
        iterations += 1;
        printSingleTableau(quadro, iterations);

        console.log("Quadro ", iterations);
        quadro.print();

        quadro.reduceForSecondPhase();
        $(".tableau:last-child").after("<p>O quadro será reduzido - primeira fase completa.</p>");
      }


      iterations++;

    }

    // prints last iteration, final tableau
    printSingleTableau(quadro, iterations);

    $("#table_container p").wrap('<div class="warning"></div>');

    console.log("Quadro ", iterations);
    quadro.print();
  });


});
