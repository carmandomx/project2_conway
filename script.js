//We relate the container 
const container = document.querySelector("#container");

//Function that creates the grid
function makeRows(rows, cols) {
  //Connect the rows and cols variables with the CSS variables
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < (rows * cols); c++) {
    //Every div is a cell
    let cell = document.createElement("div");
    //Every cell is a grid-item
    container.appendChild(cell).className = "grid-item";
  };
};

makeRows(50, 50);