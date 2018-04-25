function createTableFromTableau(tableauForPrinting) {
  let content = '<table class="tableau">'; //opens table
  let matrix = tableauForPrinting.tableForHTML();
  let rows = matrix.length;
  let cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    content += "<tr>"; //opens row
    for (let j = 0; j < cols; j++) {
      if (typeof(matrix[i][j]) == "number") {
        content += "<td>" + parseFloat(matrix[i][j].toFixed(4)) + "</td>";
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

  let printedTableRow = toBePivotRow + 2;
  let printedTableCol = enteringVar + 1;

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

function createVarTable(quadro) {
  let vars = quadro.getVarsValuesAndState();
  let varLine = "<tr class='header'><td>" + "<strong>Z*</strong>" + "</td>";
  let valueLine = "<tr><td>" + parseFloat(quadro.getZValue().toFixed(4)) + "</td>";
  let statusLine = "<tr><td>" + quadro.minOrMax() + "</td>";
  for (let i = 0; i < vars.length; i++) {
    varLine += "<td>" + vars[i][0] + "</td>";
    valueLine += "<td>" + parseFloat(vars[i][1].toFixed(4)) + "</td>";
    statusLine += "<td>" + vars[i][2] + "</td>";
  }

  varLine += "</tr>";
  valueLine += "</tr>";
  statusLine += "</tr>";

  varLine = "<table class='varTable'>" + varLine + valueLine + statusLine + "<table>"; //used as sum

  $("#table_container").append(varLine);

}

// entrada usando restrições e função objetivo
function isVdsInvalid(vdsread){
  if(isNaN(vdsread) || vdsread <= 0){
    return true;
  }
  return false;
}

function isConstsInvalid(constsread){
  if(isNaN(constsread) || constsread <= 0){
    return true;
  }
  return false;
}

function isOFValid(vars){
  for(let j=0; j<vars; j++){
    if($(".of-values").eq(j).val() != ""){
      return true;
    }
  }
  return false;
}


function invalidBs(consts){
  let answer = [];
  for(let i=0; i<consts; i++){
    let currentBValue = $(".b-values").eq(i).val();
    currentBValue = parseFloat(currentBValue);
    if(isNaN(currentBValue)) currentBValue = 0;
    if(currentBValue <= 0){
      answer.push(i);
    }

  }
  for(let i=0; i<answer.length; i++){
    answer[i] += 1;
  }
  return answer;
}

function invalidConsts(vars, consts){
  let answer = [];
  for(let i=0; i<consts; i++){
    let lineInvalid = true;
    for(let j=0; j<vars; j++){
      let value = $(".const-values").eq(i * vars + j).val();
      value = parseFloat(value);
      if(isNaN(value)) value = 0;
      if(value > 0){
        lineInvalid = false;
        break;
      }
    }
    if(lineInvalid) answer.push(i);
  }
  for(let i=0; i<answer.length; i++){
    answer[i] += 1;
  }
  return answer;
}

function insertNotification(text){
  let string = "<div class='notification'>";
  string += "<p>";
  string += text;
  string += "</p>";

  $("#notifications-container").append(string);
}


function clearNotifications(){
  $("#notifications-container").empty();
}

function createFunctionAndConstraints(vars, constraints) {
  $("#second-input-container").append("<p> Função objetivo <br></p>");
  let minMax = "<select id='minMax'><option value='max'>maximizar</option><option value='min'>minimizar</option></select>";
  let lessEqualGreater = "<select class='LEQ'><option value='less'>≤</option><option value='equal'>=</option><option value='greater'>≥</option></select>";

  //creates vars vector
  let varsSymbols = [];
  for (let i = 1; i <= vars; i++) {
    varsSymbols.push("X" + i);
  }

  let content = "<p>" + minMax;
  let currentItem = "";
  //creates objective function line
  for (let i = 0; i < varsSymbols.length; i++) {
    currentItem += "<input class=\"of-values\" type=\"number\" size=2 placeholder=\"0\">";
    currentItem += " " + varsSymbols[i];
    if (i != varsSymbols.length - 1) {
      currentItem += " + ";
    }
  }
  content += currentItem;
  content += "</p>";
  content += "<p> sujeito a... </p>";


  for (let i = 0; i < constraints; i++) {
    currentLine = "<p><span class='const-item'>(R" + (i+1) + ") </span>";
    for (let j = 0; j < varsSymbols.length; j++) {
      currentLine += "<input class=\"const-values\" type=\"number\" size=2 placeholder=\"0\">";
      currentLine += " " + varsSymbols[j];
      if (j != varsSymbols.length - 1) {
        currentLine += " + ";
      }
    }
    currentLine += lessEqualGreater;
    currentLine += "<input class=\"b-values\" type=\"number\" size=2 placeholder=\"0\"></p>";
    content += currentLine;

  }

  content += '<div id="second-input-empty-button">Limpar tabela</div>';
  content += '<div id="second-input-restart-button">Recomeçar</div>';
  content += '<div id="second-input-submit-button">Calcular</div>';
  $("#second-input-container").append(content);


}

function readFirstInput() {
  let vds = parseFloat($("#vds-read").val());
  let consts = parseFloat($("#consts-read").val());
  return [vds, consts];
}

function readTableInput(vars, consts) {
  let input_table = [];
  let standard_vars = [];
  let base_vars = [];
  let artificial_vars = [];
  let artificial_cols = [];

  console.table(input_table);

  for (let i = 1; i <= vars; i++) {
    standard_vars.push("X" + i);
  }

  let currentVarNumber = vars + 1;
  let currentColumn = vars;


  for (let i = 0; i < consts; i++) {
    input_table.push([]);
    if ($(".LEQ").eq(i).val() === "less") { //caso menor que
      for (let j = 0; j < vars; j++) {
        let value = parseFloat($(".const-values").eq(i * vars + j).val());
        if (isNaN(value)) {
          input_table[i][j] = 0;
        } else {
          input_table[i][j] = value;
        }
      }

      standard_vars.push("XF" + currentVarNumber);
      base_vars.push("XF" + currentVarNumber);
      currentVarNumber += 1;

      input_table[i][currentColumn] = 1;
      currentColumn += 1;

    } else if ($(".LEQ").eq(i).val() === "equal") { //caso igual a
      for (let j = 0; j < vars; j++) {
        let value = parseFloat($(".const-values").eq(i * vars + j).val());
        if (isNaN(value)) {
          input_table[i][j] = 0;
        } else {
          input_table[i][j] = value;
        }
      }

      standard_vars.push("XA" + currentVarNumber);
      base_vars.push("XA" + currentVarNumber);
      artificial_vars.push("XA" + currentVarNumber);
      artificial_cols.push(currentColumn);
      currentVarNumber += 1;

      input_table[i][currentColumn] = 1;
      currentColumn += 1;

    } else if ($(".LEQ").eq(i).val() === "greater") { //caso maior que
      for (let j = 0; j < vars; j++) {
        let value = parseFloat($(".const-values").eq(i * vars + j).val());
        if (isNaN(value)) {
          input_table[i][j] = 0;
        } else {
          input_table[i][j] = value;
        }
      }

      standard_vars.push("XF" + currentVarNumber);
      currentVarNumber += 1;
      input_table[i][currentColumn] = -1;
      currentColumn += 1;

      standard_vars.push("XA" + currentVarNumber);
      artificial_vars.push("XA" + currentVarNumber);
      artificial_cols.push(currentColumn);
      base_vars.push("XA" + currentVarNumber);
      currentVarNumber += 1;
      input_table[i][currentColumn] = 1;
      currentColumn += 1;

    }

  }

  for (let i = 0; i < input_table.length; i++) {
    for (let j = 0; j < input_table[input_table.length - 1].length; j++) {
      if (input_table[i][j] === undefined) input_table[i][j] = 0;
    }
  }


  //makes FO line
  let fo_line = [];
  if ($("#minMax").val() == "max") {
    fo_line.push(1);
    for (let j = 0; j < vars; j++) {
      let value = parseFloat($(".of-values").eq(j).val());
      if (isNaN(value)) {
        fo_line.push(0);
      } else {
        fo_line.push(-value);
      }
    }
  } else {
    fo_line.push(-1);
    for (let j = 0; j < vars; j++) {
      let value = parseFloat($(".of-values").eq(j).val());
      if (isNaN(value)) {
        fo_line.push(0);
      } else {
        fo_line.push(value);
      }
    }
  }


  let foa_line;
  if (artificial_vars.length != 0) {
    foa_line = [-1];
    for (let j = 0; j < artificial_cols.length; j++) {
      foa_line[2 + artificial_cols[j]] = 1;

    }
  }


  if (artificial_vars.length != 0) {
    standard_vars.unshift("Z");
    standard_vars.unshift("W");
    for (let i = 0; i < input_table.length; i++) {
      input_table[i].unshift(0);
      input_table[i].unshift(0);
    }
    fo_line.unshift(0);
    input_table.unshift(fo_line);
    input_table.unshift(foa_line);
  } else {
    standard_vars.unshift("Z");
    for (let i = 0; i < input_table.length; i++) {
      input_table[i].unshift(0);
    }
    input_table.unshift(fo_line);
  }


  for (let i = 0; i < input_table.length; i++) {
    for (let j = 0; j < input_table[input_table.length - 1].length; j++) {
      if (input_table[i][j] === undefined) input_table[i][j] = 0;
    }
  }

  if (artificial_vars.length != 0) {
    input_table[0].push(0);
    input_table[1].push(0);
    for (let i = 0; i < consts; i++) {
      let value = parseFloat($(".b-values").eq(i).val());
      if (isNaN(value)) {
        input_table[i + 2].push(0);
      } else {
        input_table[i + 2].push(value);
      }
    }
  } else {
    input_table[0].push(0);
    for (let i = 0; i < consts; i++) {
      let value = parseFloat($(".b-values").eq(i).val());
      if (isNaN(value)) {
        input_table[i + 1].push(0);
      } else {
        input_table[i + 1].push(value);
      }
    }
  }

  standard_vars.push("B");

  return [input_table, standard_vars, base_vars, artificial_vars];

}
