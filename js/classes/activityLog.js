function checkActivityLogChanges() {
    var today=(+new Date());
    getSingleValue("activityLogTime", function(time){
        if(time==null){
            setSingleValue("activityLogTime", today, function () {

            });
            return;
        }

        var daysDifference = timestampDifference(today, time).days;
        if(daysDifference>1){
            var lastCheck=new Date();
            lastCheck.setDate(lastCheck.getDate() - daysDifference);
            for (var d = lastCheck; d <= new Date(); d.setDate(d.getDate() + 1)) {
                getActivityLogData(d);
            }
            setSingleValue("activityLogTime", today, function () {

            });
        }
    });
}
function getFilters(fn) {
    getUserID(function (userId) {
        $.get("https://mbasic.facebook.com/allactivity/options?id=" + userId, function (data) {
            var dom=$(data).find("li a");
            var log_filters=[];
            for(var i=1;i<dom.length;i++)
                log_filters.push($(dom[i]).attr("href").match(/[a-zA-Z0-9_]+$/)[0]);
            fn(log_filters);
        });
    });
}
function getActivityLogData(date){
    getFilters(function (log_filters) {
        for(var i=0;i<log_filters.length;i++){
            (function (date, log_filter) {
                date = new Date(date);
                $.get("https://mbasic.facebook.com/100010475160558/allactivity?timeend="
                    + date.getTime() / 1000 + "&timestart="
                    + date.getTime() / 1000 + "&log_filter="
                    + log_filter , function (data) {

                    data=$(data)
                        .find("#" + "tlRecentStories_" + parseMonth(date.getMonth()) +"_" + parseDay(date.getDate()) +"_" + parseYear(date.getFullYear()))//tlRecentStories_{month}_{day}_{year}
                        .find(".ck.cl");
                    var links = $(data).find(".bq.z").first().attr("href");
                    storeActivityLogResult(log_filter, +date, data.length, links);
                });
            })(date, log_filters[i]);
        }
    });
}

function parseDay(x){
    if(x<10)
        return "0"+x;
    return x;
}
function parseMonth(x){
    x++;
    if(x<10)
        return "0"+x;
    return x;
}
function parseYear(x){
    x=x-2000;
    return x;
}
function anonymizeLinks(links){
    //todo hash ids => this must be done after the initial testing
    //todo return array of object{hash, type:(user, group, page, game, ...)}
    return links;
}
function storeActivityLogResult(log_filter, timestamp, activitiesNumber, links) {
    links = anonymizeLinks(links);
    getUserID(function (userId) {
        userId=getHash(userId);
        getSingleValue("activityLog", function (e) {
            if(e==null){
                e=[];
                e[userId]=[];
                e[userId].push({
                    log_filter : log_filter,
                    timestamp: timestamp,
                    activitiesNumber: activitiesNumber,
                    links: links
                });
                setSingleValue("activityLog",e, function () {

                });
            }
            else if(isElementInArray(userId, e)){
                e[userId].push({
                    log_filter : log_filter,
                    timestamp: timestamp,
                    activitiesNumber: activitiesNumber,
                    links: links
                });
                setSingleValue("activityLog",e, function () {

                });
            }
            else{
                e[userId]=[{
                    log_filter : log_filter,
                    timestamp: timestamp,
                    activitiesNumber: activitiesNumber,
                    links: links
                }];
                setSingleValue("activityLog",e, function () {

                });
            }
        });
    });
}