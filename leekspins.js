var audio, playButtonHtml, bodyCss, playing = false;
var frames = new Array(4);

document.addEventListener('DOMContentLoaded', function() {
	document.body.parentNode.style.height = '100%';
	document.body.style.cssText = bodyCss;
	var i = frames.length; while (i--) {
		frames[i] = new Image();
		frames[i].src = window['frame' + (i + 1)];
		frames[i].style.width = '100%';
		frames[i].style.pointerEvents = 'none';
	}
	audio = new Audio();
	audio.addEventListener('canplaythrough', canPlayHandler);
	audio.loop = true;
	audio.src = loituma_ogg;
});

function canPlayHandler(e) {
	audio.removeEventListener('canplaythrough', canPlayHandler);
	if(/fullcpgrid/.test(document.location.pathname)) {
		showPlayButton();
	} else {
		tryPlayback();
	}
}
function tryPlayback() {
	window.removeEventListener('click', tryPlayback, true);
	return canPlay(audio).then(function() {
		startPlayback();
	}).catch(function(e) {
		showPlayButton();
	});
}
function showPlayButton() {
	console.log('showPlayButton');
	document.body.innerHTML = playButtonHtml;
	document.body.style.backgroundImage = 'url('+frames[0].src+')';
	window.addEventListener('click', tryPlayback, true);
}
function startPlayback() {
	window.addEventListener('click', muteHandler, true);
	document.body.innerHTML = '';
	audio.play();
	var frame = 0;
	setInterval(function() {
		document.body.style.backgroundImage = 'url('+frames[frame].src+')';
		frame++;
		if (frames[frame] === undefined) frame = 0;
	}, 100);
}
function muteHandler() {
	audio.muted = !audio.muted;
}
function canPlay(audio) {
	var playHandler, timeout;
	return new Promise(function(resolve, reject) {
		playHandler = resolve;
		audio.play();
		audio.addEventListener('play', playHandler);
		timeout = setTimeout(reject, 10);
	}).then(function() {
		audio.pause();
		clearTimeout(timeout);
		audio.removeEventListener('play', playHandler);
	}).catch(function(e) {
		clearTimeout(timeout);
		audio.removeEventListener('play', playHandler);
		throw e;
	});
}

(function() {
	bodyCss = 'box-sizing:border-box;width:100%;height:100%;margin:0;background:#000 no-repeat 50% 50%/contain;';
})(); // bodyCss
(function() {
	playButtonHtml = '<div style="'+
		'position:absolute;display:table;width:100%;height:100%;'+
		'background:no-repeat 50% 50%/contain;'+
		'cursor:pointer;font:4rem arial;text-shadow: 0 0 .5rem #fff;'+
	'">'+
		'<div style="display:table-cell;text-align:center;vertical-align:middle;">'+
			'Play'+
	'</div></div>';
})(); // html

