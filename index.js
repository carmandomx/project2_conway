//-----------UI GLOBAL CONSTANS-----------

const container=document.querySelector('.container');
const sizeEl=document.querySelector('.size');
const speedEl=document.querySelector('.speed');
const randomBtn = document.querySelector('.btnRndm');
const resetBtn = document.querySelector('.btn');
const stepBtn = document.querySelector('.btnStp');
const reloadBtn=document.querySelector('.btnReload')
const startBtn=document.querySelector('.btnStart');
const dataLog = document.querySelector('.datalog');
const stepcount = document.querySelector('steps');
const sizecount = document.querySelector('sizes');
const speedcsount = document.querySelector('.stepcount');
const statecount = document.querySelector('.sizecount');
let size = sizeEl.value;
let speed=speedEl.value;
let draw = false;
let GenCount=0;
let running=false;
let myInterval=0;
//------GameLogic GLOBAL CONSTANTS
let initialSetUp=[];
initialSetUp=new Array(size*size).fill(0);
let columns=parseInt(sizeEl.value);


//-----Functions to display info-----

function displaydatalog(info)
{
    dataLog.textContent=info;
}

function displaysteps(info)
{
    stepcount.textContent=info;
}

function displaysize(info)
{
    sizecount.textContent=info;
}

function displaySpeed()
{
    let red=((speed*9/2)*speed);
    let green=256-(speed*speed);
    let blue=speed*2;
    speedcsount.style.backgroundColor="rgb("+red+","+green+","+blue+")";
}

function displayState()
{
    if(running==true){
        statecount.style.backgroundColor="#146C78";
        startBtn.textContent="Pause";
    }
    else{
        statecount.style.backgroundColor="#EFEDE7";
        startBtn.textContent="Start";
    }
    
}
/*-----------------------GAME LOGIC-----------------*/
/*-----------------------GAME LOGIC-----------------*/



//Setting an initial array

function countfamily(arr_k, k) //takes the array and it's index 2 count living neigboorhood
{
    columns=lastsize;

    let famcount=0;
    for(let j=0; j<arr_k.length; j++){
        //Searching every liv cll that'ts not the central
        if(arr_k[j]==1)
        {
            if(j==k-1-columns ) //firstneigh
            {
                famcount++;
            }

            else if(j==k-columns) //second
            {
                famcount++;
            }

            else if(j==k+1-columns) //third
            {
                famcount++;
            }

            else if(j==k-1) //fourth
            {
                famcount++;
            }

            else if(j==k+1) //fifth
            {
                famcount++;
            }

            else if(j==k-1+columns) //sixth
            {
                famcount++;
            }

            else if(j==k+columns) //seventh
            {
                famcount++;
            }

            else if(j==k+1+columns) //seventh
            {
                famcount++;
            }


        }
        
    }

    return famcount;

}

function LifeTurn(arr) //returns the next gen
{
columns=lastsize;
let currentGen=arr;
let nextGen=new Array(columns*columns).fill(0); //Setting a array of zeros
//console.log(nextGen);

for(let l=0; l<columns*columns; l++) //Checking every cell in the moodle order (i)
{
    let neighbours=countfamily(currentGen, l); //Getting number of neighbours for this cell
    if(currentGen[l]==1) //Any live cell (1-3)...
    {
        if(neighbours>3)//3.- with more than three live neighbours dies, as if by overpopulation.
        {
            nextGen[l]=0; //Dies
        }

        else if(neighbours<2) //1.- with fewer than two live neighbours dies, by underpopulation
        {
            nextGen[l]=0; //dies
        }

        else if(2<=neighbours<=3) //2.- with two or three live neighbours lives on to the next generation.
        {
            nextGen[l]=1; //lives
        }

    }

    else if(currentGen[l]==0 ) //4.- any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    {
        if(neighbours==3)
        {
            nextGen[l]=1; //Become alive
        }

        
    }

}
return nextGen;
}

function singleUpdate(j){
initialSetUp[j]=1;
}

function resetLife(){
    initialSetUp=new Array(columns*columns).fill(0);
}


/*---------------------GAME LOGIC-----------------*/


//-----------------------UI LOGIC-------------------------------------------------// 
//----------------------UI LOGIC-------------------------------------------------// 


//Populate is only used in the interface logic! remember not no mix with game logic

function setState(cell){
    initialSetUp[cell]=1;
}
function kill(cell){
    initialSetUp[cell]=0;
}
function checkalive(cell){
    if(initialSetUp[cell]==1){
        return true;
    }
    else
        return false;
}
//Setting Initial space
function populate(size){
    container.style.setProperty('--size', size)
    for (let i=0; i<size*size; i++) //Adding each pixel in acord of the size
    {
        const div = document.createElement('div');
        div.classList.add('pixel');        

        div.addEventListener('mouseover', function(){
            if(!draw){return;}
            if(checkalive(i)==true){
                div.style.backgroundColor="rgb(52, 42, 42)";
            kill(i);
            }
            else{
                div.style.backgroundColor="rgb(255, 255, 255)";
            setState(i);
            }

        });

        div.addEventListener('mousedown', function(){
            if(checkalive(i)==true){
                div.style.backgroundColor="rgb(52, 42, 42)";
            kill(i);
            }
            else{
                div.style.backgroundColor="rgb(255, 255, 255)";
            setState(i);
            }
            
        });
        
        


        container.appendChild(div);
    }

}

