let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let stats = {
    xWins: 0,
    oWins: 0,
    draws: 0
};

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const gameMessage = document.querySelector('.game-message');
const turnIndicator = document.querySelector('.current-player');

function loadStats() {
    const saved = localStorage.getItem('tictactoe-stats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

function saveStats() {
    localStorage.setItem('tictactoe-stats', JSON.stringify(stats));
}

function updateStatsDisplay() {
    document.getElementById('x-wins').textContent = stats.xWins;
    document.getElementById('o-wins').textContent = stats.oWins;
    document.getElementById('draws').textContent = stats.draws;
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase());

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCells = [];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = condition;
            break;
        }
    }

    if (roundWon) {
        gameMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameMessage.classList.add('winner');
        gameActive = false;
        
        winningCells.forEach(index => {
            cells[index].classList.add('winning');
        });

        if (currentPlayer === 'X') {
            stats.xWins++;
        } else {
            stats.oWins++;
        }
        saveStats();
        updateStatsDisplay();
        return;
    }

    if (!board.includes('')) {
        gameMessage.textContent = "It's a Draw! 🤝";
        gameMessage.classList.add('draw');
        gameActive = false;
        stats.draws++;
        saveStats();
        updateStatsDisplay();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent = currentPlayer;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameMessage.textContent = '';
    gameMessage.classList.remove('winner', 'draw');
    turnIndicator.textContent = 'X';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winning');
    });
}

function clearStats() {
    if (confirm('Are you sure you want to clear all statistics?')) {
        stats = { xWins: 0, oWins: 0, draws: 0 };
        localStorage.setItem('tictactoe-stats', JSON.stringify(stats));
        updateStatsDisplay();
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

loadStats();