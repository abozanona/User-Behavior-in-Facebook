var result = undefined;
$(document).ready(function () {

    collectResult(function (result) {
        $('#json-renderer').jsonViewer(result, {collapsed: true,withQuotes: false});
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
