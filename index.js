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

// Pattern select input
const pattern = document.querySelector('#pattern');

pattern.addEventListener('click', () => {
    selectPattern();
})

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


/*------------------------------------Function that sets the patterns------------------------------------------*/
function selectPattern() {
    if (pattern.value === 'avr') {
        startButton.disabled = false;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                cellsArray[i][j] = 0;
            }
        }
        cellsArray[5][0] = 1;
        cellsArray[3][1] = 1;
        cellsArray[4][1] = 1;
        cellsArray[5][1] = 1;
        cellsArray[6][1] = 1;
        cellsArray[7][1] = 1;
        cellsArray[2][2] = 1;
        cellsArray[8][2] = 1;
        cellsArray[0][3] = 1;
        cellsArray[3][3] = 1;
        cellsArray[4][3] = 1;
        cellsArray[5][3] = 1;
        cellsArray[6][3] = 1;
        cellsArray[7][3] = 1;
        cellsArray[10][3] = 1;
        cellsArray[0][4] = 1;
        cellsArray[1][4] = 1;
        cellsArray[3][4] = 1;
        cellsArray[5][4] = 1;
        cellsArray[7][4] = 1;
        cellsArray[9][4] = 1;
        cellsArray[10][4] = 1;
        cellsArray[1][5] = 1;
        cellsArray[3][5] = 1;
        cellsArray[5][5] = 1;
        cellsArray[7][5] = 1;
        cellsArray[9][5] = 1;
        cellsArray[1][6] = 1;
        cellsArray[3][6] = 1;
        cellsArray[7][6] = 1;
        cellsArray[9][6] = 1;
        cellsArray[2][7] = 1;
        cellsArray[8][7] = 1;
        cellsArray[3][8] = 1;
        cellsArray[4][8] = 1;
        cellsArray[5][8] = 1;
        cellsArray[6][8] = 1;
        cellsArray[7][8] = 1;
        cellsArray[5][10] = 1;
        cellsArray[4][11] = 1;
        cellsArray[6][11] = 1;
        cellsArray[5][12] = 1;
        updateVisualBoard();
    }
    else if (pattern.value === 'antiphase') {
        startButton.disabled = false;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                cellsArray[i][j] = 0;
            }
        }
        cellsArray[15][15] = 1;
        cellsArray[14][16] = 1;
        cellsArray[16][16] = 1;
        cellsArray[13][17] = 1;
        cellsArray[15][17] = 1;
        cellsArray[15][18] = 1;
        cellsArray[17][18] = 1;
        cellsArray[18][18] = 1;
        cellsArray[18][18] = 1;
        cellsArray[15][19] = 1;
        cellsArray[13][19] = 1;
        cellsArray[12][19] = 1;
        cellsArray[15][20] = 1;
        cellsArray[17][20] = 1;
        cellsArray[14][21] = 1;
        cellsArray[16][21] = 1;
        cellsArray[15][22] = 1;

        updateVisualBoard();
    }
    else if (pattern.value === 'achimsp4') {
        startButton.disabled = false;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                cellsArray[i][j] = 0;
            }
        }
        cellsArray[15][15] = 1;
        cellsArray[17][15] = 1;
        cellsArray[15][16] = 1;
        cellsArray[14][16] = 1;
        cellsArray[13][16] = 1;
        cellsArray[17][16] = 1;
        cellsArray[18][16] = 1;
        cellsArray[19][16] = 1;
        cellsArray[12][17] = 1;
        cellsArray[16][17] = 1;
        cellsArray[20][17] = 1;
        cellsArray[12][18] = 1;
        cellsArray[14][18] = 1;
        cellsArray[18][18] = 1;
        cellsArray[20][18] = 1;
        cellsArray[13][19] = 1;
        cellsArray[14][19] = 1;
        cellsArray[16][19] = 1;
        cellsArray[18][19] = 1;
        cellsArray[19][19] = 1;
        cellsArray[13][21] = 1;
        cellsArray[14][21] = 1;
        cellsArray[16][21] = 1;
        cellsArray[18][21] = 1;
        cellsArray[19][21] = 1;
        cellsArray[12][22] = 1;
        cellsArray[14][22] = 1;
        cellsArray[18][22] = 1;
        cellsArray[20][22] = 1;
        cellsArray[12][23] = 1;
        cellsArray[16][23] = 1;
        cellsArray[20][23] = 1;
        cellsArray[15][24] = 1;
        cellsArray[14][24] = 1;
        cellsArray[13][24] = 1;
        cellsArray[17][24] = 1;
        cellsArray[18][24] = 1;
        cellsArray[19][24] = 1;
        cellsArray[15][25] = 1;
        cellsArray[17][25] = 1;

        updateVisualBoard();
    }
    else if (pattern.value === 'none') {
        startButton.disabled = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                cellsArray[i][j] = 0;
            }
        }
        updateVisualBoard();
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
    selectPattern();

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
    pattern.disabled = true;
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
resetButton.addEventListener('click', () => {
    window.location.reload();
});

/*-----------------------------------------Function that create the random generation----------------------------------*/
function randomizer() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (cellsArray[i][j] === 0) {
                let rand = Math.floor(Math.random() * 15)
                if (rand <= 1) {
                    cellsArray[i][j] = 1;
                }
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
    if (started === true) {
        generationShow.innerText = 'Generation: ' + generationCounter;
    }

}


/*-------------------------------------Call the MAIN FUNCTION-------------------------------*/
startGame();
