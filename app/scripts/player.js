import { Controls } from './controls.js';

export class Player {
    // All these constants are in em's, multiply by 10 pixels
    // for 1024x576px canvas.
    static SPEED = 30; // * 10 pixels per second
    static ROTATE_SIMMI = -10;
    static WIDTH = 5;
    static HEIGHT = 5;
    static INITIAL_POSITION_X = 30;
    static INITIAL_POSITION_Y = 25;

    constructor(el, game) {
        this.el = el;
        this.game = game;
        this.pos = { x: Player.INITIAL_POSITION_X, y: Player.INITIAL_POSITION_Y };
        this.controls = new Controls();
        this.gameover = false;
        this.startingNewGame = true;
        this.playing = false;
        this.isFlying = false;
        this.rotateSimmi = Player.ROTATE_SIMMI;
        this.speed = Player.SPEED;
    }

    /**
     * Resets the state of the player for a new game.
     */
    reset() {
        this.pos.x = Player.INITIAL_POSITION_X;
        this.pos.y = Player.INITIAL_POSITION_Y;
        this.gameover = true;
        this.startingNewGame = true;
        this.rotateSimmi = Player.ROTATE_SIMMI;
        this.isFlying = false;
    }

    onFrame(delta) {
        if (this.controls && this.controls.keys && this.controls.keys.space) {
            document.getElementById('FlappingSound').play();
            this.playing = true;
            this.rotateSimmi = -30;
            this.speed = 40;
            this.pos.y -= delta * this.speed;
            this.gameover = false;
            this.startingNewGame = false;
            this.isFlying = true;
        } else if (!this.gameover) {
            // Exponential
            this.rotateSimmi += 1.5;
            this.speed -= 3;
            this.pos.y -= delta * this.speed;
            this.isFlying = false;
        }

        this.checkCollisionWithBounds();
        // Update UI
        this.el.css('transform', `translateZ(0) translate(${this.pos.x}em, ${this.pos.y}em) rotate(${this.rotateSimmi}deg)`);
        
        const wings = this.el.find('.Player-wings');
        if (this.isFlying) {
            wings.addClass('Player-wings-flapping');
        } else {
            wings.removeClass('Player-wings-flapping');
        }
    }

    checkCollisionWithBounds() {
        if (this.pos.y + Player.HEIGHT > this.game.WORLD_HEIGHT) {
            this.gameover = true;
            return this.game.gameover();
        }
    }
}
