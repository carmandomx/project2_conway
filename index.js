//queriesSelectors
const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d"); 
const reset = document.querySelector("#reset");
const start = document.querySelector("#start");
const randomize = document.querySelector("#randomize");
const input =  document.querySelector("#quantity");
const clear = document.querySelector("#clear");
const textLevel = document.querySelector('.generationNo');

//Global Variables
let initGrid = [];
let gridCurrent = [];

//Initial Values
const GRID_WIDTH =  600;             
const GRID_HEIGHT = 600;       
let RES = 60;
let COL = GRID_WIDTH / RES;    
let ROW = GRID_HEIGHT / RES;  

//Variables for the logic game
let gameId = 0; 
let stop = true;
let count = 0;

//Initialize grid size
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;


//New Function to send a grid (empty or random).
const createGrid = function(empty){
  let grid = [];
  
  for(let x = 0; x < COL; x++){
    let nest = [];
    for(let y = 0; y < ROW; y++){

      let num = empty==false? Math.floor(Math.random() * (2)):0;
      nest.push(num);
    }
    grid.push(nest);
  }

  return grid;
};

//USER STORY 1
const drawGrid = function() {
  
  //clean the canvas
  ctx.clearRect(0, 0, COL, ROW);
  for (let i = 0; i < COL; i++) {
    for (let j = 0; j < ROW; j++) {
      const cell = gridCurrent[i][j];
      //Add color depending it is alive
      ctx.fillStyle = cell ? "#000000" : "#ffffff";
      //draw the cubes
      ctx.fillRect(i * RES, j * RES, RES, RES);
      //draw my cells
      ctx.fillStyle ="#000000";
      ctx.fillRect((i * RES) , (j * 5), 2, GRID_WIDTH);
      ctx.fillStyle ="#000000";
      ctx.fillRect((i * 5) , (j * RES), GRID_HEIGHT, 2);
    }
  } 
};

//Functions of the rules    Below...
const check = function (x,y){
  //outsite the limits = 0
  if(x < 0 || x >= COL|| y < 0 || y >= ROW){
      return 0;
  }
  //if tha actual position its alavie = 1, else = 0
  let val = gridCurrent[x][y]==1?1:0;
  return val;
};

const gridAlive = function(){

  let gridAlive = createGrid(true);
  let numAlive = 0;
  for (let x = 0; x < COL; x++) {
      for (let y = 0; y < ROW; y++) {
          // Count ofpopulation
          numAlive = check(x - 1, y - 1) + check(x, y - 1) + check(x + 1, y - 1) + check(x - 1, y) + check(x + 1, y) + check(x - 1, y + 1) + check(x, y + 1) + check(x + 1, y + 1);
          gridAlive[x][y] = numAlive;
      }
  }
  return gridAlive;
};

//User Story 5
const updateCounter = function (count){
  textLevel.innerText = `Generation No: ${count}`;
}

//Init the game with a empty grid and drawing the grid
gridCurrent = createGrid(true);
drawGrid();

const game = function() {
  let newGrid = createGrid(true);

  // Game Logic
  let gridPopullation = gridAlive();
  //Here the rules...
  for(let i = 0;i<COL;i++){
    for(let j = 0;j<COL;j++){

      //Grid with the qty of alives around the position x,y
      let cellPopulation = gridPopullation[i][j];
      //Current Status
      let cellStatus = gridCurrent[i][j];
      //Rules:
      if(cellStatus == 1){
        let chase = cellPopulation >3?1:(cellPopulation<2?1:cellPopulation);
        switch (chase) {
          case 1:
            newGrid[i][j] = 0;
            break;
          case 2:
            newGrid[i][j] = 1;
            break;
          case 3:
            newGrid[i][j] = 1;
            break;
          default:
            newGrid[i][j] = 0;
        }
      }else{
        switch (cellPopulation) {
          case 3:
            newGrid[i][j] = 1;
            break;
          default:
            newGrid[i][j] = 0;
        }
      }
    }
  }
  
  //Update the grid with the newest
  gridCurrent = newGrid;
  updateCounter(count++);
  drawGrid();
};

//USER STORY 6
reset.addEventListener('click', () =>{
  if (!stop) {
    stop = true;        
    start.innerHTML = "START"
    clearInterval(gameId);
  };
  gridCurrent = initGrid;
  drawGrid();
  count = 0;
  updateCounter(0);
});

//USER STORY 2
start.addEventListener('click', () =>{
  if (stop) {
    if (count == 0) {
      initGrid = gridCurrent;
    }   
    stop = false;
    start.innerHTML = "STOP";
    gameId = setInterval(game, 50);
    
  } else {
    stop = true;
    start.innerHTML = "START";
    clearInterval(gameId);
  };
});

//Obj to control my positions
let mouseGrid = {
  x: Number,
  y: Number
};

window.addEventListener('mousemove', function (e) {
  //USER STORY 1
  //check the position inside the canva to know the position of my click
  var rect = canvas.getBoundingClientRect();
  //here I get the position of my click
  mouseGrid.x = e.x - rect.left;
  mouseGrid.y = e.y - rect.top;

});

canvas.addEventListener('click', function(){
  //USER STORY 1

  //if play, you can't change values
  if(stop){
    //change the state the grid 
    let Pos_X = Math.trunc(Math.trunc(mouseGrid.x)/RES) ;
    let Pos_Y = Math.trunc(Math.trunc(mouseGrid.y)/RES) ;
    //Invert the value
    gridCurrent[Pos_X][Pos_Y] = gridCurrent[Pos_X][Pos_Y] ? 0 : 1;
    drawGrid();
  } 
});

//USER STORY 4
//adding the interaction with the randomize button
randomize.addEventListener('click', () =>{
  if (stop == true) { //confirms that the game is stopped before changing it
      gridCurrent = createGrid(false);
      drawGrid();
      count = 0;
      updateCounter(count);
  }
  else{ //sends a warning message if the game is running and does not allow the change to push through
      window.alert("Can only randomize when the game is not playing!");
  }

});

input.addEventListener('change', (event) => {
  
  //Update values
  RES = 600/event.target.value;
  COL = GRID_WIDTH / RES;    
  ROW = GRID_HEIGHT / RES;

  //Re-draw the grid  
  gridCurrent = createGrid(true);
  drawGrid();
});

//USER STORY 3
//Adding the interaction with the clear button test1
clear.addEventListener('click', () =>{
  gridCurrent = createGrid(true);
  drawGrid();
  count =0;
  updateCounter(count);
});