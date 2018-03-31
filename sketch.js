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



// let quadro = new Tableau(initial_tableau, standard_vars, base_vars, artificial_vars);
//
// let iterations = 1;
//
// console.log("Quadro 1");
// quadro.print();

var defaultRows = 4;
var defaultCols = 7;

var iterations;

var enteringVar;
var toBePivotRow;

var quadro;

var specialCase = false;


$(document).ready(function() {

  inputSetup();
  $("#submit-button").click(function() {
    $("#table_container").empty(); //limpa container
    iterations = 0;
    specialCase = false;

    let rawTable = extractDataFromRawTable(readRawTable());
    quadro = new Tableau(rawTable[0], rawTable[1], rawTable[2], rawTable[3]);


    //prints inserted table
    printSingleTableau(quadro, iterations);
    iterations++;

    if (quadro.artificial_vars.length != 0) {
      for (let a = 0; a < quadro.artificial_vars.length; a++) {
        let index = quadro.standard_vars.indexOf(quadro.artificial_vars[a]);
        if (quadro.isColBasic(index) == false) {
          quadro.makeArtificialBasic();
          $(".tableau:last-child").after("<p>As variáveis artificiais serão adicionadas automaticamente à base no próximo quadro.</p>");
          break;
        };
      }
    }


    while (quadro.isOptimal() == false) {

      enteringVar = quadro.chooseEnteringVar();
      toBePivotRow = quadro.choosePivotRow(enteringVar);

      if (toBePivotRow == -1) {
        //Solução ilimitada
        printSingleTableau(quadro, iterations);
        $(".tableau:last-child").after("<p>O problema apresenta solução ilimitada.</p>");
        specialCase = true;
        break;
      }


      printStepTableau(quadro, enteringVar, toBePivotRow, iterations);

      console.log("Quadro ", iterations);
      quadro.print();

      quadro.makePivotRow(toBePivotRow, enteringVar);
      quadro.replaceBase(toBePivotRow, enteringVar);
      quadro.makeVarBasic(toBePivotRow, enteringVar);

      if (quadro.artificial == true && quadro.getWValue() == 0) { //fim da primeira fase
        iterations++;
        printSingleTableau(quadro, iterations);

        console.log("Quadro ", iterations);
        quadro.print();

        quadro.reduceForSecondPhase();
        $(".tableau:last-child").after("<p>O quadro será reduzido - primeira fase completa.</p>");


      } else if (quadro.artificial == true && quadro.isOptimal() == true) {
        //Impossible to nullify artificial objective function
        iterations++;
        printSingleTableau(quadro, iterations);
        $(".tableau:last-child").after("<p>É impossível zerar a função objetivo artificial. O problema não tem solução.</p>");
        specialCase = true;
        break;
      }


      iterations++;

    }

    // prints last iteration, final tableau

    if (quadro.hasMultipleSolutions() == true && specialCase == false) {
      printSingleTableau(quadro, iterations);
      $(".tableau:last-child").after("<p>O problema tem múltiplas (infinitas) soluções ótimas.</p>");
    }

    if (quadro.hasMultipleSolutions() == false && specialCase == false) {
      printSingleTableau(quadro, iterations);
      $(".tableau:last-child").after("<p>O problema tem uma única solução ótima.</p>");
    }



    $("#table_container p").wrap('<div class="warning"></div>');
    createVarTable(quadro);


    console.log("Quadro ", iterations);
    quadro.print();
  });


});
