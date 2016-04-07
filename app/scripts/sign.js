window.Sign = (function() {
	'use strict';
	var SPEED = 25;
	var WIDTH = 6;
	var HEIGHT = 40;
	var PLAYER_SIZE = 5;
	var INITIAL_POSITION_X = 150;
	var INITIAL_POSITION_Y = 25;
	var SIGNS_ON_SCREEN = 6;
	var SIGN_SPACE = 30;
	var SIGN_FADE_OUT = -10;
	var RANDOM_MULTIPLE = 20;

	var Sign = function(el, game, player) {
		this.game = game;
		this.player = player;
		this.signs = [el.find('#bigSign1'), el.find('#bigSign2'), el.find('#bigSign3'), el.find('#bigSign4'), el.find('#bigSign5'), el.find('#bigSign6')];
		this.signPos = new Array();
		for(var i = 0; i < SIGNS_ON_SCREEN; i++) {
			this.signPos[i] = {x: 0, y: 0, complete: false};
		}
	};

	Sign.prototype.reset = function() {
		for(var i = 0; i < SIGNS_ON_SCREEN; i += 2) {
			var randomNum = Math.floor(Math.random() * RANDOM_MULTIPLE);
			this.signPos[i].x = INITIAL_POSITION_X + i * RANDOM_MULTIPLE;
			this.signPos[i].y = INITIAL_POSITION_Y + randomNum;
			this.signPos[i].complete = false;

			this.signPos[i + 1].x = INITIAL_POSITION_X + i * RANDOM_MULTIPLE;
			this.signPos[i + 1].y = randomNum - SIGN_SPACE;
			this.signPos[i + 1].complete = false;
		}
	};

	Sign.prototype.onFrame = function(delta) {
		for(var i = 0; i < SIGNS_ON_SCREEN; i++) {
			this.signPos[i].x -= delta * SPEED;
		}

		this.checkCollisionWithBounds();

		for(var i = 0; i < SIGNS_ON_SCREEN; i += 2) {
			// Signs fade away, instead of disappearing all of a sudden.
			if(this.signPos[i].x <= SIGN_FADE_OUT) {
				var randomNum = Math.floor(Math.random() * RANDOM_MULTIPLE);
				this.signPos[i].x = INITIAL_POSITION_X;
				this.signPos[i].y = INITIAL_POSITION_Y + randomNum;
				this.signPos[i].complete = false;

				this.signPos[i + 1].x = INITIAL_POSITION_X;
				this.signPos[i + 1].y = randomNum - SIGN_SPACE;
				this.signPos[i + 1].complete = false;
			}
			this.signs[i].css('transform', 'translateZ(0) translate(' + this.signPos[i].x + 'em, ' + this.signPos[i].y + 'em)');
			this.signs[i + 1].css('transform', 'translateZ(0) translate(' + this.signPos[i + 1].x + 'em, ' + this.signPos[i + 1].y + 'em)');
		}
	};

	Sign.prototype.checkCollisionWithBounds = function() {
		for(var i = 0; i < SIGNS_ON_SCREEN; i++) {
			if(((this.player.pos.x > this.signPos[i].x || (this.player.pos.x + PLAYER_SIZE) > this.signPos[i].x)
				&&  this.player.pos.x < this.signPos[i].x + WIDTH 
				&&  this.player.pos.y > this.signPos[i].y 
				&&  this.player.pos.y < this.signPos[i].y + HEIGHT)
				|| ((this.player.pos.x > this.signPos[i].x || this.player.pos.x + PLAYER_SIZE > this.signPos[i].x)
					&& this.player.pos.x < (this.signPos[i].x + WIDTH) 
					&& this.player.pos.y + PLAYER_SIZE > this.signPos[i].y 
					&& this.player.pos.y + PLAYER_SIZE < this.signPos[i].y + HEIGHT)) {
				return this.game.gameover();
		}

		if(!this.signPos[i].complete && this.player.pos.x > this.signPos[i].x) {
				// Make sure player doesn't fly high and pass the signs
				if(this.player.pos.y < this.signPos[i].y-HEIGHT)
				{
					return this.game.gameover();
				}
				//console.log("Madeit through");
				this.game.updateScore();
				this.signPos[i].complete = true;
				this.signPos[i + 1].complete = true;
			}
		}
	};
	return Sign;
})();