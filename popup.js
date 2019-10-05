setInterval(send_data, 100);
var artist_name;
var song_name;
var album_name;
function send_data(){
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	song_name = message.songname;
	artist_name = message.artist.substring(0, message.artist.indexOf(" —"));
	album_name = message.artist.substring(100, message.artist.indexOf("— ")+2);
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
			url: "https://utaten.com/lyric/"+artist_name.trim()+"/"+song_name.trim()+"/",
			type: "popup",
			height : 600,
			width : 800
		  })
    });
});