//Drawing NextGEn
function drawNext(texture){
    container.style.setProperty('--size', size)
    for (let i=0; i<size*size; i++) //Adding each pixel in acord of the size
    {
        const div = document.createElement('div');
        div.classList.add('pixel');
        
        if(texture[i]==1){
            div.style.backgroundColor="rgb(255, 255, 255)";
            setState(i);
        }

        div.addEventListener('mouseover', function(){
            if(!draw){return;}
            if(checkalive(i)==true){
                div.style.backgroundColor="rgb(52, 42, 42)";
            kill(i);
            }
            else{
                div.style.backgroundColor="rgb(255, 255, 255)";
            setState(i);
            }

        });

        div.addEventListener('mousedown', function(){
            if(checkalive(i)==true){
                div.style.backgroundColor="rgb(52, 42, 42)";
            kill(i);
            }
            else{
                div.style.backgroundColor="rgb(255, 255, 255)";
            setState(i);
            }
            
        });
        
        container.appendChild(div);
    }
}

function reset(){
    container.innerHTML='';
    populate(size);
    GenCount=0;
    displaysteps(GenCount);
    displaysize(size);
    displayState();
}

function nextset(err){
    container.innerHTML='';
    drawNext(LifeTurn(initialSetUp));
}

function singleStep(){
    lastsize=parseInt(sizeEl.value);
    let buffer=LifeTurn(initialSetUp);
    nextset(); //FOR UI!
    initialSetUp=[];
    initialSetUp=new Array(size).fill(0);
    initialSetUp=buffer;
    GenCount++;
    displaysteps(GenCount);
    displaysize(size);
}

function notStep()
{
    singleStep()
    running=true;
}

function getRandom(){
    let arr=[];
    arr=new Array(size*size).fill(0);
    const prob1=Math.floor(Math.random() * 100);

    if(prob1<75) //75% Traditional Random
    {
        for(let r=0; r<size*size; r++) 
        {
            arr[r]=Math.floor(Math.random() * 2);
        }
    
    }

    else //25% Random random!!!
    {
        if(prob1>=95)  //Divisible by 10
            {
                for(let r=0; r<size*size; r++)
                {
                    if(r % 10 == 0){
                        arr[r]=1;
                    }
                }

            }

        else if(prob1>90)  //Divisible by n
            {
                let rndmix=Math.floor(Math.random() * 5);
                for(let r=0; r<size*size; r++)
                {
                    if(r % (rndmix+1) == 0){
                        arr[r]=1;
                    }
                }

            }

        else if(prob1>85)// 4 each 7
            {
                let rndmix=1;
                let randomox=5;
                for(let r=0; r<size*size; r++)
                {
                    arr[r]=1;
                    if(r-(10*rndmix) > 1){
                            arr[r]=0;
                            if(r-(10*rndmix)>randomox)
                            {
                                rndmix++;
                            }
                    }
                }

            }

            else if(prob1>80) //randomox each 7
            {
                let rndmix=1;
                let randomox=Math.floor(Math.random() * 4);
                for(let r=0; r<size*size; r++)
                {
                    arr[r]=1;
                    if(r-(7*rndmix) > 1){
                            arr[r]=0;
                            if(r-(7*rndmix)>(randomox))
                            {
                                rndmix++;
                            }
                    }

                    
                }

            }

            else{

                for(let r=0; r<size*size; r++)
                {
                    
                    if(r % 20 == 0){
                        arr[r]=1;
                        arr[r+1]=1;
                        arr[r+2]=1;
                    }
                }
            }
    }
    
return arr;

}

//------------------UI LOGIC-------------------------------------------------// 


//---EVENTS!---

window.addEventListener("mousedown", function(){
    draw=true;

});

window.addEventListener("mouseup", function(){
    draw=false;

});

resetBtn.addEventListener('click', function(){
    (clearInterval(myInterval));
    running=false;
    reset(); //FOR UI!
    resetLife(); //FOR GAME LOGIC!
    startBtn.textContent='Start';
    lastsize=parseInt(sizeEl.value);
    displayState();
})

randomBtn.addEventListener('click', function(){
    reset(); //FOR UI!
    resetLife(); //FOR GAME LOGIC!
    lastsize=parseInt(sizeEl.value);
    container.innerHTML='';
    drawNext(getRandom());
    displayState();
})

stepBtn.addEventListener('click', function(){
    singleStep();
    
})

reloadBtn.addEventListener('click',function(){
    location.reload();
})

startBtn.addEventListener('click', function(){
    if(running==false){
        running=true;
        
        startBtn.textContent="Pause";
        myInterval=setInterval(notStep, 6500/((5*speed)+((speed*speed)-(speed*2))));
        

    }

    else if(running==true){
        running=false;
        startBtn.textContent="Start";
        clearInterval(myInterval);
        
    }

    displayState();

    
})

sizeEl.addEventListener('change', function(){
    clearInterval(myInterval);
    running=false;    
    size=sizeEl.value;
    displaysize(size);
    lastsize=parseInt(sizeEl.value); 
    columns=lastsize;
    reset();
    resetLife();;
    displayState();
       

})

speedEl.addEventListener('change', function(){
    speed=speedEl.value;
    if(running==true){
        clearInterval(myInterval);
        myInterval=setInterval(notStep, 6500/((5*speed)+((speed*speed)-(speed*2))));       
    }
    displaySpeed();
})



populate(size);
clearInterval(myInterval);
displaySpeed();
