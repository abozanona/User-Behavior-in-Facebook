var result = undefined;
$(document).ready(function () {

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
                                                $('#json-renderer').jsonViewer(result, {collapsed: true,withQuotes: false});
                                            }
                            });
                        })(ids[i]);
                }
                });
            });
        });
    });

    $("#submit").click(function () {
        if(result){
            submitStudyResults(result, function () {
                alert("Thanks for ..., the plugin will uninstall itself now.");
                chrome.management.uninstallSelf();
            });
        }
    });
});
