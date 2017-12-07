var server="https://fba.ppu.edu/";
var privacy={
    public: 0,
    friends: 1,
    onlyme: 2,
    custom: 3,
    unknown: 4
};
function checkPrivacy(_privacy, fn) {
    // $.get(server + "checkprivacy.php?q=" + privacy, function (data) {
    //     return data;
    // });
    var privacyRes = {
        ar: [
            "العامة",
            "الأصدقاء",
            "أنا فقط",
            "مخصصة"
        ],
        en: [
            "Public",
            "Friends",
            "Only me",
            "Custom"
        ]
    };
    (function (_privacy) {
        getLanguage(function (lang) {
            if(lang && privacyRes[lang]){
                for(var i=0;i<4;i++)
                    if(privacyRes[lang][i] == _privacy){
                        fn(i);
                    }
            }
            else{
                //console.log("privacy", "Language not supported");
            }
        });
    })(_privacy);
}
function getPrivacyColor(privacy, fn) {
    checkPrivacy(privacy, function (res) {
        getSingleValue("colors", function (e) {
            if(!e){
                e=[
                    "#000000",
                    "#606060",
                    "#660000",
                    "#ff00ff",
                    "#cccccc"
                ];
            }
            fn(e[res]);
        });
    });
}



function sendDataAttribute(_class, data){
    $.get(server + "dataAttributesCollector.php?class=" + _class + "&data=" + data, function (data) {

    });
}



function subscribe(email, fn) {
    $.get(server + "subscribe.php?email=" + email, function (data) {
        fn();
    });
}

function submitStudyResults(results, fn) {
    chrome.storage.sync.get('userid', function(items) {
        var userid = items.userid;
        if (userid) {
            useToken(userid);
        } else {
            userid = getRandomToken();
            chrome.storage.sync.set({userid: userid}, function() {
                useToken(userid);
            });
        }
        function useToken(userid) {
            $.post(server + "submitStudyResults.php",
                {
                    clientid: userid,
                    data: results
                }
            ).done(function () {
                fn();
            });
        }
    });
}

function dataFromGenderURL(name, fn){
    $.get("https://gender-api.com/get?split=" + name, function (data) {
        if(data.indexOf("female"))
            fn(GENDER.FEMALE);
        else if(data.indexOf("male"))
            fn(GENDER.FEMALE);
        else
            fn(GENDER.UNKNOWN);
    });
}

function getSex(name, fn) {
    if(!name){
        fn(GENDER.UNKNOWN);
        return;
    }
    getSingleValue("names", function (e) {
        if(!e || !e.length){
            e = [];
            $.get(server + "sex.php?name=" + name, function (data) {
                if(data == 1){
                    fn(GENDER.MALE);
                    e.push({
                        key: name,
                        value: GENDER.MALE
                    });
                }
                else if(data == 2){
                    fn(GENDER.FEMALE);
                    e.push({
                        key: name,
                        value: GENDER.FEMALE
                    });
                }
                else{
                    fn(GENDER.UNKNOWN);
                    e.push({
                        key: name,
                        value: GENDER.UNKNOWN
                    });
                }
                setSingleValue("names", e, function () {

                });
            });
            return;
        }
        else if(getElementKeyValueInArray("key", name, e)){
            fn(getElementKeyValueInArray("key", name, e).value);
            return;
        }
        else{
            $.get(server + "sex.php?name=" + name, function (data) {
                if(data == 1){
                    fn(GENDER.MALE);
                    e.push({
                        key: name,
                        value: GENDER.MALE
                    });
                }
                else if(data == 2){
                    fn(GENDER.FEMALE);
                    e.push({
                        key: name,
                        value: GENDER.FEMALE
                    });
                }
                else{
                    fn(GENDER.UNKNOWN);
                    e.push({
                        key: name,
                        value: GENDER.UNKNOWN
                    });
                }
                setSingleValue("names", e, function () {

                });
            });
            return;
        }
    });
}