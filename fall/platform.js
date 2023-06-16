const HOLE = 12.5;
const platDiv = document.getElementById('platDiv');

export default class Platform {
    constructor(width, color, gameSpeed) {
        this.platformPart1 = document.createElement('div');
        this.platformPart2 = document.createElement('div');
        this.color = color;
        this.width = width;
        this.gameSpeed = gameSpeed;
        this.y = 100;
        this.set();
        this.velocity = -0.2;
        this.soundPlayed = false;
    }

    rect1() {
        // Gets the edges of the left platform element
        return this.platformPart1.getBoundingClientRect(); 
    }

    rect2() {
        // Gets the edges of the right platform element
        return this.platformPart2.getBoundingClientRect(); 
    }

    set() {
        this.platformPart1.classList.add('floor');
        this.platformPart1.style.width = this.width + 'vw';
        this.platformPart1.style.backgroundColor = this.color;
        this.platformPart1.style.top = this.y + 'vh';
        platDiv.appendChild(this.platformPart1);

        this.platformPart2.classList.add('floor2');
        this.platformPart2.style.width = 100 - this.width - HOLE + 'vw'
        this.platformPart2.style.backgroundColor = this.color;
        this.platformPart2.style.top = this.y + 'vh';
        platDiv.appendChild(this.platformPart2);

    }

    delete() {
        platDiv.removeChild(this.platformPart1);
        platDiv.removeChild(this.platformPart2);
    }

    sound() {
        if (!this.soundPlayed) {
            playSound('./audio/ball-fall-noise.wav');
            this.soundPlayed = true;
        }  
    }

    update() {
        this.y += this.velocity * this.gameSpeed;
        this.set();
        if (this.y <= 2) {
            this.delete();
        }
    }
}

function playSound(audio) {
    let sound = new Audio(audio);
    sound.play();
}