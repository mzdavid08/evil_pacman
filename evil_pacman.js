/*
    Team: Trifecta
    CSCI 445 Web Programming
    Section B

    Evil Pac-Man
*/

// Create pacman and ghost objects
var pacman;
var blue;
var orange;
var pink;
var red;

// Create images
var pacman_img_1 = new Image();
var pacman_img_2 = new Image();
var pacman_img_3 = new Image();
var blue_imgs = new Array(4);
var orange_imgs = new Array(4);
var pink_imgs = new Array(4);
var red_imgs = new Array(4);
var wall_straight = new Image();
var wall_end = new Image();
var wall_corner = new Image();
var wall_tee = new Image();
var wall_plus = new Image()

// Create game elements
var game, maze, width, height, context, maze_p, scorePos, replayPos, shortcutY;
var score = 0;
var pellets = new Set();
var poisonPellets = 0;
var walls = new Set();
var tol = 0.1;
var pacmanDir = null;
var requestedDir = null;
var objSpeed = 2;
var pacmanAnimateSpeed = 3;
var pacmanPhase = pacmanAnimateSpeed;
var pausePacman = true;
var gameWin = false;
var gameLost = false;
var ghostList = [];
var flashlightRadius = 150;
var gameStarted = false;
var dirs = ['left', 'right', 'up', 'down'];
var ghosts = ['red', 'orange', 'blue', 'pink'];
var ghost_img = new Array(4).fill(new Image()).map(() => new Array(4).fill(new Image()));
var music = new Audio('music.mp3');

for (var i = 0; i < 4; i++){
  for (var j = 0; j < 4; j++){
    ghost_img[i][j] = new Image();
    ghost_img[i][j].src = "sprites/ghost_" + ghosts[i] + "_" + dirs[j] + ".png";
  }
}

// Define element images
pacman_img_1.src = "sprites/pacman_1.png";
pacman_img_2.src = "sprites/pacman_2.png";
pacman_img_3.src = "sprites/pacman_3.png";
wall_straight.src = "sprites/wall_straight.png";
wall_end.src = "sprites/wall_end.png";
wall_corner.src = "sprites/wall_corner.png";
wall_tee.src = "sprites/wall_tee.png";
wall_plus.src = "sprites/wall_plus.png";

// Splash screen in canvas at start of the game
function start_splash() {
    // Prevent arrows from scrolling window
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);


    game = document.getElementById("game");
    context = game.getContext("2d");
    context.beginPath();
    context.textAlign = "center";
    context.font = 30 + "px Arial";
    context.fillStyle = "white";
    context.fillText("WELCOME TO EVIL PACMAN", 300, 150);
    context.font = 20 + "px Arial";
    context.fillText("PRESS SPACE TO START!", 300, 200);
    document.addEventListener("keyup", startGame);
}

function startGame(e) {
    if (e.code === "Space") {
        if (gameWin || gameLost) {
            gameStarted = false;
            window.location.reload();
        }
        else if (!gameStarted) {
            gameStarted = true;
            start();
        }
    }
}

// Initialization function
function start() {
    // Generate the maze using the game
    generateMaze();
    start_splash();
    redraw();

    // Add event listener for WASD/arrow keys
    document.addEventListener("keydown", noteDir, false);

    // Move pacman infinitely
    setTimeout(movePacman(pacmanDir), 1000)

    // Animate the movement
    music.play();
    animate();
}

