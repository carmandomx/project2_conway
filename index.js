//DOM elements
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clearBoard");

// Get canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Number of rows and columns, and size of each cell
let pause = false;
let gameStarted = false;
const rows = 40;
const columns = 40;
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
      ctx.fillStyle = grid[i][j] ? "black" : "white"; // Set the color based on state (alive/dead)
      ctx.fill();
      ctx.stroke();
    }
  }
};

const updateGrid = () => {
  let newGrid = new Array(columns);
  for (let i = 0; i < columns; i++) {
    newGrid[i] = new Array(rows);
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      if (grid[i][j] == 0 && neighbors == 3) {
        newGrid[i][j] = 1;
      } else if (grid[i][j] == 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0;
      } else {
        newGrid[i][j] = grid[i][j];
      }
    }
  }
  grid = newGrid;
};

const countNeighbors = (x, y) => {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
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

pauseButton.addEventListener("click", () => {
  pause = !pause;
});
startButton.addEventListener("click", () => {
  gameStarted = true;
  if (!pause) {
    setInterval(() => {
      updateGrid();
      drawGrid();
    }, 100);
  }
});

// Clear the board
clearButton.addEventListener("click", () => {
  initGrid();
});
