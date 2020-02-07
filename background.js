chrome.contextMenus.create({
    "title" : chrome.i18n.getMessage('serch_title'),
    "type"  : "normal",
    "contexts" : ["selection"],
    "onclick" : function(info){
        var select = info.selectionText;
        var serch_url = "https://beta.music.apple.com/search?term="+select;
        chrome.tabs.create({ url : serch_url});
      }
  });