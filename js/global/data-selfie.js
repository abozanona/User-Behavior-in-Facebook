//thanks to
//https://github.com/d4t4x/data-selfie

// window.addEventListener('message', function(e) {
//     console.log("message", e);
// }, true);
//

/**
 * Get page type
 * @param url current url of the page
 * @return type of current page
 */
function getPageType(){
    var pageInfo = JSON.parse(window.sessionStorage.sp_pi).pageInfo;
    return pageInfo.scriptPath;
}

window.global={};
window.global.sec = 0;
window.global.lookedFocused = true;
window.global.windowFocused = true;
window.global.overlayFocused = false;
window.global.overlayApperance = undefined;
window.global.minLookedDuration = 3;
window.global.loc = window.location.href;
window.global.sessionid = new Date().getUTCMilliseconds();
window.global.isFBWEnabled = false;
window.global.tutorialStepNumber = 0;
window.global.tabsCount = 0;
var lastStep = 8;

getSingleValue("isFBWEnabled", function (e) {
    if(!e){
        window.global.isFBWEnabled = false;
        return;
    }
    window.global.isFBWEnabled = true;
});

getSingleValue("tutorialStepNumber", function (e) {
    window.global.tutorialStepNumber = e;
    if(window.global.tutorialStepNumber && window.global.tutorialStepNumber<=lastStep){
        startTutorial(window.global.tutorialStepNumber);
    }
});

function startTutorial(step) {

    var intro = introJs();
    intro.onbeforechange(function () {
        // if (step == 1 && this._currentStep === 1) {
        //     $("#fbHelpLiteFlyout").parent().parent().addClass("openToggler");
        // }
        if(step == 5 && this._currentStep === 2){
            try {
                document.getElementById("u_ps_0_0_4").click();
            }
            catch (ex){

            }
        }
        return true;
    });
    if(step == 1){
        // $("#u_0_1").on("click", function () {
        //     setInterval(function () {
        //         $("#fbHelpLiteFlyout").find("._s39").attr(id, "privacyCheckup");
        //     }, 1000);
        // });
        intro.setOptions({
            steps: [
                {
                    intro: "Welcome to fbw, we'll guide you threw basic information about your account and it's privacy"
                },
                {
                    intro: "At first, lets intoduce you to Privacy Checkup, click here then choose 'Privacy Checkup'",
                    element: document.querySelector('#u_0_l')
                },
                // {
                //     intro: "At first",
                //     element: document.querySelector('#fbHelpLiteFlyout')
                // }
            ]
        });
        setSingleValue("tutorialStepNumber", 0, function () {
        });
    }
    else if(step==3){
        intro.setOptions({
            steps: [
                {
                    intro: "Have a look on your personal information, check them and check who can see them",
                    element: document.querySelector('#pagelet_timeline_medley_about'),
                    position: 'right'
                },
                {
                    intro: "Manage your overview information",
                    element: document.querySelector('li[testid="nav_overview"]'),
                    position: 'right'
                },
                {
                    intro: "Manage your work and education information from here",
                    element: document.querySelector('li[testid="nav_edu_work"]'),
                    position: 'right'
                },
                {
                    intro: "Manage your living information from here",
                    element: document.querySelector('li[testid="nav_places"]'),
                    position: 'right'
                },
                {
                    intro: "Manage your Contact and Basic Info from here",
                    element: document.querySelector('li[testid="nav_contact_basic"]'),
                    position: 'right'
                },
                {
                    intro: "Manage your Relationships info from here",
                    element: document.querySelector('li[testid="nav_all_relationships"]'),
                    position: 'right'
                },
                {
                    intro: "Manage the general details about you from here",
                    element: document.querySelector('li[testid="nav_about"]'),
                    position: 'right'
                },
                {
                    intro: "Manage your overview live events from here.",
                    element: document.querySelector('li[testid="nav_year_overviews"]'),
                    position: 'right'
                },
                {
                    intro: "Remember to always choose to correct audience for your personal information",
                    element: document.querySelector('#pagelet_timeline_medley_about'),
                    position: 'right'
                },
            ]
        });
        setSingleValue("tutorialStepNumber", 0, function () {
        });
    }
    else if(step==5){
        intro.setOptions({
            steps: [
                {
                    intro: "Remember to check who can see these data about you.",
                    element: document.querySelector('#u_0_1j')
                },
                {
                    intro: "Click here to see your activity log. This is the place facebook shows you a lot of your behaviour on it",
                    element: document.querySelector('#u_ps_0_0_1')
                },
                {
                    intro: "You can see how people view your profile from here. click 'View as...' to start.",
                    element: document.querySelector('#u_ps_jsonp_4_0_0 li:first-child')
                }
            ]
        });
        setSingleValue("tutorialStepNumber", 0, function () {
        });
    }
    else if(step == 8){
        intro.setOptions({
            steps: [
                {
                    intro: "Here're your settings",
                    element: document.querySelector('#sideNav')
                },
                {
                    intro: "You can use this check your Security and Login settings",
                    element: document.querySelector('#navItem_security')
                },
                {
                    intro: "Control more provacy from here",
                    element: document.querySelector('#navItem_privacy')
                },
                {
                    intro: "Control tagging privacy from here",
                    element: document.querySelector('#navItem_timeline')
                },
                {
                    intro: "Set who can't see your posts from here",
                    element: document.querySelector('#navItem_blocking')
                },
                {
                    intro: "controll what application can collect from you",
                    element: document.querySelector('#navItem_applications')
                }
            ]
        });
        setSingleValue("tutorialStepNumber", 0, function () {
        });
    }

    intro.start();
}


