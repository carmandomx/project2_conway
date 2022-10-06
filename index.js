/* ==============================  USER STORIES  ============================== */
// 1. As a user, whenever I navigate to the website and see an empty grid with the option to let the user set up the initial configuration.
// 2. If the game is paused I can resume it
// 3. I can clear the board
// 4. I can click a 'Randomize' button that will generate an initial configuration for the game to play and this can only be done when the games has not started or is paused.
// 5. I can see the amount of generation has passed since the start of the game
// 6. (Optional) Research know patterns that occurs in the Game Of Life and allow the  user to see those patterns.

// DOM button selectors
const play = document.querySelector(".play");
const stop = document.querySelector(".stop");
const random = document.querySelector(".random");
const clear = document.querySelector(".clr");

// To draw and handle the grid canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //to acces the drawing context

// To choose random mode of game
let randomMode = false;
let reqAnimation;

/* ==============================  BUILDING THE CANVAS GRID  ============================== */

// Defining the canvas size, we can modify this values if we want to resize the grid
const resolution = 10;
const h = (canvas.width = 300);
const w = (canvas.height = 300);

const cols = w / resolution;
const rows = h / resolution;

// Creating an empty canvas
function buildEmptyGrid() {
  return new Array(cols).fill(0).map(() => new Array(rows).fill(0));
}

// Creating a NEW random canvas
function buildRandomGrid(){
    return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0).map(() => Math.round(Math.random())));
}

// Function to actually draw the grid
function render(grid) {
  // Since the grid is a 2d array, we use two for loops to iterate through all the values
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      // we define a cell as a section in grid with the current coordinates of row and column
      const cell = grid[col][row];

      ctx.beginPath();
      // Adds a rectangle or cell to the current path, takes in (x position, y position, cell width, cell height)
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      // Using the ternary operator to pick the cell filling color
      // For cell values of "1" we get black, and for 0's we get white (a.k.a. empty)
      ctx.fillStyle = cell ? "black" : "white";
      // drawing the filling of the grid
      ctx.fill();
      // drawing the grid path
      ctx.stroke();
    }
  }
  // With this we can see the output of the matrix or arrays of values in the rendered canvas
  // console.log(grid);
}

// To visualize the inital empty grid
let emptyGrid = buildEmptyGrid();
let randGrid = buildRandomGrid();
render(emptyGrid);

/* ==============================  DRAWING INITIAL CONFIGURATION  ============================== */

// Allow the user to draw an initial configuration pattern by clicking the canvas cells
canvas.addEventListener("click", colorCell);

function colorCell(event) {
  // we can log the event of every click and if we look into the offset attributes, we get the coordinates (in pixels) of the click
  // console.log(event.offsetX, event.offsetY);

  // We do some math with the grid resolution to detect the coordinates (in pixels) of the click, relative to the canvas size
  let x_position = Math.floor(event.offsetX / resolution) * resolution;
  let y_position = Math.floor(event.offsetY / resolution) * resolution;
  // console.log(x_position,y_position);

  // to get the exact coordinates of the cell where the click occured
  let cell_x_coord = x_position / resolution; // indicates the col
  let cell_y_coord = y_position / resolution; // indicates the row
  // We can log the coordinates of the clicked cells into the terminal
  // console.log(cell_y_coord,cell_x_coord);
  let clickedCell = emptyGrid[cell_x_coord][cell_y_coord];
  // The new pattern is updated in the array value that corresponds to the clicked cell coordinates
  // when the clicked cell is dead, we make it alive and viceversa
  if (clickedCell === 0) {
    emptyGrid[cell_x_coord][cell_y_coord] = 1;
    ctx.fillStyle = "black"; // change cell color
  } else {
    emptyGrid[cell_x_coord][cell_y_coord] = 0;
    ctx.fillStyle = "white"; // change cell color
  }

  // Now we choose which "rectangle" or cell to fill
  ctx.fillRect(x_position + 1, y_position + 1, resolution - 2, resolution - 2);
  // the +1 and -2 are to adjust the filling positioning, so we don't "erase" the cell borders
}

