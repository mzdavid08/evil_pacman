
class Pacman {

  constructor(i, j, width, height) {
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = j * width;
    this.yCanvas = i * height;
    this.speed = 5;
    this.width = width;
    this.height = height;
    this.movingDir = 'R';
    this.requestedDir = 'R';
  }

  // Moves object
  move(axis) {
    switch (axis) {
      case "left":
        this.xCanvas -= this.speed;
        break;
      case "right":
        this.xCanvas += this.speed;
        break;
      case "up":
        this.yCanvas -= this.speed;
        break;
      case "down":
        this.yCanvas += this.speed;
        break;
    }
  }

}