// Generates the maze
// game = canvas in document
function generateMaze() {
    // Define maze as a matrix, where:
    // '.' = Normal Pellet
    // '!' = Poison Pellet
    // '#' = Wall
    // 'X' = Inaccessible
    // 'C' = Shortcut
    // ' ' = Empty Space
    // 'B', 'O', 'M', 'R' = Ghost Spawns
    // 'S' = Pacman Spawn
    // '-' = Score
    // 'T' = Win/loss text
    maze = [['-', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'P'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '!', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '!', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '#', ' ', '#', '#', 'B', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['C', '.', '#', 'X', 'X', 'X', 'X', '#', ' ', 'X', 'O', 'M', 'R', 'X', ' ', '#', 'X', 'X', 'X', 'X', '#', '.', 'C'],
    ['#', '.', '#', '#', '#', '#', '#', '#', ' ', '#', '#', '#', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', ' ', ' ', ' ', 'T', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'S', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '!', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '!', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']];

    //Build maze with padding (for making walls)
    maze_p = Array.from(Array(maze.length + 2), () => new Array(maze[0].length + 2))
    for (var i = 0; i < maze.length + 2; i++) {
        for (var j = 0; j < maze[0].length + 2; j++) {
            if (i == 0 || j == 0 || i == maze.length + 1 || j == maze[0].length + 1) {
                maze_p[i][j] = ' ';
            }
            else {
                maze_p[i][j] = maze[i - 1][j - 1];

            }
        }
    }

    // Determine size of each maze element
    height = game.height / maze.length;
    width = game.width / maze[0].length;

    // Get the game's 2D context
    context = game.getContext("2d");

    // Initialize important elements
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            switch (maze[i][j]) {
                case '-':
                    // Save score position
                    scorePos = [j, i];
                    break;
                case 'C':
                    // Save shortcut y-position
                    shortcutY = i * height;
                    break;
                case '#':
                    // Add the wall coordinates to the set of walls
                    walls.add([j * width, i * height]);
                    break;
                case '.':
                    // Add normal pellets to set of pellets
                    pellets.add([j, i, "normal"]);
                    break;
                case '!':
                    // Add poison pellets to set of pellets
                    pellets.add([j, i, "poison"]);
                    poisonPellets++;
                    break;
                case 'S':
                    // Spawn pacman
                    pacman = new Pacman(i, j, width, height, objSpeed, pacman_img_2);
                    maze[i][j] = ' ';
                    break;
                case 'B':
                    // Spawn blue ghost
                    blue = new Ghost("blue", i, j, width, height, objSpeed, 'up');
                    ghostList.push(blue);
                    maze[i][j] = ' ';
                    break;
                case 'O':
                    // Spawn orange ghost
                    orange = new Ghost("orange", i, j, width, height, objSpeed, 'right');
                    ghostList.push(orange);
                    maze[i][j] = ' ';
                    break;
                case 'M':
                    // Spawn pink ghost
                    pink = new Ghost("pink", i, j, width, height, objSpeed, 'up');
                    ghostList.push(pink);
                    maze[i][j] = ' ';
                    break;
                case 'R':
                    // Spawn red ghost
                    red = new Ghost("red", i, j, width, height, objSpeed, 'left');
                    ghostList.push(red);
                    maze[i][j] = ' ';
                    break;
                case 'P':
                    // Save replay prompt coordinates
                    replayPos = [j, i];
                    break;
            }
        }
    }
}

// Redraw the map
function redraw() {
    context.clearRect(0, 0, game.width, game.height);
    var pelletsLeft = 0; // Using to keep track of score
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            switch (maze[i][j]) {
                case '#':
                    // Draw wall
                    drawWall(i + 1, j + 1);
                    break;
                case '.':
                    // Draw normal pellet
                    context.fillStyle = "#ffe2db";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 14, width, height * 2);
                    context.fill();
                    context.closePath();
                    break;
                case '!':
                    // Draw poison pellet
                    context.fillStyle = "#79EC74";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 6, width, height * 2);
                    context.fill();
                    context.closePath();
                    break;
                case 'T':
                    // Draw win/loss text depending on state of game
                    context.textAlign = "center";
                    context.font = height + "px Arial";
                    context.fillStyle = "white";
                    if (gameWin) {
                        context.fillText("YOU WON!", j * width + (width / 2), (i + 1 - tol) * height);
                        restartGame();
                    } else if (gameLost) {
                        context.fillText("GAME OVER", j * width + (width / 2), (i + 1 - tol) * height);
                        restartGame();
                    }
                    break;
            }
        }
    }

    // Spawn all elements
    context.save()
    context.translate(pacman.xCanvas, pacman.yCanvas);
    context.rotate(-pacman.angle);
    context.drawImage(pacman.img, pacman.xTrans, pacman.yTrans, pacman.width, pacman.height);
    context.restore();
    console.log(dirs.indexOf(blue.movingDir));
    console.log(blue.movingDir);
    context.drawImage(ghost_img[ghosts.indexOf("blue")][dirs.indexOf(blue.movingDir)], blue.xCanvas, blue.yCanvas, height, height);
    context.drawImage(ghost_img[ghosts.indexOf("orange")][dirs.indexOf(orange.movingDir)], orange.xCanvas, orange.yCanvas, height, height);
    context.drawImage(ghost_img[ghosts.indexOf("pink")][dirs.indexOf(pink.movingDir)], pink.xCanvas, pink.yCanvas, height, height);
    context.drawImage(ghost_img[ghosts.indexOf("red")][dirs.indexOf(red.movingDir)], red.xCanvas, red.yCanvas, height, height);
}


