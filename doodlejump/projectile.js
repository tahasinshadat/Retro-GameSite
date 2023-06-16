export class Projectile {
    constructor (player) {
        this.player = player;
        this.width = 25;
        this.height = 25;
        // projectiles position starts from middle of players position
        this.x = this.player.x + (this.player.width/2) - (this.width/2);
        this.y = this.player.y + (this.player.height/2) - (this.height/2);
        
        this.vy = -15;
        this.delete = false;
    }

    update () {
        // sets projectiles movement and deletes if off screen
        this.y += this.vy;
        if (this.y < -this.height) {
            this.delete = true;
        }
    }

    draw (ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.roundRect(this.x, this.y, this.width, this.height, 25);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fill();
    }
}