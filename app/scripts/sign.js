export class Sign {
    constructor(el, game, player) {
        this.game = game;
        this.player = player;
        this.signs = [el.find('#bigSign1'), el.find('#bigSign2'), el.find('#bigSign3'), el.find('#bigSign4'), el.find('#bigSign5'), el.find('#bigSign6')];
        this.signPos = new Array(6).fill().map(() => ({x: 0, y: 0, complete: false}));

        this.SPEED = 25;
        this.WIDTH = 6;
        this.HEIGHT = 40;
        this.PLAYER_SIZE = 5;
        this.INITIAL_POSITION_X = 150;
        this.INITIAL_POSITION_Y = 25;
        this.SIGNS_ON_SCREEN = 6;
        this.SIGN_SPACE = 30;
        this.SIGN_FADE_OUT = -10;
        this.RANDOM_MULTIPLE = 20;

        this.reset();
    }

    reset() {
        for(let i = 0; i < this.SIGNS_ON_SCREEN; i += 2) {
            const randomNum = Math.floor(Math.random() * this.RANDOM_MULTIPLE);
            this.signPos[i] = {
                x: this.INITIAL_POSITION_X + i * this.RANDOM_MULTIPLE,
                y: this.INITIAL_POSITION_Y + randomNum,
                complete: false
            };
            this.signPos[i + 1] = {
                x: this.INITIAL_POSITION_X + i * this.RANDOM_MULTIPLE,
                y: randomNum - this.SIGN_SPACE,
                complete: false
            };
        }
    }

    onFrame(delta) {
        for(let i = 0; i < this.SIGNS_ON_SCREEN; i++) {
            this.signPos[i].x -= delta * this.SPEED;
        }

        this.checkCollisionWithBounds();

        for(let i = 0; i < this.SIGNS_ON_SCREEN; i += 2) {
            if(this.signPos[i].x <= this.SIGN_FADE_OUT) {
                const randomNum = Math.floor(Math.random() * this.RANDOM_MULTIPLE);
                this.signPos[i] = {
                    x: this.INITIAL_POSITION_X,
                    y: this.INITIAL_POSITION_Y + randomNum,
                    complete: false
                };
                this.signPos[i + 1] = {
                    x: this.INITIAL_POSITION_X,
                    y: randomNum - this.SIGN_SPACE,
                    complete: false
                };
            }
            this.signs[i].css('transform', `translateZ(0) translate(${this.signPos[i].x}em, ${this.signPos[i].y}em)`);
            this.signs[i + 1].css('transform', `translateZ(0) translate(${this.signPos[i + 1].x}em, ${this.signPos[i + 1].y}em)`);
        }
    }

    checkCollisionWithBounds() {
        for(let i = 0; i < this.SIGNS_ON_SCREEN; i++) {
            if(((this.player.pos.x > this.signPos[i].x || (this.player.pos.x + this.PLAYER_SIZE) > this.signPos[i].x)
                &&  this.player.pos.x < this.signPos[i].x + this.WIDTH 
                &&  this.player.pos.y > this.signPos[i].y 
                &&  this.player.pos.y < this.signPos[i].y + this.HEIGHT)
                || ((this.player.pos.x > this.signPos[i].x || this.player.pos.x + this.PLAYER_SIZE > this.signPos[i].x)
                    && this.player.pos.x < (this.signPos[i].x + this.WIDTH) 
                    && this.player.pos.y + this.PLAYER_SIZE > this.signPos[i].y 
                    && this.player.pos.y + this.PLAYER_SIZE < this.signPos[i].y + this.HEIGHT)) {
                return this.game.gameover();
            }

            if(!this.signPos[i].complete && this.player.pos.x > this.signPos[i].x) {
                if(this.player.pos.y < this.signPos[i].y - this.HEIGHT) {
                    return this.game.gameover();
                }
                this.game.updateScore();
                this.signPos[i].complete = true;
                this.signPos[i + 1].complete = true;
            }
        }
    }
}