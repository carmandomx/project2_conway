let cols;
let rows;
let resolution = 10;

function draw() {
    createCanvas(500, 500);
    cols = width / resolution;
    rows = height / resolution;
    background(0);
    for (let i = 0; i < cells.length - 1; i++){
        for (let j = 0; j < cells[i].length - 1; j++){
            let x = i * resolution;
            let y = j * resolution;
            if (cells[i][j] == true){
                fill(255);
                stroke(0);
                rect(x, y, resolution, resolution);
            }
        }
    }
}