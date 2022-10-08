
//Bringing the canvas to Javascript
const canvas = document.querySelector("canvas")
//getting a drawing context on the canvas 
const context = canvas.getContext("2d")

//using the previously built class
const currentGame = new gameConway()

//initialize the elements (arrays) and fill them (they should all initialize dead)
currentGame.gameInitialization();
currentGame.fillCanvas();

//This variable is to know if the game has already started at least once
//(It serves to block the inputs).
let isStarted = false;

//This variable allows to toggle between the "start/stop" states of the main button.
let stateStartStop = false;

//this variable is to name and therefore, to be able to stop the "window.setInterval" method.
let intervalId;

//generation counter.
let generationCounter = 0;


//creating variables for ever single querySelector

//In these "querySelector", classes are used since these buttons and indicators are 
//between several elements and there are adjacent similar elements, 
//so selecting them with only elements would be complicated.
const start_stop = document.querySelector(".start");
const reset = document.querySelector(".reset");
const clear = document.querySelector(".clear");
const random = document.querySelector(".randomized");
const generationNumber = document.querySelector(".generation");
const populationNumber = document.querySelector(".population");


//game sound.
this.GameSound = new Audio("./audio/8-bitBC.mp3");
this.GameSound.loop = true; //We use the property loop for the audio never end


//INITIAL STATEMENTS FOR BUTTONS.
const disableColor = 'gray';
reset.style.backgroundColor = disableColor;
reset.disabled = true;
reset.style.cursor = "no-drop";
clear.style.backgroundColor = disableColor;
clear.style.cursor = "no-drop";
clear.disabled = true;


//Click event on "start/stop".
start_stop.addEventListener("click", () => {
    
    //Checking what is the state of the "start/stop" button.
    if(stateStartStop == false){
        stateStartStop = true;
        isStarted = true;
        start_stop.textContent = "Stop"; //Changing the content of the start_Stop button
        this.GameSound.play(); //Play the music

        //Once the game start  the followings configuration for these buttons are changed
            
        //Reset button will be able to click
        reset.style.backgroundColor = "#202122"
        reset.disabled = false;
        reset.style.cursor = "pointer";


        //Randomized button will not be able to click
        random.style.backgroundColor = disableColor;
        random.disabled = true;
        random.style.cursor = 'no-drop';
    }        
    else{
        //If the game is running, this code is executed:
        stateStartStop = false;
        start_stop.textContent = "Start"; //Changing the content of the start_Stop button
        this.GameSound.pause(); //Pausing the music
    }


    //To know if the game should be run or paused, the variable "stateStartStop" is used.
    if(stateStartStop){
        //If "stateStartStop" is "true" the "window.setInterval" method is used with the variable "intervalID" as 
        //its reference ID. This method executes the internal code infinitely with pauses.
        intervalId = window.setInterval(() => {
            currentGame.updateGeneration();//updating the generations
            currentGame.fillCanvas();//updating the canvas
            generationCounter++; //One generation has passed 
            generationNumber.textContent = generationCounter; //Showing in HTML the generations that have already passed
            populationNumber.textContent = currentGame.population(); //calculating the population of each generation and displaying it in HTML
            }, 300)
    } //This method stops the "window.setInterval" with its ID
    else window.clearInterval(intervalId);
})


//event where the canvas is clicked to enter a configuration.
canvas.addEventListener('click', function(event) {
    //This can only happen if the game has never started.
    if(!isStarted){
        //calculating the distance from the page borders to the canvas.
        let canvasLeft = canvas.offsetLeft + canvas.clientLeft;
        let canvasTop = canvas.offsetTop + canvas.clientTop;

        //calculating the position(x,y) of the click on the canvas (relative position within the canvas).
        let x = event.pageX - canvasLeft; //this variable can go from 0 to the width of the canvas
        let y = event.pageY - canvasTop; //this variable can go from 0 to the height of the canvas

        //It is determined which cell had the collision with the click and its state is changed.
        currentGame.clickCell(x,y);
        currentGame.fillCanvas(); //updating the canvas 
        currentGame.population(); //updating the population
        populationNumber.textContent = currentGame.population();//showing the new population.
        //If this event causes the population to be greater than 0, the "clear" button is enabled.
        if(currentGame.population() > 0){
            clear.style.backgroundColor = disableColor;
            clear.style.cursor = "pointer";
            clear.disabled = false;
        } //Otherwise the clear button is disabled.
        else {
            clear.style.backgroundColor = disableColor;
            clear.style.cursor = "no-drop";
            clear.disabled = true;
        }
    

    }
}, false);

clear.addEventListener("click", () => {

    //This can only happen if the population is greater than 0.
    if(currentGame.population() != 0){
    currentGame.gameInitialization(); //the Initialization does not restart the game, just restart the arrays.
    currentGame.fillCanvas(); //updating the canvas.
    populationNumber.textContent = currentGame.population(); //updating the population.
    //setting the clear button to its disabled version.
    clear.style.backgroundColor = disableColor;
    clear.style.cursor = "no-drop";
    clear.disabled = true;
    }

})

//event to enter a random configuration.
random.addEventListener("click", () => {
    //This can only happen if the game has never started.
    if(!isStarted){
        currentGame.gameRandomize();//random function
        currentGame.fillCanvas(); //updating the canvas
        populationNumber.textContent = currentGame.population();////updating the population
    }
   //setting the clear button to its enabled version.
    clear.style.backgroundColor = disableColor;
    clear.style.cursor = "pointer";
    clear.disabled = false;
    
})




