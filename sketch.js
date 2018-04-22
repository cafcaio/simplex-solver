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

var iterations;

var enteringVar;
var toBePivotRow;

var quadro;

var read;

var specialCase = false;


$(document).ready(function() {

  $("#vds-read").keypress(function(e) {
      var char = String.fromCharCode(e.which);
      if ("1234567890".indexOf(char) < 0)
          return false;
  });

  $("#consts-read").keypress(function(e) {
      var char = String.fromCharCode(e.which);
      if ("1234567890".indexOf(char) < 0)
          return false;
  });

  //inputSetup();
  let vdsread;
  let constsread;

  $("#big-container").hide();


  $("#first-input-submit-button").click(function() {
    clearNotifications();
    vdsread = readFirstInput()[0];
    constsread = readFirstInput()[1];


    let firstInputValid = true;

    if (isVdsInvalid(vdsread)) {
      insertNotification("Insira um valor válido para o número de variáveis de decisão.");
      firstInputValid = false;
    }

    if (isConstsInvalid(constsread)) {
      insertNotification("Insira um valor válido para número de restrições.");
      firstInputValid = false
    }

    if (firstInputValid) {

      $("#first-input-container").hide();
      $("#big-container").show();
      createFunctionAndConstraints(vdsread, constsread);
    }
  });


  $("#big-container").on("click", "#second-input-empty-button", function() {
    clearNotifications();
    $("#second-input-container").empty();
    createFunctionAndConstraints(vdsread, constsread);
  });


  $("#big-container").on("click", "#second-input-restart-button", function() {
    clearNotifications();
    $("#table_container").empty(); //limpa container
    $("#second-input-container").empty();
    $("#big-container").hide();
    $("#first-input-container").show();
  });


  $("#big-container").on("click", "#second-input-submit-button", function() {
    $("#table_container").empty(); //limpa container
    clearNotifications();
    let validInput = true;
    //check validity and emit notifications when applicable
    let ofValidity = isOFValid(vdsread);
    let invalidBValues = invalidBs(constsread);
    let invalidConstsLines = invalidConsts(vdsread, constsread);

    if (ofValidity == false) {
      validInput = false;
      insertNotification("A função objetivo não pode ser identicamente nula.");
    }

    if (invalidBValues.length != 0) {
      validInput = false;
      let string = "O segundo membro de uma restrição não pode ser nulo ou negativo. <i>Se for negativo, você pode corrigir usando a instrução 3</i>. Restrições afetadas: ";
      string += invalidBValues.join(", ");
      insertNotification(string);
    }

    if (invalidConstsLines.length != 0) {
      validInput = false;
      let string = "Uma restrição não pode apresentar todos os coeficientes do primeiro membro negativos ou nulos. <i>Se necessário, remova a restrição.</i> Restrições afetadas: ";
      string += invalidConstsLines.join(", ");
      insertNotification(string);
    }

    if (!ofValidity || invalidBValues.length != 0 || invalidConstsLines.length != 0) {
      $("html, body").animate({
        scrollTop: $("#notifications-container").offset().top
      }, 300);
    }

    if (validInput) {




      iterations = 0;
      specialCase = false;

      read = readTableInput(vdsread, constsread);

      console.log("read[0]");
      console.table(read[0]);

      quadro = new Tableau(read[0], read[1], read[2], read[3]);


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
    }
  });


});
