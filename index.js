const rows = 30;                                                                    //  Sets the amount of rows in the game grid.
const columns = 50;                                                                 //  Sets the amount of columns in the game grid.
let currentTable = [rows];                                                          //  Sets an array for the current table with the rows set.
let nextTable = [rows];                                                             //  Sets an array for the next table with the rows set.

let gameStatus = false;                                                             //  Variable that sets the state of the game after activating the Start button.
let gameInitiated = false;                                                          //  Variable that sets true if the game was initiated once.
let timer;                                                                          //  Variable to adjust the speed of the game between generations.
let lifespeed = 500;                                                                //  Variable to set the time when life comes to another generation.
let textGeneration = document.querySelector('.gensCompleted')                       //  Variable to set the generations completed on the website.
let generations = 0;                                                                //  Variable to set the generations counter.

function createLife() {                                                             //  Creates the life of the game with the initial configuration provided by the user.
    let life = document.querySelector('.lifeGrid');                                 //  Creates a variable for the game grid.
    let table = document.createElement('table');                                    //  Creates a variable to link the population table to the game grid.
    
    for (let i = 0; i < rows; i++) {                                                //  For each row:
        let tr = document.createElement('tr');                                      //  Creates a variable for each row of the table.
        for (let j = 0; j < columns; j++) {                                         //  For each column:
            let space = document.createElement('td');                               //  Creates a variable for each space of the table on the website.
            space.setAttribute('id', i + '_' + j);                                  //  Sets the id attribute with the row and column index.
            space.setAttribute('class', 'unpopulated');                             //  Sets the class attribute of the space to unpopulated.
            space.addEventListener('click', spaceClick);                            //  Add a listener to toggle the space to unpopulated or populated.
            tr.appendChild(space);                                                  //  Add the space to the table row array.
        }
        table.appendChild(tr);                                                      //  Add the table row array to the table. 
    }
    life.appendChild(table);                                                        //  Add the table to the game grid.
}

function spaceClick() {                                                             //  User Story 1: Toggle each space to unpopulated (0) or populated (1).
    let spaceLocation = this.id.split('_');                                         //  Creates a location variable.
    let row = Number(spaceLocation[0]);                                             //  Creates a row variable with the row provided by the grid space.
    let column = Number(spaceLocation[1]);                                          //  Creates a column variable with the column provided by grid space.
                                        
    if (gameInitiated === false) {                                                  //  If the game is not running:
        if (this.className === 'populated') {                                       //  If the space is populated:
            this.setAttribute('class', 'unpopulated');                              //  Sets class to unpopulated.
            currentTable[row][column] = 0;                                          //  Set the current space to (0).
        } else {                                                                    //  Otherwise: 
            this.setAttribute('class', 'populated');                                //  Sets class to populated.
            currentTable[row][column] = 1;                                          //  Set the current space to (1).
        }
    }
}

function createTableArrays() {                                                      //  Creates two-dimensional arrays for the current and the next table.
    for (let i = 0; i < rows; i++) {                                                //  For each row it creates an array of columns.
        currentTable[i] = new Array(columns);                                       //  Creates two-dimensional array for the current table.
        nextTable[i] = new Array(columns);                                          //  Creates two-dimensional array for the next table.
    }
}

function initTableArrays() {                                                        //  Initializes the current and next table as unpopulated or 0.
    for (let i = 0; i < rows; i++) {                                                //  For each row:
        for (let j = 0; j < columns; j++) {                                         //  For each column:
            currentTable[i][j] = 0;                                                 //  Set 0 to current table space.
            nextTable[i][j] = 0;                                                    //  Set 0 to next table space.
        }
    }
}

function startStopGame() {                                                          //  User Story 2: Toogle the game status. Start/Stop.
    let startlife = document.querySelector('#btnStartStop');                //  Creates a variable that set the value of the Start/Stop button on the website.
    
    if (gameStatus) {                                                       //  If the game has begun:
        gameStatus = false;                                                 //  Status variable will be set to false.
        startlife.value = 'Start';                                          //  Start/Stop button on the webiste will go to Start option.
        clearTimeout(timer);                                                //  Clear the timeout previosly established.
    } else {                                                                //  Otherwise:
        gameStatus = true;                                                  //  Status variable will be set to true.
        gameInitiated = true;                                               //  Sets variable to true to confirm the game has begun.
        startlife.value = 'Stop';                                           //  Start/Stop button on the website will go to Stop option.
        cycle();                                                            //  Run a Game of Life cycle.
    }
}

function cycle() {                                                                  //  Run a Game of Life cycle.
    createNextTable();                                                              //  Creates the next generation table.
    updateCurrentTable();                                                           //  Updates the current table with the population of the next generation.
    updateLife();                                                                   //  Updates the game grid with the next status of each space.
    
    if (gameStatus) {                                                               //  If the game is running: 
        timer = setTimeout(cycle, lifespeed);                                       //  The timer variable will execute the game cycle after the time between generations has passed.
        generations++;                                                              //  Increase the generation counter.
        textGeneration.innerText = `Generations completed: ${generations}`;         //  User Story 5: Updates the generation counter on the website.
    }
}