/* ==============================  BUTTONS FUNCTIONALITY  ============================== */

// Each frame update, rewrites the grid with the values of the grid's next generation
function update() {
    if (randomMode === true) {
        randGrid = nextGeneration(randGrid);
        render(randGrid);
    } else {
        emptyGrid = nextGeneration(emptyGrid);
        render(emptyGrid);
    }
    reqAnimation = requestAnimationFrame(update);   
}

play.addEventListener("click", function () {
  // Give life to the game animation, to see the generations pass
  reqAnimation = requestAnimationFrame(update);
  // Once the game has started, we remove the user's ability to interact with the canvas AND the randomize button
  canvas.removeEventListener("click", colorCell);
  random.removeEventListener("click", renderRandomGrid);
  console.log("the btn PLAY was pressed");
});

stop.addEventListener("click", function () {
  //Pause the life animation
  cancelAnimationFrame(reqAnimation);
  random.removeEventListener("click", renderRandomGrid);
  console.log("the btn STOP was pressed");
});

clear.addEventListener("click", clearAll);

// Clears the grid fot both game mode cases
function clearAll() {
    emptyGrid = emptyGrid.map(function (row) {
        return row.map(function (cell) {
            return cell * 0;
        })
    })
    randGrid = randGrid.map(function (row) {
        return row.map(function (cell) {
          return cell * 0;
        })
      })
    reqAnimation = requestAnimationFrame(update);
    random.removeEventListener("click", renderRandomGrid);
    console.log("the btn CLEAR was pressed");
}


// To choose a random initial game configuration by clicking a button
random.addEventListener("click", renderRandomGrid);

function renderRandomGrid(){
    randomMode = true; // flag to indicate the games Mode of playing
    render(buildRandomGrid());
}


/* ==================================  GAME LOGIC  ================================== */

// Function that creates the next cells generation
function nextGeneration(grid) {
  // making a copy of the current grid to edit on the next gen
  const nextGeneration = grid.map((arr) => [...arr]);
  // looping through all of the grid
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row]; // coordinates in x and y
      // Starting the neighbor counter at 0
      let numNeighbors = 0;
      /* Looping around the nearest neighbors around the cell
            --> Cell is always in (0,0) <--
            
             ===================  CELLS  =================== 
            corners = 3 neighbors
            (-1,-1)  (-1,0) |
            (0,-1)   (0,0)  |
            -----------------

            borders = 5 neighbors
            __________________
            | (-1,0)  (-1,1)
            | (0,0)   (0,1)
            | (1,0)   (1,1)
            -----------------

            centrals = 8 neighbors
            ___________________________
            | (-1,-1)  (-1,0)  (-1,1) |
            |  (0,-1)   (0,0)   (0,1) |
            |  (1,-1)   (1,0)   (1,1) |
            ---------------------------
            */

      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          // Solving the borders/corners issue
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < cols && y_cell < rows) {
            const currentNeighbor = grid[col + i][row + j];
            numNeighbors += currentNeighbor;
          }
        }
      }
      // Moodle Game Rules
      // 1. Any live cell with fewer than two live neighbours
      if (cell === 1 && numNeighbors < 2) {
        // dies in next gen by underpopulation
        nextGeneration[col][row] = 0;
      } // 2. Any live cell with two or three live neighbours
      else if (cell === 1 && (numNeighbors === 3 || numNeighbors === 2)) {
        // lives on to the next generation
        nextGeneration[col][row] = 1;
      } // 3. Any live cell with more than three live neighbours
      else if (cell === 1 && numNeighbors > 3) {
        // dies, as if by overpopulation
        nextGeneration[col][row] = 0;
      } // 4. Any dead cell with exactly three live neighbours
      else if (cell === 0 && numNeighbors === 3) {
        // becomes a live cell, as if by reproduction.
        nextGeneration[col][row] = 1;
      }
    }
  }
  return nextGeneration;
}
