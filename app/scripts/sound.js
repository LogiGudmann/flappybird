var MUTED = false;
function muteSound() {
	'use strict';
	if(!MUTED) {
		MUTED = true;
		$('.Mute').show();
		$('.UnMute').hide();
		document.getElementById('themeSong').pause();
		} else {
		MUTED = false;
		$('.Mute').hide();
		$('.UnMute').show();
		document.getElementById('themeSong').play();
	}
}