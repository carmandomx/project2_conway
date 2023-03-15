//DOM elements
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clearBoard");
const randomizeButton = document.querySelector(".random");
const generations = document.querySelector(".generation");
const resetButton = document.querySelector(".reset");

// Get canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Number of rows and columns, and size of each cell
let pause = false;
let gameStarted = false;
let iteration = 0; //counter of generations
const rows = 80;
const columns = 30;
const cellSize = canvas.width / rows;

let grid = new Array(columns);
for (let i = 0; i < columns; i++) {
  grid[i] = new Array(rows);
}

// Create grid as a 2D array
const initGrid = () => {
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
  let newGrid = new Array(columns);
  for (let i = 0; i < columns; i++) {
    newGrid[i] = new Array(rows);
  }
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
  return sum;
};

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
  }
});

initGrid();
drawGrid();

// Button to start the game
startButton.addEventListener("click", () => {
  gameStarted = true;
  setInterval(() => {
    if (gameStarted && !pause) {
      updateGrid();
      drawGrid();
      // increase the generation by 1
      iteration += 1;
      generations.textContent = ` ${iteration} generations have passed`;
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
  initGrid();
  drawGrid();
});

// Button to randomize the layout
randomizeButton.addEventListener("click", () => {
  if (!gameStarted && !pause) {
    // Iterate through each column
    for (let i = 0; i < columns; i++) {
      // Iterate through each row
      for (let j = 0; j < rows; j++) {
        // Put a random number between 0 and 1 (dead or alive)
        grid[i][j] = Math.floor(Math.random() * 2);
      }
    }
    drawGrid();
  }
});

// Button to reset the game
resetButton.addEventListener("click", () => {
  // Reset all need variables
  initGrid();
  drawGrid();
  iteration = 0;
  generations.textContent = ` ${iteration} generations have passed`;
  pause = false;
  gameStarted = false;
});
