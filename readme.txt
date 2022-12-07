CSCI 445 Web Programming
Section B

Team Name: Trifecta

Team Member Names: Cammie Olsgard, David Meraz, Thomas Graham

Game Name: Evil Pacman

Description: A twist on the famous game Pacman where the lights are out, meaning you can only see so far in front of you thanks to a flashlight that Pac-Man has for these situations. Making the game more evil is the inclusion of poison dots, which look almost exactly like power dots except in color and effect, as they instantly kill you rather than allow you to devour ghosts.

Justification: Our game is worth 100% of the rubric because it is sufficiently well-structured and complex. Our images, which are our game sprites, are organized into a folder named "sprites" to reflect their purpose. We also have the required thumbnail file, which accounts for those five points. Our CSS and JavaScript code are kept in their appropriate files, with the exception of our HTML5 canvas which has CSS defined in our index HTML, which is justified as this is required to obtain the dimensions of an HTML5 canvas. In addition, our code has made Evil Pacman visually appealing, as shown by our complex maze drawing as opposed to simply drawing rectangles onto our canvas. Thanks to our various game state variables and checks, errors are handled before they can even occur, rendering our game bug-free.

Pacman itself is a relatively complex game to write for a group of three, requiring us to keep track of how many pellets have been eaten for scoring purposes in addition to special pellet functionality, design a navigable maze with bound checks, animate Pacman and the ghosts, and write some sort of an AI for ghosts to kill Pacman. Our evil twist on Pacman is just a little more complex, as it also requires us to write a flashlight that follows Pacman around the maze, and it is through this functionality that Evil Pacman distinguishes itself fron normal Pacman. This field of view constraint creates yet another reason for the player to want to avoid losing, which, in addition to our scoring mechanism, gives the player a motivating factor to win the game.