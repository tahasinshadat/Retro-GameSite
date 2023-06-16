export class Platform {
    constructor (game, lowerY, upperY, type, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.type = type;
        this.x = randomInt(0, this.game.width - this.width);
        this.y = this.calcY(lowerY, upperY);
        this.velocityX = (this.type == 'blue') ? this.game.objectXVelocity : 0;
        this.deletePlat = false;
    }

    calcY (lowerY, upperY) { // Calculates Y component of platforms via the doodlers position
        if (this.type != 'brown') {
            if (!this.game.platforms.length) {
                return randomInt(upperY-125, upperY);
            } else {
                return this.game.platforms[0].y - randomInt(this.game.platformGap-20, this.game.platformGap);
            }
        } else {
            let y;
            do {
                y = randomInt(lowerY, upperY);
            } while (this.closeToNonBrokenPlatform(y));

            return y;
        }
    }

    closeToNonBrokenPlatform (platY) { // checks if broken platform is close to a green platform
        for (let i = 0; i < this.game.platforms.length; i++) {
            const p = this.game.platforms[i];
            const margin = 10;
            /* 
            A broken platform can be added in the game if it is below 
            or above 10 pixels of a green, blue, or white platform; making 
            the game more fair 
            */
            if(
                (platY + this.height >= p.y - margin && platY + this.height <= p.y + this.height + margin) ||
                (platY >= p.y - margin && platY <= p.y + this.height + margin)
            ) {
                return true;
            }
        }
        return false;
    }

    update () {
        if (this.x > this.game.width - this.width || this.x < 0) this.velocityX *= -1;
        this.x += this.velocityX;
        this.y += this.game.vy;
        if (this.y >= this.game.height + 25) this.deletePlat = true; // If platform goes off screen, delete it
    }

    draw (ctx) {
        if (this.type != 'brown') {
            ctx.beginPath();
            ctx.fillStyle = this.type;
            ctx.roundRect(this.x, this.y, this.width, this.height, 25);
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.fillStyle = 'brown';
            ctx.roundRect(this.x, this.y, this.width/2 - 3, this.height, [25, 0, 0, 25]);
            ctx.roundRect(this.x + this.width/2 + 3, this.y, this.width/2, this.height, [0, 25, 25, 0]);
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fill();
        }
        //ctx.drawImage(imageload(`./images/${this.type}Plat.png`), this.x, this.y, this.width, this.height)
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
