setInterval(send_data, 100);
var artist_name;
var song_name;
var album_name;
var artist_rep
function send_data(){
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	song_name = message.songname;
	song_name_conv = song_name.replace(/\s+/g, "+")
	artist_name = message.artist.substring(0, message.artist.indexOf(" —"));
	album_name = message.artist.substring(100, message.artist.indexOf("— ")+2);
	artist_rep = message.artist.substring(0, message.artist.indexOf(" —")).replace(/CV:/g, '');
	document.getElementById('cover').src = message.img_url;
	document.getElementById('songname').innerText = song_name;
	document.getElementById('artist').innerText = artist_name;
	document.getElementById('album').innerText = album_name;
	return true;
})		
}

document.addEventListener('DOMContentLoaded', function() {
	var goto = document.getElementById('cover');
	goto.addEventListener('click', function() {	
		chrome.windows.create({
			url: "https://utaten.com/lyric/"+artist_rep.trim()+"/"+song_name_conv.replace(/~/g,"～")+"/",
			type: "popup",
			height : 600,
			width : 800
		  })
    });
});