var helper = {
    now: function() {
        return moment().format();
    },
    sendToBg: function(_type, _data) {
        console.log("_type", _type);
        chrome.runtime.sendMessage({
            type: _type,
            data: _data
        });
    }
};

var newsfeedEl = "";
var logic = {
    loggedId: "", // previously saved infocus element id
    getEmptyObj: function() {
        //data are to be found here
        //https://github.com/abozanona/User-Behavior-in-Facebook/blob/5856cce30f70bf2c728df4ed17b26d7fb5ab5483/chrome%20extention%5Bfba%2Bfbw%5D/js/content_scripts/content.js#L59
        return {
            // all array unless def. only one value
            "postId": undefined,
            "postTimestamp": undefined,
            "pageType": getPageType(),
            "viewTime": +new Date(),
            "gender": undefined,
            "likes": undefined,
            "privacy": undefined,
            "comments_shares_viewes": undefined,
            "posters": [], // users that are responsible for you seeing that post with their ids and type (page or user)
            "postImg": 0, // image or thumbnail of that post
            "postDesc": [], // what did they say
            "origLink": [], // what they shared (if at all)
            "origPoster": undefined, // who they shared it from (if at all)
            "origDesc": [], // what the shared content says (if at all)
            "suggested": [0, 0], // is it a suggested and sponsored post
            "duration": 0, // later can delete all with duration 0
            "timestamp": (+new Date())
        };
    },
    getUserType: function(card) {
        var type = "other";
        if (card.indexOf("user") > -1) {
            type = "user";
        } else if (card.indexOf("page") > -1) {
            type = "page";
        };
        return type;
    },
    updateCacheObj: function(_infocus) {
        var self = this,
            postObj = $("#" + _infocus),
            postData = this.getEmptyObj();

        postData.postId = postObj.find(".fsm.fwn.fcg a").attr("href");
        if(postData.postId)
            postData.postId = postData.postId.match(/\d+/g)[0];
        else
            postData.postId = 0;//may be sponsored post => no id
        //uiStreamPrivacy fbStreamPrivacy fbPrivacyAudienceIndicator _5pcq
        if(postObj.attr('data-privacy')) {
            postData.privacy = postObj.attr('data-privacy');
        }
        else {
            var _prvc = postObj.find("[id*=feed_subtitle_] [data-tooltip-content]").attr("data-tooltip-content");
            postObj.attr('data-privacy', _prvc);
            checkPrivacy(_prvc, function (data) {
                postData.privacy = data;
            });
        }
        postData.likes = postObj.find(".likes").text();
        postData.comments_shares_viewes = postObj.find("._ipo").text();
        postData.postTimestamp = postObj.parent().parent().attr("data-timestamp");
        var imgs = postObj.find("img");
        if (postObj.find("video").length > 0) {
            if (imgs.filter("._3chq").length > 0) {
                postData.postImg = imgs.filter("._3chq").length;
            } else {
                postData.postImg = imgs.filter(function() {
                    return ($(this).width() > 100);
                }).length;
            }
        } else {
            postData.postImg = imgs.filter(function() {
                return ($(this).attr("width") > 100 || $(this).width() > 100);
            }).length;
        };
        postObj.find("div._1dwg p").map(function() {
            postData.postDesc.push($(this).text().length);
        });
        var _origDesc = postObj.find("div._6m3");
        if (_origDesc.length > 0) {
            _origDesc.children().map(function() {
                postData.origDesc.push($(this).text().length);
            });
        };
        if (postObj.find("div._5g-l span").length > 0) {
            postData.suggested[0] = 1;
        };
        if (postObj.find("a.uiStreamSponsoredLink").length > 0) {
            postData.suggested[1] = 1;
        };


        // h5 e.g. Regina likes this.
        var h5 = postObj.find("h5");
        h5.find("a").each(function(i) {
            var h5link = $(this);
            var card = h5link.attr("data-hovercard");
            if (card != undefined) {
                var name = h5link.text(),
                    type = self.getUserType(card),
                    id = card.match(/\d{5,}/g)[0];
                postData.posters.push({ name: name, type: type, id: id });
            } else if (h5link.attr("href") != "#") {
                postData.origLink.push(h5link.attr("href"));
            }
        });
        // h6 e.g. New York Times (what Regina likes/interacted with)
        var h6 = postObj.find("h6._5pbw._5vra a")[0];
        if (h6) {
            var h6link = $(h6),
                name = h6link.text(),
                card = h6link.attr("data-hovercard"),
                type = self.getUserType(card),
                id = card.match(/\d{5,}/g)[0];
            postData.origPoster = { name: name, type: type, id: id };
        };

        postData.gender = postObj.find(".fwb.fcg").text();

        helper.sendToBg("postData", postData);
        cachedObj = postData;
    },
    logLooked: function(_obj, _sec, callback) {
        if (_sec >= window.global.minLookedDuration) {
            // if this fails, obj will not be saved in DB
            // logic.cachedObj is still unchanged
            _obj.duration = _sec;
            _obj.timestamp = moment(helper.now()).subtract(_sec, 'seconds').format();
            console.log(_obj);
            if (_obj.gender == parseInt(_obj.gender)){
                helper.sendToBg("saveLooked", _obj);
            }
            else{
                getSex(_obj.gender, function (res) {
                    _obj.gender = res;
                    helper.sendToBg("saveLooked", _obj);
                });
            }
        };
        this.resetClock();
        if (callback) { callback(); }
    },
    startTimer: function() {
        var self = this;
        window.global.timer = setInterval(function() {
            if (window.global.lookedFocused &&
                window.global.windowFocused &&
                !window.global.overlayFocused) {
                window.global.sec += 1;
                self.updateClockSec(window.global.sec);
            } else {
                self.updateClockSec("");
            }
        }, 1000);
    },
    resetClock: function() {
        window.global.sec = 0;
        this.updateClockSec("");
    },
    updateClockSec: function(_sec) {
        $("#clocksec").text(_sec);
        if (window.global.windowFocused) {
            $("#clock").fadeIn();
        } else {
            $("#clock").fadeOut();
        }
    },
    lookedFocusedFalse: function() {
        window.global.lookedFocused = false;
        if(this.loggedId != "")//abozaona just add the if statement
            $("#"+this.loggedId).removeClass("highlighted");
    },
    cachedObj: {},
};


