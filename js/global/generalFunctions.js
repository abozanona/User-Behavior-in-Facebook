/**
 * gets user's id
 * @param {function}fn(user_id) Callback with user's id
 */
function getUserID(fn){
    getCookieValue("c_user", function (value) {
        fn(value);
    });
}

function openJSONViewer() {
    chrome.tabs.create({url: chrome.extension.getURL('jsonViewer.html')});
}

/**
 * Chacks if current tab page is for facebook
 * @param {function}fn(isTrue) Callback
 */
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
/**
 * Hash a string using sha256 algorithm
 * @param string The string to be hashed
 * @returns {string}
 */
function getHash(string){
    var salt = "ABCD";
    string = string;// + salt;
    var out = sjcl.hash.sha256.hash(string);
    return sjcl.codec.hex.fromBits(out);
}

/**
 * Load data from local storage
 * @param key data key
 * @param {function}fn(data) Callback with the result of stored data
 */
function getSingleValue(key, fn){
    chrome.storage.local.get(key, function(e) {
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
/**
 * Stores data in local storage
 * @param key data key
 * @param value data value
 * @param {function}fn Callback
 */
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

/**
 * Check if there's any logged in user
 * @param {function}fn(isTrue) Callback
 */
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

/**
 * removes all duplicates from an array
 * @param {Array}arr
 * @returns {Array} The array without duplicates
 */
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
/**
 * Injects the required libraries for the toast messages
 * @param {function}fn Callback
 */
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

/**
 * Injects the required libraries for the toast messages
 * @param {function}fn Callback
 */
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
/**
 * Executes a script on the page DOM to create a toast message
 * @param tabId where to show the ,essage
 * @param {toastType}toastType //type of message
 * @param msg //message content
 * @param {function}fn Callback
 */
function makeToast(tabId, toastType, msg, fn){
    msg=msg.replace(/"/g, '\\\"');
    chrome.tabs.executeScript( tabId, {code: toastType + '("' + msg +'");'}, fn());
}

/**
 * Calculates the difference between two timestamps
 * @param {timestamp}date1 first timestamp
 * @param {timestamp}date2 second timestamp
 * @return difference between them
 */
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
/**
 * checks if element exists in array
 * @param element
 * @param array
 * @return {boolean}
 */
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
