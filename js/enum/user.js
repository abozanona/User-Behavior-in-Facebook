/**
 * Collects data/information about new users and registers them.
 * @param shUID the hashed value of the new user's id
 */
function registerNewUser(tabId, shUID){
    var id=shUID;


    initToasterOnTab(tabId, function () {
        makeToast(tabId, toastType.Info, "Collecting data: 1 of 10", function(){
            //doesn't have callback :/ that's okay
            readApps();
            readDevicesNumber();
        });
        makeToast(tabId, toastType.Info, "Collecting data: 2 of 10", function(){});
        collectFriendsID(function(friendsArray){
            makeToast(tabId, toastType.Info, "Collecting data: 3 of 10", function(){});
            collectLikedPages(function (pagesArray) {
                makeToast(tabId, toastType.Info, "Collecting data: 4 of 10", function(){});
                collectGroups(function (groupsArray) {
                    makeToast(tabId, toastType.Info, "Collecting data: 5 of 10", function(){});
                    collectGender(function(userGender){
                        makeToast(tabId, toastType.Info, "Collecting data: 6 of 10", function(){});
                        getLocation(function (lat, lng) {
                            $.get("http://ws.geonames.org/countryCodeJSON?lat=" + lat + "&lng=" + lng + "&username=abozanona", function(data){
                                var country = data.countryName;
                                makeToast(tabId, toastType.Info, "Collecting data: 7 of 10", function(){});
                                getLanguage(function(lang){
                                    makeToast(tabId, toastType.Info, "Collecting data: 8 of 10", function(){});
                                    getDoB(function (DoB) {
                                        makeToast(tabId, toastType.Info, "Collecting data: 9 of 10", function(){});
                                        collectAboutInfo(function(aboutInfoArray){
                                            makeToast(tabId, toastType.Info, "Collecting data: 10 of 10", function () {
                                                var user = makeUser(shUID, friendsArray, pagesArray, groupsArray, userGender, country, lang, DoB, aboutInfoArray);
                                                existUser(user, function () {
                                                    makeToast(tabId, toastType.Info, "User is registered succ. pla pla pal", function(){});
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

/**
 * Creates a User object
 * @param id The user's hashed id
 * @param friends Array Of user's friends
 * @param pages Array of user's liked pages
 * @param groups Array of User's joint groups
 * @param gender User's gender
 * @param country User's latitude and longitude
 * @param language User's lang.
 * @param DoB User's Date of birth
 * @param aboutInfo User's personal information in his 'about' section'
 * @returns {USER}
 */
function makeUser(id, friends, pages, groups, gender, country, language, DoB, aboutInfo/*, messages/*, actions, reactions, sessions, posts, events*/){
    return {
        id: id,
        friends: friends,
        pages: pages,
        groups: groups,
        gender: gender,
        country: country,
        language: language,
        DoB: DoB,
        aboutInfo: aboutInfo,
    };
}
/**
 * Adds the user to the database of participants
 * @param user user's hashed id
 * @param {function} fn Callback
 */
function existUser(user, fn){
    getSingleValue("users", function(e){
        if(e==null)
        {
            e=[];
            e.push(user);
            setSingleValue("users", e, function(){
                fn();
            });
            return;
        }
        if(!isElementInArray(user.id,e)){
            //user doesn't exist
            e.push(user);
            setSingleValue("users", e, function(){
                fn();
            });
            return;
        }
        //user already exists!
        fn();
    });
}
/**
 * Checks If the user already exists in the participants database
 * @param shUID user Hashed id.
 * @param fn(isExist){function} fn Callback with boolean parameter
 */
function isUserExists(shUID, fn){
    getSingleValue("users", function(e){
        if(e==null)
        {
            e=[];
            setSingleValue("users", e, function(){
                fn(false);
            });
        }
        if(!isElementKeyValueInArray("id", shUID, e)){
            //user doesn't exist
            fn(false);
            return;
        }
        fn(true);
    });
}
/**
 * Mark user as a non-volunteer.
 * This function is called when a facebook user chooses not to participate in the study
 * @param shUID user's hashed id
 * @param {function} fn Callback
 */
function blockUser(shUID, fn){
    getSingleValue("blockedUsers", function(e){
        if(e==null)
        {
            e=[];
            e.push(shUID);
            setSingleValue("blockedUsers", e, function(){
                fn();
            });
            return;
        }
        if(!isElementInArray(shUID,e)){
            e.push(shUID);
            setSingleValue("blockedUsers", e, function(){
                fn();
            });
            return;
        }
        fn();
    });
}
/**
 * Checks If the user has choosed not to participate in the study or not.
 * @param shUID User's hashed id
 * @param {function}fn(isBlocked) Callback
 */
function isUserBlocked(shUID, fn) {
    getSingleValue("blockedUsers", function(e){
        if(e==null)
        {
            fn(false);
            return;
        }
        if(isElementInArray(shUID,e)){
            fn(true);
        }
        else {
            fn(false);
        }
    });
}