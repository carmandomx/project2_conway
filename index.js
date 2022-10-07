/* Initial configuration */
const rows = 30;
const cols = 50;

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
const reproductionTime = 100;

/* Control buttons */
const playButton = document.querySelector('.play');
const clearButton = document.querySelector('.clear');
const randomizeButton = document.querySelector('.randomize');

/* function that sets the grids */
const initializeGrids = () => {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
};

/* function that resets grids values */
const resetGrids = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
};

/* Copy nextGrid to grid, and reset nextGrid */
const copyAndResetGrid = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
};

/* function that initializes the grid */
const initialize = () => {
  createTable();
  initializeGrids();
  resetGrids();
};

/* function that creates the board */
const createTable = () => {
  let grid = document.querySelector('.grid');
  let table = document.createElement('table');

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement('tr');

    for (let j = 0; j < cols; j++) {
      let cell = document.createElement('td');

      cell.setAttribute('id', 'c' + i + '_' + j);
      cell.className = 'dead pointer';
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }

    table.appendChild(tr);
  }

  grid.appendChild(table);
};

/* function to handles when user clicks a cell if game is not started */
function cellClickHandler() {
  if (playButton.innerText === 'Play') {
    /* Replace the c in the ID with nothing so we are just left with the numbers of the row and the column */
    let rowcol = this.id.replace('c', '').split('_');
    let row = rowcol[0];
    let col = rowcol[1];

    let classes = this.getAttribute('class');

    /* Changing 'state' of cell */
    if (classes.indexOf('live') > -1) {
      this.className = 'dead pointer';
      grid[row][col] = 0;
    } else {
      this.className = 'live pointer';
      grid[row][col] = 1;
    }
  }
}

/* function that updates the grid */
const updateView = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.querySelector(`#c${i}_${j}`);

      if (grid[i][j] === 0) {
        if (playButton.innerText === 'Play') cell.className = 'dead pointer';
        else cell.className = 'dead';
      } else {
        if (playButton.innerText === 'Play') cell.className = 'dead pointer';
        else cell.className = 'live';
      }
    }
  }
};

/* function that handles when Play button is pressed */
const playButtonHandler = () => {
  if (playButton.innerText === 'Play') {
    randomizeButton.className = 'hidden';
  }

  if (!playing) {
    playing = true;
    playButton.innerText = 'Pause';
    play();
  } else {
    /* Adding logic for pause */
    playing = false;
    clearTimeout(timer);
    playButton.innerText = 'Resume';
  }
};
playButton.onclick = playButtonHandler;

/* function that handles when Clear button is pressed */
const clearButtonHandler = () => {
  clearTimeout(timer);

  /* Grab all live cells */
  let liveCells = document.querySelectorAll('.live');

  /* Make an array to store the live cells */
  let cells = [];

  /* Fill the newly created array with the live cells */
  for (let i = 0; i < liveCells.length; i++) {
    cells.push(liveCells[i]);
  }

  /* Kill the live cells */
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = 'dead';
  }

  /* Reset the grid */
  resetGrids();

  /* If the game was playing, resume it */
  if (playing) {
    play();
  }
};
clearButton.onclick = clearButtonHandler;

/* function that first clear the current board and make each cell dead or alive state randomly */
const randomizeButtonHandler = () => {
  if (!playing) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        /* Getting the new random state */
        const isLive = Math.round(Math.random());

        /* if the cell new-random-state is 1(alive), the class is changed to live */
        const cell = document.querySelector(`#c${i}_${j}`);
        if (isLive === 1) {
          cell.className = 'live pointer';
          grid[i][j] = 1;
        } else {
          cell.className = 'dead pointer';
          grid[i][j] = 0;
        }
      }
    }
  }
};
randomizeButton.onclick = randomizeButtonHandler;

/* function that runs the game */
const play = () => {
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
};

/* function to get the grid for the next generation applying Conway's rules */
const computeNextGen = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  /* Copy nextGrid to grid, and reset nextGrid */
  copyAndResetGrid();
  /* Copy all 1 values to 'live' state in the table */
  updateView();
};

/* function that checks which of Conway's condition is met */
const applyRules = (row, col) => {
  let numNeighbors = countNeighbors(row, col);

  if (grid[row][col] === 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors === 2 || numNeighbors === 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] === 0) {
    if (numNeighbors === 3) {
      nextGrid[row][col] = 1;
    }
  }
};

/* function that returns how many neighbors a cell has */
const countNeighbors = (row, col) => {
  let count = 0;

  if (row - 1 >= 0) {
    if (grid[row - 1][col] === 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] === 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] === 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] === 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] === 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] === 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] === 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] === 1) count++;
  }

  return count;
};

/* function that initializes the grid */
initialize();
