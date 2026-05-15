# MazeGame
基于 Web 技术的交互式迷宫游戏，玩家需要从起点出发，在规定时间内找到通往终点的路径。游戏支持多种难度级别和迷宫生成算法，提供流畅的视觉体验和丰富的交互功能

## 1. 需求分析

### 1.1 游戏概述
本项目是一个基于 Web 技术的交互式迷宫游戏，玩家需要从起点出发，在规定时间内找到通往终点的路径。游戏支持多种难度级别和迷宫生成算法，提供流畅的视觉体验和丰富的交互功能。

### 1.2 目标用户
- **核心用户**: 休闲游戏爱好者（年龄 8-60 岁）
- **次要用户**: 编程学习者（可作为算法学习案例）

### 1.3 功能需求

| 需求编号 | 功能描述 | 需求来源 |
| :--- | :--- | :--- |
| FR-001 | 迷宫随机生成 | 搜索结果[1][2][3] |
| FR-002 | 玩家键盘控制移动 | 搜索结果[1][3] |
| FR-003 | 碰撞检测 | 搜索结果[3] |
| FR-004 | 计时系统 | 搜索结果[4] |
| FR-005 | 难度选择 | 搜索结果[3][4] |
| FR-006 | 路径提示（A*算法） | 搜索结果[3] |
| FR-007 | 游戏状态管理（开始/暂停/结束） | 搜索结果[1][4] |
| FR-008 | 响应式布局 | 搜索结果[1] |

### 1.4 非功能需求
- 支持现代浏览器（Chrome、Firefox、Safari）
- 游戏帧率 ≥ 60 FPS
- 迷宫生成时间 < 1 秒（中等难度）

---

## 2. 技术选型

### 2.1 前端技术栈

| 分类 | 技术 | 版本 | 选型理由 |
| :--- | :--- | :--- | :--- |
| 结构 | HTML5 | 最新 | 标准 Web 页面结构 |
| 样式 | CSS3 | 最新 | 支持动画和响应式设计 |
| 逻辑 | JavaScript (ES6+) | 最新 | 原生实现，无需依赖框架 |
| 图形 | HTML5 Canvas | 最新 | 高性能图形绘制，适合游戏场景 |

### 2.2 核心算法

| 算法类型 | 算法名称 | 用途 | 选择理由 |
| :--- | :--- | :--- | :--- |
| 迷宫生成 | 递归回溯法 | 生成迷宫路径 | 实现简单，生成路径较长，游戏性强 |
| 迷宫生成 | Prim 算法 | 生成迷宫路径 | 分支较多，迷宫更自然 |
| 路径寻路 | A* 算法 | 自动寻路提示 | 高效最短路径搜索 |

---

## 3. 架构设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     浏览器环境                              │
├─────────────────────────────────────────────────────────────┤
│                    UI层 (View)                              │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Canvas  │ │ 控制面板 │ │ 状态显示 │ │ 游戏菜单     │   │
│  │ 画布    │ │ Control  │ │ Status   │ │ Menu         │   │
│  └─────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    业务逻辑层 (Controller)                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │ GameController  │ │ MazeGenerator   │ │ PathFinder    │ │
│  │ 游戏状态管理    │ │ 迷宫生成器      │ │ 路径寻找器    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    数据模型层 (Model)                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Maze    │ │ Player   │ │ GameState│ │ Config       │   │
│  │ 迷宫数据 │ │ 玩家数据 │ │ 游戏状态 │ │ 配置参数     │   │
│  └─────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 模块职责

| 模块 | 职责 | 关键方法 |
| :--- | :--- | :--- |
| **GameController** | 游戏状态管理、用户输入处理、游戏循环 | `start()`, `pause()`, `reset()`, `update()` |
| **MazeGenerator** | 迷宫生成算法实现 | `generate()`, `recursiveBacktrack()`, `prim()` |
| **PathFinder** | 路径寻找算法（A*） | `findPath()`, `aStar()` |
| **Renderer** | Canvas 绘制 | `drawMaze()`, `drawPlayer()`, `drawPath()` |
| **Timer** | 计时系统 | `start()`, `stop()`, `reset()`, `getTime()` |