// Keeps track of last key pressed
function noteDir(event) {
    // Keep track of last direction
    if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
        requestedDir = "left";
    } else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
        requestedDir = "right";
    } else if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") {
        requestedDir = "up";
    } else if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
        requestedDir = "down";
    }
}

function moveGhost(ghost) {
    randDir = dirs[Math.floor(Math.random() * 4)];
    speed = checkBounds(ghost, ghost.movingDir);
    while (speed == 0) {
        randDir = dirs[Math.floor(Math.random() * 4)];
        speed = checkBounds(ghost, randDir);
        ghost.movingDir = randDir;
    }
    ghost.move(ghost.movingDir, speed);
}

// Moves Pacman
function movePacman() {
    // Move based on current direction and requested direction
    switch (requestedDir) {
        case null:
            break;
        default:
            speed = checkBounds(pacman, requestedDir);
            if (speed > 0) {
                pacmanDir = requestedDir;
                pausePacman = false;
            }
            else {
                speed = checkBounds(pacman, pacmanDir);
                if (speed <= 0) {
                    pausePacman = true;
                }
                else {
                    pausePacman = false;
                }
            }
            pacman.move(pacmanDir, speed);

            //Animate pacman if he is not paused
            if (!pausePacman) {
                pacmanPhase++;
                if (pacmanPhase < pacmanAnimateSpeed) {
                    pacman.img = pacman_img_1;
                }
                else if (pacmanPhase < pacmanAnimateSpeed * 2 || (pacmanPhase >= pacmanAnimateSpeed * 3 && pacmanPhase < pacmanAnimateSpeed * 4)) {
                    pacman.img = pacman_img_2;
                }

                else if (pacmanPhase < pacmanAnimateSpeed * 3) {
                    pacman.img = pacman_img_3;
                }
                else {
                    pacmanPhase = 0;
                    pacman.img = pacman_img_1;
                }
            }
            break;
    }
    // Redraw the map
    redraw();
}

// Checks bounds of any object
function checkBounds(object, direction, speed = object.speed) {
    // Check if speed is zero
    if (speed <= 0) {
        return 0;
    }

    // Translate object
    var xCoord = object.xCanvas;
    var yCoord = object.yCanvas;
    switch (direction) {
        case "left":
            xCoord -= speed;
            break;
        case "right":
            xCoord += speed;
            break;
        case "up":
            yCoord -= speed;
            break;
        case "down":
            yCoord += speed;
            break;
    }

    // Iterate through walls
    for (var it = walls.values(), val = null; val = it.next().value;) {
        // Grab coordinates
        var xWall = val[0];
        var yWall = val[1];

        // Define bound checks for each side (left, right, top down)
        let leftCheck = xWall >= (xCoord + object.width);
        let rightCheck = (xWall + width) <= xCoord;
        let topCheck = yWall >= (yCoord + object.height);
        let bottomCheck = (yWall + height) <= yCoord;

        // Check if any bound check isn't true
        if (!(leftCheck || rightCheck || topCheck || bottomCheck)) {
            // Recursively call the function again and decrement the speed
            return checkBounds(object, direction, speed - tol);
        }
    }

    // Return the final speed
    return speed;
}

// Checks pellet collision
function checkPellets(object) {
    // Check if game is won, whereas pellets left should be poison pellets
    if (pellets.size == poisonPellets) {
        gameWon();
    }

    // Iterate through pellets
    for (var it = pellets.values(), val = null; val = it.next().value;) {
        // Grab coordinates
        var j = val[0];
        var i = val[1];
        var type = val[2];

        // Define canvas elements
        var radius;
        switch (type) {
            case "normal":
                radius = height / 12;
                break;
            default:
                radius = height / 6;
                break;
        }
        var xPellet = j * width + (width / 2) - radius;
        var yPellet = i * height + (width / 2) - radius;
        var diameter = 2 * radius;

        // Define bound checks for each side (left, right, top down)
        let leftCheck = xPellet >= (object.xCanvas + object.width);
        let rightCheck = (xPellet + diameter) <= object.xCanvas;
        let topCheck = yPellet >= (object.yCanvas + object.height);
        let bottomCheck = (yPellet + diameter) <= object.yCanvas;

        // Check if any bound check isn't true
        if (!(leftCheck || rightCheck || topCheck || bottomCheck)) {
            // Action based on type
            switch (type) {
                case "normal":
                    score++;
                    break;
                case "poison":
                    gameOver();
                    break;
            }
            // Remove pellet from maze and set
            maze[i][j] = ' ';
            pellets.delete(val);
        }
    }
}