var looked = {
    logic: logic, // separated from exports because of scoping problem
    isInView: function(rect) {
        return (rect.top > -1 * rect.height / 5 &&
            rect.top < window.innerHeight / 2 &&
            document.hasFocus());
    },
    highlightPost: function(posts) {
        var infocusId;
        for (var i = posts.length - 1; i >= 0; i--) {
            var rect = posts[i].getBoundingClientRect();
            if (this.isInView(rect) && $(posts[i]).find("h5").length > 0) {
                window.global.lookedFocused = true;
                //console.log("looked forloop found post");

                infocusId = posts[i].id;
                var infocusEl = $("#" + infocusId);
                infocusEl.addClass("highlighted");
                posts.not(infocusEl).removeClass("highlighted");

                // if the current infocus != the logged (one from saved before), i.e. if there is a new element in focus and if loggedId is not empty ()
                if (logic.loggedId != infocusId && logic.loggedId != "") {
                    // wrapup previous and init new logged element
                    logic.logLooked(logic.cachedObj, window.global.sec, function() {
                        logic.updateCacheObj(infocusId);
                    });
                    // log infocus element in loggedId to compare next infocus to
                    logic.loggedId = infocusId;
                    break;
                } else if (logic.loggedId != infocusId && logic.loggedId == "") {
                    // update a new logged element
                    logic.updateCacheObj(infocusId);
                    logic.loggedId = infocusId;
                    break;
                };
            }
        };
    },
    getPagePosts: function() {
        //var posts = newsfeedEl.find("div._4-u2.mbm._5v3q._4-u8").children($("div._3ccb._4-u8"));
        var posts = newsfeedEl.find("div._4-u2.mbm._5v3q._4-u8 div._3ccb");
        if(window.global.isFBWEnabled)
            $(posts).each(function (index) {
                (function (e) {
                    if($(e).attr('data-iscolored')) {
                    }
                    else {
                        var _prvc = $(e).find("[id*=feed_subtitle_] [data-tooltip-content]").attr("data-tooltip-content");
                        //checkPrivacy(_prvc, function (privacy) {
                            getPrivacyColor(_prvc, function (color) {
                                $(e).attr('data-privacy', _prvc);
                                $(e).attr('data-iscolored', "1");
                                $(e).css("background-color", color);
                            });
                        //});
                    }
                })(this);
            });
        //console.log(posts);
        return posts;
    },
    postsInView: function() {
        var posts = this.getPagePosts();
        if (posts.length == 0) {
            //console.log("no newsfeed posts in view");
            logic.lookedFocusedFalse();
        } else if (window.global.overlayFocused == false) {
            //console.log("yes newsfeed posts + no overlay");
            this.highlightPost(posts);
        }
    },
    checkPhotoOverlay: function(delay, callback) {
        // delay because of the loading of the overlay
        setInterval(function() {
            var isPhotoOverlay = $("#photos_snowlift");
            var photoOverlayHidden = $("#photos_snowlift").hasClass("hidden_elem");
            if (!isPhotoOverlay.length || photoOverlayHidden) {
                // there is no overlay, so fire that callback
                window.global.lookedFocused = true;
                window.global.overlayFocused = false;
                if(window.global.overlayApperance) {
                    helper.sendToBg("photos_snowlift", {
                        "timestampStart": window.global.overlayApperance,
                        "timestampEnd": +new Date(),
                        "sessionId": window.global.sessionid
                    });
                    window.global.overlayApperance=undefined;
                }
                //console.log("no overlay", window.global.overlayFocused);
                if (callback) { callback(); }
            } else {
                // there is an overlay active
                logic.logLooked(logic.cachedObj, window.global.sec);
                if(!window.global.overlayApperance){
                    window.global.overlayApperance = +new Date();
                }
                //console.log("yes overlay", window.global.overlayFocused);
                window.global.overlayFocused = true;
                window.global.lookedFocused = false;
            }
        }, delay);
    },
    checkLocChanged: function() {
        setTimeout(function() {
            if (window.global.loc != window.location.href) {
                //console.log("location change", window.global.loc, window.location.href)
                logic.logLooked(logic.cachedObj, window.global.sec);
                window.global.loc = window.location.href;
            };
        }, 500);
    },
    updateNewsFeed: function() {
        //newsfeedEl = $("#stream_pagelet");
        newsfeedEl = $("#contentArea");
        if(!newsfeedEl.length) {
            newsfeedEl = $("#content_container");
        }
    },
    init: function() {
        this.updateNewsFeed();
        logic.startTimer();
        this.postsInView();
    }
};

