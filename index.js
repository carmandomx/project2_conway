/* Initial configuration */
const rows = 30;
const cols = 50;

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
const reproductionTime = 100;

let generation = 1;

/* Control buttons */
const playButton = document.querySelector('.play');
const clearButton = document.querySelector('.clear');
const randomizeButton = document.querySelector('.randomize');
const resetButton = document.querySelector('.reset');

/*Generation label*/
const generationLabel = document.querySelector('.generation-label');

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
  const grid = document.querySelector('.grid');
  const table = document.createElement('table');

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('td');

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
    const rowcol = this.id.replace('c', '').split('_');
    const row = rowcol[0];
    const col = rowcol[1];

    const classes = this.getAttribute('class');

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
  /* Handling which buttons must be shown when the game has been started/reseted */
  if (playButton.innerText === 'Play') {
    randomizeButton.className = 'hidden';
    resetButton.className = 'btn';
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
  /* Stopping the execution of next Generation calculation and view update */
  clearTimeout(timer);

  /* Resets the grid and view */
  resetGrids();
  updateView();

  /* If the game was playing, resumes it */
  if (playing) {
    play();
  }
};
clearButton.onclick = clearButtonHandler;

/* function that first clears the current board and makes each cell dead or alive state randomly when Randomize button is pressed */
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

/* function that handles when Reset button is clicked */
const resetButtonHandler = () => {
  /* Stopping the game */
  playing = false;
  playButton.innerText = 'Play';
  clearButtonHandler();

  /* Reseting the buttons */
  resetButton.className = 'hidden';
  randomizeButton.className = 'btn';

  /* Reseting Generation count and label */
  generation = 1;
  generationLabel.innerText = `Generation: ${generation}`;
};
resetButton.onclick = resetButtonHandler;

/* function that runs the game */
const play = () => {
  /* Getting the next Generation of cells */
  computeNextGen();

  /* Updating Generation count and label */
  generation++;
  generationLabel.innerText = `Generation: ${generation}`;

  /* If the game was playing, keeps running */
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

/* function that checks which of Conway's conditions is met */
const applyRules = (row, col) => {
  const numNeighbors = countNeighbors(row, col);

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
