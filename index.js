
/* ////////////////////////TABLE GENERATION//////////////////*/
/* Table size to be generated, ideally to be set by the user
Since it is impossible to generate a n x m table by hand,
it is necessary to make an itteration through JS */
let row = 50;
let column = 50;
let sizePx = 10;
let map = [];
let generation = 0;

document.addEventListener("keydown",(e) => {
    e.preventDefault()
    switch (e.keyCode) {
        case 39:
            console.log("enter");
            updateStatus()
            break;
    
        default:
            break;
    }
})

generateTable()

function generateTable(){
    //An ID was given to this element since we don't want any other contect to modify the table size by "accident"
    //Only by a grid modifier which the user can interact with
    let html = "<table cellpadding=0 cellspacing=0 class='table_id'>"
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
    let tablero = document.querySelector('.table_id')
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
    for (let x = 0; x < column; x++) {
        for(let y = 0; y < column; y++){
            let alive = aliveCells(x,y)
            let cell = document.querySelector(`#cell-${x + "-" + y}`)
            console.log(alive, cell)
            // console.log(cell);
            if(map[x][y]){ //Its alive at this point
                if(alive < 2 || alive > 3){ cell.style.background = "" }//Dies from overpopulation
            }
            else { //It's dead checking to revive
                if(alive == 3){ cell.style.background = "black" }
             }
        }      
    }
}