clicked = {
    init: function() {
        $("body").click(function(e) {
            var a_aria_label, button_aria_label, _class;

            var isLinkFound = false;
            var e1 = $(e.target).closest("a");
            a_aria_label = $(e1).attr("aria-label");
            if(a_aria_label)
                a_aria_label = a_aria_label.replace(/(\d+)/g, function (match, p, replacer){
                    return getHash(p);
                });
            if(e1.length){
                _class = $(e1).attr("class");
                e1 = $(e1).data();
                Object.keys(e1).forEach(function(key){
                    console.log(e1[key]);
                    e1[key] += "";
                    e1[key] = e1[key].replace(/(\d+)/g, function (match, p, replacer){
                        return getHash(p);
                    })
                });
            }
            else{
                _class = undefined;
                e1 = undefined;
            }
            if(e1 && JSON.stringify(e1) != JSON.stringify({}) || a_aria_label){
                isLinkFound = true;
                helper.sendToBg("action", {
                    class: _class,
                    data: e1,
                    aria_label: a_aria_label,
                    timestamp: +new Date(),
                    pageType: getPageType(),
                    session: window.global.sessionid,
                });
                for (var key in e1) {
                    if (e1.hasOwnProperty(key)) {
                        sendDataAttribute(_class, key);
                    }
                }
            }

            if(!isLinkFound) {
                e1 = $(e.target).closest("button");
                button_aria_label = $(e1).attr("aria-label");
                if (e1.length) {
                    _class = $(e1).attr("class");
                    e1 = $(e1).data();
                }
                else{
                    _class = undefined;
                    e1 = undefined;
                }
                if (e1 && JSON.stringify(e1) != JSON.stringify({}) || button_aria_label) {
                    helper.sendToBg("action", {
                        class: _class,
                        data: e1,
                        aria_label: button_aria_label,
                        timestamp: +new Date(),
                        pageType: getPageType(),
                        session: window.global.sessionid,
                    });
                }
            }
        });
    }
};

