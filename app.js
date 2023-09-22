var width = 400;
var height = 400;
var padding = 10;
var container = document.getElementById("grid");
var context = container.getContext("2d");
var restartButton = '';
var over = 0;

// Score
var score = 0;
updateScore();

var grid = []
grid.push([0, 0, 0, 0])
grid.push([0, 0, 0, 0])
grid.push([0, 0, 0, 0])
grid.push([0, 0, 0, 0])
var oldGrid = copyGrid(grid);

// misc function
function getLength(number) { 
    return number.toString().length;
}
function updateScore(){
    var scoreNum = "Score: " + score.toString();
    document.getElementById("score").textContent=scoreNum;
}
function copyGrid(grid){
    var gridCopy = []
    gridCopy.push([0, 0, 0, 0])
    gridCopy.push([0, 0, 0, 0])
    gridCopy.push([0, 0, 0, 0])
    gridCopy.push([0, 0, 0, 0])

    for (var y = 0; y < grid.length; y++){
        for (var x = 0; x < grid[0].length; x++){
            gridCopy[y][x] = grid[y][x];
        }
    }
    return gridCopy;
}
function gridEquality(grid1, grid2){
    for (var y = 0; y < grid1.length; y++){
        for (var x = 0; x < grid1[0].length; x++){
            if (grid1[y][x] != grid2[y][x]){
                return false;
            }
        }
    }
    return true;
}

// Grid function
function drawBoard() {
    console.log('Drawing board...');
    console.log("Score: " + score);
    context.clearRect(0, 0, width, height); 
  
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        var cellValue = grid[i][j];
        var x = j * (width / grid[i].length) + 20; 
        var y = i * (height / grid.length) + 30; 
        var aValue = 1 / (1 + Math.exp(-cellValue));
        context.fillStyle = "rgb(238, 199, 15" + aValue.toString();
        context.fillRect(x, y, width / grid[i].length - 2 * padding, height / grid.length - 2 * padding);
  
        margin = getLength(cellValue) * 5;
        context.font = "bold 30px Open Sans";
        context.fillStyle = "black"; 
        if (cellValue !== 0){
            context.fillText(cellValue, (x + 35) - margin, y + 50); 
        }
      }
    }
  }

// Game functions
/*
All of the basically start by iterating over the grid in their respective "direction"
Rows/columns iterate only up to the second last one to prevent going out of bounds
First you find a cell which isn't 0 and then proceed to check every succeeding cell in its respective direction
If the next cell is 0 (empty), then move it over to that empty cell
Else if the next cell is the same as the current cell, combine the two
Else, go back and check every other cell in the grid
*/

function moveUp(){
    oldGrid = copyGrid(grid);
    console.log('Moving up...');
    for (var i = 3; i > -1; i--) {
        for (var j = 0; j < 4; j++) {
            if (grid[j][i] !== 0) { 
                var y = j - 1; // move up

                while (y > -1) {
                    if (grid[y][i] === 0) { 
                        
                        grid[y][i] = grid[y + 1][i];
                        grid[y + 1][i] = 0;
                        y--;
                    } 
                    else if (grid[y][i] === grid[y + 1][i]) { // if the next cell has the same value, double
                        grid[y][i] *= 2;
                        score += grid[y][i];
                        updateScore();
                        grid[y + 1][i] = 0;
                    } 
                    else {
                        break; 
                    }
                }
            }
        }
    }
}

function moveDown() {
    oldGrid = copyGrid(grid);
    console.log('Moving down...');
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {  // start from the second-to-last row and move up
            if (grid[j][i] !== 0) { 
                var y = j + 1; // Move down

                while (y < 4) {
                    if (grid[y][i] === 0) { // if the next  cell is empty, move the tile there
                        grid[y][i] = grid[y - 1][i];
                        grid[y - 1][i] = 0;
                        y++;
                    } else if (grid[y][i] === grid[y - 1][i]) { // if the target cell has the same value, double
                        grid[y][i] *= 2;
                        score += grid[y][i];
                        updateScore();
                        grid[y - 1][i] = 0;
                        break; 
                    } else {
                        break; 
                    }
                }
            }
        }
    }
}

