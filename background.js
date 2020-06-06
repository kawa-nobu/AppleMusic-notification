chrome.contextMenus.create({
    "title" : chrome.i18n.getMessage('serch_title'),
    "type"  : "normal",
    "contexts" : ["selection"],
    "onclick" : function(info){
        var select = info.selectionText;
        var serch_url = chrome.i18n.getMessage('serch_url')+select;
        chrome.tabs.create({ url : serch_url});
    }
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
      //contentからのメタデータpopupに送信
    chrome.runtime.sendMessage(message);
	return true;
});
chrome.runtime.onMessage.addListener(function(dur_data, sender, sendResponse){
    //popupからもらった時間変更の値をcontentへ送信
    if(dur_data.tab_id != undefined){
        chrome.tabs.sendMessage(dur_data.tab_id, dur_data.change_time);
    }
	return true;
});