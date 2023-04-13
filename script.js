let player;
let pipes = [];

function setup() {
    createCanvas(1000, 500);
    player = new Player();
    pipes.push(new Pipe());
}

function draw() {
    background(220);

    player.think(pipes);
    player.show();
    player.update();

    if (frameCount % 100 == 0) {
        pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hits(player)) {
            // console.log("GAME OVER");
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
    constructor() {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
        this.size = 30;

        this.brain = new NeuralNetwork(4, 4, 2);
    }

    think(pipes) {
        // let inputs = [];
        
        // inputs[0] = this.y; //y position
        // inputs[1] = pipes[0].top;

        let inputs = [Math.random(), Math.random(), Math.random(), Math.random()]
        let output = this.brain.predict(inputs);

        if (output[0] > output[1]){
            player.up();
        }
    }

    show() {
        noStroke();
        fill(0);
        ellipse(this.x, this.y, this.size, this.size);
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
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
        this.spacing = 125;
        this.topHeight = random(height / 6, 3 / 4 * height);
        this.bottomHeight = height - (this.topHeight + this.spacing);
        this.x = width;
        this.width = 30;
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