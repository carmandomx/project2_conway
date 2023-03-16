//DOM elements
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clearBoard");
const randomizeButton = document.querySelector(".random");
const generations = document.querySelector(".generation");
const resetButton = document.querySelector(".reset");
const choosePattern = document.querySelector('.pattern');

// Get canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Number of rows and columns, and size of each cell
const rows = 80;
const columns = 30;
const cellSize = canvas.width / rows;

// Relevant variables
let pause = false;
let gameStarted = false;
let iteration = 0; //Counter of generations
let intervalID

//Creating grid object column x rows
let grid = new Array(columns);
for (let i = 0; i < columns; i++) {
  grid[i] = new Array(rows);
}

// Create grid as a 2D array
const initGrid = () => {
  //Loop through each cell to show grid's initial state
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0; //Every cell is dead at the beggining
    }
  }
};

const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through each cell in the grid and draw it as a square
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      ctx.beginPath();
      ctx.rect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx.fillStyle = grid[i][j] ? "yellow" : "black"; // Set the color based on state (alive/dead)
      ctx.fill();
      ctx.stroke();
    }
  }
};

// Update the grid by applying the rules of the game of life
const updateGrid = () => {
  let newGrid = new Array(columns); //Creating next generation grid
  for (let i = 0; i < columns; i++) {
    newGrid[i] = new Array(rows);
  }
  //Loop through each cell to recalculate grid
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      // If a dead cell has 3 neighbours, it revives
      if (grid[i][j] == 0 && neighbors == 3) {
        newGrid[i][j] = 1;
      } // If the cell is alive and has les than 2 or more than 3 neighbours, it dies
      else if (grid[i][j] == 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0;
      } // Else, the cell remains in the same state
      else {
        newGrid[i][j] = grid[i][j];
      }
    }
  }
  // Set the current grid to the new grid
  grid = newGrid;
};

// This function counts the amounts of neighbours of the given cell
const countNeighbors = (x, y) => {
  let sum = 0;
  // Loop through the neighbours of the cell
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // Go to the other side of the grid if the cell is on an edge
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  // Substract the value of the current cell, so it does not get counted as a neighbour of itself
  sum -= grid[x][y];
  return sum; //Return amount of neighbours
};

const resetFunc = ()=>{  
  // Reset all variables needed
  initGrid();
  drawGrid();
  iteration=0
  generations.textContent = ` ${iteration} generations have passed` //Updating generation number
  pause=false
  gameStarted=false}


//Drawing initial grid
initGrid();
drawGrid();

// Add click event listener to allow the user to toggle the their state and set the inial configuration
canvas.addEventListener("click", (event) => {
  if (!gameStarted) {
    // Get clicked cell location
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    // Toggle the cell's state
    grid[y][x] = grid[y][x] ? 0 : 1;
    // Redraw the cells
    drawGrid();
    choosePattern.value='none' // Reseting dropdown menu
  }
});


// Button to start the game
startButton.addEventListener("click", () => {
  //Checking if existing interval
  if (intervalID){
    clearInterval(intervalID)
  }
  gameStarted = true;
  // Start the game
  intervalID = setInterval(() => {
    if (gameStarted && !pause) {
      updateGrid();
      drawGrid();
      // Increase the generation by 1
      iteration += 1;
      generations.textContent = ` ${iteration} generations have passed`; //Update generation message
    }
  }, 100);
});

// Button to pause the game
pauseButton.addEventListener("click", () => {
  if (gameStarted) {
    pause = !pause;
  }
});

// Clear the board (nuclear bomb)
clearButton.addEventListener("click", () => {
  choosePattern.value='none' // Reseting dropdown menu
  //Clearing grid (generation count continues)
  initGrid();
  drawGrid();
});

// Button to randomize the layout
randomizeButton.addEventListener("click", () => {
  if (!gameStarted && !pause) {
    choosePattern.value='none' // Reseting dropdown menu
    // Loop through each cell and randomize values
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        // Put a random number between 0 and 1 (dead or alive)
        grid[i][j] = Math.floor(Math.random() * 2);
      }
    }
    drawGrid();
  }
});

//Button to reset de game
resetButton.addEventListener('click',()=>{
  choosePattern.value='none' //Reset dropdown menu
  resetFunc()
  })


//Dropdown menu
choosePattern.addEventListener('change',()=>{
  switch (choosePattern.value){
    case 'none': //Empty grid
      resetFunc()
      initGrid()
      drawGrid()
      break
    case 'blinker': //blinker
      resetFunc()
      initGrid();
      grid[14][39]=1
      grid[15][39]=1
      grid[16][39]=1
      drawGrid()
      break
    case 'glider': //glider
      resetFunc()
      initGrid();
      grid[14][39]=1
      grid[15][40]=1
      grid[16][38]=1
      grid[16][39]=1
      grid[16][40]=1
      drawGrid()
      break

    case 'beacon': //beacon
      resetFunc()
      initGrid();
      grid[13][38]=1
      grid[13][39]=1
      grid[14][38]=1
      grid[14][39]=1
      grid[15][40]=1
      grid[15][41]=1
      grid[16][40]=1
      grid[16][41]=1
      drawGrid()
      break
    case 'pentadecathlon': //pentadecatholon
      resetFunc()
      initGrid();
      grid[14][38]=1
      grid[15][38]=1
      grid[16][38]=1
      grid[14][39]=1
      grid[16][39]=1
      grid[14][40]=1
      grid[15][40]=1
      grid[16][40]=1
      grid[14][41]=1
      grid[16][41]=1
      grid[14][42]=1
      grid[15][42]=1
      grid[16][42]=1
      drawGrid()
      break
    case 'pulsar': //pulsar
      resetFunc()
      initGrid();
      grid[11][34]=1
      grid[11][35]=1
      grid[11][36]=1
      grid[11][40]=1
      grid[11][41]=1
      grid[11][42]=1
      grid[13][32]=1
      grid[13][37]=1
      grid[13][39]=1
      grid[13][44]=1
      grid[14][32]=1
      grid[14][37]=1
      grid[14][39]=1
      grid[14][44]=1
      grid[15][32]=1
      grid[15][37]=1
      grid[15][39]=1
      grid[15][44]=1
      grid[16][34]=1
      grid[16][35]=1
      grid[16][36]=1
      grid[16][40]=1
      grid[16][41]=1
      grid[16][42]=1
      grid[18][34]=1
      grid[18][35]=1
      grid[18][36]=1
      grid[18][40]=1
      grid[18][41]=1
      grid[18][42]=1
      grid[19][32]=1
      grid[19][37]=1
      grid[19][39]=1
      grid[19][44]=1
      grid[20][32]=1
      grid[20][37]=1
      grid[20][39]=1
      grid[20][44]=1
      grid[21][32]=1
      grid[21][37]=1
      grid[21][39]=1
      grid[21][44]=1
      grid[23][34]=1
      grid[23][35]=1
      grid[23][36]=1
      grid[23][40]=1
      grid[23][41]=1
      grid[23][42]=1
      drawGrid()
      break
  }

})