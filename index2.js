const doomWin = document.getElementById("doomguy-win");
const helloWin = document.getElementById("helloKitty-win");
const Moder = document.getElementById("copy");
const doomDeath = document.getElementById("Doom-death");
let standardbtn = document.getElementById("Standard");
let resetButton = document.getElementById("reset");
let player1Reset = document.getElementById("winreset1");
let player2Reset = document.getElementById("winreset2");

// Game settings
let playerRed = "R";
let playerYellow = "Y";
let currPlayer = playerRed;
let gameOver = false;
let board;
let rows = 6;
let columns = 7;
let currColumns = []; //keeps track of which row each column is at.

// Theme settings
const redPieces = document.getElementsByClassName("red-piece");
const yellowPieces = document.getElementsByClassName("yellow-piece");

doomDeath.addEventListener("click", function () {
  doomKittyf();
  doomDeath.innerText = "Standard Theme On";
  standardbtn.innerText = "Doom Kitty Theme";
});

function doomKittyf() {
  for (let i = 0; i < redPieces.length; i++) {
    const piece = redPieces[i];
    piece.classList.remove("red-piece");
    piece.classList.add("red-piece-doom");
  }

  for (let i = 0; i < yellowPieces.length; i++) {
    const piece = yellowPieces[i];
    piece.classList.remove("yellow-piece");
    piece.classList.add("yellow-piece-kitty");
  }
}

standardbtn.addEventListener("click", function () {
  standardTheme();
});

function standardTheme() {
  isDoomKittyTheme = false;
  const tiles = document.getElementsByClassName("tile");
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.classList.contains("red-piece-doom")) {
      tile.classList.remove("red-piece-doom");
      tile.classList.add("red-piece");
    } else if (tile.classList.contains("yellow-piece-kitty")) {
      tile.classList.remove("yellow-piece-kitty");
      tile.classList.add("yellow-piece");
    }
  }
  doomDeath.innerHTML = "Standard Theme";
}

//  Audio setup
const audio = new Audio("Audio/Per.wav");
const redAudio = new Audio("Audio/piece.mp3");
const yellowAudio = new Audio("Audio/piece.mp3");
let soundOff = document.getElementById("soundoff");
soundOff.addEventListener("click", function () {
  if (redAudio.muted === true) {
    redAudio.muted = false;
    yellowAudio.muted = false;
    soundOff.innerHTML = '<i class="fa-solid fa-volume-high"></i>Sound On';
  } else {
    redAudio.muted = true;
    yellowAudio.muted = true;
    soundOff.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>Toggle Sound';
  }
});

// Game load
window.onload = function () {
  setGame();
};

function setGame() {
  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      row.push(" ");
      // HTML
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
    board.push(row);
  }
}

let isDoomKittyTheme = false;

function setPiece() {
  if (gameOver) {
    return;
  }

  let coords = this.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  r = currColumns[c];

  if (r < 0) {
    return;
  }

  board[r][c] = currPlayer;
  let tile = document.getElementById(r.toString() + "-" + c.toString());

  // Doomkitty styles
  if (isDoomKittyTheme) {
    if (currPlayer === playerRed) {
      tile.classList.remove("yellow-piece", "yellow-piece-kitty");
      tile.classList.add("red-piece-doom");
    } else {
      tile.classList.remove("red-piece", "red-piece-doom");
      tile.classList.add("yellow-piece-kitty");
    }
  } else {
    tile.classList.remove("red-piece-doom", "yellow-piece-kitty");
    if (currPlayer === playerRed) {
      tile.classList.add("red-piece");
    } else {
      tile.classList.add("yellow-piece");
    }
  }

  //Audio and header text
  if (currPlayer === playerRed) {
    currPlayer = playerYellow;
    yellowAudio.play();
    Moder.innerText = "Player One's Turn";
  } else {
    currPlayer = playerRed;
    redAudio.play();
    Moder.innerText = "Player Two's Turn";
  }

  r -= 1;
  currColumns[c] = r;

  checkWinner();
}

function doomKittyf() {
  isDoomKittyTheme = true;
  const tiles = document.getElementsByClassName("tile");
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.classList.contains("red-piece")) {
      tile.classList.remove("red-piece");
      tile.classList.add("red-piece-doom");
    } else if (tile.classList.contains("yellow-piece")) {
      tile.classList.remove("yellow-piece");
      tile.classList.add("yellow-piece-kitty");
    }
  }
}

function checkWinner() {
  // horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r][c + 1] && // The variables r and c represent the row and column indices in the grid, allowing access to specific cells for comparisons and operations.
          board[r][c + 1] == board[r][c + 2] &&
          board[r][c + 2] == board[r][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // vertical
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c] &&
          board[r + 1][c] == board[r + 2][c] &&
          board[r + 2][c] == board[r + 3][c]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // anti diagonal
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c + 1] && //confused how diagonal works
          board[r + 1][c + 1] == board[r + 2][c + 2] &&
          board[r + 2][c + 2] == board[r + 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // diagonal
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r - 1][c + 1] &&
          board[r - 1][c + 1] == board[r - 2][c + 2] &&
          board[r - 2][c + 2] == board[r - 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
}

function setWinner(r, c) {
  let winner = document.getElementById("winner");
  if (board[r][c] == playerRed) {
    doomWin.style.display = "flex";
    console.log("working");
  } else {
    helloWin.style.display = "flex";
  }
  gameOver = true;
}

//reset functions
function resetGame() {
  // Remove all the pieces from the board
  const tiles = document.getElementsByClassName("tile");
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.classList.remove("red-piece");
    tile.classList.remove("yellow-piece");
    tile.classList.remove("red-piece-doom");
    tile.classList.remove("yellow-piece-kitty");
  }

  // Reset game variables and display
  currPlayer = playerRed;
  gameOver = false;
  doomWin.style.display = "none";
  helloWin.style.display = "none";
  Moder.innerText = "Game Start";

  // Clear the board array
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c] = " ";
    }
  }

  // Reset column heights
  currColumns = [5, 5, 5, 5, 5, 5, 5];
}

// Reset buttons calling

resetButton.addEventListener("click", function () {
  resetGame();
});

player1Reset.addEventListener("click", function () {
  resetGame();
});

player2Reset.addEventListener("click", function () {
  resetGame();
});
