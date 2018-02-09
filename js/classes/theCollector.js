//FIX check if facebook has changed their links 

// collecting friends and mutual frinds id
function collectFriendsID(fn){
    var friendsID=[];
    var startindex=-1;
    var friendsCountInList=10;
    function getNewList(startindex){
        startindex++;
        console.log(startindex);
        $.get("https://mbasic.facebook.com/friends/center/friends/?ppk=" + startindex, function( data ) {
            //alert(startindex);
            if (data.match(/uid=\d+/g) && startindex<299) {
                data = $(data).find("table").not(':first').not(':last');
                // var friendid_array = data.match(/uid=\d+/g);
                // var mutualfriends_array = data.match(/bo bp">(.*?)<\/div><div class="bq">/g);
                // var names_array = $(data).find("a.bn");

                var names = $(data).find("tr td:nth-child(2) a");
                var mutualFriends = $(data).find("tr td:nth-child(2) div");

                var minLen =(names.length<mutualFriends.length)?names.length:mutualFriends.length;
                var minLen2 = minLen;
                for (var i=0; i<minLen;i++) {
                    var friend_id = $(names[i]).attr("href").match(/uid=\d+/g)[0].replace("uid=", "");
                    var friend_name = $(names[i]).text();
                    var mutualFriendsNumber = $(mutualFriends[i]).text();

                    var numRegex = /\d+/;
                    mutualFriendsNumber = mutualFriendsNumber.match(numRegex);
                    if(mutualFriendsNumber==null)
                        mutualFriendsNumber=0;
                    else
                        mutualFriendsNumber=parseInt(mutualFriendsNumber);
                    var isSex=1;
                    (function (friend_id, mutualFriendsNumber, friend_name) {
                        getSex(friend_name, function (res) {
                            minLen2--;
                            friendsID.push({
                                "id" : getHash(friend_id),
                                "mutual_friends" : mutualFriendsNumber,
                                "gender": res,
                                //FIX read it from the activity log => not necessary required.
                                //https://www.facebook.com/abozanona/allactivity?privacy_source=activity_log&log_filter=cluster_8
                                //"friendship_date" :"00"
                            });
                            if(!minLen2)
                                getNewList(startindex);
                            isSex = 0;
                        });
                    })(friend_id, mutualFriendsNumber, friend_name);
                }
            } else {
                if(friendsID.length==0) {

                    fn(null);
                }
                else{
                    fn(friendsID);
                }
            }
        });
    }
    getNewList(startindex);
}

