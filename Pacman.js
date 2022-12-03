
class Pacman {

  constructor(i, j, width, height, speed) {
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = j * width;
    this.yCanvas = i * height;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.movingDir = 'R';
    this.requestedDir = 'R';
  }

  // Moves object
  move(direction, speed) {
    switch (direction) {
      case "left":
        this.xCanvas -= speed;
        break;
      case "right":
        this.xCanvas += speed;
        break;
      case "up":
        this.yCanvas -= speed;
        break;
      case "down":
        this.yCanvas += speed;
        break;
    }
  }

}
