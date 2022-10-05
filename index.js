const state = {
  play: 0,
  stop: 1,
  hold: 2,
};

// Class to represent the game
class GameOfLife {
  constructor(element, options) {
    const {
      widthCanvas,
      heightCanvas,
      cellSize,
      aliveColor,
      deadColor,
      strokeColor,
    } = options;
    this.widthCanvas = widthCanvas;
    this.heightCanvas = heightCanvas;
    this.cellSize = cellSize;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.strokeColor = strokeColor;

    // Prop that store the current state on the game
    this.currentState = state.hold; // The initial state

    this.playBtn = document.querySelector('.play-btn');
    this.randomizerBtn = document.querySelector('.random-generate-btn');
    this.clearBtn = document.querySelector('.clear-btn');
    this.canvas = document.querySelector(element);
    this.countGeneration = document.querySelector('.counter');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    // Calculate the number of columns
    this.canvasCol = this.widthCanvas / this.cellSize;
    // Calculate the number of rows
    this.canvasRow = this.heightCanvas / this.cellSize;
    // Store the current generation
    this.currentGeneration = [];
    this.count = 0; //The number of the current generation e.g. generation 10th!
    this.msVelocity = 100 // 100 ms to repeat each iteration on loop!
    // Store the next generation (when rules are applied
    this.nextGeneration = [];
    // Store all grid cells
    this.cells = [];
    this.pause = true;
    // Store generation count
    this.count = 0;
  }
  // Method to init game sequence
  init() {
    this.generateGrid();
    this.initEvents();
  }
  // Method to init events
  initEvents() {
    this.canvas.addEventListener('click', (event) => {
      const { pageX, pageY } = event;
      // Number of pixels to the left of the actual canvas element
      const elemLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
      // Number of pixels to the top of the actual canvas element
      const elemTop = this.canvas.offsetTop + this.canvas.clientTop;
      // Finds the cell that corresponds to the the click event coordinates
      const cellClicked = this.cells.find(
        (cell) =>
          pageX - elemLeft >= cell.positionX &&
          pageX - elemLeft <= cell.positionX + cell.width &&
          pageY - elemTop >= cell.positionY &&
          pageY - elemTop <= cell.positionY + cell.height
      );
      // Store the value of selected cell
      const selectedCell =
        this.currentGeneration[cellClicked.row][cellClicked.col];
      // change the "state" of the clicked cell
      this.currentGeneration[cellClicked.row][cellClicked.col] = !selectedCell;
      // paint cells
      this.paintCells();
    });
    // Generate random configuration values
    this.randomizerBtn.addEventListener('click', () => {
      //  check if game is stopped
      if (this.currentState == state.stop || this.currentState == state.hold) {
        this.randomize();
      }
    });
    // Clear board configuration values
    this.clearBtn.addEventListener('click', () => {
      //  check if game is paused
      if (this.pause) {
        this.clear();
      }
    });

    this.playBtn.addEventListener('click', () => {
      if (!this.isCurrentGenerationEmpty() && this.currentState == state.hold) {
        //Active the color blue in case that user put at least one cell live
        this.playBtn.className = "play-btn-start";
        this.updatePlayBtn();
      } else if (this.currentState != state.hold) {
        this.updatePlayBtn();
      }
    });
  }
  async gameLoop() {
    if (this.currentState == state.play) {
      // rules
      this.nextGeneration = new Array(this.canvasRow);
      this.nextGeneration = await this.generateNextGeneration();
      this.currentGeneration = this.nextGeneration;
      // count generation
      this.count++;
      // show the generation count
      this.countGeneration.innerHTML = this.count;
      this.paintCells();
    }
  }
  // Method to generate random cells and paint them
  randomize() {
    this.generateRandomData();
    this.paintCells();
  }
  // Method to generate the grid (without colors)
  generateGrid() {
    // Create matrix of cells
    for (let row = 0; row < this.canvasRow; row++) {
      this.currentGeneration[row] = [];
      for (let col = 0; col < this.canvasCol; col++) {
        // create a new cell (borders)
        const cell = new Cell(
          col,
          row,
          this.cellSize,
          this.cellSize,
          this.strokeColor
        );
        // Draw grid rectangles without fill
        cell.drawRect(this.context);
        // push created cells to the cells property
        this.cells.push(cell);
        // Initialize current generation data for the current cell
        this.currentGeneration[row][col] = 0;
      }
    }
  }
  // Method to paint cells
  paintCells() {
    for (let row = 0; row < this.canvasRow; row++) {
      for (let col = 0; col < this.canvasCol; col++) {
        // Choose the color based on the value of current cell
        const color = this.currentGeneration[row][col]
          ? this.aliveColor
          : this.deadColor;
        // Validate cell value and paint it
        if (this.currentGeneration[row][col]) {
          // Create a new painted cell
          const paintedCell = new PaintedCell(
            col,
            row,
            this.cellSize,
            this.cellSize,
            this.strokeColor,
            color
          );
          // Paint current cell
          paintedCell.paint(this.context);
        } else {
          const cell = new Cell(
            col,
            row,
            this.cellSize,
            this.cellSize,
            this.strokeColor
          );
          // Draw cell without fill
          cell.drawRect(this.context);
        }
      }
    }
  }
  // Method to generate random data
  generateRandomData() {
    for (let row = 0; row < this.canvasRow; row++) {
      this.currentGeneration[row] = [];
      for (let col = 0; col < this.canvasCol; col++) {
        let value = Math.random() > 0.5 ? 1 : 0;
        this.currentGeneration[row][col] = value;
      }
    }
  }
  // Method to generate the new generation
  generateNextGeneration() {
    return new Promise((resolve, reject) => {
      for (let row = 0; row < this.canvasRow; row++) {
        this.nextGeneration[row] = new Array(this.canvasCol);
        for (let col = 0; col < this.canvasCol; col++) {
          // next generation will be the result of applying the game rules to every element of current generation
          this.nextGeneration[row][col] = this.applyGameRules(row, col);
        }
      }
      resolve(this.nextGeneration);
    });
  }
  // Method to count neighbours and apply game rules
  applyGameRules(row, col) {
    // count the alive neighbours of every cell (8 neighbours by cell)
    let totalNeighbours = 0;
    // Loop to evaluate the cell's neighbours, ommiting itself
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
          continue;
        }
        totalNeighbours += this.relativeCellPosition(row, col, i, j);
      }
    }
    // Use totalNeighbours to apply the game of life rules
    if (this.currentGeneration[row][col] && totalNeighbours < 2) {
      return 0;
    } else if (
      (totalNeighbours == 2 || totalNeighbours == 3) &&
      this.currentGeneration[row][col]
    ) {
      return 1;
    } else if (this.currentGeneration[row][col] && totalNeighbours > 3) {
      return 0;
    } else if (!this.currentGeneration[row][col] && totalNeighbours == 3) {
      return 1;
    } else {
      return this.currentGeneration[row][col];
    }
  }
  relativeCellPosition(element1, element2, pos1, pos2) {
    // equations to get the "indexes" of a neighbour
    // including the elements in the edges (first and last columns and rows)
    const row = (this.canvasRow + element1 + pos1) % this.canvasRow;
    const col = (this.canvasCol + element2 + pos2) % this.canvasCol;
    // Element storing the neighbour with the gotten indexes
    const valueElement = this.currentGeneration[row][col];
    return valueElement;
  }
  clearData() {
    for (let row = 0; row < this.canvasRow; row++) {
      this.currentGeneration[row] = [];
      for (let col = 0; col < this.canvasCol; col++) {
        this.currentGeneration[row][col] = 0;
      }
    }
  }

  clear() {
    this.clearData();
    this.paintCells();
  }

  isCurrentGenerationEmpty() {
    for (let row of this.currentGeneration) {
      const rowContainsCellLives = row.some((col) => col === true || col === 1 );
      if (rowContainsCellLives === true) {
        return false;
      }
    }
    return true;
  }

  updatePlayBtnState(){
    this.currentState = Number(!this.currentState);
    this.playBtn.textContent = this.currentState > 0 ? 'Play' : 'Stop';
  }
}
// Make sure that all resources are fully loaded
window.onload = () => {
  const widthCanvas = 1400;
  const heightCanvas = 500;
  const cellSize = 10;
  const deadColor = `#000000`;
  // it is purple
  const aliveColor = `#194bb0`;
  const strokeColor = 'rgba(40, 40, 40, 0.2)';

  // Creates an instance of the game
  const game = new GameOfLife('#game-grid', {
    widthCanvas,
    heightCanvas,
    cellSize,
    aliveColor,
    deadColor,
    strokeColor,
  });
  // init the game
  game.init();

  // For async loop to run the code every 100ms
  setInterval(() => {

    switch (game.currentState) {
      case state.stop:
        console.log('You are stopping');
        break;
      case state.play:
        //Logic for a game started//
        game.gameLoop();
        console.log('You are playing');
        break;
      case state.hold:
        // Due to user paint a live cell the buttons change its color
        if (!game.isCurrentGenerationEmpty()) {
          game.playBtn.classList.remove("play-btn");
          game.playBtn.classList.add("play-btn-start");
        } else {
          game.playBtn.classList.remove("play-btn-start");
          game.playBtn.classList.add("play-btn");
        }
        console.log('Game on hold. it is not started yet');
        break;
    }
  }, game.msVelocity);
};