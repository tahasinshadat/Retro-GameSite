import {Background} from  './background.js';
import {Platform} from  './platform.js';
import {Player} from './player.js';
import {InputHandler} from './inputHandler.js';
import {Enemy} from './enemy.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 550;
    canvas.height = 830;

    class Game {
        constructor(width, height) { 
            this.width = width;
            this.height = height;
            this.playing = false; 
            this.gameOver = false;
            this.vy = 0;
            this.level = 0;
            this.score = 0;
            this.enemies = [];
            this.enemyChance = 0;
            this.maxEnemyChance = 0.55;
            this.platforms = []; // Array that holds all platforms
            this.platformGap = 85; // Gap in between each platform
            this.maxPlatformGap = 175;
            this.addPlatforms(0, this.height-15); // Add platforms for first background image
            this.addBrokenPlatforms(0, this.height-15); 
            this.addPlatforms(-this.height, -15); // Add patforms for the second background image thats stacked ontop of the first
            this.addBrokenPlatforms(-this.height, -15); 
            this.BlueOrWhite = 0; // chance to spawn blue or white platforms
            this.maxBOW = 0.85;
            this.objectXVelocity = 3; // Speed at which objects like the blue platform or enemies will be moving in the x-direction
            this.maxOXV = 6;
            this.background = new Background(this); // Sets Background
            this.InputHandler = new InputHandler(this);
            this.player = new Player(this);
        }

        addPlatforms(lowerY, upperY) {
            do { // Keep adding platforms 
                let type = 'green';

                if (Math.random() < this.BlueOrWhite) {
                    type = (Math.random() < this.BlueOrWhite) ? 'blue' : 'white';
                }

                this.platforms.unshift(new Platform(this, lowerY, upperY, type, 90, 15))
            } while (this.platforms[0].y >= lowerY); // exit loop only when y value of most recently added platform is less than lowerY
        }

        addBrokenPlatforms(lowerY, upperY) {
            let num = randomInt(0, 4);

            for (let i = 0; i < num; i++) {
                this.platforms.push(new Platform(this, lowerY, upperY, 'brown', 90, 15))
            }
        }

        addEnemy () {
            this.enemies.push(new Enemy(this));
        }

        increaseDifficulty () { // Increment component parameters
            this.level++;
            if (this.maxPlatformGap > this.platformGap) this.platformGap += 5;
            if (this.maxEnemyChance > this.enemyChance) this.enemyChance += 0.02;
            if (this.maxBOW > this.BlueOrWhite) this.BlueOrWhite += 0.02;
            if (this.level % 8 == 0 && this.maxOXV > this.objectXVelocity) this.objectXVelocity++;
        }

        update () { // update all components
            this.background.update();

            this.platforms.forEach(platform => {
                platform.update();
            });

            this.player.update(this.InputHandler);

            this.enemies.forEach(enemy => {
                enemy.update();
            });

            this.platforms = this.platforms.filter(platform => !platform.deletePlat) // Take out platforms that arent marked as deleted
            this.enemies = this.enemies.filter(enemy => !enemy.delete);
        }

        draw(ctx) { 
            this.background.draw(ctx);

            if (!this.playing) {
                // Title
                ctx.textAlign = 'center';
                ctx.fillStyle = 'green';
                ctx.font = 'bold 70px arial';
                ctx.fillText('DOODLE JUMP', this.width/2, this.height/12);

                // Jumping thumbnail
                ctx.drawImage(imageload('./images/DoodleJumpR.webp'), this.width/2 + 55, 150, 100, 100);
                ctx.globalAlpha = 0.75;
                ctx.drawImage(imageload('./images/DoodleJumpR.webp'), this.width/2 - 30, 75, 100, 100);
                ctx.globalAlpha = 0.5;
                ctx.drawImage(imageload('./images/DoodleJumpR.webp'), this.width/2 - 140, 170, 100, 100);
                ctx.globalAlpha = 0.25;
                ctx.drawImage(imageload('./images/DoodleJumpR.webp'), this.width/2 - 180, 300, 100, 100);

                // Instructions
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'black';
                ctx.font = 'bold 25px courier new';
                ctx.fillText('Press ENTER to start', this.width/2, this.height/2);
            } else {
                // Draw all components of game
                this.platforms.forEach(platform => {
                    platform.draw(ctx);
                }); 
                
                this.player.draw(ctx);

                this.enemies.forEach(enemy => {
                    enemy.draw(ctx);
                }); 

                ctx.fillStyle = 'black';
                ctx.textAlign = 'start';
                ctx.fillText(`Score: ${this.score}`, 20, 40);

                // End Screen
                if (this.gameOver) {
                    ctx.font = 'bold 35px courier new';
                    ctx.textAlign = 'center';
                    ctx.fillText('Game Over', this.width/2, this.height/2);
                    ctx.font = 'bold 25px courier new';
                    ctx.fillText('Press SPACE to play again', this.width/2, this.height/1.8);
                }
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.with, canvas.height);
        if(game.playing) game.update();
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }

    animate();

});

function randomInt (min, max) { // helper function
    return Math.round(Math.random() * (max - min) + min);
}

function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}