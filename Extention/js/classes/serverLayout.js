var server="https://fba.ppu.edu/";
var privacy={
    public: 0,
    friends: 1,
    onlyme: 2,
    custom: 3,
    unknown: 4
};
var GENDER = {
    MALE: 1,
    FEMALE: 2,
    UNKNOWN: 3
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
        if(!_privacy)
            return;
        _privacy = _privacy.toLowerCase();
        getLanguage(function (lang) {
            if(lang && privacyRes[lang]){
                var isFound = false;
                for(var i=0;i<4;i++) {
                    var mtch= privacyRes[lang][i].toLowerCase();
                    if (mtch.indexOf(_privacy) != -1 || _privacy.indexOf(mtch) != -1) {
                        fn(i);
                        isFound = true;
                    }
                }
                if(!isFound){
                    fn(3);
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
                    "#baffb2",
                    "#ffdab2",
                    "#ffa3a3",
                    "#ccdaff",
                    "#cccccc"
                ];
            }
            fn(e[res]);
        });
    });
}

function getDeviceId(fn) {
    getSingleValue('userid', function (userid) {
        if (userid) {
            fn(userid);
        } else {
            userid = getRandomToken();
            setSingleValue('userid', userid, function() {
                fn(userid);
            });
        }
    });
}

function submitStudyResults(results, fn) {
    console.log("test", results);
    getDeviceId(function (userid) {
        console.log("test", userid);
        $.post(server + "submitStudyResults.php",
            {
                clientid: userid,
                data: JSON.stringify(results)
            }
        ).done(function (data) {
            console.log("test", data);
            fn();
        });
    });
}
function reportError(err) {
    getDeviceId(function (userid) {
        $.post(server + "submitError.php",
            {
                clientid: userid,
                data: JSON.stringify(err)
            }
        ).done(function (data) {

        });
    });
}

function dataFromGenderURL(name, fn){

    name = name.split(" ")[0];
    name = name.replace(/\W/g, '');
    if(name == "")
    {
        fn(GENDER.UNKNOWN);
        return;
    }
    $.ajax({
        url: "https://api.genderize.io/?name=" + name,
        type: 'GET',
        success: function(data){
            if(data.gender == "male")
                fn(GENDER.MALE);
            else if(data.gender == "female")
                fn(GENDER.FEMALE);
            else
                fn(GENDER.UNKNOWN);
        },
        error: function(data) {
            fn(-1);
        }
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
            dataFromGenderURL( name, function (data) {
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
            dataFromGenderURL(name, function (data) {
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