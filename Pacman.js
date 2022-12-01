
class Pacman {

  constructor(i, j, width, height){
    this.xGrid = j;
    this.yGrid = i;
    this.xCanvas = this.xGrid*height;
    this.yCanvas = this.yGrid*width;
    this.speed = 5;
    this.width = width;
    this.height = height;
    this.movingDir = 'R';
    this.requestedDir = 'R';
  }

  move(dir){

  }

}
