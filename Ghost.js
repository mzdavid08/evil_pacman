
class Ghost {

  constructor(name, i, j, width, height, speed, movingDir) {
    this.name = name;
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = j * width;
    this.yCanvas = i * height;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.movingDir = movingDir;
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

  // Directly positions object
  position(xCanvas, yCanvas) {
    this.xCanvas = xCanvas;
    this.yCanvas = yCanvas;
  }
  
}
