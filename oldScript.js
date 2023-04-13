// const nn = new NeuralNetwork(3, 4, 1);
const PLAYER_COUNT = 1;

let players = [];
let playing = false;
let pipes = [];

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

function RandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startGame() {
    game.start();
    game.notReadyScreen();

    for (i = 0; i < PLAYER_COUNT; i++){
        players.push(new Player(new Vector2D(150, 250), 3));
    }
    // player = new Player(new Vector2D(150, 250), 3);

    animate();
}

let game = {
    start: function() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        this.canvas.width = 1000;
        this.canvas.height = 500;
    },
    clear: function() {
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
    },
    notReadyScreen: function() {
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "Press Spacebar to start",
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    },
};

function Player(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.jump = false;
    this.velocity = 0;
    this.jumpSpeed = 8;
    this.gravity = 0.5;
    this.maxVelocity = 10; // maximum downward velocity

    this.brain = new NeuralNetwork(4, 4, 2);
    this.think = function(){
        // let inputs = [];
        // inputs[0] = this.pos.y;

        // console.log(pipes);

        let inputs = [Math.random(), Math.random(), Math.random(), Math.random()]
        let output = this.brain.predict(inputs);

        // console.log(output);

        if (output[0] > output[1]){
            this.jump = true;
            // console.log(output);
        }
    };
    this.draw = function() {
        // game.ctx.fillStyle = "black";
        // game.ctx.fillRect(this.pos.x, this.pos.y, 35, 35);

        game.ctx.beginPath();
        game.ctx.arc(this.pos.x, this.pos.y, 20, 0, 2 * Math.PI, false);
        game.ctx.fillStyle = "black";
        game.ctx.fill();
    };
    this.update = function() {
        this.velocity += this.gravity;
        this.velocity = Math.min(this.velocity, this.maxVelocity); // limit maximum velocity
        this.pos.y += this.velocity;

        if (this.jump) {
            this.velocity = -this.jumpSpeed;
            this.jump = false;
        }

        if (this.pos.y < 20){
            this.pos.y = 20;
        } else if (this.pos.y > 500-20){
            this.pos.y = 500-20;
        }

        // this.pos.x += this.speed;
    };
};

function PipePair(pos, count){
    this.pos = pos;
    this.width = 50;
    this.gap = 125;
    this.count = count;
    this.minHeight = 50;
    this.maxHeight = 325;

    this.topHeight = RandInt(this.minHeight, this.maxHeight);
    this.bottomHeight = 500 - (this.topHeight + this.gap)

    this.draw = function() {
        this.pos.x -= 3;

        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.topHeight);

        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.pos.x, 500, this.width, -this.bottomHeight);
    }
}

document.addEventListener("keydown", function(e) {
    if ((e.key == " " || e.code == "Space") && !players[0].jump) {
        if (!playing) {
            playing = true;
        }

        players[0].jump = true;
    }
});

// document.addEventListener("keyup", function(e) {
//     if (e.key == " " || e.code == "Space") {
//         player.jump = false;
//     }
// });

function checkCollision(player, pipe){
    if(pipe.pos.x - player.pos.x <= 50 && pipe.pos.x - player.pos.x >= -50 &&
        (player.pos.y + 20 >= pipe.topHeight || player.pos.y - 20 <= pipe.topHeight + pipe.gap)){
        console.log("hit");
    }
}

let pipeX = 600;
let pipeCount = 0;
let pipeFPS = 0;

let closestPipe = 1;
let score = 0;

function animate() {
    setInterval(function() {
        // if (playing) {
        game.ctx.save();

        game.clear();
        game.ctx.translate(((game.canvas.width / 2) - players[0].pos.x), 0);

        if (pipeFPS % 60 == 0){
            pipeCount += 1;
            pipes.push(new PipePair(new Vector2D(pipeX, 0), pipeCount));
            pipeX += 100;
        }
        pipeFPS += 1;

        // console.log(pipes.length);
        // console.log(score);
        // console.log(closestPipe);
        // console.log(pipes[0].pos.x);

        checkCollision(players[0], pipes[0]);

        for(let i = 0; i < pipes.length; i++){
            if(pipes[i].pos.x < players[0].pos.x - 60){
                score += 1;
                closestPipe += 1;
                pipes.splice(0, 1);
            }

            pipes[i].draw();
        }

        for(let i = 0; i < players.length; i++){
            // players[i].think();
            players[i].draw();
            players[i].update();
        }

        // for(let i = 0; i < players.length; i++){
        //     for(let j = 0; j < pipes.length; j++){
        //         if(checkCollision(players[i], pipes[j])){
        //             console.log("a");
        //         }
        //     }
        // }

        game.ctx.restore();
        // } else {
        //     game.notReadyScreen();
        // }
    }, 1000/60);
}

startGame();