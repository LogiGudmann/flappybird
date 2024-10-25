import $ from 'jquery';
import { Game } from './game.js';

/**
 * Bootstrap and start the game.
 */
$(function() {
    const game = new Game($('.GameCanvas'));
    
    // Start the game on first click or keypress
    $(document).one('click keypress', function() {
        game.start();
    });
});
