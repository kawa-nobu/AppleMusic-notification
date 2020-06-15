window.onload = function (){
    var url_param = new this.URLSearchParams(window.location.search);
    window.alert(url_param.get('text'));
    document.getElementById('twitter')[0].src = 'https://twitter.com/intent/tweet?text='+url_param.get('text')+url_param.get('hashtags');
}