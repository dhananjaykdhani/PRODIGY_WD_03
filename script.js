const board = document.getElementById("board");
const message = document.getElementById("message");
const modeSelect = document.getElementById("mode");

let cells = [];
let currentPlayer = "X";
let gameOver = false;
let mode = "friend";

modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  restartGame();
});

function createBoard() {
  board.innerHTML = "";
  cells = [];
  gameOver = false;
  currentPlayer = "X";
  message.textContent = `${currentPlayer} Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => makeMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function makeMove(index) {
  if (cells[index].textContent || gameOver) return;

  cells[index].textContent = currentPlayer;
  if (checkWinner()) {
    message.textContent = `${currentPlayer} Wins!`;
    gameOver = true;
    return;
  }

  if (isDraw()) {
    message.textContent = "It's a Draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `${currentPlayer} Turn`;

  if (mode !== "friend" && currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  let index;
  switch (mode) {
    case "easy":
      index = easyAI();
      break;
    case "medium":
      index = mediumAI();
      break;
    case "impossible":
      index = bestMove();
      break;
  }
  if (index !== undefined) makeMove(index);
}

function easyAI() {
  const empty = cells.map((c, i) => (!c.textContent ? i : null)).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumAI() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = "O";
      if (checkWinner()) {
        cells[i].textContent = "";
        return i;
      }
      cells[i].textContent = "";
    }
  }
  // Block opponent
  for (let i = 0; i < 9; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = "X";
      if (checkWinner()) {
        cells[i].textContent = "";
        return i;
      }
      cells[i].textContent = "";
    }
  }
  return easyAI();
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = "O";
      let score = minimax(0, false);
      cells[i].textContent = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(depth, isMaximizing) {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (isDraw()) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 9; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = isMaximizing ? "O" : "X";
      let score = minimax(depth + 1, !isMaximizing);
      cells[i].textContent = "";
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function checkWinner(player = currentPlayer) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => cells[i].textContent === player)
  );
}

function isDraw() {
  return cells.every(cell => cell.textContent);
}

function restartGame() {
  createBoard();
}

createBoard();
