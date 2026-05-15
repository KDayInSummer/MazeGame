class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = {
            wall: '#2c3e50',
            path: '#ecf0f1',
            start: '#27ae60',
            end: '#e74c3c',
            player: '#3498db',
            hint: '#f1c40f',
            trail: 'rgba(149, 165, 166, 0.5)'
        };
    }

    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    drawMaze(maze, cellSize) {
        const ctx = this.ctx;
        const rows = maze.length;
        const cols = maze[0].length;

        ctx.fillStyle = this.colors.path;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.strokeStyle = this.colors.wall;
        ctx.lineWidth = 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * cellSize;
                const y = row * cellSize;
                const cell = maze[row][col];

                if (cell.top) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + cellSize, y);
                    ctx.stroke();
                }
                if (cell.right) {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
                if (cell.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y + cellSize);
                    ctx.lineTo(x, y + cellSize);
                    ctx.stroke();
                }
                if (cell.left) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
    }

    drawStart(startX, startY, cellSize) {
        const ctx = this.ctx;
        const x = startX * cellSize + cellSize / 2;
        const y = startY * cellSize + cellSize / 2;
        const radius = cellSize / 3;

        ctx.fillStyle = this.colors.start;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = `${cellSize / 3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', x, y);
    }

    drawEnd(endX, endY, cellSize) {
        const ctx = this.ctx;
        const x = endX * cellSize + cellSize / 2;
        const y = endY * cellSize + cellSize / 2;
        const radius = cellSize / 3;

        ctx.fillStyle = this.colors.end;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = `${cellSize / 3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('E', x, y);
    }

    drawPlayer(playerX, playerY, cellSize) {
        const ctx = this.ctx;
        const x = playerX * cellSize + cellSize / 2;
        const y = playerY * cellSize + cellSize / 2;
        const radius = cellSize / 3.5;

        ctx.fillStyle = this.colors.player;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawTrail(trail, cellSize) {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.trail;

        for (const pos of trail) {
            const x = pos.x * cellSize + cellSize / 4;
            const y = pos.y * cellSize + cellSize / 4;
            ctx.fillRect(x, y, cellSize / 2, cellSize / 2);
        }
    }

    drawHint(path, cellSize) {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.hint;

        for (const pos of path) {
            const x = pos.x * cellSize + cellSize / 4;
            const y = pos.y * cellSize + cellSize / 4;
            ctx.fillRect(x, y, cellSize / 2, cellSize / 2);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}