### 3.3 核心数据结构

#### 3.3.1 迷宫数据结构

```javascript
// 二维数组表示迷宫
// 0 = 通路, 1 = 墙壁, 2 = 起点, 3 = 终点
maze[row][col] = {
    top: boolean,     // 顶部墙壁
    right: boolean,   // 右侧墙壁
    bottom: boolean,  // 底部墙壁
    left: boolean,    // 左侧墙壁
    visited: boolean  // 是否已访问（生成算法用）
}
```

#### 3.3.2 玩家数据结构

```javascript
player = {
    x: number,        // 横坐标（格子索引）
    y: number,        // 纵坐标（格子索引）
    trail: Array,     // 走过的路径记录
    speed: number     // 移动速度
}
```

#### 3.3.3 游戏状态

```javascript
gameState = {
    status: 'idle' | 'playing' | 'paused' | 'completed',
    difficulty: 'easy' | 'medium' | 'hard',
    time: number,     // 游戏时长（秒）
    score: number     // 得分
}
```

---

## 4. 功能模块设计

### 4.1 迷宫生成模块

#### 4.1.1 递归回溯算法流程

```
1. 初始化：创建全墙网格，随机选择起点
2. 将起点标记为已访问，压入栈
3. While 栈不为空：
   a. 从栈顶获取当前单元格
   b. 查找未访问的相邻单元格
   c. 如果有未访问邻居：
      i. 随机选择一个邻居
      ii. 打通当前单元格与邻居之间的墙
      iii. 将邻居标记为已访问，压入栈
   d. 否则：
      i. 弹出栈顶元素（回溯）
4. 标记起点和终点
```

#### 4.1.2 难度配置

| 难度 | 行数 | 列数 | 单元格大小 |
| :--- | :--- | :--- | :--- |
| 简单 | 10 | 15 | 40px |
| 中等 | 15 | 20 | 30px |
| 困难 | 20 | 30 | 25px |

### 4.2 玩家控制模块

#### 4.2.1 键盘映射

| 按键 | 操作 |
| :--- | :--- |
| ↑ / W | 向上移动 |
| ↓ / S | 向下移动 |
| ← / A | 向左移动 |
| → / D | 向右移动 |
| Space | 暂停/继续 |
| R | 重新开始 |

#### 4.2.2 碰撞检测逻辑

```
移动前检查目标位置：
1. 目标坐标是否在迷宫范围内
2. 目标位置是否有墙壁阻挡
3. 若是有效移动，更新玩家位置
```

### 4.3 计时与计分模块

#### 4.3.1 计时规则
- 游戏开始时启动计时
- 暂停时停止计时
- 通关时停止计时

#### 4.3.2 计分规则
```
得分 = 基础分 - 时间惩罚 + 难度奖励
基础分 = 1000
时间惩罚 = 游戏时长（秒）
难度奖励：简单=0，中等=200，困难=500
```

### 4.4 路径提示模块

#### 4.4.1 A* 算法实现

A* 算法评估函数：
```
f(n) = g(n) + h(n)
g(n): 起点到当前节点的实际步数
h(n): 当前节点到终点的曼哈顿距离
```

#### 4.4.2 提示功能
- 点击"提示"按钮显示最短路径
- 路径用高亮颜色显示
- 提示后计分扣减 100 分

---

## 5. UI/UX 设计

### 5.1 页面布局

```
┌─────────────────────────────────────────────────────┐
│  标题栏: 迷宫游戏                                    │
├─────────────────────────────────────────────────────┤
│  控制面板:                                          │
│  [难度选择] [开始游戏] [暂停] [提示] [重新开始]       │
├─────────────────────────────────────────────────────┤
│  状态栏:                                            │
│  时间: 00:00   |   得分: 0   |   状态: 准备开始      │
├─────────────────────────────────────────────────────┤
│                                                    │
│              Canvas 游戏画布                        │
│                                                    │
├─────────────────────────────────────────────────────┤
│  操作说明: 使用方向键或WASD控制移动                    │
└─────────────────────────────────────────────────────┘
```

