import { Player } from './player.js';
import { Sign } from './sign.js';
import $ from 'jquery';

export class Game {
    /**
     * Main game class.
     * @param {Element} el jQuery element containing the game.
     */
    constructor(el) {
        this.el = el;
        this.score = 0;
        this.highScore = 0;
        this.isPlaying = false;
        this.audioInitialized = false;

        this.player = new Player(this.el.find('.Player'), this);
        this.sign = new Sign(this.el, this, this.player);
        this.groundMoney = this.el.find('.groundMoney');

        this.el.on('click', () => this.initializeAudio());

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
    }

    initializeAudio() {
        if (this.audioInitialized) return;

        document.getElementById('Introsong').volume = 0.1;
        document.getElementById('Losersound').volume = 0.6;
        document.getElementById('FlappingSound').volume = 1;
        document.getElementById('Introsong').play().catch(e => console.log('Audio play failed:', e));

        this.audioInitialized = true;
    }

    /**
     * Runs every frame. Calculates a delta and allows each game
     * entity to update itself.
     */
    onFrame() {
        // Check if the game loop should stop.
        if (!this.isPlaying) {
            return;
        }
        // Calculate how long since last frame in seconds.
        const now = +new Date() / 1000;
        const delta = now - this.lastFrame;
        this.lastFrame = now;

        // Update game entities.
        this.player.onFrame(delta);
        if (!this.player.PLAYING) {
            this.sign.onFrame(delta);
        }
        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    }

    /**
     * Starts a new game.
     */
    start() {
        this.reset();

        // Restart the onFrame loop
        this.lastFrame = +new Date() / 1000;
        window.requestAnimationFrame(this.onFrame);
        this.isPlaying = true;
    }

    /**
     * Resets the state of the game so a new game can be started.
     */
    reset() {
        const Menu = this.el.find('.Menu');

        if (this.audioInitialized) {
            document.getElementById('Losersound').pause();
            document.getElementById('Introsong').currentTime = 0;
            document.getElementById('Introsong').play().catch(e => console.log('Audio play failed:', e));
        }

        Menu.addClass('is-visible');

        if (this.isPlaying === false) {
            $(window).keypress((e) => {
                if (e.keyCode === 32) {
                    Menu.removeClass('is-visible');
                }
            });

            $(document).click(() => {
                Menu.removeClass('is-visible');
            });
        }

        this.player.reset();
        if (this.sign) {
            this.sign.reset();
        } else {
            console.warn('Sign is undefined in Game.reset()');
        }
        this.groundMoney.removeClass('stopGround');
        this.GAMEOVER = true;
        this.STARTINGNEWGAME = true;
        this.score = 0;
        $('.ScoreCounter').text('' + this.score);
    }

    /**
     * Signals that the game is over.
     */
    gameover() {
        this.isPlaying = false;
        this.groundMoney.addClass('stopGround');
        this.GAMEOVER = false;

        if (this.audioInitialized) {
            document.getElementById('Introsong').pause();
            document.getElementById('Introsong').currentTime = 0;
            document.getElementById('Losersound').play().catch(e => console.log('Audio play failed:', e));
        }

        // Should be refactored into a Scoreboard class.
        const scoreboardEl = this.el.find('.Scoreboard');
        scoreboardEl
            .addClass('is-visible')
            .find('.Scoreboard-restart')
            .one('click', () => {
                scoreboardEl.removeClass('is-visible');
                this.start();
            });

        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        $('.Score').text('Score ' + this.score);
        $('.HighScore').text('High score ' + this.highScore);
    }

    updateScore() {
        this.score++;
        $('.ScoreCounter').text('' + this.score);
    }

    // Some shared constants.
    static WORLD_WIDTH = 102.4;
    static WORLD_HEIGHT = 57.6;
}
