
// The visual grid of cells
const grid = document.querySelector(".gridContainer");
// reset button
const resetButton = document.querySelector(".reset");
const startButton = document.querySelector(".start");
// a cell (div)
const square = document.querySelector("div");

var startedGame=false;
// Logical array of cells
var cellsArray;
// n^2 size
var gridSize=20;

// Function that receives a number and create a n*n 2D array
function make2DArray(num){
  gridSize=num;
  let arr = new Array(num);
  for(let i=0;i<arr.length;i++){
    arr[i]= new Array(num);
  }
  return arr;
}
// Fills the 2D Array with 0
// 0 represents that the cell is dead
function fill2DArray(){
  cellsArray=make2DArray(gridSize);
  for(let i=0;i<gridSize;i++){
    for(let j=0;j<gridSize;j++){
      cellsArray[i][j]=0;  
    }
  }
}

// Function that prints in log the logical array
function print2DArray(arr){
  for(let i=0;i<gridSize;i++){
    for(let j=0;j<gridSize;j++){
      console.log("i: ",i,", j: ", j, ", value: ",cellsArray[i][j]);  
    }
  }
}


// Updates every div of the grid based on each cell state  
function updateVisualBoard(){
  let totalCells=gridSize*gridSize;
  let col; let row;
  for(let i=0;i<totalCells;i++){
      row=getRowByIndex(i);
      col=getColByIndex(i);
      grid.children[i].classList.remove("dead");
      grid.children[i].classList.remove("alive");
      //reseteDiv(grid.children[i]);
      if(cellsArray[row][col]==0){
        grid.children[i].classList.add("dead");
      }else{
        grid.children[i].classList.add("alive");
      }
  }
}

// Deletes extra classes from a given div
function reseteDiv(div){
  div.classList.remove("dead");
  div.classList.remove("alive");
}

function startGame(){
  createGrid();
  fill2DArray();
  updateVisualBoard();
}


// Create a div that represents a dead cell and then append it to the visual grid
createGrid = () => {
  let size =gridSize*gridSize;
  grid.style.setProperty(
    "grid-template-columns",
    `repeat(${gridSize}, 2fr)`
  );
  grid.style.setProperty(
    "grid-template-rows",
    `repeat(${gridSize}, 2fr)`)
  for (let i = 0; i < size; i++) {
        const div = document.createElement("div");
        div.classList.add("dead");
        div.id = "cell_"+i.toString();
        grid.appendChild(div);
    }
    
};





// Return row and col by a given index
function getRowByIndex(index){
  return Math.floor(index/gridSize);
}
function getColByIndex(index){
  return index%gridSize;
}


// Setting cell's click listener
square.addEventListener("click", function(event) {
  let actualCell = parseInt(String(event.target.id).replace("cell_",""));
  let actualRow = getRowByIndex(actualCell);
  let actualCol = getColByIndex(actualCell);
  if(startedGame==false){
    if(event.target.classList.contains("dead")){
      cellsArray[actualRow][actualCol]=1;
      //event.target.classList.replace("dead", "alive");
    }else{
      cellsArray[actualRow][actualCol]=0;
      //event.target.classList.replace("alive", "dead");
    }
    updateVisualBoard();
  }
    
    console.log(event.target.id)
    console.log(actualRow+"_"+actualCol)
});


startButton.addEventListener("click", function() {
  startedGame=true;

  setInterval(() => {
    refresh();
  }, 1000 / 1);
});



/*------Create the Next Generation Function------*/
function nextGeneration(cellsArray) {
  // Create a copy of the cellsArray matrix
  let nextGen = cellsArray.map(i => [...i]);

  for (let i = 0; i < cellsArray.length; i++) {
      for (let j = 0; j < cellsArray[i].length; j++) {
          const cell = cellsArray[i][j];

          // Variable to store the amount of neighbors
          let neighborAmount = 0;

          // Check each neighbor
          for (let k = -1; k < 2; k++) {
              for (let l = -1; l < 2; l++) {
                  if (k === 0 && l === 0) {
                      continue;
                  }

                  // Variables to avoid the limited walls and corners
                  let neighborX = (i + k + gridSize) % gridSize;
                  let neighborY = (j + l + gridSize) % gridSize;

                  const currentNeighbor = cellsArray[neighborX][neighborY];
                  neighborAmount += currentNeighbor;
              }
          }

          /*------------Game-of-Life Rules-------------*/

          // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          if (cell === 1 && neighborAmount < 2) {
              nextGen[i][j] = 0;
          }
          // Any live cell with more than three live neighbours dies, as if by overpopulation.
          else if (cell === 1 && neighborAmount > 3) {
              nextGen[i][j] = 0;
          }
          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          else if (cell === 0 && neighborAmount === 3) {
              nextGen[i][j] = 1;
          }

      }
  }
  return nextGen;
}


function refresh() {
  // Overwrite the cellsArray matrix with the next gerneration matrix so that we can compare and "refresh".
  cellsArray = nextGeneration(cellsArray);
  updateVisualBoard();

}


startGame();



















