// Class to represent a Cell
class Cell {
  constructor(col, row, width, height, strokeColor) {
    this.col = col;
    this.row = row;
    this.width = width;
    this.height = height;
    this.strokeColor = strokeColor;
    this.positionX = this.col * this.width;
    this.positionY = this.row * this.height;
  }
  // Method to draw the cell "borders"
  drawRect(context) {
    // Erase pixels in a rectangular area
    context.clearRect(this.positionX, this.positionY, this.width, this.height);
    // Begin a path or reset the current path (a line)
    context.beginPath();
    // create a new rectangle
    context.rect(this.positionX, this.positionY, this.width, this.height);
    // Define the lines style
    context.strokeStyle = this.strokeColor;
    // Draw the path or lines
    context.stroke();
    // close the path, create a path from the current point back to the starting point
    context.closePath();
  }
}
