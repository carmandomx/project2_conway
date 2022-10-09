/*-------------------------------------------------Buttons from HTML-------------------------------------------------*/
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const clearButton = document.querySelector(".clear");
const randomizeButton = document.querySelector(".randomize");
const resetButton = document.querySelector(".reset");


/*-------------------------------------------------Elements from HTML-------------------------------------------------*/
// The visual grid of cells
const grid = document.querySelector(".gridContainer");

// a cell (div)
const square = document.querySelector("div");

// Title
let title = document.querySelector('h1');

// Generation title
let generationShow = document.querySelector(".generationTitle");

/*-------------------------------------------------Global Variables-------------------------------------------------*/
let started = false;
let pause = false;
let randomized = false;
let startedGame = false;
let generationCounter = 0;
// Logical array of cells
let cellsArray;
// n^2 size
let gridSize = 40;

let buttonPressed = false;


/*-------------------------------------------------Initial state of the buttons-------------------------------------------------*/
startButton.disabled = true;
pauseButton.disabled = true;
clearButton.disabled = true;


/*----------------------------Function that receives a number and create a n*n 2D array-------------------------------*/
function make2DArray(num) {
    gridSize = num;
    let arr = new Array(num);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(num);
    }
    return arr;
}


/*------------------------------------Function that fills the 2D Array with 0------------------------------------------*/
function fill2DArray() {
    cellsArray = make2DArray(gridSize);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            cellsArray[i][j] = 0;
        }
    }
}


/*---------------------Function that update every div of the grid based on each cell state ---------------------------*/
function updateVisualBoard() {
    let totalCells = gridSize * gridSize;
    let col; let row;
    for (let i = 0; i < totalCells; i++) {
        row = getRowByIndex(i);
        col = getColByIndex(i);
        grid.children[i].classList.remove("dead");
        grid.children[i].classList.remove("alive");
        if (cellsArray[row][col] == 0) {
            grid.children[i].classList.add("dead");
        } else {
            grid.children[i].classList.add("alive");
        }
    }
}


/*------------------------------Function that Delete extra classes from a given div------------------------------------*/
function reseteDiv(div) {
    div.classList.remove("dead");
    div.classList.remove("alive");
}


/*-----------------------------------------------MAIN FUNCTION----------------------------------------------------------*/
function startGame() {
    createGrid();
    fill2DArray();
    updateVisualBoard();
  
}


/*-------------------Create a div that represents a dead cell and then append it to the visual grid---------------------*/
createGrid = () => {
    let size = gridSize * gridSize;
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
        div.classList.add("grayGrid");
        div.id = "cell_" + i.toString();
        grid.appendChild(div);
    }
};


/*-------------------------------------------Return row by a given index------------------------------------------------*/
function getRowByIndex(index) {
    return Math.floor(index / gridSize);
}


/*-------------------------------------------Return row by a given index------------------------------------------------*/
function getColByIndex(index) {
    return index % gridSize;
}


/*--------------------------------------------Setting cell's click listener (down) --------------------------------------------*/
square.addEventListener("mousedown", function (event) {
    let actualCell = parseInt(String(event.target.id).replace("cell_", ""));
    let actualRow = getRowByIndex(actualCell);
    let actualCol = getColByIndex(actualCell);
    if (startedGame == false) {
        buttonPressed = true;
        if (event.target.classList.contains("dead")) {
            cellsArray[actualRow][actualCol] = 1;
        } else {
            cellsArray[actualRow][actualCol] = 0;
        }
        updateVisualBoard();
        startButton.disabled = false;
    }
});


/*--------------------------------------------Setting cell's click listener (up) --------------------------------------------*/
square.addEventListener("mouseup", function (event) {
    buttonPressed = false;
});



/*--------------------------------------------Setting cell's click listener (mouseover) --------------------------------------------*/
square.addEventListener("mouseover", function (event) {
    let actualCell = parseInt(String(event.target.id).replace("cell_", ""));
    let actualRow = getRowByIndex(actualCell);
    let actualCol = getColByIndex(actualCell);
    if (buttonPressed == true) {
        if (startedGame == false) {
            if (event.target.classList.contains("dead")) {
                cellsArray[actualRow][actualCol] = 1;
            } else {
                cellsArray[actualRow][actualCol] = 0;
            }
            updateVisualBoard();
        }
    }

});


/*----------------------------------------------------Buttons Actions-------------------------------------------------*/
// Start button
startButton.addEventListener("click", function () {
    startedGame = true;
    for (let i = 0; i < (gridSize * gridSize); i++) {
        grid.children[i].classList.remove("grayGrid");
    }
    started = true;
    if (started === true) {
        startButton.disabled = true;
        pauseButton.disabled = false;
        randomizeButton.disabled = true;
        clearButton.disabled = false;
    }
    setInterval(() => {
        refresh();
        generations();
    }, 1000 / 10);
});

// Randomize button
randomizeButton.addEventListener('click', () => {
    randomizer();
    randomizeButton.disabled = true;
    randomized = true;
    if (randomized === true) {
        startButton.disabled = false;
    }

})

// Pause button
pauseButton.addEventListener('click', () => {
    if (pause === false) {
        pause = true;
        pauseButton.innerText = 'PLAY';
        title.innerText = 'Paused';
    } else {
        pause = false;
        pauseButton.innerText = 'PAUSE';
        title.innerText = '';
    }
});

// Clear button
clearButton.addEventListener('click', () => {
    fill2DArray();
    updateVisualBoard();
    if (started === true) {
        clearButton.disabled = true;
    }
});


// Reset button
resetButton.addEventListener('click', () =>{
    window.location.reload();
});

/*-----------------------------------------Function that create the random generation----------------------------------*/
function randomizer() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (cellsArray[i][j] === 0) {
                cellsArray[i][j] = Math.floor(Math.random() * 2);
            }
        }
    }
    updateVisualBoard();
}


/*-------------------------------------Function that create the Next Generation Function-------------------------------*/
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

    generationCounter++;
    return nextGen;
}


/*-------------------------------------Function that update the generations-------------------------------*/
function refresh() {
    // Overwrite the cellsArray matrix with the next gerneration matrix so that we can compare and "refresh".
    if (pause === false) {
        cellsArray = nextGeneration(cellsArray);
        updateVisualBoard();
    }
}


/*-------------------------------------Function that synchronize animation-------------------------------*/
window.addEventListener('animationstart', e =>
    e.animationName == 'rainbow-bg' && e.target.getAnimations({ subtree: true }).forEach(e => e.startTime = 0), true)


/*-------------------------------------Function to show the generations-------------------------------*/

function generations() {
    if (started===true) {
        generationShow.innerText='Generation: '+generationCounter;
    }
    
}


/*-------------------------------------Call the MAIN FUNCTION-------------------------------*/
startGame();
