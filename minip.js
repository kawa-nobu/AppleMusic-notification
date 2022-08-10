var artist_name;
var song_name;
var album_name;
var artist_rep;
var mdata;
var tid;
var st_p = true;
var m_shurl;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	try{
		st_p = false;
		song_name = message.songname;
		artist_name = message.artist.substring(0, message.artist.indexOf(" —"));
		album_name = message.artist.substring(100, message.artist.indexOf("— ")+2);
		artist_rep = encodeURIComponent(message.artist.substring(0, message.artist.indexOf(" —")).replace(/CV:/g, "").replace(/、/g, ",").replace(/\s&\s/g, ","));
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
			document.getElementById('share').style.visibility = "visible";
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
	tw_s.src = chrome.runtime.getURL('svg/twitter.svg');
	tw_s.title = chrome.i18n.getMessage('tw_tit');
	lyric.title = chrome.i18n.getMessage('lrc_tit');
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
});