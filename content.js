var m_upl;
var nm_url;
var ef_init = true;
//webaudio vars
var audio_tag;//audiotag set
var context;//create ac
var source;
var gain;
var bass_filter;
var mid_filter;
var tre_filter;
var gainNode;
//
window.onload = function(){
	if(localStorage.amn_content_eqd == undefined){
		localStorage.setItem('amn_content_eqd', JSON.stringify({bass: 0, mid: 0, tre: 0, back_g: false, eq_tf: false}));
	}
	if(Object.keys(JSON.parse(localStorage.amn_content_eqd)).length < 1){
		//backup restore
		localStorage.setItem('amn_content_eqd', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd_bup).bass, mid: JSON.parse(localStorage.amn_content_eqd_bup).mid, tre: JSON.parse(localStorage.amn_content_eqd_bup).tre, back_g: JSON.parse(localStorage.amn_content_eqd_bup).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd_bup).eq_tf}));
	}
	//append css
	var cre_css = document.createElement("style");
	cre_css.type = 'text/css';
	cre_css.innerText = '.product-info {z-index: 0;}';
	document.getElementsByTagName('head')[0].appendChild(cre_css);
setInterval(appl, 600);
function appl() {
	if (document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll')[0] == null) {
		var test = true;
	}else{
		if(location.hostname == "music.apple.com"){ //AppleMusic WebPlayer Only
			//end
		var ap_title = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
		var ap_al = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll')[0].innerText;
		var artw = document.getElementsByClassName('media-artwork-v2__image')[0].currentSrc;
		var ar_rep = artw.replace(/\d{1,2}x\d{1,2}bb/g, '500x500bb');
		var alb = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll-inner-text-wrapper')[0].childNodes[3].textContent;
		//2020_05_24_nowtime
		var audio_duration = document.getElementsByTagName('audio')[0].duration;
		var audio_nowtime = document.getElementsByTagName('audio')[0].currentTime;
		//end
		//
		if ('mediaSession' in navigator && m_upl != ap_title) {
			m_upl = ap_title;
			navigator.mediaSession.metadata = new MediaMetadata({
				title: ap_title,
				artist: ap_al.split(/\s[\u2014]\s\s/)[0] + "-" + ap_al.split(/\s[\u2014]\s\s/)[1],
				album: alb,
				artwork: [{ src: ar_rep,  sizes: '540x540',   type: 'image/jpeg' }]
			});
			
			navigator.mediaSession.setActionHandler('play', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('pause', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('previoustrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[0].click()});
			navigator.mediaSession.setActionHandler('nexttrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[2].click()});
			//get shareURL
			switch(location.pathname.split('/')[2]){
				case 'playlist':
					var shdata = document.getElementsByName('schema:musicPlaylist')[0].text;
					var shobj = JSON.parse(shdata);
					for(var i=0;i<shobj.track.length;i++){
						var m_name = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
						if(m_name == shobj.track[i].name){
							//console.log(shobj.track[i].url);
							nm_url = shobj.track[i].url;
						}
					}
					shdata = null;
					break;
				case 'album':
					var shdata = document.getElementsByName('schema:music-album')[0].text;
					var shobj = JSON.parse(shdata);
					for(var i=0;i<shobj.workExample.length;i++){
						var m_name = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
						if(m_name == shobj.workExample[i].name){
							//console.log(shobj.workExample[i].url);
							nm_url = shobj.workExample[i].url;
						}
					}
					shdata = null;
					break;
				case 'artist':
					var shdata = document.getElementsByName('schema:music-group')[0].text;
					var shobj = JSON.parse(shdata);
					for(var i=0;i<shobj.tracks.length;i++){
						var m_name = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
						if(m_name == shobj.tracks[i].name){
							//console.log(shobj.track[i].url);
							nm_url = shobj.tracks[i].url;
						}
					}
					shdata = null;
					break;
				default:
					nm_url = '';
					break;
				}

				if (ef_init == true && JSON.parse(localStorage.amn_content_eqd).eq_tf){
					effect_init();
					//value backup
					localStorage.setItem('amn_content_eqd_bup', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd).bass, mid: JSON.parse(localStorage.amn_content_eqd).mid, tre: JSON.parse(localStorage.amn_content_eqd).tre, back_g: JSON.parse(localStorage.amn_content_eqd).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd).eq_tf}));
					ef_init = false;
				}
				if(Object.keys(JSON.parse(localStorage.amn_content_eqd)).length < 1){
					//backup restore
					localStorage.setItem('amn_content_eqd', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd_bup).bass, mid: JSON.parse(localStorage.amn_content_eqd_bup).mid, tre: JSON.parse(localStorage.amn_content_eqd_bup).tre, back_g: JSON.parse(localStorage.amn_content_eqd_bup).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd_bup).eq_tf}));
				}
			// append backgroud
			if(JSON.parse(localStorage.amn_content_eqd).back_g){
				//amn_bacground_imageが無い状態のとき
				if(document.getElementById('amn_backgroud_image') == null){
					//create bakgroud
				var back = document.createElement("div");
				back.id = 'amn_backgroud_image';
				if(document.body.classList.value.indexOf('dark-mode') == -1){
					//background light-mode
					back.style = 'background-image: url('+ar_rep+');background-position: center;background-repeat: no-repeat;background-size: cover;height: 1000px;width: 100%;z-index: 0;position: absolute;filter: blur(10px);';
				}
				if(document.body.classList.value.indexOf('dark-mode') != -1){
					//background light-mode
					back.style = 'background-image: url('+ar_rep+');background-position: center;background-repeat: no-repeat;background-size: cover;height: 1000px;width: 100%;z-index: 0;position: absolute;filter: brightness(0.3) blur(10px);';
				}
				//noimage
				if(document.getElementById('amn_backgroud_image') != null){
					if(document.getElementById('amn_backgroud_image').style.backgroundImage == 'url("")'){
						document.getElementById('amn_backgroud_image').style.backgroundImage = ("url("+ar_rep+")");
					}	
				}
				//append back
				document.getElementById("web-main").insertBefore(back, document.getElementById("web-main").firstChild);
				//既にバックグラウンドがあるとき
				}else{
					if(document.body.classList.value.indexOf('dark-mode') == -1){
						document.getElementById('amn_backgroud_image').animate({backgroundImage:"url("+ar_rep+")", filter:"blur(10px)"}, {duration :1000, fill:"both"});
					}
					if(document.body.classList.value.indexOf('dark-mode') != -1){
						document.getElementById('amn_backgroud_image').animate({backgroundImage:"url("+ar_rep+")", filter:"blur(10px) brightness(0.3)"}, {duration :1000, fill:"both"});
					}
					//noimage
					if(document.getElementById('amn_backgroud_image') != null){
						if(document.getElementById('amn_backgroud_image').style.backgroundImage == 'url("")'){
							//retry load image
							for(var i=0;i<30;i++){
								if(document.body.classList.value.indexOf('dark-mode') == -1){
									document.getElementById('amn_backgroud_image').animate({backgroundImage:"url("+ar_rep+")", filter:"blur(10px)"}, {duration :1000, fill:"both"});
								}
								if(document.body.classList.value.indexOf('dark-mode') != -1){
									document.getElementById('amn_backgroud_image').animate({backgroundImage:"url("+ar_rep+")", filter:"blur(10px) brightness(0.3)"}, {duration :1000, fill:"both"});
								}
								if(document.getElementById('amn_backgroud_image').style.backgroundImage != 'url("")'){
									break
								}
							}
						}	
					}
				}
			}
		}
		//end
		}
		var send_info = {songname: ap_title, artist: ap_al, img_url: ar_rep, duration: audio_duration, now_time: audio_nowtime, music_url: nm_url};
		chrome.runtime.sendMessage(send_info);
		}
	}
}

