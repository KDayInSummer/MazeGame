document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mazeCanvas');
    const difficultySelect = document.getElementById('difficulty');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const hintBtn = document.getElementById('hintBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const gameStatusDisplay = document.getElementById('gameStatus');
    const winModal = document.getElementById('winModal');
    const winTimeDisplay = document.getElementById('winTime');
    const winScoreDisplay = document.getElementById('winScore');
    const playAgainBtn = document.getElementById('playAgainBtn');

    const renderer = new Renderer(canvas);
    const timer = new Timer();
    const game = new GameController(renderer, timer);

    timer.onTick = (seconds) => {
        timerDisplay.textContent = timer.formatTime(seconds);
        game.updateScore(game.calculateScore());
    };

    game.onStatusChange = (status) => {
        gameStatusDisplay.textContent = status;
    };

    game.onScoreChange = (score) => {
        scoreDisplay.textContent = score;
    };

    game.onWin = (result) => {
        winTimeDisplay.textContent = result.time;
        winScoreDisplay.textContent = result.score;
        winModal.style.display = 'flex';
    };

    startBtn.addEventListener('click', () => {
        game.startGame();
    });

    pauseBtn.addEventListener('click', () => {
        if (game.status === 'playing') {
            game.pauseGame();
            pauseBtn.textContent = '继续';
        } else if (game.status === 'paused') {
            game.resumeGame();
            pauseBtn.textContent = '暂停';
        }
    });

    hintBtn.addEventListener('click', () => {
        game.showHint();
    });

    resetBtn.addEventListener('click', () => {
        pauseBtn.textContent = '暂停';
        winModal.style.display = 'none';
        game.resetGame();
    });

    difficultySelect.addEventListener('change', () => {
        pauseBtn.textContent = '暂停';
        winModal.style.display = 'none';
        game.init(difficultySelect.value);
    });

    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        pauseBtn.textContent = '暂停';
        game.init(difficultySelect.value);
    });

    document.addEventListener('keydown', (e) => {
        if (winModal.style.display === 'flex') return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                game.movePlayer('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                game.movePlayer('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                game.movePlayer('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                game.movePlayer('right');
                break;
            case ' ':
                e.preventDefault();
                if (game.status === 'playing') {
                    game.pauseGame();
                    pauseBtn.textContent = '继续';
                } else if (game.status === 'paused') {
                    game.resumeGame();
                    pauseBtn.textContent = '暂停';
                } else if (game.status === 'idle') {
                    game.startGame();
                }
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                pauseBtn.textContent = '暂停';
                game.resetGame();
                break;
        }
    });

    game.init('medium');
});