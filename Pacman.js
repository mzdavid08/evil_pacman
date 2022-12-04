
class Pacman {

  constructor(i, j, width, height, speed, img) {
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = j * width;
    this.yCanvas = i * height;
    this.img = img;
    this.speed = speed
    this.angle = 0;
    this.xTrans = 0;
    this.yTrans = 0;
    this.width = width;
    this.height = height;
    this.movingDir = 'right';
    this.requestedDir = 'R';
  }

  // Moves object
  move(direction) {
    switch (direction) {
      case "left":
        this.xCanvas -= speed;
        this.angle = Math.PI;
        this.xTrans = -width;
        this.yTrans = -height;
        break;
      case "right":
        this.xCanvas += speed;
        this.angle = 0;
        this.xTrans = 0;
        this.yTrans = 0;
        break;
      case "up":
        this.yCanvas -= speed;
        this.angle = Math.PI/2;
        this.xTrans = -width;
        this.yTrans = 0;
        break;
      case "down":
        this.yCanvas += speed;
        this.angle = (3*Math.PI)/2;
        this.xTrans = 0;
        this.yTrans = -height;
        break;
    }
  }

  // Directly positions object
  position(xCanvas, yCanvas) {
    this.xCanvas = xCanvas;
    this.yCanvas = yCanvas;
  }

}
