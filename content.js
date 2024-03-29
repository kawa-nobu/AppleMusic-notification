var m_upl;
var nm_url;
var ef_init = true;
var ar_rep;
//webaudio vars
var audio_tag;//audiotag set
var context;//create ac
var source;
var gain;
var bass_filter;
var mid_filter;
var tre_filter;
var gainNode;
//image Base64
var image_b64;
//
var artist_alb;
var ms_ar_al;
//bitrate
var m_bitrate,sm_rate;
//metadata_duration
var metadata_duration;
//fix bug
if(location.pathname == "/library/albums"){
	document.getElementsByClassName('web-navigation__navigation-details-view page-container')[0].addEventListener('scroll', function() {
		//console.warn("aaa");
	}, false);
}
//
window.onload = function(){
  	var top_script = document.createElement('script');
	  top_script.src = chrome.runtime.getURL('top_scr.js');
	  top_script.onload = function() {
    	this.remove();
	};
	(document.head || document.documentElement).appendChild(top_script);
	var top_css = document.createElement('link');
	  top_css.href = chrome.runtime.getURL('dark_sh.css');
	  console.log(chrome.runtime.getURL('dark_sh.css'));
	  top_css.rel = "stylesheet";
	(document.head || document.documentElement).appendChild(top_css);
	if(localStorage.amn_content_eqd == undefined){
		localStorage.setItem('amn_content_eqd', JSON.stringify({bass: 0, mid: 0, tre: 0, back_g: false, eq_tf: false}));
	}
	//append css
	var cre_css = document.createElement("style");
	cre_css.innerText = '.product-info {z-index: 0;}';
	document.getElementsByTagName('head')[0].appendChild(cre_css);
setInterval(appl, 550);
function appl() {
	try{
		var name_query = document.getElementsByTagName("amp-chrome-player")[0].shadowRoot.querySelector("div").querySelector(".chrome-player__lcd").getElementsByTagName("amp-lcd")[0].shadowRoot.querySelector(".lcd__track-info-container").querySelector(".lcd-meta .lcd-meta__primary-wrapper .lcd-meta-line__fragment").innerText;
		var picture_query = document.getElementsByTagName("amp-chrome-player")[0].shadowRoot.querySelector("div").querySelector(".chrome-player__lcd").getElementsByTagName("amp-lcd")[0].shadowRoot.querySelector("div picture img").src;
	}catch{
		var name_query = "none";
		var picture_query= "none";
	}
	
	if (name_query == null || picture_query == "") {
		var test = true;
	}else{
		if(location.hostname == "music.apple.com"){ //AppleMusic WebPlayer Only
			//v2.0.8 Get Metadata on Debug mode
			var ap_title, ap_al, artw, alb, metadata;
			if(document.getElementById('amn_metadata') != undefined){
				metadata = JSON.parse(document.getElementById('amn_metadata').innerText);
				ap_title = metadata.song_name;
				ap_al = metadata.artist_name;
				artw = metadata.art_work.replace(/{w}x{h}/g, '500x500').replace(/{f}/g, 'jpg');
				ar_rep = artw;

				alb = metadata.album_name;
				if(metadata.album_name !== undefined){
					ms_ar_al = `${metadata.artist_name}-${metadata.album_name}`;
					artist_alb = `${metadata.artist_name}<=-=>${metadata.album_name}`;
				}else{
					ms_ar_al = `${metadata.artist_name}`;
					artist_alb = `${metadata.artist_name}<=-=>`;
				}
				if(metadata.music_bitrate !== null){
					m_bitrate = metadata.music_bitrate;
					sm_rate = metadata.music_samplerate;
				}else{
					m_bitrate = null;
					sm_rate = null;
				}
				
				var lcds_arts = picture_query;
				if(lcds_arts == "https://music.apple.com/assets/product/MissingArtworkMusic.svg" || lcds_arts == "https://music.apple.com/assets/product/MissingArtworkMusic_dark.svg" ||  lcds_arts.indexOf(".blobstore.apple.com")>-1){
					lcds_arts = ar_rep;
				}
			}else{
				ap_title = "none";
				ap_al = "none";
				artw = "none";
				ar_rep = "none";
				alb = "none";
				artist_alb = "none";
				ms_ar_al = "none";
			}
		//end
		//2020_05_24_nowtime
		var audio_duration, audio_nowtime, audio_pause;
		if(document.getElementById('amn_metadata') != undefined && metadata.music_type == "mv"){
			audio_duration = null;
			audio_nowtime = null;
		}else{
			try {
				audio_duration = Math.ceil(JSON.parse(document.getElementById('amn_metadata').innerText).music_duration);
			} catch (error) {
				
			}
			audio_nowtime = document.getElementById("amn_now_time").innerText;
			if(document.getElementsByTagName("audio")[0] != undefined ){
				audio_pause = document.getElementsByTagName("audio")[0].paused;
			}else{
				audio_pause = false;
			}
			
		}
		if ('mediaSession' in navigator && m_upl != ap_title) {
			//alert("OK");
			m_upl = ap_title;
			navigator.mediaSession.metadata = new MediaMetadata({
				title: ap_title,
				artist: ms_ar_al,
				album: alb,
				artwork: [{ src: ar_rep,  sizes: '500x500',   type: 'image/jpeg' }]
			});
			navigator.mediaSession.setActionHandler('play', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('pause', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[1].click()});
			navigator.mediaSession.setActionHandler('previoustrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[0].click()});
			navigator.mediaSession.setActionHandler('nexttrack', function() {document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[2].click()});
			//get shareURL
			if(document.getElementById('amn_metadata') != undefined){
				var metadata = JSON.parse(document.getElementById('amn_metadata').innerText);
				if(metadata.al_id != "undefined"){
					if(metadata.s_id != -1){
						nm_url = `https://music.apple.com/jp/song/${metadata.s_id}`;
					}else{
						nm_url = "";
					}
				}else{
					nm_url = '';
				}
			}else{
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
				}
			//
			
			//document.getElementsByTagName("audio")[0].currentTime = 0;
				if (ef_init == true && JSON.parse(localStorage.amn_content_eqd).eq_tf){
					effect_init();
					//value backup
					//localStorage.setItem('amn_content_eqd_bup', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd).bass, mid: JSON.parse(localStorage.amn_content_eqd).mid, tre: JSON.parse(localStorage.amn_content_eqd).tre, back_g: JSON.parse(localStorage.amn_content_eqd).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd).eq_tf}));
					ef_init = false;
				}
				//バックグラウンド
				//バックグラウンドブラー画像
				if(JSON.parse(localStorage.amn_content_eqd).back_g && document.getElementById("amn_backgroud_image") == null){
					var back = document.createElement("div");
					back.type = "image";
	  				back.id = 'amn_backgroud_image';
					//back.src = ar_rep;
					document.getElementsByTagName("main")[0].insertBefore(back, document.getElementsByTagName("main")[0].firstChild);
					  document.getElementById('amn_backgroud_image').animate({
						backgroundImage: "url("+ar_rep+")",
						filter: "blur(10px)"
					  }, {
						duration: 1500,
						fill: "both"
					  });
				}else{
					if(JSON.parse(localStorage.amn_content_eqd).back_g){
						document.getElementById('amn_backgroud_image').animate({
						backgroundImage: "url("+ar_rep+")",
						filter: "blur(10px)"
					}, {
						duration: 1500,
						fill: "both"
					  });
					}
				}
			}
		}
		var send_info = {songname: ap_title, artist: artist_alb, img_url: ar_rep, duration: audio_duration, now_time: audio_nowtime, music_url: nm_url, music_bitrate: m_bitrate, music_samplerate: sm_rate, paused : audio_pause};
		chrome.runtime.sendMessage(send_info);
		
	}
}
}

chrome.runtime.onMessage.addListener(function(durl_data, sender, sendResponse){
	//backgroudから時間変更もらったら時間変更
	//console.log(durl_data);
	try{
		if (durl_data != null){
			document.getElementById("amn_time_changedata").textContent = JSON.stringify(durl_data / 100);
			//change_time();
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
			if(eqa_data.type == "settings"){
				var ls_bcup = localStorage.amn_content_eqd;
				localStorage.setItem('amn_content_eqd', JSON.stringify({bass: eqa_data.bass, mid: eqa_data.mid, tre: eqa_data.tre, back_g: eqa_data.back_image, eq_tf:eqa_data.eq_tf}));
				if(eqa_data.eq_tf != false){
					if(JSON.parse(ls_bcup).eq_tf == true){
						if(ef_init == true){
							ef_init = false;
							effect_init();
						}else{
							bass_filter.gain.value = parseFloat(eqa_data.bass);
							mid_filter.gain.value = parseFloat(eqa_data.mid);
							tre_filter.gain.value = parseFloat(eqa_data.tre);
						}
					}else{
						re_effect();
						bass_filter.gain.value = parseFloat(eqa_data.bass);
						mid_filter.gain.value = parseFloat(eqa_data.mid);
						tre_filter.gain.value = parseFloat(eqa_data.tre);
					}
				}else{
					gainNode.disconnect();
					bass_filter.disconnect();
					mid_filter.disconnect();
					tre_filter.disconnect();
					gainNode.connect(context.destination);
				}
			}
		}catch(e){
			//console.log(e);
		}
	}
	return true;
});
chrome.runtime.onMessage.addListener(function(play_ctrl, sender, sendResponse){
	//PlayCtrl
	//console.log(play_ctrl);
	if (play_ctrl != null){
		try{
			if(play_ctrl.play == 1){
				if(document.getElementsByTagName("audio")[0].paused == true){
					document.getElementsByTagName("audio")[0].play();
				}else{
					document.getElementsByTagName("audio")[0].pause();
				}
			}
			if(play_ctrl.next == 1){
				document.getElementsByTagName("amp-chrome-player")[0].shadowRoot.querySelector(".chrome-player__container div apple-music-playback-controls").shadowRoot.querySelector(".music-controls__main amp-playback-controls-item-skip.next").shadowRoot.querySelector("button").click();
			}
			if(play_ctrl.prev == 1){
				document.getElementsByTagName("amp-chrome-player")[0].shadowRoot.querySelector(".chrome-player__container div apple-music-playback-controls").shadowRoot.querySelector(".music-controls__main amp-playback-controls-item-skip.previous").shadowRoot.querySelector("button").click();
			}
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
function re_effect(){
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
}