//todo determine input data-,arial-,placeholder and type
var typed = {
    init: function() {
        var self = this;
        $("body").on('keyup', function(e) {
            if (window.global.lookedFocused == true)
                window.global.lookedFocused = false;

            if (e.keyCode != 13) {
            }

            if (e.target.contentEditable == "true" || e.target.localName.toLowerCase() == "textarea" || e.target.localName.toLowerCase() == "input") {
                if (e.keyCode === 13) {
                    $(e.target).attr("data-fbachecked", false);
                } else if ($(e.target).attr("data-fbachecked")) {
                    ;
                } else {
                    $(e.target).attr("data-fbachecked", true);
                    var typingTypes = {
                        chatUserSearch: 0,
                        chattingWithUser: 1,
                        makingComment: 2,
                        posting: 3,
                        searchForUser: 4,
                        somethingElse: 5,
                    };
                    if($(e.target).closest(".fbChatTypeahead").length>0)
                    {
                        helper.sendToBg("typing", {
                            type: typingTypes.chatUserSearch,
                            time: +new Date()
                        });
                    }
                    else if($(e.target).closest(".fbNubFlyoutFooter ._mh6").length>0)
                    {
                        getSex($(e.target).closest(".fbNubFlyoutInner").find(".fbNubFlyoutTitlebar .titlebarText").text(), function (gender) {
                            helper.sendToBg("typing", {
                                type: typingTypes.chattingWithUser,
                                time: +new Date(),
                                with: $(e.target).closest(".fbNubFlyoutInner").find(".fbNubFlyoutTitlebar .titlebarText").attr("href"),
                                gender: gender
                            });
                        });
                    }
                    else if($(e.target).closest(".UFIAddCommentInput").length>0)
                    {
                        helper.sendToBg("typing", {
                            type: typingTypes.makingComment,
                            time: +new Date(),
                            with: $(e.target).closest(".fbNubFlyoutInner").find(".fbNubFlyoutTitlebar .titlebarText").attr("href")
                        });
                    }
                    else if($(e.target).closest("#feedx_container").length>0)
                    {
                        helper.sendToBg("typing", {
                            type: typingTypes.posting,
                            time: +new Date()
                        });
                    }
                    else if($(e.target).closest(".navigationFocus").length>0)
                    {
                        helper.sendToBg("typing", {
                            type: typingTypes.searchForUser,
                            time: +new Date()
                        });
                    }
                    else
                    {
                        helper.sendToBg("typing", {
                            type: typingTypes.somethingElse,
                            time: +new Date()
                        });
                    }
                }
            }
            e.target.addEventListener("blur", function() {
                window.global.lookedFocused == true;
                looked.postsInView();
            });
        });
    }
};

