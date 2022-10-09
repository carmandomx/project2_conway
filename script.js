//We relate the container 
const container = document.querySelector("#container");

//Generation counter, as it will be used in several places, its global
let countgen = 0;
//Creation of the cells array... 52x52 for ease of use.
let cells = new Array(52).fill(0).map(() => new Array(52).fill(0));

const resolution = 10;
//These flags will allow the code to enable or disable changes when the game is running or stopped
let canRandom = true;
let canClick = true;
const resetflag = true;

function checkNeighbors() {
    //Variable that counts the amount of alive neighbors
    let aliveneigh = 0;
    
    /*This code is no longer useless, it´s necesary to change 
    the states of the new generations without changing during the check*/
    let celltemp = new Array(52).fill(0).map(() => new Array(52).fill(0));
    for(let i = 0; i < cells.length; i ++){
        for(let j = 0; j < cells[i].length; j++){
            celltemp[i][j] = cells[i][j];
        }
    }

    /*To prevent complications with out of bound values, the array has one extra row and column
    so we start at index 1 and end at index length-1, this could help scalating the solution.
    We travel the array asking at every cell if alive.*/
    for(let i = 1; i < cells.length-1; i ++){
        for(let j = 1; j < cells[i].length-1; j++){
            if(cells[i][j]){
                //If the cell is alive we run this function and restart the aliveneigh value to 0
                alive(i, j);
                aliveneigh = 0;
            }else{
                //If the cell is dead we run this function and restart the aliveneigh value to 0
                dead(i, j);
                aliveneigh = 0;
            }
        }
        //This line is just to change the cells global array when done
        if(i === cells.length-2){
            cells = celltemp;
        }
    }

    /*With this function we check if there are more than 2 alive neighbors but less than 4,
    and if that is true, we do nothing, else the cell dies changing the value to false*/
    function alive(row, column) {
        //Function call that counts the amount of alive neighbors
        countneighbors(row, column);
        if(aliveneigh < 2 || aliveneigh > 3){
            celltemp[row][column] = false;
        }
    }

    /*With this function we check if there are exactly 3 alive neighbors,
    and if that is true, we revive the cell changing the value to true*/
    function dead(row, column) {
        //Function call that counts the amount of alive neighbors
        countneighbors(row, column);
        if(aliveneigh === 3){
            celltemp[row][column] = true;
        }
    }

    /*This function checks every neighbor and if its alive, it increases the aliveneigh 
    counter by 1*/
    function countneighbors(i, j){
        if(cells[i][j+1]){
            aliveneigh++;
        }if(cells[i][j-1]){
            aliveneigh++;
        }if(cells[i-1][j]){
            aliveneigh++;
        }if(cells[i+1][j]){
            aliveneigh++;
        }if(cells[i-1][j+1]){
            aliveneigh++;
        }if(cells[i-1][j-1]){
            aliveneigh++;
        }if(cells[i+1][j+1]){
            aliveneigh++;
        }if(cells[i+1][j-1]){
            aliveneigh++;
        }
    }
}

//This function is to turn false all cells thus clearing the canvas
function clearBoard() {
    for(let i = 1; i < cells.length-1; i ++){
        for(let j = 1; j < cells[i].length-1; j++){
            cells[i][j] = false;
        }
    }
    tempDraw();

}

//Function that will initiate the cells values when called
function randomizer() {
    if(canRandom){
        for(let i = 1; i < cells.length-1; i ++){
            for(let j = 1; j < cells[i].length-1; j++){
                //We just assign true or false at random with this little funtion
                cells[i][j] = Math.random() < 0.5;
                
            }
        }
        tempDraw();
        document.querySelector('h2').innerHTML = "Generations:  " + countgen;
    }
}