chrome.runtime.onMessage.addListener(function(durl_data, sender, sendResponse){
	//backgroudから時間変更もらったら時間変更
	//console.log(durl_data);
	try{
		if (durl_data != null){
			document.getElementsByTagName('audio')[0].currentTime = durl_data / 100;
		}
	}catch(e){
		//console.log(e);
	}
	return true;
});
chrome.runtime.onMessage.addListener(function(eqa_data, sender, sendResponse){
	//backgroudからEQもらったらEQ変更
	if (eqa_data != undefined){
		try{
			localStorage.setItem('amn_content_eqd', JSON.stringify({bass: eqa_data.bass, mid: eqa_data.mid, tre: eqa_data.tre, back_g: eqa_data.back_image, eq_tf:eqa_data.eq_tf}));
			bass_filter.gain.value = parseFloat(eqa_data.bass);
			mid_filter.gain.value = parseFloat(eqa_data.mid);
			tre_filter.gain.value = parseFloat(eqa_data.tre);
		}catch(e){
			//console.log(e);
		}
	}
	return true;
});

function effect_init(){
	audio_tag = document.getElementsByTagName('audio')[0];//audiotag set
	context = new AudioContext();//create ac
	gain = context.createGain();
	//create filter
	bass_filter = context.createBiquadFilter();
	mid_filter = context.createBiquadFilter();
	tre_filter = context.createBiquadFilter();
	//connect
	source = context.createMediaElementSource(audio_tag);
	gain.connect(bass_filter);
	gain.connect(mid_filter);
	gain.connect(tre_filter);
	//filter setting
	bass_filter.type = (typeof bass_filter.type === 'string') ? 'lowshelf' : 3;
	mid_filter.type = (typeof mid_filter.type === 'string') ? 'peaking' : 5;
	tre_filter.type = (typeof tre_filter.type === 'string') ? 'highshelf' : 4;
	bass_filter.frequency.value = 64;//60Hz
	mid_filter.frequency.value = 800;//800Hz
	tre_filter.frequency.value = 2000;//2000Hz
	//filter connect
	source.connect(bass_filter);
	source.connect(mid_filter);
	source.connect(tre_filter);
	bass_filter.connect(context.destination);
	mid_filter.connect(context.destination);
	tre_filter.connect(context.destination);
	source.connect(gain);
	//create gain node
	gainNode = context.createGain();
	source.connect(gainNode);
	gainNode.connect(context.destination);
	//dB Data init
	bass_filter.gain.value = JSON.parse(localStorage.amn_content_eqd).bass;
	mid_filter.gain.value = JSON.parse(localStorage.amn_content_eqd).mid;
	tre_filter.gain.value = JSON.parse(localStorage.amn_content_eqd).tre;
	gainNode.gain.value = -5;
}