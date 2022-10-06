//Global variables
let row = 30;
let column = 30;
let sizePx = 13;
let map = [];
let currentGeneration = 0;
let playing = false;
let statusClick = true;

//Selecting Elements
const slider = document.querySelector(".slider");
const gridSize = document.querySelector(".columns");
const startButton = document.querySelector(".start");
const clearButton = document.querySelector(".clear");
const randomButton = document.querySelector(".random");
const generation = document.querySelector(".generation")

gridSize.innerHTML = slider.value;

/* Slider event to modify the slider representation
and grid size in a N x N grid.*/

slider.oninput = function () {
  gridSize.innerHTML = this.value;
  column = this.value; //Update column size
  row = this.value; //Updtate row size
  generateTable();
};

slider.addEventListener("input", function () {
  let x = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  let color = `linear-gradient(90deg, rgb(117,252,117) ${x}%, rgb(214,214,214) ${x}%)`;
  slider.style.background = color;
});

generateTable();

/* ////////////////////////TABLE GENERATION//////////////////*/
/* Table size to be generated, ideally to be set by the user
Since it is impossible to generate a n x m table by hand,
it is necessary to make an itteration through JS */

function generateTable() {
  //Grid can change its size by using the slider event.
  let html = "<table cellpadding=0 cellspacing=0 class='table'>";
  for (let y = 0; y < row; y++) {
    html += "<tr>";
    for (let x = 0; x < column; x++) {
      //Working as a coordinate system
      //Generate the coordinates of each cell
      html += `<td id="cell-${x + "-" + y}" onmouseup="cellStatus(${x},${y})">`;
      html += "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  let container = document.querySelector(".tableContainer");
  container.innerHTML = html;
  let table = document.querySelector(".table");
  table.style.width = sizePx * column + "px";
  table.style.height = sizePx * row + "px";
}

/* /////////////////////TABLE GENERATION END//////////////////*/

/* /////////////////////CELL STATUS CHECK//////////////////*/

function cellStatus(x, y) {
  let cell = document.querySelector(`#cell-${x + "-" + y}`);
  if (cell.style.background != "black") {
    cell.style.background = "black";
  } else {
    cell.style.background = "";
  }
}

/* /////////////////////CELL STATUS CHECK END//////////////////*/

/* Will return a "map" in which the algorithm will recognice
which cell its alive with a TRUE or which is dead. */
function mapping() {
  map = [];
  for (let x = 0; x < column; x++) {
    map.push([]);
    for (let y = 0; y < column; y++) {
      let cell = document.querySelector(`#cell-${x + "-" + y}`);
      map[x][y] = cell.style.background == "black";
    }
  }
}

function aliveCells(x, y) {
  let alive = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      //Means its checking the input cell
      if (i == 0 && j == 0) {
        continue;
      }
      try {
        if (map[x + i][y + j]) {
          alive = alive + 1;
        }
      } catch (e) {}
      //It doesnt matter more than 3, because it counts as overpoplation
      if (alive > 3) {
        return alive;
      }
    }
  }
  return alive;
}

//Will check the "map" generated of the actual cell grid and using the
//aliveCells() function will gather the amount of living cells around the neighborhood.

function updateStatus() {
  mapping();
  for (let x = 0; x < column; x++) {
    for (let y = 0; y < column; y++) {
      let alive = aliveCells(x, y); //Amount of living cells
      let cell = document.querySelector(`#cell-${x + "-" + y}`);
      if (map[x][y]) {
        //Its alive at this point
        if (alive < 2 || alive > 3) {
          cell.style.background = "";
        } //Dies from overpopulation
      } else {
        //It's dead checking to revive
        if (alive == 3) {
          cell.style.background = "black";
        }
      }
    }
  }
  currentGeneration += 1;
  generation.innerHTML = currentGeneration;
  console.log(generation);
}

//Function that makes the grid and buttons clickable or not.
function noClick() {
  let container = document.querySelector(".tableContainer");

  //Depending on the status whether it is clickable or not, I make the elements clickable or not.
  if (statusClick) {
    container.classList.remove("unclickable");
    randomButton.classList.remove("unclickable");
    slider.classList.remove("unclickable");
  } else {
    container.classList.add("unclickable");
    randomButton.classList.add("unclickable");
    slider.classList.add("unclickable");
  }
}

//Function that keeps calling itself to keep executing the game every number of milliseconds.
function start() {
  updateStatus(); //Call the function that changes the state of the cells.

  if (playing) {
    //If it is playing, I wait X amount of milliseconds and call me back.
    setTimeout(start, 200);
  }
}

//Function that when pressing the start button, evaluates if the game was running or not, in order to start, pause and resume it.//
function startGameButton() {
  statusClick = false;
  if (playing) {
    //If you are playing when you press the button, the game is paused.
    playing = false;
    startButton.textContent = "Resume";
  } else {
    //In case you press the button and you are not playing, the game is resumed.
    playing = true;
    startButton.textContent = "Pause";
    start(); //Call the function that keeps the game running.
    noClick(); //Call the function that makes the grid unclickable or clickable.
  }
}

//Function that iterates over all elements of the table and kills all cells.
function clearGameButton() {
  for (let x = 0; x < column; x++) {
    //Iterate at position x.
    for (let y = 0; y < column; y++) {
      //Iterate at position y.
      let cell = document.querySelector(`#cell-${x + "-" + y}`); //Select the cell.
      cell.style.background = ""; //No background property, which means that it is dead.
    }
  }
}

//Function that generate a random pattern when the user click the random button
function randomPatternButton() {
  //clear the grid before create the random pattern
  clearGameButton();
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < column; y++) {
      //create a variable that will have a value between 0 to 1 for each cell
      let isLive = Math.round(Math.random());
      //if isLive is equal to 1 the background color for that cell will change to black
      if (isLive == 1) {
        let cell = document.querySelector(`#cell-${x + "-" + y}`);
        cell.style.background = "black";
      }
    }
  }
}

startButton.addEventListener("click", startGameButton); //Start Button Event Listener.
clearButton.addEventListener("click", clearGameButton); //Clear Button Event Listener.
randomButton.addEventListener("click", randomPatternButton); //Random Button Event Listener
