// getting chrome cookies 
function getCookies(fn){
    chrome.tabs.getSelected(null, function (tab) {
        chrome.cookies.getAll({"url":tab.url},function (cookie){
            fn(cookie);
        });
    });
}
// getting cookie value
function getCookieValue(cookieName, fn){
    getCookies(function(cookie){
        for(var i=0;i<cookie.length;i++){
            if(cookie[i]["name"]==cookieName){
                fn(cookie[i]["value"]);
                return;
            }
        }
        fn(null);
    });
}