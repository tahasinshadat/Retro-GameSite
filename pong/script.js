import Ball from './ball.js';
import Paddle from './paddle.js';

const ball = new Ball(document.getElementById('ball'));
const playerPaddle = new Paddle(document.getElementById('playerPaddle'));
const computerPaddle = new Paddle(document.getElementById('computerPaddle'));
const playerScoreElem = document.getElementById('playerScore');
const computerScoreElem = document.getElementById('computerScore');
let playerScore = 0;
let computerScore = 0;

// Update Loop
let lastTime;
function update(time) {
    if (lastTime != null) {
        // delta: the time passed from between previous frame to current frame
        const delta = time - lastTime;
        // console.log(delta);
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()] );
        computerPaddle.update(delta, ball.y);
        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--hue')
        );

        document.documentElement.style.setProperty('--hue', hue + delta * 0.008);


        if (lost()) {
            handleLoss();
            updateScore();
        }

        checkWinner()
    }

    lastTime = time;
    //console.log(time);
    window.requestAnimationFrame(update); // Creates an infinite loop
}

function checkWinner() {
    if (playerScore == 12) {
        alert("You Win!");
        freshStart();
        
    }
    if (computerScore == 12) {
        alert("Computer Wins!");
        freshStart();
    }
}

function freshStart() {
    ball.reset()
    computerPaddle.reset()
    playerScore = 0;
    computerScore = 0;
}

function lost() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0 
}

function handleLoss() {
    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        playerScore++;
    } else {
        computerScore++;
    }
    ball.reset()
    computerPaddle.reset()
}

function updateScore() {
    playerScoreElem.innerHTML = playerScore;
    computerScoreElem.innerHTML = computerScore;
}

document.addEventListener('mousemove', event => {
    /* Must convert y position from pixels to percentage because I use percentages
    for the paddle position in the css */
    if ( ((event.y / window.innerHeight) * 100) <= 11) {
        playerPaddle.position = 11;
    } else if ( ((event.y / window.innerHeight) * 100) >= 95) {
        playerPaddle.position = 95;
    } else {
        playerPaddle.position = (event.y / window.innerHeight) * 100;
    }
    
});

//Every time that you can change whats on the screen, this function is called
window.requestAnimationFrame(update);