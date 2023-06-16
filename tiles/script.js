const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 65;
let laneWidth = canvas.width / 4;
let tileHeight = 150;
let animationId;
let gameSpeed = 1;
let dead = false;
let tiles = [];
let keyOrder = [];
let keys = ['a', 's', 'd', 'f'];
let expectedKeyIndex = 0;
let keyState = {}; // New: keyState object to track pressed keys
const startButton = document.getElementById('start-button');
const difficultySettings = document.getElementById('difficulty-settings');
const startScreen = document.getElementById('startScreen');
const playAgainMessage = document.getElementById('playAgain');
let selectedDifficulty = 'normal'; // Default difficulty
let score = 0;

class Tile {
    constructor(lane) {
        this.width = laneWidth;
        this.height = tileHeight;
        this.y = -this.height;
        this.x = laneWidth * lane;
        this.lane = lane;
        this.key = keys[lane];
        this.color = 'black';
    }

    draw() {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.key.toUpperCase(), this.x + this.width / 2, this.y + this.height / 2 + 7);
    }

    animate() {
        this.y += 3 * gameSpeed;
        this.draw();
    }

    delete() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision() {
        return this.y + this.height >= canvas.height && !checkKey(this.lane);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (tiles.length == 0 || tiles[tiles.length - 1].y >= 0) {
        generateTile();
    }

    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];

        if (tile.checkCollision()) {
            dead = true;
            break;
        }

        tile.animate();
    }

    showScore();

    if (dead) {
        handleLoss();
    } else {
        animationId = window.requestAnimationFrame(update); // Store the animation ID
    }

    gameSpeed += 0.0003;
}

function generateTile() {
    let random = randomInt(0, keys.length - 1);
    let tile = new Tile(random);
    tiles.push(tile);
    keyOrder.push(random);
}

function checkKey(lane) {
    return keys[lane] in keyState && keyState[keys[lane]];
}

function removeTileFromLane(lane) {
    if (lane === keyOrder[expectedKeyIndex]) {
        expectedKeyIndex++;
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].lane === lane) {
                tiles[i].delete();
                tiles.splice(i, 1);
                break;
            }
        }
        score++;
    } else {
        dead = true;
    }
}

function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (keys.includes(key)) {
        const lane = keys.indexOf(key);
        removeTileFromLane(lane);
        keyState[key] = true; // Set the key as pressed in keyState
    }

    if (event.key === ' ') {
        if (!animationId) {
            startGame();
        }
    }
}

function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (keys.includes(key)) {
        keyState[key] = false; // Set the key as released in keyState
    }
}

// Helper functions
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function startGame() {

    if (selectedDifficulty === 'normal') {
        laneWidth = canvas.width / 4;
        tileHeight = 150;
        keys = ['a', 's', 'd', 'f'];
      } else if (selectedDifficulty === 'hard') {
        laneWidth = canvas.width / 6;
        tileHeight = 185;
        keys = ['a', 's', 'd', 'f', 'g'];
      } else if (selectedDifficulty === 'pianist') {
        laneWidth = canvas.width / 9;
        tileHeight = 220;
        keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
      }

    // Reset game variables
    dead = false;
    tiles = [];
    keyOrder = [];
    expectedKeyIndex = 0;
    gameSpeed = 1;
    animationId = null;
    score = 0;

    // Hide the difficulty settings
    difficultySettings.style.display = 'none';
    startScreen.style.display = 'none';

    // Reset keyState
    keyState = {};

    // Start the game animation
    update();
}

function showScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 30);
}

function handleLoss() {
    let deathTile = new Tile(keyOrder[0]);
    deathTile.y = tiles[0].y;
    deathTile.color = 'red';
    deathTile.draw();
    startScreen.style.display = 'block';
    playAgainMessage.innerHTML = 'Press Space to Reset Game<br>Score: ' + score;
    window.addEventListener('keydown', (evt) => { 
        // reloads page to restart the game
        if (evt.key == ' ' && dead) location.reload();
    });
}

// Function to handle difficulty selection
function handleDifficultyChange(event) {
    selectedDifficulty = event.target.value;
}

// Event listeners
difficultySettings.addEventListener('change', handleDifficultyChange);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);