function readApps(){
    $.get("https://mbasic.facebook.com/privacy/touch/apps/list/?tab=all", function(data){
        var finalResult = [];
        var finalLength;
        var appsLinks = $(data).find("table.br.bo a");
        finalLength = $(appsLinks).length;
        for(var i=0;i<$(appsLinks).length;i++)
            (function(appLink){
                $.get("https://mbasic.facebook.com" + appLink, function (data) {
                    data=$(data).find("table.l.cd.ce");
                    var result=[];
                    $(data).each(function (index) {
                        result.push({
                            name: $(this).find("input").attr("value"),
                            ischecked: $(this).find("input").attr('checked'),
                        });
                    });
                    var appId = appLink.match(/\d+/)[0];
                    var r = {
                        appId: getHash(appId),
                        permissions: result
                    };
                    finalResult.push(r);
                    finalLength--;
                    if(!finalLength)
                    getUserID(function (userId) {
                        var shUID = getHash(userId);
                        getSingleValue("apps", function(e){
                            if(e==null)
                            {
                                e=[];
                                e.push({
                                    userId: shUID,
                                    apps: finalResult
                                });
                                setSingleValue("apps", e, function(){

                                });
                                return;
                            }
                            if(!isElementInArray(shUID,e)){
                                e.push({
                                    userId: shUID,
                                    apps: finalResult
                                });
                                setSingleValue("apps", e, function(){

                                });
                                return;
                            }
                        });
                    });
                });
            })($(appsLinks[i]).attr("href"));
    });
}

function readDevicesNumber(){
    $.get("https://mbasic.facebook.com/settings/security_login/sessions/", function(data){
        var result=[];
        $(data).find(".bs.bt").each(function (index) {
            var os,location,browser,time;
            var l1  = $(this).find(".bu").text().split(" · ");
            var l2  = $(this).find(".bv").text().split(" · ");
            result.push({
                os: l1[0],
                location: getHash(l1[1]),
                browser: l2[0],
                time: l2[1],
            });
        });

        getUserID(function (userId) {
            var shUID = getHash(userId);
            result = {
                user: shUID,
                devices: result
            };
            getSingleValue("devices", function(e){
                if(e==null)
                {
                    e=[];
                    e.push(result);
                    setSingleValue("devices", e, function(){

                    });
                    return;
                }
                if(!isElementInArray(shUID,e)){
                    e.push(result);
                    setSingleValue("devices", e, function(){

                    });
                    return;
                }
            });
        });
    });
}