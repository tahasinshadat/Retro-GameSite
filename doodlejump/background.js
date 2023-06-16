export class Background {
    constructor(game) {
        this.game = game;
        this.width = this.game.width
        this.height = this.game.height;
        this.bgimage = imageload('./images/GraphPaperBg.png');
        this.x = 0;
        this.y = 0;
    }

    update () {
        // Resets the position of the first image once it goes off screen
        if (this.y > this.height) {
            this.y = 0;
            this.game.addPlatforms(-this.height, -15);
            this.game.addBrokenPlatforms(-this.height, -15);
            this.game.increaseDifficulty();

            if (Math.random() <  this.game.enemyChance) {
                this.game.addEnemy();
            }
        } else {
            this.y += this.game.vy;
            this.game.score += Math.ceil(this.game.vy * 0.1);
        }
    }

    // Stacks the images ontop of each other
    draw (ctx) {
        ctx.drawImage(this.bgimage, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.bgimage, this.x, this.y - this.height, this.width, this.height);
    }
}

function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}