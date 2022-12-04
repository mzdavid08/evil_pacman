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
var pacman_img = new Image();
var blue_img = new Image();
var orange_img = new Image();
var pink_img = new Image();
var red_img = new Image();

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

// Define element images
pacman_img.src = "sprites/pacman_2.png";
blue_img.src = "sprites/ghost_blue_up.png";
orange_img.src = "sprites/ghost_orange_right.png";
pink_img.src = "sprites/ghost_pink_up.png";
red_img.src = "sprites/ghost_red_left.png";

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
    maze = [['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '!', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '#', '.', '#', '#', 'B', '#', '#', '.', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['C', '.', '#', 'X', 'X', 'X', 'X', '#', '.', '#', 'O', 'M', 'R', '#', '.', '#', 'X', 'X', 'X', 'X', '#', '.', 'C'],
    ['#', '.', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'S', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#'],
    ['#', '!', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'P', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']];

    // Determine size of each maze element
    height = game.height / maze.length;
    width = game.width / maze[0].length;

    // Get the game's 2D context
    context = game.getContext("2d");

    // Initialize important elements
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            switch (maze[i][j]) {
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
                    pacman = new Pacman(i, j, width, height, objSpeed);
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
                    // Draw wall
                    context.fillStyle = "blue";
                    context.fillRect(j * width, i * height, width, height);
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
            }
        }
    }

    // Spawn all elements
    context.save()
    context.translate(pacman.xCanvas, pacman.yCanvas);
    context.rotate(-pacman.angle);
    context.drawImage(pacman_img, pacman.xTrans, pacman.yTrans, pacman.width, pacman.height);
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
    switch(requestedDir) {
        case null:
            break;
        default:
            speed = checkBounds(pacman, requestedDir);
            if (speed > 0){
              pacmanDir = requestedDir;
              pausePacman = false;
            }
            else{
              speed = checkBounds(pacman, pacmanDir);
              if (speed <= 0){
                pausePacman = true;
              }
              else{
                pausePacman = false;
              }
            }
            pacman.move(pacmanDir, speed);

            //Animate pacman if he is not paused
            if (!pausePacman){
              pacmanPhase++;
              if (pacmanPhase < pacmanAnimateSpeed){
                pacman_img.src = "sprites/pacman_1.png";
              }
              else if (pacmanPhase < pacmanAnimateSpeed*2 || (pacmanPhase >= pacmanAnimateSpeed*3 && pacmanPhase < pacmanAnimateSpeed*4)){
                pacman_img.src = "sprites/pacman_2.png";
              }

              else if (pacmanPhase < pacmanAnimateSpeed*3){
                pacman_img.src = "sprites/pacman_3.png";
              }
              else{
                pacmanPhase = 0;
                pacman_img.src = "sprites/pacman_1.png";
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
        switch(type) {
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
            switch(type) {
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

// Game won!
function powerPellet() {
    // TODO: Something if the power pellet is won
}

// Game won!
function gameWon() {
    // TODO: Game win functionality
}

// Game over
function gameOver() {
    // TODO: Game loss functionality
}

// Animates all movement
function animate(){
    requestAnimationFrame(animate);
    movePacman(pacmanDir);
    checkPellets(pacman);
    redraw();
}
