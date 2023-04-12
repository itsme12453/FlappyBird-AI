let player;
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

    player = new Player(new Vector2D(150, 250), 3);

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

    this.draw = function() {
        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.pos.x, this.pos.y, 35, 35);
    };
    this.update = function() {
        this.velocity += this.gravity;
        this.velocity = Math.min(this.velocity, this.maxVelocity); // limit maximum velocity
        this.pos.y += this.velocity;

        if (this.jump) {
            this.velocity = -this.jumpSpeed;
            this.jump = false;
        }

        this.pos.x += this.speed;
    };
};


function PipePair(pos){
    this.pos = pos;
    this.width = 50;
    this.gap = 125;
    this.minHeight = 50;
    this.maxHeight = 325;

    this.topHeight = RandInt(this.minHeight, this.maxHeight);
    this.bottomHeight = 500 - (this.topHeight + this.gap)

    this.draw = function() {
        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.topHeight);

        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.pos.x, 500, this.width, -this.bottomHeight);
    }
}

document.addEventListener("keydown", function(e) {
    if ((e.key == " " || e.code == "Space") && !player.jump) {
        if (!playing) {
            playing = true;
        }

        player.jump = true;
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key == " " || e.code == "Space") {
        player.jump = false;
    }
});

let pipeX = 500;

function animate() {
    setInterval(function() {
        if (playing) {
            game.ctx.save();

            game.clear();
            game.ctx.translate(((game.canvas.width / 2) - player.pos.x), 0);

            pipes.push(new PipePair(new Vector2D(pipeX, 0)))
            pipeX += 250;

            for(let i = 0; i < pipes.length; i++){
                pipes[i].draw();
            }

            player.draw();
            player.update();

            game.ctx.restore();
        } else {
            game.notReadyScreen();
        }
    }, 1000/60);
}

startGame();