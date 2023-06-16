let once = true;
export class InputHandler {
    constructor (game) {
        this.game = game;
        this.keys = [];
        this.bulletCount = 0;

        window.addEventListener('keydown', (evt) => { // Activates game when user presses Enter Key
            if (evt.key == 'Enter' && once) {
                this.game.playing = true;
                once = false;
            }

            // reloads page to restart the game
            if (evt.key == ' ' && !once && this.game.gameOver) location.reload();

            // contans movement of Doodle
            if ((evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') && !this.keys.includes(evt.key)) {
                this.keys.push(evt.key);
            }
        });

        window.addEventListener('keyup', (evt) => {
            if ((evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') && this.keys.includes(evt.key)) {
                this.keys.splice(this.keys.indexOf(evt.key), 1);
            }
            if (evt.key == 'ArrowUp' && this.game.player.bullets.length < 2) {
                this.bulletCount += 1;
            }
        });
    }
}