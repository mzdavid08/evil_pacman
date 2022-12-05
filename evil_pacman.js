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
var blue_img = new Image();
var orange_img = new Image();
var pink_img = new Image();
var red_img = new Image();
var wall_straight = new Image();
var wall_end = new Image();
var wall_corner = new Image();
var wall_tee = new Image();
var wall_plus = new Image();

// Create game elements
var game, maze, width, height, context;
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
var maze_p;
var scorePos;

// Define element images
pacman_img_1.src = "sprites/pacman_1.png";
pacman_img_2.src = "sprites/pacman_2.png";
pacman_img_3.src = "sprites/pacman_3.png";
blue_img.src = "sprites/ghost_blue_up.png";
orange_img.src = "sprites/ghost_orange_right.png";
pink_img.src = "sprites/ghost_pink_up.png";
red_img.src = "sprites/ghost_red_left.png";
wall_straight.src = "sprites/wall_straight.png";
wall_end.src = "sprites/wall_end.png";
wall_corner.src = "sprites/wall_corner.png";
wall_tee.src = "sprites/wall_tee.png";
wall_plus.src = "sprites/wall_plus.png";

// Initialization function
function start() {
    // Grab the game's canvas
    game = document.getElementById("game");

    // Generate the maze using the game
    generateMaze();
    redraw();

    // Add event listener for WASD/arrow keys
    document.addEventListener("keydown", noteDir, false);

    // Move pacman infinitely
    setTimeout(movePacman(pacmanDir), 1000)

    // Prevent arrows from scrolling window
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    // Animate the movement
    animate();
}

// Generates the maze
// game = canvas in document
function generateMaze() {
    // Define maze as a matrix, where:
    // '.' = Normal Pellet
    // 'P' = Power Pellet
    // '!' = Poison Pellet
    // '#' = Wall
    // 'X' = Inaccessible
    // 'C' = Shortcut
    // ' ' = Empty Space
    // 'B', 'O', 'M', 'R' = Ghost Spawns
    // 'S' = Pacman Spawn
    // '-' = Score
    // 'T' = Win/loss text
    maze = [['-', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '!', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '#', ' ', '#', '#', 'B', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['C', '.', '#', 'X', 'X', 'X', 'X', '#', ' ', '#', 'O', 'M', 'R', '#', ' ', '#', 'X', 'X', 'X', 'X', '#', '.', 'C'],
    ['#', '.', '#', '#', '#', '#', '#', '#', ' ', '#', '#', '#', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', ' ', ' ', ' ', 'T', ' ', ' ', ' ', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'S', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '!', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', '#'],
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
                case 'P':
                    // Add power pellets to set of pellets
                    pellets.add([j, i, "power"]);
                    break;
                case 'S':
                    // Spawn pacman
                    pacman = new Pacman(i, j, width, height, objSpeed, pacman_img_2);
                    maze[i][j] = ' ';
                    break;
                case 'B':
                    // Spawn blue ghost
                    blue = new Ghost("Blue", i, j, width, height, objSpeed, 'U');
                    maze[i][j] = ' ';
                    break;
                case 'O':
                    // Spawn orange ghost
                    orange = new Ghost("Orange", i, j, width, height, objSpeed, 'R');
                    maze[i][j] = ' ';
                    break;
                case 'M':
                    // Spawn pink ghost
                    pink = new Ghost("Pink", i, j, width, height, objSpeed, 'U');
                    maze[i][j] = ' ';
                    break;
                case 'R':
                    // Spawn red ghost
                    red = new Ghost("Red", i, j, width, height, objSpeed, 'L');
                    maze[i][j] = ' ';
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
                    // Draw wal
                    drawWall(i + 1, j + 1);
                    //context.fillStyle = "blue";
                    //context.fillRect(j * width, i * height, width, height);
                    break;
                case '.':
                    // Draw normal pellet
                    context.fillStyle = "#ffe2db";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 14, width, height * 2);
                    context.fill();
                    context.closePath();
                    break;
                case 'P':
                    // Draw power pellet
                    context.fillStyle = "#F3AFF1";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 6, width, height * 2);
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
                    } else if (gameLost) {
                        context.fillText("GAME OVER", j * width + (width / 2), (i + 1 - tol) * height);
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
    context.drawImage(blue_img, blue.xCanvas, blue.yCanvas, height, height);
    context.drawImage(orange_img, orange.xCanvas, orange.yCanvas, height, height);
    context.drawImage(pink_img, pink.xCanvas, pink.yCanvas, height, height);
    context.drawImage(red_img, red.xCanvas, red.yCanvas, height, height);
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

        // Define bound checks
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
        // context.arc(j * width + (width / 2), i * height + (width / 2), height / 6, width, height * 2);
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

        // Define bound checks
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
                case "power":
                    score++;
                    powerPellet();
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
        object.position(maze[0].length * width - tol, object.yCanvas);
    } else if (object.xCanvas >= maze[0].length * width - tol) {
        object.position(0 + tol, object.yCanvas);
    }
}

// Power pellet
function powerPellet() {
    // TODO: Something if a power pellet is eaten
}

// Game won!
function gameWon() {
    // TODO: Game win functionality
    gameWin = true;
}

// Game over
function gameOver() {
    // TODO: Game loss functionality
    gameLost = true;
}

// Animates all movement
function animate() {
    requestAnimationFrame(animate);
    if (!gameWin && !gameLost) {
        movePacman(pacmanDir);
        checkPellets(pacman);
        checkShortcut(pacman);
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
        context.lineWidth = 900;
        context.beginPath();
        context.strokeStyle = "black";
        context.arc(pacman.xCanvas + pacman.width / 2, pacman.yCanvas + pacman.width / 2, 300, 0, 2 * Math.PI);;
        context.stroke();

        // var grd = context.createRadialGradient(pacman.xCanvas + pacman.width/2, pacman.yCanvas + pacman.width/2, 60, pacman.xCanvas + pacman.width/2, pacman.yCanvas + pacman.width/2, 70);
        // grd.addColorStop(0, 'rgba(255,255,255,0)');
        // grd.addColorStop(1, 'rgba(0,0,0,1)');

        // context.fillStyle = grd;
        // context.beginPath();
        // context.arc(pacman.xCanvas + pacman.width/2, pacman.yCanvas + pacman.width/2, 70, 0, 2 * Math.PI, true);
        // context.closePath();
        // context.fill();
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
