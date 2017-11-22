var server="https://fba.ppu.edu/";
var privacy={
    public: 0,
    friends: 1,
    onlyme: 2,
    custom: 3,
    unknown: 4
};
function checkPrivacy(privacy, fn) {
    $.get(server + "checkprivacy.php?q=" + privacy, function (data) {
        return data;
    });
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

//todo check if is working
function getSex(name, fn) {
    getSingleValue("names", function (e) {
        if(!e){
            e = [];
            $.get(server + "sex.php?q=" + name, function (data) {
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
        else if(getElementFromArray(name, e)){
            fn(getElementFromArray(name, e).value);
            return;
        }
        else{
            $.get(server + "sex.php?q=" + name, function (data) {
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