/*This function will handle the new canvas generation, it will also
check in which state is the game and stop it if pause is clicked */
function playCreate() {
    play.textContent = "Play";
    play.disabled = true;

    //We set an interval to run the new canvas
    let intervalID = setInterval(create, 100);
    
    //This function will loop the creations of new generations
    function create(){
        canRandom = false;      //These variables turn these flags down to avoid changes when the game is running
        canClick = false;
        checkNeighbors();
        tempDraw();
        countgen++;
        document.querySelector('h2').innerHTML = "Generations:  " + countgen;
    }
    //Here we check if the pause button is clicked and act accordingly
    pause.addEventListener("click", stop)
    function stop(){
        play.textContent = "Resume";
        play.disabled = false;
        canRandom = true;
        canClick = true;
        clearInterval(intervalID);
        intervalID = null;

    }
    
    //Reset buttons is created to go to initial values
    _reset.addEventListener('click', subReset);
    function subReset(){
        //Only this is exclusive of the play state, so we do this and call the reset() function
        clearInterval(intervalID);
        intervalID = null;
        reset();
    } 
    
}

//The function that sets everything to its initial state, a hard reset
function reset() {    
    countgen = 0;  //Sets generations to 0
    document.querySelector('h2').innerHTML = "Generations:  " + countgen; //Visualization of 0 generations
    //Set every cell to dead
    for(let i = 1; i < cells.length-1; i ++){
        for(let j = 1; j < cells[i].length-1; j++){
            //All values to initial state
            cells[i][j] = false;
            
        }
        //Logic reset
        tempDraw();
        play.textContent = "Play";
        play.disabled = false;
        canRandom = true;
        canClick = true;
        
    }

}


/*Initial function (created with p5) that will create the canvas when the site loads. 
For ease of work, it will only work once, the loop will stop, 
and we will use the seted parameters for our own logic*/
function draw() {
    //Canvas creation
    createCanvas(500, 500);
    cols = width / resolution;
    rows = height / resolution;
    background(0);
    //We fill the canvas dividing it in 50x50 cells
    for (let i = 1; i < cells.length-1; i++){
        for (let j = 1; j < cells[i].length-1; j++){
            let x = (i-1) * resolution;
            let y = (j-1) * resolution;
            //If the cell in the array is alive, we make that section of the canvas turn on (turn it white)
            if (cells[i][j] === true){
                fill(255);
                stroke(0);
                rect(y, x, resolution, resolution);
            }
        }
    }
    //If you need the loop to work all the time, comment this line
    noLoop();
    
}


//This function listens for clicks on the grid
function mousePressed() {
    //Variables x and y contain the coordinates from the mouse, divided by the resolution of the cells
    let x = Math.ceil((mouseX/10)), 
        y = Math.ceil((mouseY/10));
        if(x >= 1 && x <= 50 && y >= 1 && y <= 50) {    //Run the code only when the click is in the region of the canvas
            if(canClick){                               //Run the code only when the flag for clickable grid is enabled
            if(cells[y][x])                             //Access the cell value with the coordinates of the mouse click
            cells[y][x] = false;                        //If value is truthy, turn the cell value to false
            else
            cells[y][x] = true;                         //If the value is falsy, turn the cell value to true
            tempDraw();                                 //Re draw the canvas to apply the change from the mouse click
        }
    }
}


/*Unfortunatly, I wasn´t able to recycle the draw() function due to
how the library works, so i had to kill the original loop, and create
a new funciton that does the same but has to be called, this gives 
control but makes draw() usable only once.*/
function tempDraw() {
    //This is the exact same logic of draw(), so no point in being redudant
    createCanvas(500, 500);
    cols = width / resolution;
    rows = height / resolution;
    background(0);
    for (let i = 1; i < cells.length-1; i++){
        for (let j = 1; j < cells[i].length-1; j++){
            let x = (i-1) * resolution;
            let y = (j-1) * resolution;
            if (cells[i][j] === true){
                fill(255);
                stroke(0);
                rect(y, x, resolution, resolution);
            }
        }
    }
}

//We visualy tell the user the current generation (0 at creation state)
document.querySelector('h2').innerHTML = "Generations:  " + countgen;

//Button clicks attached to functions
//Button to start the game
let play = document.querySelector(".play");
play.addEventListener("click", playCreate);

//Button that will pause the game
let pause = document.querySelector(".pause");

//Button that will clear the board, killing everything
let clear = document.querySelector(".clear");
clear.addEventListener('click', clearBoard); 

//Button that will randomize the array
let random = document.querySelector(".randomize");
random.addEventListener("click", randomizer);

//Reset to initial values button
let _reset = document.querySelector(".reset");
_reset.addEventListener('click', reset); 




