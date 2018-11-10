/**
 * MAZE 
 * © 2018 Chiraag Bangera.
 */

let Width;
let Height;

let canvas;

let cols;
let rows;

var SIZE = false;

let maze;

var DEBUG_MODE = true;

function setup() {
    canvas = createCanvas(Width, Height);
    canvas.parent(document.getElementById("canvasHolder"));
    windowResized();
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    textSize(60);
}


function windowResized() {
    let w = document.getElementById("canvasHolder").offsetWidth;
    let h = document.getElementById("canvasHolder").offsetHeight;
    resizeCanvas(w, h);
    Width = canvas.width;
    Height = canvas.height;
    rows = Math.ceil((Height - SIZE) / SIZE * 2);
    cols = Math.ceil((Width - SIZE) / SIZE * 2);
    maze = new MAZE(rows, cols, SIZE);
    //maze.build();
}

function draw() {
    background(0);
    if (maze) {
        maze.draw();
        maze.buildNext();
    }
}

function newMaze(size,speed=0,r = 0, c = 0) {
    SIZE = size;
    if (r === 0) {
        rows = Math.ceil((Height - SIZE) / SIZE * 2);
    }

    if (c === 0) {
        cols = Math.ceil((Width - SIZE) / SIZE * 2);
    }
    maze = new MAZE(rows, cols, SIZE);
    if(speed === 0){
        maze.build();
    }
    else{
        frameRate(speed);
    }
}

class MAZE {
    constructor(rows, cols, size) {
        this.rows = rows;
        this.cols = cols;
        this.size = size;
        this.cells = [];
        this.stack = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.cells.push(new Cell(i, j, this.size));
            }
        }
        this.current = this.cells[floor(random(0, this.cells.length))];
        this.current.visited = true;
        this.cellIndex = 0;
    }


    build() {
        while (this.current) {
            this.processCell();
        }
        console.log("Maze Built");
    }
    buildNext() {
        if (!this.current) {
            console.log("Maze Built");
            return;
        }
        this.processCell();
    }

    indexFromCellStack(r, c) {
        if (r < 0 || c < 0 || r > this.rows - 1 || c > this.cols - 1) {
            return -1;
        }
        return c + r * this.cols;
    }

    processCell() {
        let next;
        let neighbors = [];
        let top = this.cells[this.indexFromCellStack(this.current.r - 1, this.current.c)];
        let right = this.cells[this.indexFromCellStack(this.current.r, this.current.c + 1)];
        let bottom = this.cells[this.indexFromCellStack(this.current.r + 1, this.current.c)];
        let left = this.cells[this.indexFromCellStack(this.current.r, this.current.c - 1)];
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        if (neighbors.length > 0) {
            var r = floor(random(0, neighbors.length));
            next = neighbors[r];
        }

        if (next) {
            this.removeWalls(next);
            next.visited = true;
            next.current = true;
            this.stack.push(this.current);
            this.current = next;
        } else if (this.stack.length > 0) {
            this.current = this.stack.pop();
        } else {
            this.current = null;
        }
    }

    removeWalls(next) {
        let x = this.current.c - next.c;
        if (x === 1) {
            this.current.walls[3] = false;
            next.walls[1] = false;
        }
        else if (x === -1) {
            this.current.walls[1] = false;
            next.walls[3] = false;
        }
        let y = this.current.r - next.r;
        if (y === 1) {
            this.current.walls[0] = false;
            next.walls[2] = false;
        } else if (y === -1) {
            this.current.walls[2] = false;
            next.walls[0] = false;
        }
    }

    draw() {
        this.cells.forEach(cell => {
            cell.draw();
        });
    }
}

class Cell {
    constructor(r, c, size) {
        this.r = r;
        this.c = c;
        this.size = size;
        this.walls = [true, true, true, true];
        this.visited = false;
    }

    makeVisited() {
        fill(51, 200, 51);
        noStroke();
        rect(this.x + this.size / 4, this.y + this.size / 4, this.size / 2, this.size / 2);
    }

    draw() {
        if (DEBUG_MODE) {
            if (this.visited) {
                this.makeVisited();
            }
            fill(255);
            textSize(10);
            text(this.r + "," + this.c, this.x + this.size / 4, this.y + this.size / 4);
        }
        stroke(255);
        this.x = this.c * this.size / 2 + this.size / 2;
        this.y = this.r * this.size / 2 + this.size / 2;
        if (this.walls[0]) {
            line(this.x, this.y, this.x + this.size / 2, this.y);
        }

        if (this.walls[1]) {
            line(this.x + this.size / 2, this.y, this.x + this.size / 2, this.y + this.size / 2);
        }

        if (this.walls[2]) {
            line(this.x + this.size / 2, this.y + this.size / 2, this.x, this.y + this.size / 2);
        }

        if (this.walls[3]) {
            line(this.x, this.y + this.size / 2, this.x, this.y);
        }
    }
}