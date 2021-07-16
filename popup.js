var artist_name;
var song_name;
var album_name;
var artist_rep;
var mdata;
var tid;
var st_p = true;
var m_shurl;
var play_pause = 0;
var paused = null;
var setting_open = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	try{
		var ar_alb_split = message.artist.split('<=-=>');
		//console.log(message);
		paused = message.paused;
		if(message.paused == false){
			play_pause = 1;
			document.getElementById('play').src = chrome.extension.getURL('svg/pause.svg');
		}else{
			play_pause = 0;
			document.getElementById('play').src = chrome.extension.getURL('svg/play.svg');
		}
		st_p = false;
		song_name = message.songname;
		artist_name = ar_alb_split[0];
		album_name = ar_alb_split[1];
		artist_rep = encodeURIComponent(ar_alb_split[0].replace(/CV:/g, "").replace(/、/g, ",").replace(/\s&\s/g, ","));
		document.getElementById('cover').src = message.img_url;
		if(document.getElementById('songname').innerText.length > 12){
			document.getElementById('songname').style.fontSize = '20px';
		}
		if(mdata != message.songname){
			mdata = message.songname;
			m_shurl = message.music_url;
			document.getElementById('songname').innerText = song_name;
			document.getElementById('artist').innerText = artist_name;
			document.getElementById('album').innerText = album_name;
			document.getElementById('g_wind').style.visibility = "visible";
			document.getElementById('tw_share').style.visibility = "visible";
			//
			document.getElementById('eq_on').disabled = false;
			document.getElementById('backg_on').disabled = false;
			document.getElementById('bass_bar').disabled = false;
			document.getElementById('mid_bar').disabled = false;
			document.getElementById('tre_bar').disabled = false;
			document.getElementById('eq_reset').disabled = false;
		}
		//nowtime
		var dr_m = new Date(parseInt(message.duration*1000));
		var nt_m = new Date(parseInt(message.now_time*1000));
		document.getElementById('a_duration').innerText = ('0' + dr_m.getMinutes()).slice(-1) + ":" + ('00' + dr_m.getSeconds()).slice(-2);
		document.getElementById('nowtime').innerText = ('0' + nt_m.getMinutes()).slice(-1) + ":" + ('00' + nt_m.getSeconds()).slice(-2);
		document.getElementById('s_bar').max = parseInt(message.duration*100);
		document.getElementById('s_bar').value = parseInt(message.now_time*100);
		tid = sender.tab.id;
		//bitrate
		if(message.music_bitrate != null){
			document.getElementById('songname').title = `${message.music_bitrate}kbps-${message.music_samplerate / 1000}kHz`;
		}else{
			document.getElementById('songname').title = "";
		}
	}
	catch(e){
		//console.log("exception");
	}
	
	//end
	return true;
})	
//
var bass_db,mid_db,tre_db,mvol_db;
if (localStorage.getItem('amn_eqd') == null){
	bass_db = 0;
	mid_db = 0;
	tre_db = 0;
	mvol_db = 0;
	var eq_data = JSON.stringify({type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid});
	localStorage.setItem('amn_eqd', eq_data);
}else{
	var local_set = JSON.parse(localStorage.getItem('amn_eqd'));
	bass_db = local_set.bass;
	mid_db = local_set.mid;
	tre_db = local_set.tre;
	mvol_db = 0;
}
if(localStorage.getItem('new_minip') == null){
	localStorage.setItem('new_minip', true);
}
document.addEventListener('DOMContentLoaded', function() {
	document.getElementsByClassName('eq_bar')[0].addEventListener('input', function() {
		bass_db = document.getElementById('bass_bar').value - 20;
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
	document.getElementsByClassName('eq_bar')[1].addEventListener('input', function() {
		mid_db = document.getElementById('mid_bar').value - 20;
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
	document.getElementsByClassName('eq_bar')[2].addEventListener('input', function() {
		tre_db = document.getElementById('tre_bar').value - 20;
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
	document.getElementById('backg_on').addEventListener('change', function(){
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
	document.getElementById('eq_on').addEventListener('change', function(){
		if(document.getElementById('eq_on').checked == false){
			document.getElementById('bass_bar').disabled = true;
			document.getElementById('mid_bar').disabled = true;
			document.getElementById('tre_bar').disabled = true;
			document.getElementById('eq_reset').disabled = true;
		}else{
			document.getElementById('bass_bar').disabled = false;
			document.getElementById('mid_bar').disabled = false;
			document.getElementById('tre_bar').disabled = false;
			document.getElementById('eq_reset').disabled = false;
		}
		window.alert(chrome.i18n.getMessage('eq_append_message'));
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
	document.getElementById('eq_reset').addEventListener('click', function(){
		document.getElementById('bass_bar').value = 20;
		document.getElementById('mid_bar').value = 20;
		document.getElementById('tre_bar').value = 20;
		bass_db = 0;
		mid_db = 0;
		tre_db = 0;
		var eq_data = {type: "settings", bass: 0, mid: 0, tre: 0, tab_id: tid, back_image: document.getElementById('backg_on').checked, eq_tf: document.getElementById('eq_on').checked};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
		chrome.runtime.sendMessage(eq_data);
	}, false);
});
//
document.addEventListener('DOMContentLoaded', function() {
	//
	if(paused == null){
		document.getElementById('play').src = chrome.extension.getURL('svg/play.svg');
	}else{
		if(message.paused == false){
			play_pause = 1;
			document.getElementById('play').src = chrome.extension.getURL('svg/pause.svg');
		}else{
			play_pause = 0;
			document.getElementById('play').src = chrome.extension.getURL('svg/play.svg');
		}
	}
	
	//new miniplayer
	if(localStorage.getItem('new_minip') == "false"){
		document.getElementById('new_minip_on').checked = false;
	}else{
		document.getElementById('new_minip_on').checked = true;
	}
	//check
	document.getElementById('new_minip_on').addEventListener('change', function(){
		localStorage.setItem('new_minip', document.getElementById('new_minip_on').checked);
	}, false);

	//SeekBar2020_0602
	var s_bar = document.getElementById('s_bar');
	s_bar.addEventListener('input', function() {
		var seek_data = {change_time: s_bar.value, tab_id: tid};
		chrome.runtime.sendMessage(seek_data);
	}, false);
	//playctrl play(0=nomal,1=click),next(0=nomal,1=click),back(0=nomal,1=click)
	document.getElementById('play').addEventListener('click', function(){
		if(play_pause == 1){
			play_pause = 0;
			document.getElementById('play').src = chrome.extension.getURL('svg/pause.svg');
		}else{
			play_pause = 1;
			document.getElementById('play').src = chrome.extension.getURL('svg/play.svg');
		}
		var plctrl = {type: "play_ctrl", play: 1, next :0, prev: 0, tab_id: tid};
		chrome.runtime.sendMessage(plctrl);
	});
	document.getElementById('next').addEventListener('click', function(){
		var plctrl = {type: "play_ctrl", play: 0, next :1, prev: 0, tab_id: tid};
		chrome.runtime.sendMessage(plctrl);
	});
	document.getElementById('prv').addEventListener('click', function(){
		var plctrl = {type: "play_ctrl", play: 0, next :0, prev: 1, tab_id: tid};
		chrome.runtime.sendMessage(plctrl);
	});
//
document.getElementById('show_tos').addEventListener('click', function() {
	alert(chrome.i18n.getMessage('tos_message'));
});
//
document.getElementById('feed_back').addEventListener('click', function() {
	chrome.windows.create({
		url: chrome.i18n.getMessage('feedback_url'),
		type: "popup",
		height : 600,
		width : 800
	});
});
//end
	var lyric = document.getElementById('cover');
	lyric.addEventListener('click', function() {
		if(st_p == false){
			var ure = encodeURIComponent(song_name.replace(/\+\:|:\+/g,":").replace(/~/g,"～").replace(/〜/g,"~"));
			var lrc_url = 'https://utaten.com/lyric/'+artist_rep.trim()+"/"+ure+"/";
			console.log(lrc_url);
			chrome.windows.create({
				url: lrc_url,
				type: "popup",
				height : 600,
				width : 800
			});
		}
	});
	//window
	var op_window = document.getElementById('g_wind');
	op_window.addEventListener('click', function() {
		var wop_url;
		var mp_w;
		var mp_h;
		if(document.getElementById('new_minip_on').checked == true){
			wop_url = chrome.extension.getURL('nv_minip.html');//20200912
			mp_w = 480;
			mp_h = 175;
		}else{
			wop_url = chrome.extension.getURL('minip.html');//20200912
			mp_w = 330;
			mp_h = 520;
		}
		chrome.windows.create({
			url: wop_url,
			type: "popup",
			width : mp_w,
			height : mp_h
		});
	});
	//
	var tw_s = document.getElementById('tw_share');
	var settings = document.getElementById('set_icon');
	var backg_on = document.getElementById('backg_tf');
	//
	tw_s.src = chrome.extension.getURL('svg/twitter.svg');
	op_window.src = chrome.extension.getURL('svg/miniw.svg');
	settings.src = chrome.extension.getURL('svg/settings.svg');
	//
	document.getElementById('next').src = chrome.extension.getURL('svg/next.svg');
	document.getElementById('prv').src = chrome.extension.getURL('svg/prev.svg');
	//
	op_window.title = chrome.i18n.getMessage('open_window');
	tw_s.title = chrome.i18n.getMessage('tw_tit');
	lyric.title = chrome.i18n.getMessage('lrc_tit');
	settings.title = chrome.i18n.getMessage('setting_button');
	document.getElementById('songname').innerText = chrome.i18n.getMessage('status_message');
	document.getElementById('backg_tf').innerText = chrome.i18n.getMessage('backgtf_message');
	document.getElementById('other_s_message').innerText = chrome.i18n.getMessage('other_set_message');
	document.getElementById('backg_on').title = chrome.i18n.getMessage('backg_d_message');
	document.getElementById('backg_on').title = chrome.i18n.getMessage('backg_d_message');
	document.getElementById('bass_bar').title = chrome.i18n.getMessage('backg_d_message');
	document.getElementById('mid_bar').title = chrome.i18n.getMessage('backg_d_message');
	document.getElementById('tre_bar').title = chrome.i18n.getMessage('backg_d_message');
	//
	document.getElementById('play').title = chrome.i18n.getMessage('s_play_pause');
	document.getElementById('next').title = chrome.i18n.getMessage('s_next');
	document.getElementById('prv').title = chrome.i18n.getMessage('s_prev');
	//
	document.getElementById('new_minip').innerText = chrome.i18n.getMessage('new_minip_message');
	//
	document.getElementById('show_tos').value = chrome.i18n.getMessage('tos');
	document.getElementById('feed_back').value = chrome.i18n.getMessage('feedback');
	//
	if(window.matchMedia('(prefers-color-scheme: dark)').matches){
		document.getElementById('cover').src = 'https://music.apple.com/assets/product/MissingArtworkMusic_dark.svg';
	}
	//
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
	//set
	settings.addEventListener('click', function() {
		if(document.getElementById('settings').style.visibility == "visible"){
			setting_open = false;
			document.getElementById('settings').style.visibility = "hidden";
		}else{
			setting_open = true;
			var local_set = JSON.parse(localStorage.getItem('amn_eqd'));
			document.getElementById('bass_bar').value = local_set.bass + 20;
			document.getElementById('mid_bar').value = local_set.mid + 20;
			document.getElementById('tre_bar').value = local_set.tre + 20;
			document.getElementById('settings').style.visibility = "visible";
			document.getElementById('backg_on').checked = local_set.back_image;
			document.getElementById('eq_on').checked = local_set.eq_tf;
			// back mode change
			if(document.getElementById('artist').innerText == ""){
				document.getElementById('eq_on').disabled = true;
				document.getElementById('backg_on').disabled = true;
				document.getElementById('bass_bar').disabled = true;
				document.getElementById('mid_bar').disabled = true;
				document.getElementById('tre_bar').disabled = true;
				document.getElementById('eq_reset').disabled = true;
			}
		}
	});
	document.getElementById('main').addEventListener('click', function() {
		if(setting_open == true){
			setting_open = false;
			document.getElementById('settings').style.visibility = "hidden";
		}
	});
	if(window.onbeforeunload){
		var eq_data = {type: "settings", bass: bass_db, mid: mid_db, tre: tre_db, tab_id: tid};
		localStorage.setItem('amn_eqd', JSON.stringify(eq_data));
	}
});