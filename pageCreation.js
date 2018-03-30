function createTableFromTableau(tableauForPrinting) {
  let content = '<table class="tableau">'; //opens table
  let matrix = tableauForPrinting.tableForHTML();
  let rows = matrix.length;
  let cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    content += "<tr>"; //opens row
    for (let j = 0; j < cols; j++) {
      if (typeof(matrix[i][j]) == "number") {
        content += "<td>" + parseFloat(matrix[i][j].toFixed(5)) + "</td>";
      } else {
        content += "<td>" + matrix[i][j] + "</td>";
      }
    }
    content += "</tr>"; //closes row
  }
  content += "</table>"; //closes table
  return content;
}


function printStepTableau(quadro, enteringVar, toBePivotRow, iterations) { //arguments should be passed as in quadro.tableau
  $("#table_container").append(createTableFromTableau(quadro));
  $(".tableau:last-child tr:first-child").addClass("header");
  $(".tableau:last-child").prepend("<tr><td>Quadro " + iterations + "</td></tr>");
  $(".tableau:last-child tr:first-child").addClass("counter");

  let artificial = quadro.artificial;
  let printedTableRow;
  let printedTableCol;

  if (artificial == false) {
    printedTableRow = toBePivotRow + 2;
    printedTableCol = enteringVar + 1;
  } else {
    printedTableRow = toBePivotRow + 3;
    printedTableCol = enteringVar + 2;
  }

  $(".tableau:last-child tr").eq(printedTableRow).addClass("pivotRow");
  $(".tableau:last-child tr:nth-child(2) td").eq(printedTableCol).addClass("enteringVarHead");
}

function printSingleTableau(quadro, iterations) {
  $("#table_container").append(createTableFromTableau(quadro));
  $("#table_container table:last-child").addClass("tableau");
  $(".tableau:last-child tr:first-child").addClass("header");
  $(".tableau:last-child").prepend("<tr><td>Quadro " + iterations + "</td></tr>");
  $(".tableau tr:first-child").addClass("counter");
}


function createInputsArray(rows, cols, isArtificial) {

  let content = "<table>";
  for (let i = 0; i < rows; i++) {
    content += '<tr class="inputRow">';
    for (let j = 0; j < cols; j++) {
      content += '<td><input type="text" class="to-be-read"></td>';
    }
    content += "</tr>";
  }
  $("#inputs_array").append(content);
  $("#inputs_array table").attr("id", "inputsTable");
  $("#inputs_array input").attr("size", 2);

  createHeaders(isArtificial);

}

function createHeaders(isArtificial) {
  $(".inputRow:first-child td:first-child").empty().text("VB").addClass("to-be-read");
  $(".inputRow:first-child td:last-child").empty().text("B").addClass("to-be-read");
  if (isArtificial == true) {
    $(".inputRow:first-child td:nth-child(2)").empty().text("W").addClass("to-be-read");
    $(".inputRow:first-child td:nth-child(3)").empty().text("Z").addClass("to-be-read");
    $(".inputRow:nth-child(2) td:first-child").empty().text("FOA").addClass("to-be-read");
    $(".inputRow:nth-child(3) td:first-child").empty().text("FO").addClass("to-be-read");
  } else {
    $(".inputRow:nth-child(1) td:nth-child(2)").empty().text("Z").addClass("to-be-read");
    $(".inputRow:nth-child(2) td:first-child").empty().text("FO").addClass("to-be-read");
  }
}

function addInputColumn() {
  $(".inputRow td:last-child").before('<td><input type="text" class="to-be-read"></td>');
  $("#inputs_array input").attr("size", 2);
}

function eraseInputColumn() {
  $(".inputRow td:nth-last-child(2)").remove();
}

function addInputRow() {
  let cols = $(".inputRow:last-child td").length;
  let content = '<tr class="inputRow">';
  for (let j = 0; j < cols; j++) {
    content += '<td><input type="text" size=2></td>';
  }
  content += "</tr>";
  $("#inputsTable").append(content);
  $("#inputsTable tr:last-child input").addClass("to-be-read");
}

function eraseInputRow() {
  $(".inputRow:last-child").remove();
}


function readRawTable() {
  let result = [];
  let rows = $(".inputRow").length;
  let cols = $(".inputRow:last-child td").length;
  let element;
  for(let i=0; i<rows; i++){
    result.push([]);
    for(let j=0; j<cols; j++){
      element = $(".to-be-read").eq(i*cols + j).val();
      if(element==""){
        element = $(".to-be-read").eq(i*cols + j).text();
      }
      result[i].push(element);
    }
  }
  return result;
}

function inputSetup() {
  //input array and buttons creation
  let isArtificial = false; //starting values
  let phaseText = "Uma fase";

  createInputsArray(defaultRows, defaultCols, isArtificial);

  $("#add-cols").click(addInputColumn);

  $("#erase-cols").click(function() {
    if ($(".inputRow:first td").length > defaultCols) {
      eraseInputColumn();
    }
  });

  $("#add-rows").click(addInputRow);

  //erase rows
  $("#erase-rows").click(function() {
    let rows = $(".inputRow").length;
    if (rows > defaultRows) {
      eraseInputRow();
    }
  });

  //reset button
  $("#reset-table").click(function() {
    $("#inputsTable").remove();
    createInputsArray(defaultRows, defaultCols);
    iterations = 1;
    $("#table_container").empty();

  });

  //artificial buttons
  $("#artificial-button").click(function() {
    isArtificial = !isArtificial;
    phaseText == "Uma fase" ? phaseText = "Duas fases" : phaseText = "Uma fase";
    $(this).text(phaseText);
    $("#inputsTable").remove();
    createInputsArray(defaultRows, defaultCols, isArtificial);

  });
}
