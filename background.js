var tab_id;
var select_text;
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "AP_Search",
        title : chrome.i18n.getMessage('serch_title'),
        type  : "normal",
        contexts : ["selection"]
        })
        return true;
    })
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        switch (info.menuItemId) {
            case 'AP_Search':
                select_text = info.selectionText;
                var serch_url = chrome.i18n.getMessage('serch_url')+select_text;
                chrome.tabs.create({ url : serch_url});
              break;
        }
        return true;
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    //contentからのメタデータpopupに送信
    //console.log(message);
  chrome.runtime.sendMessage(message).catch(function( error ){
    //popupが開いていない時の接続エラー無視
    //console.log( error );
}).then(function (){});
  return true;
});
chrome.runtime.onMessage.addListener(function(dur_data, sender, sendResponse){
  //popupからもらった時間変更の値をcontentへ送信
  if(dur_data.tab_id != undefined){
      chrome.tabs.sendMessage(dur_data.tab_id, dur_data.change_time);
  }
  return true;
});
chrome.runtime.onMessage.addListener(function(eqa_data, sender, sendResponse){
  //popupからもらったEQの値をcontentへ送信
  //console.log(eqa_data);
  tab_id = eqa_data.tab_id;
  if(eqa_data.bass != undefined){
      chrome.tabs.sendMessage(eqa_data.tab_id,eqa_data);
  }
  return true;
});
chrome.runtime.onMessage.addListener(function(play_ctrl, sender, sendResponse){
  //Play Control
  //console.log(play_ctrl);
  if(play_ctrl.play != undefined){
      chrome.tabs.sendMessage(play_ctrl.tab_id,play_ctrl);
  }
  return true;
});
chrome.runtime.onMessage.addListener(function(artwork_conv, sender, sendResponse){
  //Blob Store src to Base64 (CORS Bypass)
  //console.log(artwork_conv);
  if(artwork_conv.type != undefined && artwork_conv.type == "img_conv"){
      var image_bin = "";
      var image_xhr = new XMLHttpRequest();
      image_xhr.open("GET", artwork_conv.url, true);
      image_xhr.responseType = "arraybuffer";
      image_xhr.withCredentials = true;
          image_xhr.onload = function(){
              if(image_xhr.readyState == 4 && image_xhr.status == 200){
                  var im_byte = new Uint8Array(image_xhr.response);
                      for(var i=0;i<im_byte.byteLength;i++){
                          image_bin += String.fromCharCode(im_byte[i]);
                      }
                      //console.log(btoa(image_bin));
                      chrome.tabs.sendMessage(sender.tab.id,{type: "img_conv_return", b64_conv: btoa(image_bin)});
                  }
              }
              image_xhr.send();
              
          }
          return true;
      });