### 5.2 视觉设计

| 元素 | 颜色 | 说明 |
| :--- | :--- | :--- |
| 墙壁 | `#2c3e50` | 深灰色 |
| 通路 | `#ecf0f1` | 浅灰色 |
| 起点 | `#27ae60` | 绿色 |
| 终点 | `#e74c3c` | 红色 |
| 玩家 | `#3498db` | 蓝色 |
| 路径提示 | `#f1c40f` | 黄色 |
| 走过路径 | `#95a5a6` | 灰色半透明 |

### 5.3 交互反馈

- **移动动画**: 平滑过渡效果
- **碰撞反馈**: 轻微抖动动画
- **通关提示**: 弹窗显示成绩
- **按键提示**: 悬停显示功能说明

---

## 6. 代码实现

### 6.1 文件结构

```
maze-game/
├── index.html          # 主页面
├── style.css           # 样式文件
└── js/
    ├── main.js         # 入口文件
    ├── MazeGenerator.js # 迷宫生成器
    ├── GameController.js # 游戏控制器
    ├── PathFinder.js   # 路径寻找器
    ├── Renderer.js     # Canvas 渲染器
    └── Timer.js        # 计时器
```

### 6.2 核心代码示例

#### 6.2.1 迷宫生成器（递归回溯法）

```javascript
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

    // ... 其他辅助方法
}
```

#### 6.2.2 A* 路径寻找算法

```javascript
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

        gScore[`${start.x},${start.y}`] = 0;
        fScore[`${start.x},${start.y}`] = this.heuristic(start, end);

        while (openList.length > 0) {
            const current = this.getLowestFScore(openList, fScore);
            
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(cameFrom, current);
            }

            this.removeFromList(openList, current);
            closedList.push(current);

            for (const neighbor of this.getNeighbors(current)) {
                if (this.contains(closedList, neighbor)) continue;
                
                const tentativeG = gScore[`${current.x},${current.y}`] + 1;
                
                if (!this.contains(openList, neighbor)) {
                    openList.push(neighbor);
                } else if (tentativeG >= gScore[`${neighbor.x},${neighbor.y}`]) {
                    continue;
                }

                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                gScore[`${neighbor.x},${neighbor.y}`] = tentativeG;
                fScore[`${neighbor.x},${neighbor.y}`] = tentativeG + this.heuristic(neighbor, end);
            }
        }
        return null;
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    // ... 其他辅助方法
}
```

---

## 7. 测试计划

### 7.1 功能测试

| 测试项 | 测试步骤 | 预期结果 |
| :--- | :--- | :--- |
| 迷宫生成 | 点击开始游戏 | 随机生成有效迷宫，有且仅有一条路径 |
| 玩家移动 | 按方向键/WASD | 玩家正确移动，不穿墙 |
| 碰撞检测 | 尝试向墙壁移动 | 玩家位置不变，有碰撞反馈 |
| 计时功能 | 开始游戏后等待 | 时间正常递增 |
| 暂停功能 | 按空格 | 游戏暂停，时间停止 |
| 路径提示 | 点击提示按钮 | 显示黄色路径，得分扣减 |
| 通关检测 | 到达终点 | 显示通关弹窗，计算得分 |

### 7.2 兼容性测试

| 浏览器 | 版本 | 测试重点 |
| :--- | :--- | :--- |
| Chrome | ≥ 80 | 全部功能 |
| Firefox | ≥ 75 | Canvas 绘制 |
| Safari | ≥ 13 | 动画效果 |
| Edge | ≥ 80 | 兼容性 |

---

## 8. 部署与发布

### 8.1 部署方式
- 静态文件托管（无需后端）
- 推荐平台：GitHub Pages、Netlify、Vercel

### 8.2 性能优化
- Canvas 局部重绘（仅更新变化区域）
- 迷宫生成使用 Web Worker（大迷宫）
- CSS 动画使用 GPU 加速