var userIdAsGlobal;
function getUserID(fn){
    if(userIdAsGlobal) {
        fn(userIdAsGlobal);
        return;
        console.log(userIdAsGlobal);
    }
    getCookieValue("c_user", function (value) {
        userIdAsGlobal = value;
        fn(value);
    });
}

function openJSONViewer() {
    chrome.tabs.create({url: chrome.extension.getURL('jsonViewer.html')});
}

function isFacebookNormalTab(fn){
    chrome.tabs.getSelected(null, function (tab) {
        if(tab.incognito){
            fn(false,0);
            return;
        }
        try {
            var domain = new URL(tab.url).hostname;
            if(domain=="facebook.com" || domain=="www.facebook.com") {
                fn(true,tab.id);
            }
            else {
                fn(false,0);
            }
        }
        catch(linkIsNotUrl) {
            fn(false,0);
        }
    });
}
function getHash(string){
    var salt = "ABCD";
    string = string;// + salt;
    var out = sjcl.hash.sha256.hash(string);
    return sjcl.codec.hex.fromBits(out);
}
function getSingleValue(key, fn){
    chrome.storage.local.get(key, function(e) {
        if(key == "names"){
            //console.log(e);
        }
        if(JSON.stringify(e) == JSON.stringify({})){
            fn(null);
            return;
        }
        try {
            e[key]=JSON.parse(e[key]);
        }
        catch(err) {

        }
        fn(e[key]);
    });
}
function setSingleValue(key, value, fn){
    //console.log("user value", value);
    try {
        value=JSON.stringify(value);
        //console.log("parsed as", value);
    }
    catch(err) {
        //console.log("parsing error");
    }
    var obj = {};
    obj[key] = value;
    //console.log("final object to store", obj);
    chrome.storage.local.set(obj, function() {
        fn();
    });
}
function isUserLoggedIn(fn){
    getCookieValue("c_user", function (value) {
        if(value){
            fn(true);
        }
        else{
            fn(false);
        }
    });
}

function unique_array(arr) {
    var i, j, cur, found;
    for (i = arr.length - 1; i >= 0; i--) {
        cur = arr[i];
        found = false;
        for (j = i - 1; !found && j >= 0; j--) {
            if (cur === arr[j]) {
                if (i !== j) {
                    arr.splice(i, 1);
                }
                found = true;
            }
        }
    }
    return arr;
}
function initToaster(fn){
    //_todo must check if already injected,,,, is thar really necessary?
    //looks like it's fine to inject library more than once, or is it?
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.executeScript(tab.id, {
            file: "/js/global/jquery.min.js"
        },function(){
            chrome.tabs.executeScript(tab.id, {
                file: "/js/global/toastr.js"
            },function(){
                fn(tab.id)
            })
        });
    });
}
function initToasterOnTab(tabId, fn){
    //_todo must check if already injected,,,, is thar really necessary?
    //looks like it's fine to inject library more than once, or is it?
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.executeScript(tab.id, {
            file: "/js/global/jquery.min.js"
        },function(){
            chrome.tabs.executeScript(tab.id, {
                file: "/js/global/toastr.js"
            },function(){
                fn()
            })
        });
    });
}

var toastType={
    success : "toastSuccess",
    Info : "toastInfo",
    Warning : "toastWarning",
    Error : "toastError"
};
function makeToast(tabId, toastType, msg, fn){
    msg=msg.replace(/"/g, '\\\"');
    try {
        chrome.tabs.executeScript(tabId, {code: 'try {' + toastType + '("' + msg + '");}catch (e) {}'}, fn());
    }
    catch (ex){
        //Silence is gold :3
    }
}
function timestampDifference(date1,date2){
    var difference = new Date(date1).getTime() - new Date(date2).getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    var secondsDifference = Math.floor(difference / 1000);

    return {
        days: daysDifference,
        hours: hoursDifference,
        minutes: minutesDifference,
        seconds: secondsDifference
    };
}

function isElementInArray(element, array) {
    if(array[element])
        return true;
    for(var i=0;i<array.length;i++)
        if(array[i] && array[i]==element)
            return true;
    return false;
}
function isElementKeyInArray(key, array) {
    if(array[key])
        return true;
    for(var i=0;i<array.length;i++)
        if(array[i][key])
            return true;
    return false;
}
function isElementKeyValueInArray(key, value, array) {
    if(array[key] && array[key]==value)
        return true;
    for(var i=0;i<array.length;i++)
        if(array[i][key] && array[i][key]==value)
            return true;
    return false;
}
function getElementKeyValueInArray(key, value, array) {
    if(array[key] && array[key]==value)
        return array[key];
    for(var i=0;i<array.length;i++)
        if(array[i][key] && array[i][key]==value)
            return array[i];
    return false;
}
function getElementFromArray(key, array) {
    if(array[key])
        return array[key];
    for(var i=0;i<array.length;i++)
        if(array[i][key])
            return array[i];
    return undefined;
}

//thanks to https://stackoverflow.com/a/23854032/4614264
function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

function facebookTabsNumber(fn) {
    chrome.tabs.query({}, function(foundTabs) {
        var count = 0;
        for(var i=0;i<foundTabs.length;i++)
            if(foundTabs[i].url.indexOf(".facebook.com") != -1)
                count++;
        fn(count);
    });
}

function getLanguage(fn){
    $.get("https://www.facebook.com/settings", function( data ) {
        data=data.toString();
        data=data.substring(0, 100);
        data=data.match(/lang\s*=\s*"[a-zA-Z-]+"/g);
        data=data[0].replace("lang=\"", "");
        data=data.replace("\"", "");
        if(data)
            fn(data);
    });
}

function collectResult(fn){
    result={users: undefined, actions: [], apps:undefined, devices:undefined, activityLog:undefined};
    getSingleValue("users", function (users) {
        getSingleValue("apps", function (apps) {
            getSingleValue("devices", function (devices) {
                getSingleValue("activityLog", function (activityLog) {
                    result.users = users;
                    result.apps=apps;
                    result.devices=devices;
                    result.activityLog=activityLog;
                    var ids=[];
                    if(users){
                        for(var i=0;i<users.length;i++) {
                            ids.push(users[i].id);
                        }
                        var usersCount=users.length;
                        for(var i=0;i<users.length;i++)
                            (function (userId) {
                                var userObject={id:userId, requests:undefined}
                                getSingleValue("requests" + userId, function (requests) {
                                    userObject.requests=requests;
                                    result.actions.push(userObject);
                                    usersCount--;
                                    if(!usersCount){
                                        fn(result);
                                    }
                                });
                            })(ids[i]);
                    }
                });
            });
        });
    });
}
function clearCashAfterSubmit(fn) {
    setSingleValue("actions", false, function () {
        setSingleValue("apps", false, function () {
            setSingleValue("devices", false, function () {
                setSingleValue("activityLog", [], function () {
                    fn();
                });
            });
        });
    });
}