function createNextTable() {                                                        //  Creates the next generation table.
    for (row in currentTable) {                                             //  For each row in the current table:
        for (column in currentTable[row]) {                                 //  For each column in the current row of the table:
            let neighbors = getNeighborsCount(row, column);                 //  Creates a varible for the number of current neighbors populated (1).
                                                       
            if (currentTable[row][column] === 1) {                          //  If cell is populated (1):
                if (neighbors < 2) {                                        //  If neighbors are less than 2:
                    nextTable[row][column] = 0;                             //  The cell dies in the next generation by underpopulation. 
                } else if (neighbors === 2 || neighbors === 3) {            //  Else, if neighbors are equal to 2 or 3:
                    nextTable[row][column] = 1;                             //  The cell lives in the next generation. 
                } else if (neighbors > 3) {                                 //  Else, if neighbors are more than 3: 
                    nextTable[row][column] = 0;                             //  The cell dies in the next generation by overpopulation.
                }
            } else if (currentTable[row][column] === 0) {                   //  Else, if it is unpopulated (0):
                if (neighbors === 3) {                                      //  If neighbors are exactly 3:
                    nextTable[row][column] = 1;                             //  The cell becomes a live cell by reproduction.
                }
            }
        }
    }
}

function getNeighborsCount(row, column) {                                           //  Counts the current populated (1) neighbors.
    let count = 0;                                                                  //  Creates a variable to count populated (1) neighbors.
    let numberRow = Number(row);                                                    //  Creates a variable with the current row number.
    let numberColumn = Number(column);                                              //  Creates a variable with the current column number.

    if (numberRow - 1 >= 0 && numberColumn - 1 >= 0) {                              //  Check if it is not at the top and at the left column of the grid:
        if (currentTable[numberRow - 1][numberColumn - 1] === 1)                    //  Check upper left space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberRow - 1 >= 0) {                                                       //  Check if it is not at the top row of the grid:
        if (currentTable[numberRow - 1][numberColumn] === 1)                        //  Check top space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberRow - 1 >= 0 && numberColumn + 1 < columns) {                         //  Check if it is not at the top and at the right column of the grid:
        if (currentTable[numberRow - 1][numberColumn + 1] === 1)                    //  Check upper right space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberColumn - 1 >= 0) {                                                    //  Check if it is not at the left column of the grid:
        if (currentTable[numberRow][numberColumn - 1] === 1)                        //  Check left space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberColumn + 1 < columns) {                                               //  Check if it is not at the right column of the grid:
        if (currentTable[numberRow][numberColumn + 1] === 1)                        //  Check right space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberRow + 1 < rows && numberColumn - 1 >= 0) {                            //  Check if it is not at the bottom row and left column of the grid:
        if (currentTable[numberRow + 1][numberColumn - 1] === 1)                    //  Check bottom left space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberRow + 1 < rows) {                                                     //  Check if it is not at the bottom row of the grid:
        if (currentTable[numberRow + 1][numberColumn] === 1)                        //  Check bottom space and if it is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    if (numberRow + 1 < rows && numberColumn + 1 < columns) {                       //  Check if it is not at the bottom row and right column of the grid:
        if (currentTable[numberRow + 1][numberColumn + 1] === 1)                    //  Check botto right space and if is is populated (1):
            count++;                                                                //  Increase the counter variable.
    }
    return count;                                                                   //  Returns the counter variable.
}

function updateCurrentTable() {                                                     //  Updates the current table with the population of the next generation.
    for (row in currentTable) {                                                     //  For each row in the current table:
        for (column in currentTable[row]) {                                         //  For each column in the current table:
            currentTable[row][column] = nextTable[row][column];                     //  Update the current row and column.
            nextTable[row][column] = 0;                                             //  Clear the next table row and column.
        }
    }
}

function updateLife() {                                                             //  Updates the game grid with the next status of each space.
    let space = '';                                                                 //  Creates a local variable to select the space to update.
    
    for (row in currentTable) {                                                     //  For each row in current table:
        for (column in currentTable[row]) {                                         //  For each column in current table:
            space = document.querySelector('[id=\'' + row + '_' + column + '\']');  //  The local variable will be the concatenated string of the row + _ + the column index.
            if (currentTable[row][column] === 0) {                                  //  If the current space is unpopulated (0):
                space.setAttribute('class', 'unpopulated');                         //  Set the unpopulated class attribute to the space.
            } else {                                                                //  Otherwise:
                space.setAttribute('class', 'populated');                           //  Set the populated class attribute to the space.
            }
        }
    }
}

function clearLifeGrid() {                                                          //  User Story 3: Clear the game grid.
    initTableArrays();                                                              //  Initializes the current and next table as unpopulated or 0.
    updateLife();                                                                   //  Updates the game grid with the next status of each space.
}

function randomInitState() {                                                        //  User Story 4: Sets a random initialization configuration. 
    if (gameInitiated === false) {                                                  //  If game has not begun yet:
        for (let i = 0; i < rows; i++) {                                            //  For each row:
            for (let j = 0; j < columns; j++) {                                     //  For each column:
                currentTable[i][j] = Math.round(Math.random());                     //  Set a random value to current table space.
            }
        }
        updateLife();                                                               //  Updates the life in the game grid.
    }
}

window.onload = () => {                                                             //  When the windows has loaded:
    createLife();                                                                   //  Creates the life of the game with the initial configuration provided by the user.
    createTableArrays();                                                            //  Creates two-dimensional arrays for the current and the next table.
    initTableArrays();                                                              //  Initializes the current and next table as unpopulated or 0.
}