var bgc;
var comps;
var a_art_src;
var music_type;
var music_bitrate;
var music_samplerate;
var music_relese_date;
var al_id;
var ap_album_art;
function get_append(){
  if (typeof audioPlayer != "undefined") {
	  document.getElementById("amn_time_changedata").textContent = 0;
    try{
      if(typeof audioPlayer._nowPlayingItem.attributes.artwork?.url  == 'undefined'){
        if(typeof audioPlayer._nowPlayingItem?.hasContainerArtwork == 'undefined'){
        ap_album_art = "https://music.apple.com/assets/product/MissingArtworkMusic.svg";
        }else{
          ap_album_art = audioPlayer._nowPlayingItem.hasContainerArtwork;
        }
      }else{
      ap_album_art = audioPlayer._nowPlayingItem.attributes.artwork.url;
      }
    }catch{}
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
    //console.log(song_info)
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
}


var timehead = document.getElementsByTagName("body")[0];
	var time_create = document.createElement("span");
	time_create.id = "amn_time_changedata";
	time_create.style = "display:none";
	time_create.textContent = 0;
	timehead.appendChild(time_create);
  //now_time
  var now_time_create = document.createElement("span");
	now_time_create.id = "amn_now_time";
	now_time_create.style = "display:none";
	now_time_create.textContent = 0;
	timehead.appendChild(now_time_create);

const Time_observer = new MutationObserver((mutations) => {
  Time_observer.disconnect();
  audioPlayer.seekToTime(parseFloat(document.getElementById('amn_time_changedata').textContent)).then(function(){seek_flag = false;});
  Time_observer.observe(Time_el, {
    childList: true
    });
  });
  const Time_el = document.getElementById('amn_time_changedata');
  Time_observer.observe(Time_el, {
	childList: true
  });
  var watch_name_old;
  function name_watch(){
    var name_query;
    if(typeof audioPlayer != 'undefined'){
      name_query = audioPlayer._nowPlayingItem.attributes.name;
    }else{
      name_query  = undefined;
    }
	  if(typeof name_query != 'undefined'){
		if(name_query != watch_name_old){
			//曲目変更フラグ
			console.log("PLAY!");
      get_append();
		}
		watch_name_old = name_query;
	  }
    //now_timeWite
    if(typeof audioPlayer != 'undefined'){
      document.getElementById("amn_now_time").innerText = audioPlayer._currentTime;
    }
    
  }
  const watch_timer = setInterval(name_watch, 500);