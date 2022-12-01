/*
	Team: Trifecta
    CSCI 445 Web Programming
    Section B

	Evil Pacman
*/

// Initialization function
function start() {
    // Grab the game's canvas
    var game = document.getElementById("game");

    // Generate the maze using the game
    generateMaze(game);
}

// Generates the maze
// game = canvas in document
var pacman = document.createElement('img');
pacman.src = "sprites/sprite_pacmana1_2.png";
function generateMaze(game) {
    // Define maze as a matrix, where:
    // '.' = Normal Pellet
    // 'P' = Power Pellet
    // '!' = Poison Pellet
    // '#' = Wall
    // 'X' = Inaccessible
    // 'C' = Shortcut
    // ' ' = Empty Space
    // 'G' = Ghost Spawn
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
                ['#', '#', '#', '#', '#', '.', '#', '#', 'G', '#', '#', '.', '#', '#', '#', '#', '#'],
                ['C', ' ', ' ', ' ', ' ', '.', '#', 'G', 'G', 'G', '#', '.', ' ', ' ', ' ', ' ', 'C'],
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
                    context.drawImage(pacman, 0,0, 50, 50);
            }
        }
    }
}