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
//
//fix bug
if(location.pathname == "/library/albums"){
	document.getElementsByClassName('web-navigation__navigation-details-view page-container')[0].addEventListener('scroll', function() {
		console.warn("aaa");
	}, false);
}
//
window.onload = function(){
	var head = document.getElementsByTagName('head')[0];
	var linka = document.createElement('script');
	linka.innerText = `
	var logdata = console.log;
var log_array = [];
var bgc;
var comps;
var a_art_src;
var music_type;
console.log = function () {
  log_array = [];
  log_array.push.apply(log_array, arguments);
  console.warn(log_array);
  if (log_array[0] == "MK.JS nowPlayingItemDidChange" && typeof log_array[1] != "undefined") {
    if (typeof log_array[1]._container.attributes == "undefined") {
      bgc = null;
      if (typeof log_array[1].artwork?.url != "undefined") {
        a_art_src = log_array[1].artwork.url;
      } else {
        a_art_src = "https://music.apple.com/assets/product/MissingArtworkMusic.svg";
      }
    } else {
      if (log_array[1].artworkURL == undefined) {
		  if(typeof log_array[1]._container.attributes.artwork?.url == "undefined"){
			a_art_src = "https://music.apple.com/assets/product/MissingArtworkMusic.svg";
		  }else{
			  a_art_src = log_array[1]._container.attributes.artwork.url;
		  }
      } else {
		  if(typeof log_array[1].artworkURL == "undefined"){
			  a_art_src = "https://music.apple.com/assets/product/MissingArtworkMusic.svg";
		  }else{
			  a_art_src = log_array[1].artworkURL;
		  }
      }
	  if(typeof log_array[1]._container.attributes.artwork?.bgColor != "undefined"){
		  bgc = log_array[1]._container.attributes.artwork.bgColor;
	  }else{
		bgc = null;
	  }
    }
    if (log_array[1].attributes.composerName == undefined) {
      comps = null;
    } else {
      comps = log_array[1].attributes.composerName;
    }
    if (log_array[1].normalizedType == "music-videos") {
      music_type = "mv";
    } else {
      music_type = "song";
    }
    var song_info = {
      pl_trg: log_array[1]._container.type,
      al_id: log_array[1].albumId,
      s_id: log_array[1].attributes.playParams.id,
      composer: comps,
      song_name: log_array[1].attributes.name,
      artist_name: log_array[1].attributes.artistName,
      album_name: log_array[1].attributes.albumName,
      art_work: a_art_src,
      bg_color: bgc,
      music_type: music_type
    };
    console.warn(song_info);
    if (document.getElementById("amn_metadata") == null) {
      var head = document.getElementsByTagName("body")[0];
      var linka = document.createElement("script");
      linka.id = "amn_metadata";
      linka.type = "application/json";
      linka.innerText = JSON.stringify(song_info);
      head.appendChild(linka);
    } else {
      document.getElementById("amn_metadata").innerText = JSON.stringify(song_info);
    }
  }
};`;
	head.appendChild(linka);
	//Metadata_ConsoleLog(Debug)
	if(localStorage.getItem('music-app-pref:show-logs') == null){
		console.warn('DebugMode=>ON\r\nOFF=>Run"localStorage.setItem("music-app-pref:show-logs", false);"');
		localStorage.setItem('music-app-pref:show-logs', true);
	}else{
		if(localStorage.getItem('music-app-pref:show-logs') == "false"){
			console.warn('DebugMode=>OFF\r\nON=>Run"localStorage.setItem("music-app-pref:show-logs", true);"');
		}else{
			console.warn('DebugMode=>ON\r\nOFF=>Run"localStorage.setItem("music-app-pref:show-logs", false);"');
		}
	}
	//create_background_image_css
	const dark_css = '@media (prefers-color-scheme: dark) {#amn_backgroud_image{background-position: center;background-repeat: no-repeat;background-size: cover;height: 100%;width: 100%;z-index: 0;position: absolute;filter: brightness(0.3) blur(10px)'+String.raw` url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='10' result='b'/%3E%3CfeMorphology operator='dilate' radius='10'/%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a");}`;
	const light_css  ='#amn_backgroud_image{background-position: center;background-repeat: no-repeat;background-size: cover;height: 100%;width: 100%;z-index: 0;position: absolute;filter: blur(10px)'+String.raw` url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='10' result='b'/%3E%3CfeMorphology operator='dilate' radius='10'/%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a");}`;
	//var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('style');
	link.innerText = light_css+dark_css;
	head.appendChild(link);
	//
	if(localStorage.amn_content_eqd == undefined){
		localStorage.setItem('amn_content_eqd', JSON.stringify({bass: 0, mid: 0, tre: 0, back_g: false, eq_tf: false}));
	}
	/*if(Object.keys(JSON.parse(localStorage.amn_content_eqd)).length < 1){
		//backup restore
		localStorage.setItem('amn_content_eqd', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd_bup).bass, mid: JSON.parse(localStorage.amn_content_eqd_bup).mid, tre: JSON.parse(localStorage.amn_content_eqd_bup).tre, back_g: JSON.parse(localStorage.amn_content_eqd_bup).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd_bup).eq_tf}));
	}*/
	//append css
	var cre_css = document.createElement("style");
	cre_css.innerText = '.product-info {z-index: 0;}';
	document.getElementsByTagName('head')[0].appendChild(cre_css);
setInterval(appl, 600);
function appl() {
	try {
		if(location.hostname == "music.apple.com"){
			if(location.pathname == "/library/albums" || location.pathname == "/library/albums/"){
				document.getElementsByClassName('albums-virtual-scrolling-container')[0].removeAttribute('style');
			}
			if(location.pathname.indexOf("/library/albums/") == 0 && location.pathname != "/library/albums/"){
				if(document.getElementsByClassName('media-artwork-v2__image')[1].naturalHeight >= 1900){
					document.getElementsByClassName('media-artwork-v2__image')[1].style.height = "270px";
				}
			}
		}
	} catch (error) {
		
	}
	if (document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll')[0] == null || document.getElementsByClassName('media-artwork-v2__image')[0].currentSrc == "") {
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
				
				var lcds_arts = document.getElementsByClassName('media-artwork-v2__image')[0];
				if(lcds_arts.src == "https://music.apple.com/assets/product/MissingArtworkMusic.svg" || lcds_arts.src.indexOf(".blobstore.apple.com")>-1){
					lcds_arts.src = ar_rep;
				}
			}else{
				ap_title = document.getElementsByClassName('web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper')[0].innerText.trim();
				ap_al = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll')[0].innerText;
				artw = document.getElementsByClassName('media-artwork-v2__image')[0].currentSrc;
				ar_rep = artw.replace(/\d{1,3}x\d{1,3}bb(?:-\d{1,4})?/g, '500x500');
				alb = document.getElementsByClassName('web-chrome-playback-lcd__sub-copy-scroll-inner-text-wrapper')[0].childNodes[3].textContent;
				artist_alb = ap_al.split(/\s[\u2014]\s\s/)[0] + "<=-=>" + ap_al.split(/\s[\u2014]\s\s/)[1];
				ms_ar_al = ap_al.split(/\s[\u2014]\s\s/)[0] + "-" + ap_al.split(/\s[\u2014]\s\s/)[1];
			}
		//end
		//2020_05_24_nowtime
		var audio_duration, audio_nowtime, audio_pause;
		if(document.getElementById('amn_metadata') != undefined && metadata.music_type == "mv"){
			audio_duration = null;
			audio_nowtime = null;
		}else{
			audio_duration = document.getElementsByTagName('audio')[0].duration;
			audio_nowtime = document.getElementsByTagName('audio')[0].currentTime;
			audio_pause = document.getElementsByTagName("audio")[0].paused;
		}
		
		//end
		//var clogs_length = console.logs.length - 1;
		//console.log(console.logs[clogs_length]);
		//
		if ('mediaSession' in navigator && m_upl != ap_title) {
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
					nm_url = `https://music.apple.com/jp/album/${metadata.al_id}?i=${metadata.s_id}`;
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
			

				if (ef_init == true && JSON.parse(localStorage.amn_content_eqd).eq_tf){
					effect_init();
					//value backup
					//localStorage.setItem('amn_content_eqd_bup', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd).bass, mid: JSON.parse(localStorage.amn_content_eqd).mid, tre: JSON.parse(localStorage.amn_content_eqd).tre, back_g: JSON.parse(localStorage.amn_content_eqd).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd).eq_tf}));
					ef_init = false;
				}
				/*if(Object.keys(JSON.parse(localStorage.amn_content_eqd)).length < 1){
					//backup restore
					localStorage.setItem('amn_content_eqd', JSON.stringify({bass: JSON.parse(localStorage.amn_content_eqd_bup).bass, mid: JSON.parse(localStorage.amn_content_eqd_bup).mid, tre: JSON.parse(localStorage.amn_content_eqd_bup).tre, back_g: JSON.parse(localStorage.amn_content_eqd_bup).back_g, eq_tf: JSON.parse(localStorage.amn_content_eqd_bup).eq_tf}));
				}*/
				// append backgroud
				if(JSON.parse(localStorage.amn_content_eqd).back_g){
					if(document.getElementById('amn_metadata') == undefined){
						//XHRで画像もらってくる
						var image_bin = "";
						var image_xhr = new XMLHttpRequest();
						image_xhr.open("GET", ar_rep, true);
						image_xhr.responseType = "arraybuffer";
						image_xhr.withCredentials = true;
						image_xhr.onload = function(){
							//console.log(image_xhr.status+"-"+image_xhr.readyState);
							//console.log(ar_rep);
							if(image_xhr.readyState == 4 && image_xhr.status == 200){
								var im_byte = new Uint8Array(image_xhr.response);
								for(var i=0;i<im_byte.byteLength;i++){
									image_bin += String.fromCharCode(im_byte[i]);
								}
								image_b64 =  btoa(image_bin);
								//console.log(image_b64);
								//back append
								append_background();
							}
						}
						image_xhr.send();
						append_background();
					}else{
						if(typeof document.getElementById('amn_metadata') != "undefined"){
							chrome.runtime.sendMessage({type: "img_conv", url:ar_rep});
							chrome.runtime.onMessage.addListener(function(img_b64_data, sender, sendResponse){
								try{
									if(img_b64_data.type == "img_conv_return"){
									//console.warn(img_b64_data.b64_conv);
									image_b64 = img_b64_data.b64_conv;
									append_background();
									}
								}catch(e){

								}
								
							})
						}
					}
				}
			}
			//end
		}
		var send_info = {songname: ap_title, artist: artist_alb, img_url: ar_rep, duration: audio_duration, now_time: audio_nowtime, music_url: nm_url, paused : audio_pause};
		chrome.runtime.sendMessage(send_info);
	}
}
}

