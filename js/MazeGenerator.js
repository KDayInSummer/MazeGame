class MazeGenerator {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.maze = [];
    }

    generate() {
        this.initMaze();
        this.recursiveBacktrack(0, 0);
        return this.maze;
    }

    initMaze() {
        for (let r = 0; r < this.rows; r++) {
            this.maze[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.maze[r][c] = {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    visited: false
                };
            }
        }
    }

    recursiveBacktrack(row, col) {
        this.maze[row][col].visited = true;
        const directions = this.getRandomDirections();

        for (const dir of directions) {
            const [newRow, newCol] = this.getNeighbor(row, col, dir);

            if (this.isValidCell(newRow, newCol) && !this.maze[newRow][newCol].visited) {
                this.removeWall(row, col, dir);
                this.recursiveBacktrack(newRow, newCol);
            }
        }
    }

    getRandomDirections() {
        const directions = ['top', 'right', 'bottom', 'left'];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }

    getNeighbor(row, col, direction) {
        switch (direction) {
            case 'top': return [row - 1, col];
            case 'right': return [row, col + 1];
            case 'bottom': return [row + 1, col];
            case 'left': return [row, col - 1];
            default: return [row, col];
        }
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    removeWall(row, col, direction) {
        const oppositeDir = {
            'top': 'bottom',
            'right': 'left',
            'bottom': 'top',
            'left': 'right'
        };

        this.maze[row][col][direction] = false;
        const [newRow, newCol] = this.getNeighbor(row, col, direction);
        if (this.isValidCell(newRow, newCol)) {
            this.maze[newRow][newCol][oppositeDir[direction]] = false;
        }
    }

    canMove(row, col, direction) {
        if (!this.isValidCell(row, col)) return false;
        return !this.maze[row][col][direction];
    }
}