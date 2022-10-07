//We relate the container 
const container = document.querySelector("#container");
//si ij, si i-1j
let countgen = 0;
let cells = new Array(52).fill(0).map(() => new Array(52).fill(0));
//May have no use for this variable, during final review, check if needed
let loopFlag = true;
let canRandom = true;

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

function clearBoard() {}

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
    }
    
}

/*This function will handle the new canvas generation, it will also
check in which state is the game and stop it if pause is clicked */
function playCreate() {
    //We set an interval to run the new canvas
    let intervalID = setInterval(create, 1100);
    //This funciont will loop the creations of new generations
    function create(){
        canRandom = false;
        checkNeighbors();
        tempDraw();
    }

    //Here we check if the pause button is clicked and act accordingly
    pause.addEventListener("click", stop)
    function stop(){
        canRandom = true;
        clearInterval(intervalID);
        intervalID = null;
    }
}

function draw() {
    const resolution = 10;
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
    //If you need the loop to work all the time, comment this line
    noLoop();
}

/*Unfortunatly, I wasn´t able to recycle the draw() function due to
how the library works, so i had to kill the original loop, and create
a new funciton that does the same but has to be called, this gives 
control but makes draw() usable only once.*/
function tempDraw() {
    const resolution = 10;
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

//Button clicks attached to functions
// _resume.addEventListener('click', );
//Button to start the game
let play = document.querySelector(".play")
play.addEventListener("click", playCreate);
//Button that will pause the game
let pause = document.querySelector(".pause")
// pause.addEventListener("click", pause);
// _pause.addEventListener('click', ); 
// _clear.addEventListener('click', ); 
//Button that will randomize the array
let random = document.querySelector(".randomize");
random.addEventListener("click", randomizer);
// _customMode.addEventListener('click', ); 
// _customPttrns.addEventListener('click', );
