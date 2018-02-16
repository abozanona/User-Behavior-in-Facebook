function checkActivityLogChanges() {
    var today = (+new Date());
    getSingleValue("activityLogTime", function (time) {
        console.log('started');
        if (!time) {
            setSingleValue("activityLogTime", today, function () {

            });
            time = new Date().setDate(new Date().getDate() - 3);
        }
        var daysDifference = timestampDifference(today, time).days;
        if (daysDifference > 1) {
            var lastCheck = new Date();
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
            var dom = $(data).find("li a");
            var log_filters = [];
            for (var i = 1; i < dom.length; i++)
                log_filters.push($(dom[i]).attr("href").match(/[a-zA-Z0-9_]+$/)[0]);
            fn(log_filters);
        });
    });
}

function getActivityLogData(date) {
    getUserID(function (userId) {
        getFilters(function (log_filters) {
            for (var i = 0; i < log_filters.length; i++) {
                (function (date, log_filter) {
                    date = new Date(date);
                    var date2 = new Date(date);
                    date2.setDate(date2.getDate() - 1);
                    var url = "https://mbasic.facebook.com/" + userId + "/allactivity?timeend="
                        + parseInt(date.getTime() / 1000) + "&timestart="
                        + parseInt(date2.getTime() / 1000) + "&log_filter="
                        + log_filter;
                    $.get(url, function (data) {

                        var links = [];
                        $(data).find('[id^="tlRecentStories_"] a').each(function (index) {
                            var _link = $(this).attr('href');
                            if (_link) {

                                if (_link && _link.match(/^\/[a-zA-Z0-9.]+[\/]*$/)) {
                                    //links.push("USER_NAME");
                                }
                                else {
                                    links.push(
                                        _link.replace(/(\d+)/g, function (match, p, replacer) {
                                            return getHash(p);
                                        })
                                    );
                                }
                            }
                        });
                        if (links.length)
                            storeActivityLogResult(log_filter, +date, links.length, links);
                    });
                })(date, log_filters[i]);
            }
        });
    });
}

function parseDay(x) {
    if (x < 10)
        return "0" + x;
    return x;
}

function parseMonth(x) {
    x++;
    if (x < 10)
        return "0" + x;
    return x;
}

function parseYear(x) {
    x = x - 2000;
    return x;
}

function anonymizeLinks(links) {
    //todo hash ids => this must be done after the initial testing
    //todo return array of object{hash, type:(user, group, page, game, ...)}
    return links;
}

function storeActivityLogResult(log_filter, timestamp, activitiesNumber, links) {
    links = anonymizeLinks(links);
    getUserID(function (userId) {
        userId = getHash(userId);
        getSingleValue("activityLog", function (e) {
            if (e == null) {
                e = [];
                e.push({
                    log_filter: log_filter,
                    timestamp: timestamp,
                    activitiesNumber: activitiesNumber,
                    links: links
                });
                setSingleValue("activityLog", e, function () {

                });
            }
            else {
                e.push({
                    log_filter: log_filter,
                    timestamp: timestamp,
                    activitiesNumber: activitiesNumber,
                    links: links
                });
                setSingleValue("activityLog", e, function () {

                });
            }
        });
    });
}