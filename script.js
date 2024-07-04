// Select DOM elements
const alertModal = document.getElementById('alert-modal');
const alertMessage = document.getElementById('alert-message');
const alertCloseButton = document.querySelector('.alert-close-button');
const alertOkButton = document.getElementById('alert-ok-button');
const grid = document.getElementById('grid');
const resetButton = document.getElementById('reset-button');
const hintButton = document.getElementById('hint-button');
const instructionButton = document.getElementById('instruction-button');
const modal = document.getElementById('instruction-modal');
const closeButton = document.querySelector('.close-button');
const movesDisplay = document.getElementById('moves');
const hintsDisplay = document.getElementById('hints');
const timerDisplay = document.getElementById('timer');

let moves = 0;
let hintsUsed = 0;
let maxHints;
let timer;
let startTime;

// Define key codes
const RESTART_KEY = 'R';
const HINT_KEY = 'H';
const INSTRUCTION_KEYS = ['/', '?'];

const gridSize = 5;
let cells = [];

// Initialize and start the timer
function startTimer() {
    clearInterval(timer);
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
}

// Reset the timer display
function resetTimer() {
    clearInterval(timer);
    timerDisplay.textContent = '00:00';
}

// Create the grid
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
                startTimerIfNecessary();
            });
            grid.appendChild(cell);
            cells[i][j] = cell;
        }
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
    maxHints = Math.ceil(minimumMovesToSolve() / 2);
    hintsDisplay.textContent = `Hints used: ${hintsUsed} / ${maxHints}`;
}

// Start the timer if it's not already running
function startTimerIfNecessary() {
    if (!timer) {
        startTimer();
    }
}

// Toggle cells
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

// Toggle a single cell
function toggleCell(row, col) {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        cells[row][col].classList.toggle('on');
    }
}

// Check for win condition
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
        stopTimer();
        setTimeout(() => {
            showAlert(`You win! 🏆\n\nTotal Moves: ${moves}\nTotal Hints Used: ${hintsUsed}\nTotal Time: ${timerDisplay.textContent}`);
        }, 100);
    }
}

// Reset the game
function resetGame() {
    moves = 0;
    hintsUsed = 0;
    movesDisplay.textContent = `Moves: ${moves}`;
    maxHints = Math.ceil(minimumMovesToSolve() / 2);
    hintsDisplay.textContent = `Hints used: ${hintsUsed} / ${maxHints}`;
    cells.forEach(row => {
        row.forEach(cell => {
            cell.classList.remove('on');
            cell.classList.remove('hint');
        });
    });
    removeHint();
    resetTimer();
}

// Provide a hint
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
        startTimerIfNecessary();
    }
}

// Simulate a toggle to count lit cells
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

// Toggle a single cell in simulation
function toggleCellSim(tempCells, row, col) {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        tempCells[row][col] = !tempCells[row][col];
    }
}

// Highlight the hint cell
function highlightHint(row, col) {
    cells.forEach(row => row.forEach(cell => cell.classList.remove('hint')));
    cells[row][col].classList.add('hint');
}

// Remove hint highlight
function removeHint() {
    cells.forEach(row => row.forEach(cell => cell.classList.remove('hint')));
}

// Calculate minimum moves to solve the game
function minimumMovesToSolve() {
    return Math.ceil(gridSize * gridSize / 2);
}

// Show custom alert
function showAlert(message) {
    alertMessage.textContent = message;
    alertModal.style.display = 'block';
}

// Hide custom alert
function hideAlert() {
    alertModal.style.display = 'none';
}

// Event listeners for alert modal
alertCloseButton.addEventListener('click', hideAlert);
alertOkButton.addEventListener('click', hideAlert);
window.addEventListener('click', (event) => {
    if (event.target == alertModal) {
        hideAlert();
    }
});

// Add keydown event listener
window.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if (key === RESTART_KEY) {
        resetGame();
    } else if (key === HINT_KEY) {
        provideHint();
    } else if (INSTRUCTION_KEYS.includes(key)) {
        modal.style.display = 'block';
    }
});

// Initialize the grid
createGrid();
resetTimer();

// Event listeners
resetButton.addEventListener('click', () => {
    resetGame();
    resetTimer();
});
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
