
class Ghost {

  constructor(name, i, j, width, height, movingDir) {
    this.name = name;
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = j * width;
    this.yCanvas = i * height;
    this.speed = 5;
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
  
}
