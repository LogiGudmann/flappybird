
window.Game = (function() {
	'use strict';

	/**
	* Main game class.
	* @param {Element} el jQuery element containing the game.
	* @constructor
	*/
	var score = 0;
	var highScore = 0;
	document.getElementById('Introsong').volume = 0.1;
	document.getElementById('Losersound').volume = 0.6;
	document.getElementById('FlappingSound').volume = 1;

	var Game = function(el) {
		this.el = el;

		this.player = new window.Player(this.el.find('.Player'), this);
		this.sign = new window.Sign(this.el.find('.Signs'), this, this.player);

		this.isPlaying = false;
		this.groundMoney = this.el.find('.groundMoney');
	//this.IntroSong = this.el.find('.');
	document.getElementById('Introsong').play();
	// Cache a bound onFrame since we need it each frame.
	this.onFrame = this.onFrame.bind(this);
};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	 Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}
		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
		delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		if(!this.player.PLAYING){
			this.sign.onFrame(delta);
		}
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	 Game.prototype.start = function() {
	 	this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */

	 Game.prototype.reset = function() {
	 	var Menu = this.el.find('.Menu');

		//Only works on clicking on that said element
		//Need to fix to put for whole game
		document.getElementById('Losersound').pause();
		document.getElementById('Introsong').currentTime = 0;
		document.getElementById('Introsong').play();
		Menu
			.addClass('is-visible'); 
			// .one('click',function(){
			// 	Menu.removeClass('is-visible');
			// 	//this.start();
			// });
		if (this.isPlaying === false) {
			$(window).keypress(function (e) {
				if (e.keyCode === 32) {
					Menu.removeClass('is-visible');
				}
			});

			$(document).click(function() {
				Menu.removeClass('is-visible');
			});
		}

		this.player.reset();
		this.sign.reset();
		this.groundMoney.removeClass('stopGround');
		this.GAMEOVER = true;
		this.STARTINGNEWGAME = true;
		score = 0;
		$('.ScoreCounter').text(''+ score);
	};

	/**
	 * Signals that the game is over.
	 */
	 Game.prototype.gameover = function() {
	 	this.isPlaying = false;
	 	this.groundMoney.addClass('stopGround');
	 	this.GAMEOVER = false;
	 	document.getElementById('Introsong').pause();
	 	document.getElementById('Introsong').currentTime = 0;
	 	document.getElementById('Losersound').play();
		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
			.one('click', function() {
				scoreboardEl.removeClass('is-visible');
				that.start();
			});

		if(score > highScore){
			highScore = score;
		}
		$('.Score').text('Score '+ score);
		$('.HighScore').text('High score '+ highScore);
	};

	Game.prototype.updateScore = function() {
		score++;
		$('.ScoreCounter').text(''+ score);
	}

	/**
	 * Some shared constants.
	 */
	 Game.prototype.WORLD_WIDTH = 102.4;
	 Game.prototype.WORLD_HEIGHT = 57.6;

	 return Game;
	})();
