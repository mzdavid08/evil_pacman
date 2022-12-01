/*
	Team: Trifecta
    CSCI 445 Web Programming
    Section B

	Evil Pacman
*/

// Create pacman and ghost elements
var pacman = new Image();
var blue = new Image();
var orange = new Image();
var pink = new Image();
var red = new Image();

// Define element images
pacman.src = "sprites/sprite_pacmana1_2.png";
blue.src = "sprites/ghostb1.png";
orange.src = "sprites/ghosto1.png";
pink.src = "sprites/ghostp1.png";
red.src = "sprites/ghostr1.png";

// Initialization function
function start() {
    // Grab the game's canvas
    var game = document.getElementById("game");

    // Generate the maze using the game
    generateMaze(game);
}

// Generates the maze
// game = canvas in document
function generateMaze(game) {
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
    var maze = [['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
                ['#', 'P', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '!', '#'],
                ['#', '.', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '.', '#'],
                ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#'],
                ['#', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['#', '#', '#', '#', '#', '.', '#', '.', '.', '.', '#', '.', '#', '#', '#', '#', '#'],
                ['X', 'X', 'X', 'X', '#', '.', '#', '#', '.', '#', '#', '.', '#', 'X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X', '#', '.', '#', '.', '.', '.', '#', '.', '#', 'X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X', '#', '.', '.', '.', '.', '.', '.', '.', '#', 'X', 'X', 'X', 'X'],
                ['#', '#', '#', '#', '#', '.', '#', '#', 'B', '#', '#', '.', '#', '#', '#', '#', '#'],
                ['C', ' ', ' ', ' ', ' ', '.', '#', 'O', 'M', 'R', '#', '.', ' ', ' ', ' ', ' ', 'C'],
                ['#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#', '#'],
                ['X', 'X', 'X', 'X', '#', '.', '.', '.', '.', '.', '.', '.', '#', 'X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X', '#', '.', '#', '.', '.', '.', '#', '.', '#', 'X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X', '#', '.', '#', '#', '.', '#', '#', '.', '#', 'X', 'X', 'X', 'X'],
                ['#', '#', '#', '#', '#', '.', '#', '.', '.', '.', '#', '.', '#', '#', '#', '#', '#'],
                ['#', '!', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', 'P', '#'],
                ['#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '.', '#'],
                ['#', '.', '.', '.', '.', '.', '.', '.', 'S', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['#', '.', '#', '#', '.', '#', '#', '.', '#', '.', '#', '#', '.', '#', '#', '.', '#'],
                ['#', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']];

    // Determine size of each maze element
    var height = game.height / maze.length;
    var width = game.width / maze[0].length;

    // Get the game's 2D context
    var context = game.getContext("2d");

    // Draw the maze
    for (let i = 0; i <= maze.length; i++) {
        for (let j = 0; j <= maze[i].length; j++) {
            switch (maze[i][j]) {
                case '#':
                    // Draw wall
                    context.fillStyle = "#0000FF";
                    context.fillRect(j * width, i * height, width, height);
                    break;
                case '.':
                    // Draw normal pellet
                    context.fillStyle = "white";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 12, width, height);
                    context.fill();
                    context.closePath();    
                    break;
                case 'P':
                    // Draw power pellet
                    context.fillStyle = "#F3AFF1";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 6, width, height);
                    context.fill();
                    context.closePath();    
                    break;
                case '!':
                    // Draw poison pellet
                    context.fillStyle = "#79EC74";
                    context.beginPath();
                    context.arc(j * width + (width / 2), i * height + (width / 2), height / 6, width, height);
                    context.fill();
                    context.closePath();    
                    break;
                case 'S':
                    // Spawn pacman                    
                    context.drawImage(pacman, j * width, i * height, height, height);
                    break;
                case 'B':
                    // Spawn pacman                    
                    context.drawImage(blue, j * width, i * height, height, height);
                    break;
                case 'O':
                    // Spawn pacman                    
                    context.drawImage(orange, j * width, i * height, height, height);
                    break;
                case 'M':
                    // Spawn pacman                    
                    context.drawImage(pink, j * width, i * height, height, height);
                    break;
                case 'R':
                    // Spawn pacman                    
                    context.drawImage(red, j * width, i * height, height, height);
                    break;
            }
        }
    }
}