const array2D = [
    ['R', 'Y', 'R'],
    ['Y', 'R', 'Y'],
    ['R', 'Y', 'R']
];
const canvas = document.querySelector('canvas');
canvas.width = 600;
canvas.height = 600;
const cellSide = 200;
var ctx = canvas.getContext('2d');
for (let i = 0; i < array2D.length; i++) {
    for (let j = 0; j < array2D[i].length; j++) {
        let x = j * cellSide;
        let y = i * cellSide;
        
        cellColor = '#e74c3c';
        if (array2D[i][j] === 'Y') cellColor = '#f1c40f';
        ctx.beginPath();
        ctx.fillStyle = cellColor;
        ctx.fillRect(x, y, cellSide, cellSide);  
    }
}

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