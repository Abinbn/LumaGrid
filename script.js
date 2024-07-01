const alertModal = document.getElementById('alert-modal');
const alertMessage = document.getElementById('alert-message');
const alertCloseButton = document.querySelector('.alert-close-button');
const alertOkButton = document.getElementById('alert-ok-button');

// script.js
const grid = document.getElementById('grid');
const resetButton = document.getElementById('reset-button');
const hintButton = document.getElementById('hint-button');
const instructionButton = document.getElementById('instruction-button');
const modal = document.getElementById('instruction-modal');
const closeButton = document.querySelector('.close-button');
const movesDisplay = document.getElementById('moves');
const hintsDisplay = document.getElementById('hints');
let moves = 0;
let hintsUsed = 0;
let maxHints;

const gridSize = 5;
let cells = [];

function createGrid() {
    for (let i = 0; i < gridSize; i++) {
        cells[i] = [];
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => {
                toggleCells(i, j);
                removeHint();
            });
            grid.appendChild(cell);
            cells[i][j] = cell;
        }
    }
    maxHints = Math.ceil(minimumMovesToSolve() / 2);
    hintsDisplay.textContent = `Hints used: ${hintsUsed} / ${maxHints}`;
}

function toggleCells(row, col) {
    toggleCell(row, col);
    toggleCell(row - 1, col);
    toggleCell(row + 1, col);
    toggleCell(row, col - 1);
    toggleCell(row, col + 1);
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    checkWin();
}

function toggleCell(row, col) {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        cells[row][col].classList.toggle('on');
    }
}

function checkWin() {
    let allOn = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!cells[i][j].classList.contains('on')) {
                allOn = false;
                break;
            }
        }
    }
    if (allOn) {
        setTimeout(() => {
            alert(`You win! Total moves: ${moves}`);
        }, 100);
    }
}

function resetGame() {
    moves = 0;
    hintsUsed = 0;
    movesDisplay.textContent = `Moves: ${moves}`;
    maxHints = Math.ceil(minimumMovesToSolve() / 2); // Update maxHints here
    hintsDisplay.textContent = `Hints used: ${hintsUsed} / ${maxHints}`;
    cells.forEach(row => {
        row.forEach(cell => {
            cell.classList.remove('on');
            cell.classList.remove('hint');
        });
    });
    removeHint();
}


        // Function to show custom alert
function showAlert(message) {
    alertMessage.textContent = message;
    alertModal.style.display = 'block';
}

// Function to hide custom alert
function hideAlert() {
    alertModal.style.display = 'none';
}

// Event listeners to close alert modal
alertCloseButton.addEventListener('click', hideAlert);
alertOkButton.addEventListener('click', hideAlert);
window.addEventListener('click', (event) => {
    if (event.target == alertModal) {
        hideAlert();
    }
});

// Example usage of showAlert
function checkWin() {
    let allOn = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!cells[i][j].classList.contains('on')) {
                allOn = false;
                break;
            }
        }
    }
    if (allOn) {
        setTimeout(() => {
            showAlert(`You win! Total moves: ${moves}`);
        }, 100);
    }
}

function provideHint() {
    if (hintsUsed >= maxHints) {
        showAlert('No more hints available!');
        return;
    }

    let bestMove = null;
    let maxLitCells = -1;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const litCellsCount = simulateToggle(i, j);
            if (litCellsCount > maxLitCells) {
                maxLitCells = litCellsCount;
                bestMove = { row: i, col: j };
            }
        }
    }

    if (bestMove) {
        highlightHint(bestMove.row, bestMove.col);
        hintsUsed++;
        hintsDisplay.textContent = `Hints used: ${hintsUsed} / ${maxHints}`;
    }
}

function simulateToggle(row, col) {
    const tempCells = cells.map(row => row.map(cell => cell.classList.contains('on')));
    toggleCellSim(tempCells, row, col);
    toggleCellSim(tempCells, row - 1, col);
    toggleCellSim(tempCells, row + 1, col);
    toggleCellSim(tempCells, row, col - 1);
    toggleCellSim(tempCells, row, col + 1);

    let litCellsCount = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (tempCells[i][j]) {
                litCellsCount++;
            }
        }
    }
    return litCellsCount;
}


function toggleCellSim(tempCells, row, col) {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        tempCells[row][col] = !tempCells[row][col];
    }
}

function highlightHint(row, col) {
    cells.forEach(row => row.forEach(cell => cell.classList.remove('hint')));
    cells[row][col].classList.add('hint');
}

function removeHint() {
    cells.forEach(row => row.forEach(cell => cell.classList.remove('hint')));
}


function minimumMovesToSolve() {
    return Math.ceil(gridSize * gridSize / 2);
}


resetButton.addEventListener('click', resetGame);
hintButton.addEventListener('click', provideHint);
instructionButton.addEventListener('click', () => {
    modal.style.display = 'block';
});
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

createGrid();