function append_background() {
	//missing svg
	var image_type;
	if (ar_rep == "https://music.apple.com/assets/product/MissingArtworkMusic.svg") {
	  image_type = "image/svg+xml";
	} else {
	  image_type = "image/jpeg";
	}
	//amn_bacground_imageが無い状態のとき
	if (document.getElementById('amn_backgroud_image') == null) {
	  //create bakgroud
	  var back = document.createElement("div");
	  back.id = 'amn_backgroud_image';
	  back.style = "background-image: url(" + "data:" + image_type + ";base64," + image_b64 + ");";
	
	  /*if (document.body.classList.value.indexOf('dark-mode') == -1) {
		//background light-mode
		back.style = "background-image: url(" + "data:" + image_type + ";base64," + image_b64 + ");";
	  }
	  if (document.body.classList.value.indexOf('dark-mode') != -1) {
		//background light-mode
		back.style = "background-image: url(" + "data:" + image_type + ";base64," + image_b64 + ");";
	  }*/
	  
	  //noimage
	  if (document.getElementById('amn_backgroud_image') != null) {
		if (document.getElementById('amn_backgroud_image').style.backgroundImage == 'url("")') {
		  document.getElementById('amn_backgroud_image').style.backgroundImage = ("url(" + "data:" + image_type + ";base64," + image_b64 + ")");
		}
	  }
	  //append back
	  document.getElementById("web-main").insertBefore(back, document.getElementById("web-main").firstChild);
	  //既にバックグラウンドがあるとき
	} else {
		document.getElementById('amn_backgroud_image').animate({
			backgroundImage: "url(" + "data:" + image_type + ";base64," + image_b64 + ")"
		}, {
			duration: 1000,
			fill: "both"
		});
	  }

	  //noimage
	  if (document.getElementById('amn_backgroud_image') != null) {
		if (document.getElementById('amn_backgroud_image').style.backgroundImage == 'url("")') {
		  //retry load image
		  for (var i = 0; i < 30; i++) {
			if (document.body.classList.value.indexOf('dark-mode') == -1) {
			  document.getElementById('amn_backgroud_image').animate({
				backgroundImage: "url(" + "data:" + image_type + ";base64," + image_b64 + ")",
				filter: "blur(10px)"
			  }, {
				duration: 1000,
				fill: "both"
			  });
			}
			if (document.body.classList.value.indexOf('dark-mode') != -1) {
			  document.getElementById('amn_backgroud_image').animate({
				backgroundImage: "url(" + "data:" + image_type + ";base64," + image_b64 + ")",
				filter: "blur(10px) brightness(0.3)"
			  }, {
				duration: 1000,
				fill: "both"
			  });
			}
			if (document.getElementById('amn_backgroud_image').style.backgroundImage != 'url("")') {
			  break
			}
		  }
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
				document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[2].click();
			}
			if(play_ctrl.prev == 1){
				document.getElementsByClassName('button-reset web-chrome-playback-controls__playback-btn')[0].click();
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