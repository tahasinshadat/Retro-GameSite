import { Projectile } from "./projectile.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        // Start right above a Green platform
        this.x = this.game.platforms.filter(platform => platform.type=='green').slice(-1)[0].x + 6;
        this.y = this.game.platforms.filter(platform => platform.type=='green').slice(-1)[0].y - this.height;
        
        this.min_y = (this.game.height/2) - 30;
        this.min_vy = -18;
        this.max_vy = this.game.platforms[0].height;
        this.vy = this.min_vy;
        this.weight = 0.5; // gravity

        this.imageR = imageload('./images/DoodleJumpR.webp');
        this.imageL = imageload('./images/DoodleJumpL.webp');
        this.right = true;

        this.velocityX = 0;
        this.maxVX = 8;

        this.bullets = []; // holds how many shots it will fire
    }

    onPlatform () { // checks if on the platform and returns what type of platform it was
        let type = null;
        let hitbox = {x: this.x + 15, y: this.y, width: this.width - 30, height: this.height};

        this.game.platforms.forEach((platform) => {
            const X = (hitbox.x >  platform.x && hitbox.x < platform.x + platform.width) || (hitbox.x + hitbox.width > platform.x && hitbox.x + hitbox.width < platform.x + platform.width);
            const Y = (platform.y - (hitbox.y + hitbox.height) <= 0) && (platform.y - (hitbox.y + hitbox.height) >= -platform.height);

            if (X && Y) {
                type = platform.type;
                platform.deletePlat = (type == 'brown' || type == 'white') ? true : false;
            }
            
        });

        return type;
    }

    collision () { // Checks for collisions with enemies
        let death = false;
        let hitbox = {x: this.x + 15, y: this.y, width: this.width - 30, height: this.height};
        this.game.enemies.forEach( (enemy) => {
            if (
                hitbox.x < enemy.x + enemy.width &&
                hitbox.x + hitbox.width > enemy.x &&
                hitbox.y < enemy.y + enemy.height &&
                hitbox.y + hitbox.height > enemy.y
            ) {
                death = true;
            }
        })
        return death;
    }

    update (handler) {
        // x-direction movement
        this.x += this.velocityX;
        if (handler.keys.includes('ArrowLeft')) {
            this.velocityX = -this.maxVX;
            this.right = false;
        } else if (handler.keys.includes('ArrowRight')) {
            this.velocityX = this.maxVX;
            this.right = true;
        } else {
            this.velocityX = 0;
        }

        // barriers / walls
        if (this.x > this.game.width) this.x = -25;
        if (this.x < -25) this.x = this.game.width;

        // y-direction movement
        if (this.vy > this.weight) {
            let pType = this.onPlatform();
            if(pType == 'white' || pType == 'blue' || pType == 'green') this.vy = this.min_vy
        }

        if (this.vy < this.max_vy) this.vy += this.weight;
        if (this.y > this.min_y || this.vy > this.weight) this.y += this.vy;

        if (this.y <= this.min_y && this.vy < this.weight) this.game.vy = -this.vy;
        else this.game.vy = 0;

        // Death
        if (this.collision()) this.game.gameOver = true;
        if(this.y > this.game.height && !this.game.gameOver) this.game.gameOver = true;

        // Firing projectiles
        if (handler.bulletCount > 0) {
            handler.bulletCount--;
            this.bullets.push(new Projectile(this));
        }

        this.bullets.forEach(bullet => bullet.update())
        this.bullets = this.bullets.filter(bullet => !bullet.delete);

    }

    draw (ctx) {
        this.bullets.forEach(bullet => bullet.draw(ctx));
        if (this.right) ctx.drawImage(this.imageR, this.x, this.y, this.width, this.height);
        else ctx.drawImage(this.imageL, this.x, this.y, this.width, this.height);
    }
}

function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}