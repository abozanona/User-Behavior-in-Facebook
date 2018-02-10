chrome.runtime.onInstalled.addListener(function(details){
    // if(details.reason == "install"){
    // }else if(details.reason == "update"){
    // }
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });

    setSingleValue("installWelcome", true, function () {
        chrome.tabs.create({url: chrome.extension.getURL('popup.html')});
    });
    setSingleValue("isFBWEnabled", true, function (e) {
    });
});
// listener when tabs updated
chrome.tabs.onUpdated.addListener(function (tab) {
    // counting number of facebook tabs after updating certain tab
    chrome.tabs.query({}, function(foundTabs) {
        try {
            var count = 0;
            var ids = [];
            for (var i = 0; i < foundTabs.length; i++) {
                if (foundTabs[i].url.indexOf(".facebook.com") != -1) {
                    count++;
                    ids.push(foundTabs[i].id);
                }
            }
            for (var j = 0; j < ids.length; j++)
                chrome.tabs.sendMessage(ids[j], {tabsCount: count});
        }
        catch (ex){
            reportError(ex);
        }
    });
});


    // counting number of facebook tabs after removing certain tab
chrome.tabs.onRemoved.addListener(function (tab) {
    try {

        chrome.tabs.query({}, function (foundTabs) {
            var count = 0;
            var ids = [];
            for (var i = 0; i < foundTabs.length; i++) {
                if (foundTabs[i].url.indexOf(".facebook.com") != -1) {
                    count++;
                    ids.push(foundTabs[i].id);
                }
            }
            for (var j = 0; j < ids.length; j++)
                chrome.tabs.sendMessage(ids[j], {tabsCount: count});
        });
    }
    catch (ex){
        reportError(ex);
    }
});


function checkSendingData() {
    var today=(+new Date());
    getSingleValue("weekPeriod", function(time){
        if(time==null){
            setSingleValue("weekPeriod", today, function () {

            });
            return;
        }

        var hoursDifference = timestampDifference(today, time).hours;
        if(hoursDifference>20){
            getSingleValue("isAutoSave", function(isAutoSave){
                if(isAutoSave){
                    collectResult(function (result) {
                        submitStudyResults(result, function () {
                            clearCashAfterSubmit(function () {

                            });
                        });
                    });
                }
                else{
                    openJSONViewer();
                }
            });
        }
    });


}
checkSendingData();
var resetAll=1;
if (resetAll) {
    setSingleValue("blockedUsers", [], function () {
    });
    setSingleValue("users", [], function () {
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        try {

            if (!request.type) {
                return;
            }
            request.back_time = +(new Date());
            //action, reaction, openPage, blur, focus, closeWindow, photos_snowlift
            getSingleValue("requests", function (e) {
                if (!e) {
                    e = [];
                }
                e.push(request);
                setSingleValue("requests", e, function () {

                })
            });
        }
        catch (ex){
            reportError(ex);
        }
    }
);

var lastWebReq = 0;
chrome.webRequest.onCompleted.addListener(function(info) {
    var dif = info.timeStamp - lastWebReq;
    if (dif > 1500 || lastWebReq == 0) {
        chrome.tabs.sendMessage(info.tabId, { webRequest: 1 });
    }
    lastWebReq = info.timeStamp;
}, {
    urls: ["https://www.facebook.com/*", "http://www.facebook.com/*"],
    types: ["image"]
});

var isCollected = false;
chrome.tabs.onHighlighted.addListener(function(){
    try {
        checkActivityLogChanges();//todo debugging

        var today = (+new Date());
        isFacebookNormalTab(function (isTrue, tabId) {
            if (isTrue) {
                getSingleValue("lastCollect", function (time) {
                    if (time == null) {
                        if (isCollected)
                            return;
                        isCollected = true;
                        setSingleValue("lastCollect", today, function () {
                            collectData();
                        });
                        return;
                    }

                    var timeDifference = timestampDifference(today, time).minutes;
                    if (timeDifference > 10) {
                        if (isCollected)
                            return;
                        isCollected = true;
                        setSingleValue("lastCollect", today, function () {
                            collectData();
                        });
                        return;
                    }
                });
            }
        });
    }
    catch (ex){
        reportError(ex);
    }
});

function collectData(){
    //_todo check if code is already injected => not necessary, right?
    isFacebookNormalTab(function(isTrue, tabId){
        if(isTrue){
            getUserID(function (id) {
                if (id == null) {
                    return;
                }
                var shUID = getHash(id);
                isUserBlocked(shUID, function (isBlocked) {
                    if(isBlocked)
                        return;
                    isUserExists(shUID, function (isTrue){
                        if(!isTrue){
                            initToasterOnTab(tabId, function(){
                                makeToast(tabId, toastType.Info, "A new user was detected, Welcome...", function(){
                                    //FIX enhance alert shape
                                    //if (confirm("Do you want to participate in pla.") === true) {
                                    initToasterOnTab(tabId, function(){
                                        makeToast(tabId, toastType.Info, "Thanks for joining our study,User is being registered.", function () {
                                            makeToast(tabId, toastType.Info, "We're collecting some data, please be patient.", function(){
                                                registerNewUser(tabId, shUID);
                                                checkActivityLogChanges();
                                            });
                                        });
                                    });
                                    //} else {
                                    //    blockUser(shUID, function(){
                                    //        initToasterOnTab(tabId, function(){
                                    //            makeToast(tabId, toastType.Info, "User is blocked., pla pla pla", function () {});
                                    //        });
                                    //    });
                                    //}
                                });
                            });
                        }
                        else{
                            checkActivityLogChanges();
                        }
                    });
                });
            });
        }
    });
}