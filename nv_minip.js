var artist_name;
var song_name;
var album_name;
var artist_rep;
var mdata;
var tid;
var st_p = true;
var m_shurl;
var full_scr_status = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	try{
		var ar_alb_split = message.artist.split('<=-=>');
		st_p = false;
		song_name = message.songname;
		if(mdata != message.songname){
			artist_name = ar_alb_split[0];
			album_name = ar_alb_split[1];
			artist_rep = encodeURIComponent(ar_alb_split[0].replace(/CV:/g, "").replace(/、/g, ",").replace(/\s&\s/g, ","));
			
			if(document.getElementById('songname').innerText.length > 12){
				document.getElementById('songname').style.fontSize = '20px';
			}
			//image XHR
			var image_bin = "";
			var image_xhr = new XMLHttpRequest();
			image_xhr.open("GET", message.img_url, true);
			image_xhr.responseType = "arraybuffer";
			image_xhr.onload = function(){
				//console.log(image_xhr.status+"-"+image_xhr.readyState);
				//console.log(message.img_url);
				var image_type;
				if (message.img_url == "https://music.apple.com/assets/product/MissingArtworkMusic.svg") {
					image_type = "image/svg+xml";
				} else {
					image_type = "image/jpeg";
				}
				if(image_xhr.readyState == 4 && image_xhr.status == 200){
					var im_byte = new Uint8Array(image_xhr.response);
					for(var i=0;i<im_byte.byteLength;i++){
						image_bin += String.fromCharCode(im_byte[i]);
					}
					image_b64 =  btoa(image_bin);
					//console.log(image_b64);
					//back append
					document.getElementById('fl_back_cover').src = "data:" + image_type + ";base64," + image_b64;
					document.getElementById('cover').animate({backgroundImage:"url(" + "data:" + image_type + ";base64," + image_b64 + ")"}, {duration :1000, fill:"both"});
				}
			}
			image_xhr.send();
			/*fcsr
			document.getElementById('fl_back_cover').src = message.img_url;
			document.getElementById('cover').animate({backgroundImage:"url("+message.img_url+")"}, {duration :1000, fill:"both"});
			*/
			mdata = message.songname;
			m_shurl = message.music_url;
			document.getElementById('songname').innerText = song_name;
			document.getElementById('artist').innerText = artist_name;
			document.getElementById('album').innerText = album_name;
			//fullscr
			document.getElementsByClassName('songname_fscr')[0].innerText = song_name;
			document.getElementsByClassName('artist_fscr')[0].innerText = artist_name;
			document.getElementsByClassName('album_fscr')[0].innerText = album_name;
			//
			document.getElementById('share').style.visibility = "visible";
			document.title =  "▶" + song_name + "-" + artist_name;
		}
		//nowtime
		var dr_m = new Date(parseInt(message.duration*1000));
		var nt_m = new Date(parseInt(message.now_time*1000));
		document.getElementById('a_duration').innerText = ('0' + dr_m.getMinutes()).slice(-1) + ":" + ('00' + dr_m.getSeconds()).slice(-2);
		document.getElementById('nowtime').innerText = ('0' + nt_m.getMinutes()).slice(-1) + ":" + ('00' + nt_m.getSeconds()).slice(-2);
		document.getElementById('s_bar').max = parseInt(message.duration*100);
		document.getElementById('s_bar').value = parseInt(message.now_time*100);
		tid = sender.tab.id;
	}
	catch(e){
		//console.log("exception");
	}
	
	//end
	return true;
})	
//
document.addEventListener('DOMContentLoaded', function() {
	//SeekBar2020_0602
	var s_bar = document.getElementById('s_bar');
	s_bar.addEventListener('input', function() {
		var seek_data = {change_time: s_bar.value, tab_id: tid};
		chrome.runtime.sendMessage(seek_data);
	}, false);
//end

	var lyric = document.getElementById('cover');
	
	lyric.addEventListener('click', function() {
		if(st_p == false){
			var ure = encodeURIComponent(song_name.replace(/\+\:|:\+/g,":").replace(/~/g,"～").replace(/〜/g,"~"));
			var aaa = "https://utaten.com/lyric/"+artist_rep.trim()+"/"+ure+"/";
			console.log(aaa);
			chrome.windows.create({
				url: aaa,
				type: "popup",
				height : 600,
				width : 800
			});
		}
	});
	var tw_s = document.getElementById('tw_share');
	tw_s.src = chrome.extension.getURL('svg/twitter.svg');
	tw_s.title = chrome.i18n.getMessage('tw_tit');
	lyric.title = chrome.i18n.getMessage('lrc_tit');
	//fullscr
	document.getElementById('full_screen').src = chrome.extension.getURL('svg/fullscr.svg');
	document.getElementById('full_screen').title = chrome.i18n.getMessage('fullscr_message');
	document.getElementById('full_screen').addEventListener('click', function() {
		full_scr_status = true;
		document.getElementById('main').requestFullscreen();
	});
	//
	document.getElementById('songname').innerText = chrome.i18n.getMessage('status_message');
	if(window.matchMedia('(prefers-color-scheme: dark)').matches){
		document.getElementById('cover').src = "https://music.apple.com/assets/product/MissingArtworkMusic_dark.svg";
	}
	//
	tw_s.addEventListener('click', function() {
		var s_text = encodeURIComponent(chrome.i18n.getMessage('sh1')+artist_name+chrome.i18n.getMessage('sh2')+song_name+chrome.i18n.getMessage('sh3'));
		chrome.windows.create({
			url: 'https://twitter.com/intent/tweet?text='+s_text+'&url='+encodeURIComponent(m_shurl)+'&hashtags=NowPlaying',
			type: "popup",
			height : 600,
			width : 800
		  })
	});
	document.getElementById('fl_back_cover').addEventListener('dblclick', function() {
		if(full_scr_status == true){
			full_scr_status = false;
			document.exitFullscreen();
		}
	});
});