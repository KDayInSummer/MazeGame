class GameController {
    constructor(renderer, timer) {
        this.renderer = renderer;
        this.timer = timer;
        this.maze = null;
        this.mazeGenerator = null;
        this.pathFinder = null;
        this.player = { x: 0, y: 0, trail: [] };
        this.start = { x: 0, y: 0 };
        this.end = { x: 0, y: 0 };
        this.hintPath = [];
        this.score = 0;
        this.status = 'idle';
        this.difficulty = 'medium';
        this.cellSize = 30;

        this.difficultyConfig = {
            easy: { rows: 10, cols: 15, cellSize: 40 },
            medium: { rows: 15, cols: 20, cellSize: 30 },
            hard: { rows: 20, cols: 30, cellSize: 25 }
        };

        this.onStatusChange = null;
        this.onScoreChange = null;
    }

    init(difficulty) {
        this.difficulty = difficulty || this.difficulty;
        const config = this.difficultyConfig[this.difficulty];
        this.cellSize = config.cellSize;

        this.mazeGenerator = new MazeGenerator(config.rows, config.cols);
        this.maze = this.mazeGenerator.generate();

        this.start = { x: 0, y: 0 };
        this.end = { x: config.cols - 1, y: config.rows - 1 };

        this.player = { x: 0, y: 0, trail: [{ x: 0, y: 0 }] };
        this.hintPath = [];
        this.score = 0;
        this.status = 'idle';

        this.pathFinder = new PathFinder(this.maze);

        const width = config.cols * this.cellSize;
        const height = config.rows * this.cellSize;
        this.renderer.setSize(width, height);

        this.render();
        this.updateStatus('准备开始');
        this.updateScore(0);
    }

    startGame() {
        if (this.status === 'playing') return;

        this.timer.reset();
        this.timer.start();
        this.status = 'playing';
        this.updateStatus('游戏中');
        this.updateScore(this.calculateScore());
    }

    pauseGame() {
        if (this.status !== 'playing') return;

        this.timer.stop();
        this.status = 'paused';
        this.updateStatus('已暂停');
    }

    resumeGame() {
        if (this.status !== 'paused') return;

        this.timer.start();
        this.status = 'playing';
        this.updateStatus('游戏中');
    }

    resetGame() {
        this.timer.reset();
        this.init(this.difficulty);
    }

    movePlayer(direction) {
        if (this.status !== 'playing') return;

        let newX = this.player.x;
        let newY = this.player.y;

        switch (direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

        if (this.canMove(newX, newY, direction)) {
            this.player.x = newX;
            this.player.y = newY;

            const pos = { x: newX, y: newY };
            const trailIndex = this.player.trail.findIndex(p => p.x === newX && p.y === newY);
            if (trailIndex !== -1) {
                this.player.trail = this.player.trail.slice(0, trailIndex + 1);
            } else {
                this.player.trail.push(pos);
            }

            this.render();
            this.updateScore(this.calculateScore());

            if (this.player.x === this.end.x && this.player.y === this.end.y) {
                this.win();
            }
        }
    }

    canMove(x, y, direction) {
        if (y < 0 || y >= this.maze.length || x < 0 || x >= this.maze[0].length) {
            return false;
        }

        const oppositeDir = {
            'up': 'bottom',
            'down': 'top',
            'left': 'right',
            'right': 'left'
        };

        const currentCell = this.maze[this.player.y][this.player.x];
        const targetCell = this.maze[y][x];
        
        return !currentCell[direction] && !targetCell[oppositeDir[direction]];
    }

    showHint() {
        if (this.status !== 'playing') return;

        const path = this.pathFinder.findPath(
            { x: this.player.x, y: this.player.y },
            { x: this.end.x, y: this.end.y }
        );

        if (path) {
            this.hintPath = path.slice(1);
            this.score = Math.max(0, this.score - 100);
            this.updateScore(this.score);
            this.render();

            setTimeout(() => {
                this.hintPath = [];
                this.render();
            }, 3000);
        }
    }

    win() {
        this.timer.stop();
        this.status = 'completed';
        this.updateStatus('通关！');
        this.updateScore(this.calculateScore());

        if (this.onWin) {
            this.onWin({
                time: this.timer.formatTime(this.timer.getTime()),
                score: this.score
            });
        }
    }

    calculateScore() {
        const baseScore = 1000;
        const timePenalty = this.timer.getTime();
        const difficultyBonus = {
            easy: 0,
            medium: 200,
            hard: 500
        };

        return Math.max(0, baseScore - timePenalty + difficultyBonus[this.difficulty]);
    }

    render() {
        this.renderer.clear();
        this.renderer.drawMaze(this.maze, this.cellSize);
        this.renderer.drawStart(this.start.x, this.start.y, this.cellSize);
        this.renderer.drawEnd(this.end.x, this.end.y, this.cellSize);
        
        if (this.player.trail.length > 1) {
            this.renderer.drawTrail(this.player.trail, this.cellSize);
        }
        
        if (this.hintPath.length > 0) {
            this.renderer.drawHint(this.hintPath, this.cellSize);
        }
        
        this.renderer.drawPlayer(this.player.x, this.player.y, this.cellSize);
    }

    updateStatus(status) {
        if (this.onStatusChange) {
            this.onStatusChange(status);
        }
    }

    updateScore(score) {
        if (this.onScoreChange) {
            this.onScoreChange(score);
        }
    }
}