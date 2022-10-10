// Class to represent a painted Cell
class PaintedCell extends Cell {
  constructor(col, row, width, height, strokeColor, fillColor) {
    super(col, row, width, height, strokeColor);
    this.fillColor = fillColor;
  }
  // Method to paint a cell
  paint(context) {
    // Erase pixels in a rectangular area
    context.clearRect(this.positionX, this.positionY, this.width, this.height);
    // Define the color to fill the cell
    context.fillStyle = this.fillColor;
    // Draw a rectangle filled with the fillStyle
    context.fillRect(
      this.col * this.width,
      this.row * this.height,
      this.width,
      this.height
    );
  }
}
