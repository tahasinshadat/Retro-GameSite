export class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = randomInt(0, this.game.width - this.width);
        this.y = randomInt(-this.game.height, -this.height);
        this.image = imageload('./images/enemy.webp');
        this.vx = this.game.objectXVelocity;
        this.delete = false;
    }

    update () {
        // x-direction movement
        if (this.x < 0 || this.x > this.game.width - this.width) this.vx *= -1;
        this.x += this.vx;
        this.y += this.game.vy;

        // delete if off screen
        if (this.y >= this.game.height) {
            this.delete = true;
        }

        // checks if enemy has been shot and killed
        this.game.player.bullets.forEach(bullet => {
            if (
                bullet.x < this.x + this.width &&
                bullet.x + bullet.width > this.x &&
                bullet.y < this.y + this.height &&
                bullet.y + bullet.height > this.y
            ) {
                this.delete = true;
            }
        })

    }

    draw (ctx) {
        ctx.beginPath();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

function randomInt (min, max) { // helper function
    return Math.round(Math.random() * (max - min) + min);
}

function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}