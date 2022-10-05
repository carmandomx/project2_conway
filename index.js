const state = {
  stop: 0,
  play: 1,
  hold: 2,
}

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
    this.currentState = state.stop; // The initial state

    this.playBtn = document.querySelector('.play-btn');
    this.randomizerBtn = document.querySelector('.random-generate-btn');
    this.clearBtn = document.querySelector('.clear-btn');
    this.canvas = document.querySelector(element);
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.widthCanvas;
    this.canvas.height = this.heightCanvas;
    // Calculate the number of columns
    this.canvasCol = this.widthCanvas / this.cellSize;
    // Calculate the number of rows
    this.canvasRow = this.heightCanvas / this.cellSize;
    // Store the current generation
    this.currentGeneration = [];
    // Store the next generation (when rules are applied
    this.nextGeneration = [];
    // Store all grid cells
    this.cells = [];
    this.pause = true;
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
      //  check if game is paused
      if (this.pause) {
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

    this.playBtn.addEventListener("click", () => {
      this.currentState = Number(!this.currentState);
      this.playBtn.textContent = this.currentState > 0 ? "Stop" : "Play";
    })

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
  setInterval( () => {
    switch (game.currentState) {
      case state.stop:
        console.log("You are stopping");
        break;
      case state.play:
        //Logic for a game started//
        console.log("You are playing");
        break;
      case state.hold:
        console.log("Game on hold. it is not started yet")
    }
  }, 100);
};


