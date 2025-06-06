const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // lignes
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // colonnes
  [0, 4, 8],
  [2, 4, 6], // diagonales
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner() || currentPlayer !== "X") return;

  makeMove(index, "X");

  const winner = checkWinner();
  if (!winner) {
    currentPlayer = "O";
    statusText.textContent = `À ${currentPlayer} de jouer`;
    setTimeout(aiMove, 500); // Petit délai pour plus de réalisme
  }
}

function makeMove(index, player) {
  grid[index] = player;
  const cell = board.querySelector(`.cell[data-index='${index}']`);
  if (cell) {
    cell.textContent = player;
    cell.classList.add("taken");
  }

  const winner = checkWinner();
  if (winner) {
    statusText.textContent =
      winner === "Egalité" ? "Match nul !" : `Joueur ${winner} a gagné !`;
  } else if (player === "X") {
    currentPlayer = "O";
  } else {
    currentPlayer = "X";
    statusText.textContent = `À ${currentPlayer} de jouer`;
  }
}

function aiMove() {
  if (checkWinner()) return;

  const emptyIndices = grid
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
  if (emptyIndices.length === 0) return;

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  if (!statusText) return;
  statusText.textContent = "Joueur X commence";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);

createBoard();
