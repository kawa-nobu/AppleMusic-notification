setInterval(send_data, 100);
var artist_name;
var song_name;
var album_name;
var artist_rep
function send_data(){
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	song_name = message.songname;
	artist_name = message.artist.substring(0, message.artist.indexOf(" —"));
	album_name = message.artist.substring(100, message.artist.indexOf("— ")+2);
	artist_rep = encodeURIComponent(message.artist.substring(0, message.artist.indexOf(" —")).replace(/CV:/g, "").replace(/、/g, ",").replace(/\s&\s/g, ","));
	document.getElementById('cover').src = message.img_url;
	document.getElementById('songname').innerText = song_name;
	document.getElementById('artist').innerText = artist_name;
	document.getElementById('album').innerText = album_name;
	document.getElementById('share').style.visibility = "visible";
	
	return true;
})		
}
document.addEventListener('DOMContentLoaded', function() {
	var lyric = document.getElementById('cover');
	
	lyric.addEventListener('click', function() {
		var ure = encodeURIComponent(song_name.replace(/\+\:|:\+/g,":").replace(/~/g,"～").replace(/〜/g,"~"));
		var aaa = "https://utaten.com/lyric/"+artist_rep.trim()+"/"+ure+"/";
		console.log(aaa);
		chrome.windows.create({
			url: aaa,
			type: "popup",
			height : 600,
			width : 800
		  })
		
	});
	var tw_s = document.getElementById('tw_share');
	tw_s.src = chrome.extension.getURL('twitter.png');
	tw_s.title = chrome.i18n.getMessage('tw_tit');
	lyric.title = chrome.i18n.getMessage('lrc_tit');

	tw_s.addEventListener('click', function() {
		var s_text = encodeURIComponent(chrome.i18n.getMessage('sh1')+artist_name+chrome.i18n.getMessage('sh2')+song_name+chrome.i18n.getMessage('sh3'));
		chrome.windows.create({
			url: "https://twitter.com/intent/tweet?text="+s_text+"&hashtags=NowPlaying",
			type: "popup",
			height : 600,
			width : 800
		  })
    });
});