
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