function moveLeft(){
    oldGrid = copyGrid(grid);
    console.log('Moving left...');
    for (var i = 0; i < 4; i++) { 
        for (var j = 3; j > -1; j--) { // row
            if (grid[j][i] !== 0) { 
                var x = i - 1; // move to the left

                while (x > -1) {
                    drawBoard();
                    if (grid[j][x] === 0) { 
                        
                        grid[j][x] = grid[j][x + 1];
                        grid[j][x + 1] = 0;
                        x--;
                    } else if (grid[j][x] === grid[j][x + 1]) {
                        grid[j][x] *= 2;
                        score += grid[j][x];
                        updateScore();
                        grid[j][x + 1] = 0;

                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function moveRight() {
    oldGrid = copyGrid(grid);
    console.log('Moving right...');
    for (var i = 0; i < 4; i++) {
        for (var j = 3; j >= 0; j--) {
            if (grid[i][j] !== 0) {
                var x = j;
                
                while (x < 3) {
                    if (grid[i][x + 1] === 0) { 
                        grid[i][x + 1] = grid[i][x];
                        grid[i][x] = 0;
                        x++;
                    } else if (grid[i][x + 1] === grid[i][x]) { 
                        grid[i][x + 1] *= 2;
                        score += grid[i][x + 1];
                        updateScore();
                        grid[i][x] = 0;
                        break; 
                    } else {
                        break; 
                    }
                }
            }
        }
    }
    updateScore();
}

function newTile(){ // could definitely be more efficient
    console.log('New tile...');
    var containsZero = false;
    for (var y = 0; y < grid.length; y++){
        for (var x = 0; x < grid[0].length; x++){
            if (grid[y][x] === 0){
                containsZero = true;
            }
        }
    }

    if (containsZero){
        while (true){
            x = Math.floor(Math.random() * 4);
            y = Math.floor(Math.random() * 4);
    
            if (grid[x][y] == 0){
                if (Math.random() > 0.5){
                    grid[x][y] = 2;
                }
                else{
                    grid[x][y] = 4;
                }
                break;
            }
        }    
    }
}

function isGameOver(){ 
    /*
    Not working properly
    */

    // check if grid is full
    if (!grid.includes(0)){
        for (var y = 0; y < grid.length; y++){
            for (var x = 0; x < grid[0].length - 1; x++){ 
                // check if any tiles can be combined horizontally
                if (grid[y][x] === grid[y][x + 1]){
                    return false;
                }
            }
        }    

        for (var y = 0; y < grid.length - 1; y++){
            for (var x = 0; x < grid[0].length; x++){
                // check if any tiles can be combined vertically
                if (grid[y][x] === grid[y + 1][x]){
                    return false;
                }
            }
        }    
    }
    else{
        return false;
    }
    over++;
    if (over <= 1){
        restartButton = document.createElement("button");
    
        restartButton.textContent = "Restart?"
        restartButton.style.font = "'Open Sans', sans-serif"; // sans-serif here is the backup font
        restartButton.style.marginLeft = "50px";
        restartButton.style.marginTop = "50px";
        restartButton.addEventListener("click", restart);
        document.body.appendChild(restartButton);
        context.filter = 'blur(10px)'; // blur effect doesn't fit properly??
        drawBoard();
    }

    return true;
}
function restart(){
    score = 0;
    for (var y = 0; y < grid.length; y++){
        for (var x = 0; x < grid[0].length; x++){
            grid[y][x] = 0;
        }
    }
    context.filter = 'blur(0px)';
    restartButton.remove();
    newTile();
    newTile();
    updateScore();
    drawBoard();
}

// Game 
newTile();
newTile();

function handleKeyDown(event) {
    console.log(over);
    if (event.key == "ArrowLeft") {
        if (!isGameOver()){
            moveLeft();
            drawBoard();
            if (!gridEquality(oldGrid, grid)){
                newTile();
            }
            drawBoard();    
        }
    }
    else if (event.key == "ArrowRight") {
        if (!isGameOver()){
            moveRight();
            drawBoard();
            if (!gridEquality(oldGrid, grid)){
                newTile();
            }
            drawBoard();    
        }
    }
    else if (event.key == "ArrowUp") {
        if (!isGameOver()){
            moveUp();
            drawBoard();
            if (!gridEquality(oldGrid, grid)){
                newTile();
            }
            drawBoard();    
        }
    }

    else if (event.key == "ArrowDown") {
        if (!isGameOver()){
            moveDown();
            drawBoard();
            if (!gridEquality(oldGrid, grid)){
                newTile();
            }
            drawBoard();    
        }
    }
}

// Add event listener for keydown events
window.addEventListener('keydown', handleKeyDown);

drawBoard();
