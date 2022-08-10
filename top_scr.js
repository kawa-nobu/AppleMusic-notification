var logdata = console.log;
var log_array = [];
var bgc;
var comps;
var a_art_src;
var music_type;
var music_bitrate;
var music_samplerate;
var music_relese_date;
var al_id;
var ap_album_art;
console.log = function () {
  log_array = [];
  log_array.push.apply(log_array, arguments);
  //console.warn(log_array);
  if (log_array[0] == "PLAY!" && typeof audioPlayer != "undefined") {
	  
	  if(typeof audioPlayer._nowPlayingItem.attributes.artwork?.url  == 'undefined'){
		  if(typeof audioPlayer._nowPlayingItem?.hasContainerArtwork == 'undefined'){
			ap_album_art = "https://music.apple.com/assets/product/MissingArtworkMusic.svg";
		  }else{
			  ap_album_art = audioPlayer._nowPlayingItem.hasContainerArtwork;
		  }
	  }else{
		ap_album_art = audioPlayer._nowPlayingItem.attributes.artwork.url;
	  }
    var song_info = {
      pl_trg: audioPlayer._nowPlayingItem._container.type,
      al_id: null,//audioPlayer._nowPlayingItem._container.id
      s_id: audioPlayer._nowPlayingItem._songId,
      composer: audioPlayer._nowPlayingItem.attributes.composerName,
      song_name: audioPlayer._nowPlayingItem.attributes.name,
      artist_name: audioPlayer._nowPlayingItem.attributes.artistName,
      album_name: audioPlayer._nowPlayingItem.attributes.albumName,
      art_work: ap_album_art,
      bg_color: null,
      music_type: audioPlayer._nowPlayingItem.normalizedType,
	  music_bitrate: audioPlayer.bitrate,
	  music_samplerate: null,
	  music_duration: audioPlayer._nowPlayingItem.attributes.durationInMillis / 1000,
	  time_t_duration: ""
    };
    console.warn(song_info);
	//
	var head = document.getElementsByTagName("body")[0];
      var linka = document.createElement("script");
      linka.id = "amn_metadata";
      linka.type = "application/json";
      linka.innerText = "";
      head.appendChild(linka);
	  //
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
};
//
var timehead = document.getElementsByTagName("body")[0];
	var time_create = document.createElement("span");
	time_create.id = "amn_time_changedata";
	time_create.style = "display:none";
	time_create.textContent = 0;
	timehead.appendChild(time_create);

const Time_observer = new MutationObserver((mutations) => {
	try {
		audioPlayer.seekToTime(parseFloat(document.getElementById('amn_time_changedata').textContent));
		//console.warn(parseFloat(document.getElementById('amn_time_changedata').textContent));
	} catch (error) {}
  });
  const Time_el = document.getElementById('amn_time_changedata');
  Time_observer.observe(Time_el, {
	childList: true
  });
  var watch_name_old;
  function name_watch(){
	  if(typeof document.getElementsByClassName("web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper")[0]?.innerText != 'undefined'){
		if(document.getElementsByClassName("web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper")[0].innerText != watch_name_old){
			//曲目変更フラグ
			console.log("PLAY!");
		}
		watch_name_old = document.getElementsByClassName("web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper")[0].innerText;
	  }
  }
  const watch_timer = setInterval(name_watch, 100);