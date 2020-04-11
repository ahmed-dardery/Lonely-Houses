import Board from './modules/board.js';
import {colors} from './modules/utils.js';

document.addEventListener("DOMContentLoaded", initialization);

const gameState = {
    notStarted: 1,
    running: 2,
    stopped: 3
};

const CELL_COUNT = 9;

let myGameState;
let myBoard;
let canvas;
function initialization(){
    canvas = document.getElementById("gameCanvas");
    canvas.addEventListener("mousedown",function(event){
        onMouseClick(event);
    });
    canvas.addEventListener("mousemove",function(event){
        onMouseMove(event);
    });
    canvas.addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } );
    newGame();
    //setInterval(updateGame, 50);
}

function newGame() {
    myBoard = new Board(CELL_COUNT, [25, 25, 750, 750]);
    myGameState = gameState.running;
    updateGame();
}

function onMouseClick(e) {
    let cell_cursor = myBoard.getCellAt(e.clientX, e.clientY);

    if (myGameState === gameState.running && cell_cursor != null) {
        myBoard.triggerCell(cell_cursor, e.button === 2);
        updateGame();
    }
}

function onMouseMove(e) {
    if (myGameState === gameState.running)
        myBoard.highlighted = myBoard.getCellAt(e.clientX, e.clientY);
    updateGame();
}

function updateGame(){
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = colors.navyBlue;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    myBoard.drawBoard(ctx);
}
