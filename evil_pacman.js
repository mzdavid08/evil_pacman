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
var game;
var maze;
var width;
var height;
var context;
var score;
var numPellets = 0;
var walls = new Set();

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

    // Draw the maze
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            switch (maze[i][j]) {
                case '#':
                    // Draw wall
                    context.fillStyle = "#0000FF";
                    context.fillRect(j * width, i * height, width, height);
                    walls.add([j * width, i * height]); // Add the wall coordinates to the set of walls
                    break;
                case '.':
                    // Draw normal pellet
                    context.fillStyle = "#ffe2db";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 14, width, height * 2);
                    context.fill();
                    context.closePath();
                    numPellets++; // Increment the total number of pellets
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
                case 'S':
                    // Spawn pacman
                    pacman = new Pacman(i, j, width, height);
                    maze[i][j] = ' ';
                    break;
                case 'B':
                    // Spawn blue ghost
                    blue = new Ghost("Blue", i, j, width, height, 'U');
                    maze[i][j] = ' ';
                    break;
                case 'O':
                    // Spawn orange ghost
                    orange = new Ghost("Orange", i, j, width, height, 'R');
                    maze[i][j] = ' ';
                    break;
                case 'M':
                    // Spawn pink ghost
                    pink = new Ghost("Pink", i, j, width, height, 'U');
                    maze[i][j] = ' ';
                    break;
                case 'R':
                    // Spawn red ghost
                    red = new Ghost("Red", i, j, width, height, 'L');
                    maze[i][j] = ' ';
                    break;
            }
        }
    }
}

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
                    pelletsLeft++; // Keep track of remaining pellets
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

    // Calculate score and determine if the game is won
    score = numPellets - pelletsLeft;
    if (pelletsLeft == 0) {
        // TODO: Game win behavior
        alert("Congrats! You've won Evil Pac-Man!");
    }

    // Spawn all elements
    context.drawImage(pacman_img, pacman.xCanvas, pacman.yCanvas, pacman.width, pacman.height);
    context.drawImage(blue_img, blue.xCanvas, blue.yCanvas, height, height);
    context.drawImage(orange_img, orange.xCanvas, orange.yCanvas, height, height);
    context.drawImage(pink_img, pink.xCanvas, pink.yCanvas, height, height);
    context.drawImage(red_img, red.xCanvas, red.yCanvas, height, height);
}