//var throttle = require('throttle-debounce/throttle');
function throttle (limit, callback) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit);
        }
    }
}
var kickoff = {
    addClock: function() {
        $("body").append('<div id="clock"><span id="clocksec">' + 0 + '</span></div>');
    },
    listeners: function() {
        var _window = $(window);
        looked.checkPhotoOverlay(1000, function() {
            looked.postsInView();
        });
        window.onblur = function() {
            window.global.windowFocused = false;
            looked.logic.lookedFocusedFalse();
            looked.logic.logLooked(looked.logic.cachedObj, window.global.sec);
            helper.sendToBg("blur",
                {"timestamp": (+new Date()), "sessionId" : window.global.sessionid, remainingTabs: window.global.tabsCount});
        };
        window.onbeforeunload = function() {
            helper.sendToBg("closeWindow",
                {"timestamp": (+new Date()), "sessionId" : window.global.sessionid, remainingTabs: window.global.tabsCount});
        };
        window.onfocus = function() {
            window.global.windowFocused = true;
            helper.sendToBg("focus",
                {"timestamp": (+new Date()), "sessionId" : window.global.sessionid, remainingTabs: window.global.tabsCount});
        };
        $.event.special.scrollstop.latency = 800;
        _window.on("scrollstop", throttle(2000, function() {
            if (window.global.windowFocused) {
                //console.log("scrollstop check posts");
                looked.postsInView();
            }
        }));
        var prevScrollPos = 0;
        _window.on("scroll", throttle(2000, function() {
            var curPos = _window.scrollTop(),
                dif = Math.abs(curPos - prevScrollPos);
            if (dif > 800) {
                // scrolling a lot = stopped looking at the current post
                looked.logic.logLooked(looked.logic.cachedObj, window.global.sec);
            }
            prevScrollPos = curPos;
        }));
        chrome.runtime.onMessage.addListener(function(req, sen, res) {
            if (req.webRequest) {
                looked.updateNewsFeed();
            }
            else if(req.tabsCount){
                window.global.tabsCount = req.tabsCount;
            }
        });
    }
};

var start = function() {

    var info = $("#pagelet_bluebar a._2s25").has("img");
    if (info.length > 0) {
        // this is the beginning, bg only starts tracking
        // if profle img / logged in
        helper.sendToBg("contentLoaded", [1]); // session true
        //console.log("Tracking on this page.");
        kickoff.listeners();
        kickoff.addClock();
        looked.init();
        typed.init();
        clicked.init();
    }
    var androidPath = $("meta[property='al:android:url']").attr("content");
    var isDigit = androidPath.match(/\d+/g);
    if(!isDigit) {
        isDigit = 0;
    }
    else{
        isDigit = isDigit[0];
    }
    androidPath = androidPath.replace(isDigit, getHash(isDigit));

    if(getPageType().includes("profile_book.php")) {
        getSex($("title").text(), function (res) {
            helper.sendToBg("openPage", {
                type: getPageType(),
                androidurl: androidPath,
                gender: res
            });
        });
    }
    else{
        helper.sendToBg("openPage", {
            type: getPageType(),
            androidurl: androidPath,
        });
    }
}

start();

setTimeout(function () {
    if(window.global.loc != window.location.href){
        window.global.loc = window.location.href;
        looked.updateNewsFeed();
    }
}, 5000);