// Shortcut check
function checkShortcut(object) {
    if (object.xCanvas <= -width + tol) {
        object.position(maze[0].length * width - tol, shortcutY);
    } else if (object.xCanvas >= maze[0].length * width - tol) {
        object.position(-width, shortcutY);
    }
}

// Game won!
function gameWon() {
    // TODO: Game win functionality
    music.pause();
    music.currentTime = 0;
    gameWin = true;
}

// Game over
function gameOver() {
    // TODO: Game loss functionality
    music.pause();
    music.currentTime = 0;
    gameLost = true;
}

// Animates all movement
function animate() {
    requestAnimationFrame(animate);
    if (!gameWin && !gameLost) {
        movePacman(pacmanDir);
        checkPellets(pacman);
        checkShortcut(pacman);
        moveGhost(red);
        moveGhost(orange);
        moveGhost(blue);
        moveGhost(pink);
        ghostCollision();
    }
    redraw();
    drawFlashlight();
    revealScore();
}

// Reveal score
function revealScore() {
    var j = scorePos[1];
    var i = scorePos[0];

    // Draw score
    context.textAlign = "left";
    context.font = height + "px Arial";
    context.fillStyle = "white";
    context.fillText("SCORE: " + score, j * width, (i + 1 - tol) * height);
}

// Draw flashlight around pacman
function drawFlashlight() {
    if (!gameWin && !gameLost) {
        //Draws one flashlight around Pacman
        if (pacman.xCanvas > flashlightRadius / 1.4 && pacman.xCanvas < width * maze[0].length - (flashlightRadius / 1.4)) {
            var grd = context.createRadialGradient(pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, 15, pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, flashlightRadius);
            grd.addColorStop(0, 'rgba(0,0,0,0)');
            grd.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = grd;
            context.fillRect(0, height, width * maze[0].length, height * maze.length);
        }
        else if (pacman.xCanvas <= flashlightRadius / 1.4) {
            //Draws the flashlight around pacman
            var grd1 = context.createRadialGradient(pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, 15, pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, flashlightRadius);
            grd1.addColorStop(0, 'rgba(0,0,0,0)');
            grd1.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = grd1;
            context.fillRect(0, height, (width * maze[0].length) / 2 + 2, height * maze.length);

            //Determines location and opacity of second flashlight
            var xMirror = width * maze[0].length + (pacman.xCanvas + (3 * width) / 2);
            var yOpacity = (Math.abs(pacman.yCanvas - maze.length * width / 2) / (maze.length * width / 3))

            //Draws flashlight on the right side of the room
            var grd2 = context.createRadialGradient(xMirror, (maze.length * height) / 2 + width / 2, 15, xMirror, (maze.length * height) / 2 + width / 2, flashlightRadius);
            grd2.addColorStop(0, 'rgba(0,0,0,' + yOpacity + ')');
            grd2.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = grd2;
            context.fillRect((width * maze[0].length) / 2 - 2, height, width * maze[0].length, height * maze.length);
        }
        else {
            //Draws the flashlight around pacman
            var grd1 = context.createRadialGradient(pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, 15, pacman.xCanvas + width / 2, pacman.yCanvas + width / 2, flashlightRadius);
            grd1.addColorStop(0, 'rgba(0,0,0,0)');
            grd1.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = grd1;
            context.fillRect((width * maze[0].length) / 2 - 2, height, width * maze[0].length, height * maze.length);

            //Determines location and opacity of second flashlight
            var xMirror = (pacman.xCanvas + width / 2) - width * maze[0].length - width;
            var yOpacity = (Math.abs(pacman.yCanvas - maze.length * width / 2) / (maze.length * width / 3))

            //Draws flashlight on the left side of the room
            var grd2 = context.createRadialGradient(xMirror, (maze.length * height) / 2 + width / 2, 15, xMirror, (maze.length * height) / 2 + width / 2, flashlightRadius);
            grd2.addColorStop(0, 'rgba(0,0,0,' + yOpacity + ')');
            grd2.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = grd2;
            context.fillRect(0, height, (width * maze[0].length) / 2 + 2, height * maze.length);
        }
    }
}

