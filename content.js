window.onload = function(){
setInterval(appl, 500);
function appl() {
	if (document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll')[0] == null) {
		var test = true;
	}else{
		
		var ap_title = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
		var ap_al = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll')[0].innerText;
		var artw = document.getElementsByClassName('media-artwork-v2__image')[0].currentSrc;
		var ar_rep = artw.replace('44x44bb', '540x540bb');
		var alb = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll-inner-text-wrapper')[0].childNodes[3].textContent;
		//2020_05_24_nowtime
		var audio_duration = document.getElementsByTagName('audio')[0].duration;
		var audio_nowtime = document.getElementsByTagName('audio')[0].currentTime;
		//end
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: ap_title,
				artist: ap_al,
				album: alb,
				artwork: [{ src: ar_rep,  sizes: '540x540',   type: 'image/jpeg' }]
			});
			navigator.mediaSession.setActionHandler('play', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('pause', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('previoustrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[0].click()});
			navigator.mediaSession.setActionHandler('nexttrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[2].click()});
		}
		var send_info = {songname: ap_title, artist: ap_al, img_url: ar_rep, duration: audio_duration, now_time: audio_nowtime};
		chrome.runtime.sendMessage(send_info);
	}
}
}
chrome.runtime.onMessage.addListener(function(durl_data, sender, sendResponse){
	//backgroudから時間変更もらったら時間変更
	console.log(durl_data);
	document.getElementsByTagName('audio')[0].currentTime = durl_data / 100;
	return true;
});