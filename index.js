

let row = 30;
let column = 30;
let sizePx = 10;
let map = [];
let generation = 0;

let slider = document.querySelector('#sliderColumns')
let gridSize = document.querySelector('.columns')

gridSize.innerHTML = slider.value;

document.addEventListener("keydown",(e) => {
    e.preventDefault()
    switch (e.keyCode) {
        case 39:
            updateStatus()
            break;
    
        default:
            break;
    }
})

slider.oninput = function() {
    gridSize.innerHTML = this.value;
    column = this.value
    row = this.value
    generateTable()
}

slider.addEventListener("input", function(){
    var x = ((slider.value - slider.min) / (slider.max - slider.min) * 100 )
    var color =`linear-gradient(90deg, rgb(117,252,117) ${x}%, rgb(214,214,214) ${x}%)`;
    slider.style.background = color
})

generateTable()

/* ////////////////////////TABLE GENERATION//////////////////*/
/* Table size to be generated, ideally to be set by the user
Since it is impossible to generate a n x m table by hand,
it is necessary to make an itteration through JS */

function generateTable(){
    //Grid can change its size by using the slider event.
    let html = "<table cellpadding=0 cellspacing=0 class='table'>"
    for (let y = 0; y < row; y++) {
        html += "<tr>"
        for (let x = 0; x < column; x++) {
            //Working as a coordinate system
            //Generate the coordinates of each cell
            html += `<td id="cell-${x + "-" + y}" onmouseup="cellStatus(${x},${y})">`
            html += "</td>"
        }
        html += "</tr>"
    }
    html += "</table>"
    let container = document.querySelector('.tableContainer')
    container.innerHTML = html
    let tablero = document.querySelector('.table')
    tablero.style.width = sizePx * column + "px"
    tablero.style.height = sizePx * row + "px"

}

/* /////////////////////TABLE GENERATION END//////////////////*/

/* /////////////////////CELL STATUS CHECK//////////////////*/

function cellStatus(x,y){
    let cell = document.querySelector(`#cell-${x + "-" + y}`)
    if (cell.style.background != "black") {
        cell.style.background = "black"
    } else {  cell.style.background = ""  }
}

/* /////////////////////CELL STATUS CHECK END//////////////////*/

/* Will return a "map" in which the algorithm will recognice
which cell its alive with a TRUE or which is dead. */
function mapping() {
    map = []
    for (let x = 0; x < column; x++) {
        map.push([])
        for (let y = 0; y < column; y++) {
            let cell = document.querySelector(`#cell-${x + "-" + y}`)
            map[x][y] = cell.style.background == "black"
        }      
    }
}

function aliveCells(x,y){
    let alive = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++){
            //Means its checking the input cell
            if(i == 0 && j == 0){
                continue
            }
            try{
                if (map[x+i][y+j]) {
                    alive = alive + 1;
                }
            } catch (e){}
            //It doesnt matter more than 3, because it counts as overpoplation
            if (alive > 3) {
                return alive
            }
        }
    }
    return alive
}

function updateStatus() {
    mapping()
    console.log(map);
    for (let x = 0; x < column; x++) {
        for(let y = 0; y < column; y++){
            let alive = aliveCells(x,y)
            let cell = document.querySelector(`#cell-${x + "-" + y}`)
            if(map[x][y]){ //Its alive at this point
                if(alive < 2 || alive > 3){ cell.style.background = "" }//Dies from overpopulation
            }
            else { //It's dead checking to revive
                if(alive == 3){ cell.style.background = "black" }
             }
        }      
    }
}