// collecting id's of user liked pages
function collectLikedPages(fn){
    var userLikes=[];
    var startindex=-70;
    getUserID(function(user_id){
        function getNewList(){

            startindex=startindex+70;

            $.get("https://www.facebook.com/ajax/browser/list/fanned_pages/?id="+user_id+"&start="+startindex+"&__user="+user_id+"&__a=1", function( data ) {
                if(!data.match("errorSummary")){
                    if(data.match(/data-profileid=\\\"\d+/g)){
                        responceprocess=data.match(/data-profileid=\\\"\d+/g);
                        for(temp_counter_var=0;responceprocess[temp_counter_var];temp_counter_var++){
                            var page_id=responceprocess[temp_counter_var].replace('data-profileid=\\\"',"");
                            userLikes.push({
                                "id" : getHash(page_id),
                                //"likeTime" : "dd"
                            });
                        }
                    }
                    getNewList();
                }else{
                    userLikes=unique_array(userLikes);
                    fn(userLikes);
                }
            });
        }
        getNewList();
    });
}

//collecting user's group
function collectGroups(fn){
    var groupsID=[];
    $.get("https://www.facebook.com/bookmarks/groups/", function( htmlstring ) {
        if(htmlstring.match(/\["group\_\d+"\]/igm)){
            var _groupsID=htmlstring.match(/\["group\_\d+"\]/igm);
            for(var temp_var=0;_groupsID[temp_var];temp_var++){
                _groupsID[temp_var]=parseInt(_groupsID[temp_var].replace("\[\"group\_","").replace("\"\]",""));
            }
            _groupsID=unique_array(_groupsID);

            var numbberOfGroups=_groupsID.length;


            for(var i=0;i<_groupsID.length;i++) {
                (function (id) {
                    getGroupMembersNumber(id, function (membersNumberObj) {
                        getPhotosNumberAndFilesNumber(id, function (id, photos, files, privacy) {
                            groupsID.push({
                                id: getHash(id),
                                membersNumber: membersNumberObj,
                                photos: photos,
                                files: files,
                                privacy: privacy,
                            });
                            numbberOfGroups--;
                            if (!numbberOfGroups)
                                fn(groupsID);
                        });
                    });
                })(_groupsID[i]);
            }
        }else{

            fn([]);
        }
    });
}

 // function to return members of a group 
function getGroupMembersNumber(id, fn){
    $.get("https://m.facebook.com/groups/" + id + "?view=members", function(data){
        dataMatch=data.match(/_55wr\\">[^>]+\([\d,]+\)/g);

        if(!dataMatch || dataMatch.length==0){
            fn({
                field1 : "",
                field2 : ""
            });
        }else if(dataMatch.length==1){
            fn({
                field1 : dataMatch[0].replace("_55wr\\\">", ""),
                field2 : ""
            });
        }
        else{
            fn({
                field1 : dataMatch[0].replace("_55wr\\\">", ""),
                field2 : dataMatch[1].replace("_55wr\\\">", "")
            });
        }
    });
}

// function to get number of photos and files of a group member depending on its id
function getPhotosNumberAndFilesNumber(id, fn){
    $.get("https://mbasic.facebook.com/groups/" + id + "?view=info", function(data){
        data = $(data);
        photos = $(data).find("#u_0_2").text();
        files = $(data).find("#u_0_4").text();
        privacy = $(data).find(".bp.bq").text();
        fn(id, photos, files, privacy);
    });
}

function getGender(name, fn){

    name = name.replace(/ /g, "%20");
    getSex(name, function (res) {
        fn(res);
    });
}

function collectGender(fn) {
    getUserID(function(user_id) {

        $.get("https://m.facebook.com/profile.php?v=info&lst=" + user_id + ":" + user_id + ":", function( data ) {
            var age = $(data).find("#basic-info ._5cds:nth-child(1) ._5cdv").text();
            var gender = $(data).find("#basic-info ._5cds:nth-child(2) ._5cdv").text();
            fn({
                age: age,
                gender: gender
            });
        });

    });
}

//FIX depends on variant class names.
function collectAboutInfo(fn){
    var privacyClass = "._52jb._52jg._53n8._5tg_";
    var onlyMeTag = ".sp_W8lAgYMLpCR.sx_dd6231";
    var friendsTag = ".sp_VomNpQeIuCw.sx_d85d19";
    var friendsOfFriendsTag = "";
    var customTag = ".sp_15KOkA3i_dk.sx_0d464c";
    var publicTag = ".sp_PnJwgboNhOk.sx_17e9bb";
    var userAboutInfo=[];
    var collectInfoAbout=[
        {"id" : "#work", "class": "._5cds"},
        {"id" : "#education", "class": "._5cds"},
        {"id" : "#skills", "class": "._5cds"},
        {"id" : "#living", "class": "._4g34._5b6q._5b6p._5i2i._52we"},
        {"id" : "#contact-info", "class": "._5cds"},
        {"id" : "#basic-info", "class": "._5cds"},
        {"id" : "#nicknames", "class": "._5cds"},
        {"id" : "#relationship", "class": "._5cds"},
        {"id" : "#family", "class": "._5cds"},
        {"id" : "#bio", "class": "._5cds"},
        {"id" : "#quote", "class": "._5cds"}
        ];
    getUserID(function(user_id) {

        $.get("https://m.facebook.com/profile.php?v=info&lst=" + user_id + ":" + user_id + ":", function( data ) {
            var result = [];
            for(var i=0;i<collectInfoAbout.length;i++){
                var section=$(data).find(collectInfoAbout[i].id);
                //alert(section.html());
                var sectionItems=$(section).find(collectInfoAbout[i].class);
                var numberOfItems=sectionItems.length;
                var privacyItems=$(section).find(privacyClass);
                for(var j=0;j<privacyItems.length;j++)
                    privacyItems[i]=privacyItems[i].text();
                result.push({
                    "section_name" :  collectInfoAbout[i].id,
                    "numberOfItems" : numberOfItems,
                //    "privacyItems" : privacyItems
                });
            }
            fn(result);
        });

    });
}

function getLocation(fn) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            fn(position.coords.latitude, position.coords.longitude);
        });
    }
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

//FIX not ready
function getDoB(fn){
    fn("12/9/1995")
}