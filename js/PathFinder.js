class PathFinder {
    constructor(maze) {
        this.maze = maze;
    }

    findPath(start, end) {
        const openList = [start];
        const closedList = [];
        const cameFrom = {};
        const gScore = {};
        const fScore = {};

        const startKey = `${start.x},${start.y}`;
        gScore[startKey] = 0;
        fScore[startKey] = this.heuristic(start, end);

        while (openList.length > 0) {
            const current = this.getLowestFScore(openList, fScore);
            const currentKey = `${current.x},${current.y}`;

            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(cameFrom, current);
            }

            this.removeFromList(openList, current);
            closedList.push(current);

            for (const neighbor of this.getNeighbors(current)) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                
                if (this.contains(closedList, neighbor)) continue;

                const tentativeG = gScore[currentKey] + 1;

                if (!this.contains(openList, neighbor)) {
                    openList.push(neighbor);
                } else if (tentativeG >= (gScore[neighborKey] || Infinity)) {
                    continue;
                }

                cameFrom[neighborKey] = current;
                gScore[neighborKey] = tentativeG;
                fScore[neighborKey] = tentativeG + this.heuristic(neighbor, end);
            }
        }
        return null;
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    getLowestFScore(list, fScore) {
        let lowest = list[0];
        let lowestScore = fScore[`${lowest.x},${lowest.y}`] || Infinity;

        for (const item of list) {
            const score = fScore[`${item.x},${item.y}`] || Infinity;
            if (score < lowestScore) {
                lowest = item;
                lowestScore = score;
            }
        }
        return lowest;
    }

    removeFromList(list, item) {
        const index = list.findIndex(i => i.x === item.x && i.y === item.y);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    contains(list, item) {
        return list.some(i => i.x === item.x && i.y === item.y);
    }

    getNeighbors(cell) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        for (const dir of directions) {
            const newX = cell.x + dir.dx;
            const newY = cell.y + dir.dy;

            if (this.isValidMove(cell.x, cell.y, dir)) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        return neighbors;
    }

    isValidMove(x, y, direction) {
        if (y < 0 || y >= this.maze.length || x < 0 || x >= this.maze[0].length) {
            return false;
        }

        const cell = this.maze[y][x];
        let wallKey;

        if (direction.dx === 0 && direction.dy === -1) wallKey = 'top';
        else if (direction.dx === 0 && direction.dy === 1) wallKey = 'bottom';
        else if (direction.dx === -1 && direction.dy === 0) wallKey = 'left';
        else if (direction.dx === 1 && direction.dy === 0) wallKey = 'right';

        return !cell[wallKey];
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let key = `${current.x},${current.y}`;

        while (cameFrom[key]) {
            current = cameFrom[key];
            path.unshift(current);
            key = `${current.x},${current.y}`;
        }

        return path;
    }
}