setInterval(appl, 100);
function appl() {

if (document.getElementById('apple-music-player') ==! null) {
var test = true;
}else{
var ap_title = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll')[0].innerText;
var ap_al = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll')[0].innerText;
var artw = document.getElementsByClassName('media-artwork-v2__image')[0].currentSrc;
var ar_rep = artw.replace('44x44bb', '540x540bb');
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: ap_title,
				artist: ap_al,
				album: "Test",
				artwork: [{ src: ar_rep,  sizes: '540x540',   type: 'image/jpeg' }]
			});
			navigator.mediaSession.setActionHandler('play', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('pause', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('previoustrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[0].click()});
			navigator.mediaSession.setActionHandler('nexttrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[2].click()});
		}
	}
}

