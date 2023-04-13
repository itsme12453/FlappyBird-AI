// const nn = new NeuralNetwork(3, 4, 1);
const PLAYER_COUNT = 100;

let players = [];
let playing = false;
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
        let inputs = [];
        
        inputs[0] = this.y; //y position
        inputs[1] = pipes[0].top;

        // let inputs = [Math.random(), Math.random(), Math.random(), Math.random()]
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

document.addEventListener("keydown", function(e) {
    if ((e.key == " " || e.code == "Space") && !player.jump) {
        if (!playing) {
            playing = true;
        }

        // player.jump = true;
    }

// document.addEventListener("keyup", function(e) {
//     if (e.key == " " || e.code == "Space") {
//         player.jump = false;
//     }
// });

function checkCollision(player, pipe){
    if(pipe.pos.x < player.pos.x){
        return false;
    }
}

let pipeX = 600;
let pipeCount = 0;

function animate() {
    setInterval(function() {
        // if (playing) {
        game.ctx.save();

        game.clear();
        game.ctx.translate(((game.canvas.width / 2) - players[0].pos.x), 0);

        if (pipeCount % 60 == 0){
            pipes.push(new PipePair(new Vector2D(pipeX, 0)))
            pipeX += 100;
        }
        pipeCount += 1;

        // console.log(pipes[0].pos.y - players[0].pos.y)

        for(let i = 0; i < pipes.length; i++){
            pipes[i].draw();
        }

        for(let i = 0; i < players.length; i++){
            players[i].think();
            players[i].draw();
            players[i].update();
        }

        for(let i = 0; i < players.length; i++){
            for(let j = 0; j < pipes.length; j++){
                if(checkCollision(players[i], pipes[j])){
                    console.log("a");
                }
            }
        }

        game.ctx.restore();
        // } else {
        //     game.notReadyScreen();
        // }
    }, 1000/60);
}