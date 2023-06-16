import Ball from './ball.js'
import Platform from './platform.js'

const ball = new Ball(document.getElementById('ball'));
const playerScoreElem = document.getElementById('score');
let title = document.getElementById('Title');
let gameSpeed = 1;
let playerScore = 0;
let platforms = [];

let initialSpawnTimer = 100;
let spawnTimer = 0;
// Update Loop
let lastTime;
function update(time) {
    if (lastTime != null) {
        // delta: the time passed from between previous frame to current frame
        const delta = time - lastTime;
        // console.log(delta);
        ball.update(moveRight, moveLeft);
        
        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--hue')
        );
        document.documentElement.style.setProperty('--hue', hue + delta * 0.008);

        spawnTimer--; // will decrease by 1 every frame
        if (spawnTimer <= 0) {
            spawnPlatform();

            spawnTimer = initialSpawnTimer / gameSpeed;

            if (spawnTimer < 40) { // prevents next obstacle from spawning immediately / sets max speed obstacles will spawn at
                spawnTimer = 40;
            }

        }
        
        // Spawn the obstacles
        for (let i = 0; i < platforms.length; i++) {
            let p = platforms[i];
            
            let ballR = ball.rect();
            let plat1 = p.rect1();
            let plat2 = p.rect2();
            let isColliding = false;
            
            if (
              (plat1.top <= ballR.bottom && plat1.bottom >= ballR.top && plat1.left <= ballR.right && plat1.right >= ballR.left) ||
              (plat2.top <= ballR.bottom && plat2.bottom >= ballR.top && plat2.left <= ballR.right && plat2.right >= ballR.left)
            ) {
                isColliding = true;
            }
    
            if (isColliding) {
                if (!ball.onPlatform) {
                    //console.log('hit');
                    ball.onPlatform = true;
                    ball.velocity = 0; // Stop the ball from falling
                    ball.y = p.y - 1.45; // Position the ball on top of the platform
                    p.sound();
                }
                ball.velocity = p.velocity; // Match the platform's vertical speed
            } else {
                ball.onPlatform = false;
            }

            p.update();
        }

        if (ball.death()) {
            restart();
        }
        playerScore++;
        playerScoreElem.innerHTML = `Score: ${Math.floor(playerScore / 3)}`;
        gameSpeed += 0.001;
    }

    lastTime = time;
    //console.log(time);
    window.requestAnimationFrame(update); // Creates an infinite loop
}

function spawnPlatform() {
    let width = randomInt(5, 80);
    let floor = new Platform(width, 'red', gameSpeed);
    platforms.push(floor);
}

function randomInt (min, max) { // helper function
    return Math.round(Math.random() * (max - min) + min);
}


let moveRight = false;
let moveLeft = false;
window.addEventListener("keydown", moveBall);
window.addEventListener("keyup", () => {
    moveRight = false;
    moveLeft = false;
});

function moveBall(evt) {
    if (evt.code == "KeyA" || evt.code == "ArrowLeft") {
        moveLeft = true; 
        moveRight = false;
    } else if (evt.code == "KeyD" || evt.code == "ArrowRight") {
        moveRight = true; 
        moveLeft = false;
    }
}

function restart() {
    platforms = [];
    document.getElementById('platDiv').innerHTML = '';
    gameSpeed = 1;
    playerScore = 0;
    title.style.top = 0 + 'vw';
    title.style.display = 'block';
    setTimeout( function x() {
        title.style.display = 'none';
    }, 1500);
}

setTimeout( function x() {
    title.style.display = 'none';
}, 1500);

window.requestAnimationFrame(update);