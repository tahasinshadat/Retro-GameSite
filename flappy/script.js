const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// setup
canvas.width = window.innerWidth / 1.25;
canvas.height = 600;
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Game Variables
let playing = false;
let score = 0;
let highscore = 0;
let bird;
const gravity = 0.5;
const hole = 175;
const pipeWidth = 100;
let pipeColor = "rgb(10, 10, 255)";
let pipes = [];
let pipe;
let gameSpeed = 1;
let dead = false;
let animationId = null; // Keep track of the animation ID
let lastPipePassed = null;
let initialSpawnTime = 100;
let spawnTimer = initialSpawnTime;

// Aesthetic Variables
let mount = imageload('images/mountain.png');
let mountX = canvas.width; // High Score Mountain spawns outside of view
let cliff = imageload('images/cliff.png');
let cliffX = -10; // Initial cliffs X
let pipeNum = 0; // What number pipe has spawned (similar to score)
let move = false; // Sees if the HighScore Mountain should move yet
let oneTimePerGame = 1; // Makes sure the high score mountain and pipe show up only once per game


class Bird {
  constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        this.velocityY = 0;
        this.jumpForce = 9;
        this.dead = false;
        this.angle = 0;
    }

    Draw() {
        ctx.save(); // Save the current state of the canvas context
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move the origin to the center of the bird
        ctx.rotate(this.angle); // Rotate the canvas context
        ctx.drawImage(imageload('images/bird.png'), -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore(); // Restore the canvas context to its previous state
    }

    Animate() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.angle = this.velocityY / 20;
        this.Draw();
    }

    Jump() {
        this.velocityY = -this.jumpForce;
    }
}

class Pipe {
    constructor(x, y, width, height, gap, num) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gap = this.height + gap;
        this.velocityX = 5;
        this.color = pipeColor;
        this.num = num;
    }

    Draw() {

        if (this.num == highscore && oneTimePerGame == 1) {
            move = true;
            this.color = "red"
            oneTimePerGame = 0;
        }

        ctx.beginPath();
        // Collision rectangles
        ctx.fillStyle = "rgba(255, 0, 0, 0)"; // Top
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "rgba(255, 0, 0, 0)"; // Bottom
        ctx.fillRect(this.x, this.y + this.gap, this.width, canvas.height - this.height);


        // top pipe
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + 10, this.y, this.width - 20, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 15, this.y, this.width - 30, this.height);
        // top cap
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y + this.height - 25, this.width, 25);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 5, this.y + this.height - 20, this.width - 10, 15);

        // bottom pipe  
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + 10, this.y + this.gap, this.width - 20, canvas.height - this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 15, this.y + this.gap, this.width - 30, canvas.height - this.height);
        // bottom cap
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y + this.gap, this.width, 25);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 5, this.y + this.gap + 5, this.width - 10, 15);


    }

    Animate () {
        this.x -= this.velocityX * gameSpeed;
        if (dead) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.gap = this.height + gap;
        }
        this.Draw();
    }

}

function spawnPipes() {
    pipeNum++;
    let randomHeight = randomInt(50, canvas.height - hole - 50);
    let pipe = new Pipe (canvas.width + pipeWidth, 0, pipeWidth, randomHeight, hole, pipeNum);
    pipes.push(pipe);
}

// Helper Functions
function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}

function randomInt (min, max) { // helper function
    return Math.round(Math.random() * (max - min) + min);
}

function start() {
    if (!animationId) { // Only start the animation if it's not already running
        reset();
        update();
    } else { // Cancel any existing animation frame and start over
        window.cancelAnimationFrame(animationId);
        reset();
        update();
    }
}

function reset() {
    bird = new Bird(100, 200, 80, 50);
    dead = false;
    score = 0;
    oneTimePerGame = 1;
    pipeNum = 0;
    mountX = canvas.width;
    move = false;
    cliffX = 0;
    pipes = [];
    gameSpeed = 1;
    if (localStorage.getItem('FlapHighscore')) {
        highscore = localStorage.getItem('FlapHighscore');
    }
}

function checkDeath() {
    if (bird.y + bird.height > canvas.height ||
        bird.y < -10
        ) {
        bird.dead = true;
        return bird.dead;
    }
    if (
        (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x && 
        bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) 
        || 
        (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
        bird.y + bird.height > pipe.gap)
        ) {
        bird.dead = true;
        return bird.dead;  
    }
}

function handleLoss() {
    // console.log("dead");
    gameButton.style.display = 'block';
    animationId = null;
    gameButton.insertAdjacentHTML('beforeend', `<p>Score: ${score}<p>`);
    window.localStorage.setItem('FlapHighscore', highscore);
    playing = false;
}

function updateScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`HighScore: ${highscore}`, canvas.width - 200, 30);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageload('images/flappyBG.jpg'), 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cliff, cliffX, 140, 220, 310);
    cliffX -= 2;

    spawnTimer--; // will decrease by 1 every frame
    if (spawnTimer <= 0) {
        spawnPipes();
        spawnTimer = initialSpawnTime / gameSpeed;
    }
    
    highScoreMountain();
    for (let i = 0; i < pipes.length; i++) {
        pipe = pipes[i];

        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
        }

        if (checkDeath()) {
            dead = true;
            pipes = [];
            break;
        } 

        if (bird.x > pipe.x + pipe.width && lastPipePassed !== pipe) {
            score++;
            lastPipePassed = pipe;
        }
        pipe.Animate();
    }
    
    cliff.x--;
    bird.Animate();
    updateScore();

    if (score > highscore) {
        highscore = score;
    }

    if (dead) {
        handleLoss();
    } else {
        animationId = window.requestAnimationFrame(update); // Store the animation ID
    }

    gameSpeed += 0.0003;
}

// Aesthetics
function highScoreMountain() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`HighScore`, mountX + 222.5, canvas.height-350);
    ctx.fillRect(mountX + 282.5, canvas.height-340, 5, 25)
    ctx.drawImage(mount, mountX, canvas.height-310, canvas.height, 310);
    if (move) {
        mountX -= 5 * gameSpeed;
    }
}

function setup() {
    imageload('images/flappyBG.jpg').onload = function () {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    };
    imageload('images/cliff.png').onload = function () {
        ctx.drawImage(this, cliffX, 140, 190, 310);
    }
    imageload('images/bird.png').onload = function () {
        ctx.drawImage(this, 100, 200, 80, 50);
    };
}

const gameButton = document.getElementById('gameButton');
if (!playing) {
    gameButton.addEventListener('keydown', () => {
        gameButton.innerHTML = "Press Any Key To Start";
        start();
        gameButton.style.display = 'none';
    });
}

canvas.addEventListener('click', () => {
    bird.Jump();
});

document.addEventListener('keypress', () => {
    bird.Jump();
});

setup();