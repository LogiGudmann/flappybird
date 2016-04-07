var MUTED = true;
function muteSound() {
	'use strict';
	if(!MUTED) {
		MUTED = true;
		$('.Mute').show();
		$('.UnMute').hide();
		document.getElementById('Introsong').volume = 0;
		document.getElementById('Losersound').volume = 0;
		document.getElementById('FlappingSound').volume = 0;
		} else {
		MUTED = false;
		$('.Mute').hide();
		$('.UnMute').show();
		document.getElementById('Introsong').volume = 0.1;
		document.getElementById('Losersound').volume = 0.6;
		document.getElementById('FlappingSound').volume = 1;
	}
}
