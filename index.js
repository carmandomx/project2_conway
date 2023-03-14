// Get canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Number of rows and columns, and size of each cell
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

// Add click event listener to allow the user to toggle the their state and set the inial configuration
canvas.addEventListener("click", (event) => {
  // Get clicked cell location
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);

  // Toggle the cell's state
  grid[y][x] = grid[y][x] ? 0 : 1;
  // Redraw the cells
  drawGrid();
});

initGrid();
drawGrid();