//Draws the walls
function drawWall(i, j) {
    context.save();
    context.translate((j - 1) * width, (i - 1) * height);

    //Draw corners
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] != '#' && maze_p[i + 1][j] == '#' && maze_p[i][j + 1] == '#') {
        context.rotate(-Math.PI);
        context.drawImage(wall_corner, -width, -height, height, height);
    }
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] == '#' && maze_p[i + 1][j] == '#' && maze_p[i][j + 1] != '#') {
        context.rotate(-Math.PI / 2);
        context.drawImage(wall_corner, -width, 0, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] != '#' && maze_p[i + 1][j] != '#' && maze_p[i][j + 1] == '#') {
        context.rotate((-3 * Math.PI) / 2);
        context.drawImage(wall_corner, 0, -height, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] == '#' && maze_p[i + 1][j] != '#' && maze_p[i][j + 1] != '#') {
        context.rotate(0);
        context.drawImage(wall_corner, 0, 0, height, height);
    }

    //Draw tees
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] == '#' && maze_p[i + 1][j] == '#') {
        context.rotate(0);
        context.drawImage(wall_tee, 0, 0, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] == '#' && maze_p[i + 1][j] != '#') {
        context.rotate(Math.PI);
        context.drawImage(wall_tee, -width, -height, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] != '#' && maze_p[i][j + 1] == '#' && maze_p[i + 1][j] == '#') {
        context.rotate(-Math.PI / 2);
        context.drawImage(wall_tee, -width, 0, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] != '#' && maze_p[i + 1][j] == '#') {
        context.rotate((-3 * Math.PI) / 2);
        context.drawImage(wall_tee, 0, -height, height, height);
    }

    //Draw straight walls
    if (maze_p[i + 1][j] != '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] == '#' && maze_p[i - 1][j] != '#') {
        context.rotate(0);
        context.drawImage(wall_straight, 0, 0, height, height);
    }
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] != '#' && maze_p[i][j + 1] != '#' && maze_p[i + 1][j] == '#') {
        context.rotate(-Math.PI / 2);
        context.drawImage(wall_straight, -width, 0, height, height);
    }

    //Draw ends
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] != '#' && maze_p[i][j + 1] != '#' && maze_p[i + 1][j] != '#') {
        context.rotate((-3 * Math.PI) / 2);
        context.drawImage(wall_end, 0, -height, height, height);
    }
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] != '#' && maze_p[i + 1][j] != '#') {
        context.rotate(0);
        context.drawImage(wall_end, 0, 0, height, height);
    }
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] != '#' && maze_p[i][j + 1] == '#' && maze_p[i + 1][j] != '#') {
        context.rotate(Math.PI);
        context.drawImage(wall_end, -width, -height, height, height);
    }
    if (maze_p[i - 1][j] != '#' && maze_p[i][j - 1] != '#' && maze_p[i][j + 1] != '#' && maze_p[i + 1][j] == '#') {
        context.rotate(-Math.PI / 2);
        context.drawImage(wall_end, -width, 0, height, height);
    }

    //Draw pluses
    if (maze_p[i - 1][j] == '#' && maze_p[i][j - 1] == '#' && maze_p[i][j + 1] == '#' && maze_p[i + 1][j] == '#') {
        context.rotate(0);
        context.drawImage(wall_plus, 0, 0, height, height);
    }

    context.restore();

}

function restartGame() {
    // Show the restart game prompt
    var j = replayPos[0];
    var i = replayPos[1];
    context.textAlign = "right";
    context.font = height + "px Arial";
    context.fillStyle = "white";
    context.fillText("PRESS SPACE TO PLAY AGAIN", (j + 1) * width, (i + 1 - tol) * height);
}

function ghostCollision() {

    ghostList.forEach(ghost => {
        var pacmanRightSide = pacman.xCanvas + pacman.width;
        var pacmanLeftSide = pacman.xCanvas;
        var pacmanTopSide = pacman.yCanvas;
        var pacmanBotSide = pacman.yCanvas + pacman.height;

        var ghostRightSide = ghost.xCanvas + ghost.width;
        var ghostLeftSide = ghost.xCanvas;
        var ghostTopSide = ghost.yCanvas;
        var ghostBotSide = ghost.yCanvas + ghost.height;

        if (pacmanRightSide >= ghostLeftSide && pacmanRightSide < ghostRightSide && pacmanTopSide == ghostTopSide ||
            pacmanLeftSide <= ghostRightSide && pacmanLeftSide > ghostLeftSide && pacmanTopSide == ghostTopSide ||
            pacmanBotSide >= ghostTopSide && pacmanBotSide < ghostBotSide && pacmanLeftSide == ghostLeftSide ||
            pacmanTopSide <= ghostBotSide && pacmanTopSide > ghostTopSide && pacmanLeftSide == ghostLeftSide) { // check for collisions
            gameOver();
        }

    });
}
