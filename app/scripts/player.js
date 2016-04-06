window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	var ROTATESIMMI = -10;
	//var WIDTH = 5;
	var HEIGHT = 7.5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var GAMEOVER = false;
	var STARTINGNEWGAME = true;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: INITIAL_POSITION_X, y: INITIAL_POSITION_Y };
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		GAMEOVER = true;
		STARTINGNEWGAME = true;
		ROTATESIMMI = -10;
	};

	Player.prototype.onFrame = function(delta) {

		if (Controls.keys.space) {
			document.getElementById('Introsong').pause();
			document.getElementById('Introsong').currentTime = 0;
			//This should be hardcoded
			ROTATESIMMI = -30;
			SPEED = 40;
			this.pos.y -= delta *SPEED;
			GAMEOVER = false;
			STARTINGNEWGAME = false;
		}
		//Not working
		else if (Controls.keys.click) {
			SPEED = 40;
			this.pos.y -= delta *SPEED;
			GAMEOVER = false;
			STARTINGNEWGAME = false;
		}
		else if(GAMEOVER === false)
		{
			//Exponential
			ROTATESIMMI += 1.5;
			SPEED -= 3;

			this.pos.y -= delta * SPEED;
	  }
		//console.log(STARTINGNEWGAME);
		this.checkCollisionWithBounds();
		// Update UI
		this.el.css('transform', ' translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)' + 'rotate('+ ROTATESIMMI + 'deg)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			GAMEOVER = true;
		//	console.log("Testing");
		//	console.log(STARTINGNEWGAME);
			return this.game.gameover();
		}
	};

	return Player;

})();
