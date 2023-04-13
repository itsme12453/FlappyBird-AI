const POPULATION_TOTAL = 350;

let players = [];
let playersDup = [];
let pipes = [];
let counter = 0;

function setup() {
    createCanvas(1000, 500);

    for (let i = 0; i < POPULATION_TOTAL; i++) {
        players.push(new Player());
    }

    // pipes.push(new Pipe());
}

function draw() {
    background(220);

    if (counter % 75 == 0) {
        pipes.push(new Pipe());
    }

    for (let player of players) {
        player.think(pipes);
        player.show();
        player.update();   
    }

    if (players.length == 0) {
        counter = 0;
        nextGeneration();
        pipes = [];

        pipes.push(new Pipe());
    }

    counter += 1;

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        for (let j = players.length - 1; j >= 0; j--){
            if (pipes[i].hits(players[j])) {
                playersDup.push(players.splice(j, 1)[0]);
            }
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }
}

// function keyPressed() {
//     if (key == " ") {
//         player.up();
//     }
// }

class Player {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
        this.size = 30;

        this.score = 0;
        this.fitness = 0;

        if(brain){
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(4, 4, 2);
        }
    }

    think(pipes) {
        let closest = null;
        let closestDist = Infinity;

        for (let i = 0; i < pipes.length; i++) {
            let d = pipes[i].x - this.x;

            if (d < closestDist && d > 0){
                closest = pipes[i];
                closestDist = d;
            }
        }

        let inputs = [];
        
        inputs[0] = this.y / height;
        inputs[1] = closest.topHeight / height;
        inputs[2] = closest.bottomHeight / height;
        inputs[3] = closest.x / width;

        // let inputs = [Math.random(), Math.random(), Math.random(), Math.random()]
        let output = this.brain.predict(inputs);

        if (output[0] > output[1]){
            this.up();
        }
    }

    mutate() {
        this.brain.mutate(0.1);
    }

    show() {
        // noStroke();
        stroke(100);
        fill(0, 75);
        ellipse(this.x, this.y, this.size, this.size);
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        this.score += 1;

        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

class Pipe {
    constructor() {
        this.spacing = 150;
        this.topHeight = random(height / 6, min(height/1.5, 3 / 4 * height));
        this.bottomHeight = height - (this.topHeight + this.spacing);
        this.x = width;
        this.width = 50;
        this.speed = 4;
    }

    show() {
        fill(0);
        rect(this.x, 0, this.width, this.topHeight);
        rect(this.x, height - this.bottomHeight, this.width, this.bottomHeight);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return (this.x < -this.width);
    }

    hits(player) {
        if ((player.y - player.size / 2) < this.topHeight || (player.y + player.size / 2) > (height - this.bottomHeight)) {
            if (player.x > this.x && player.x < (this.x + this.width)) {
                return true;
            }
        }
        return false;
    }
}