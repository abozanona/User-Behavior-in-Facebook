getSingleValue("installWelcome", function (e) {
    if(e){
        $("#installWelcome").show();
        $("#installWelcome").click(function () {
            $("#installWelcome").hide();
        });
        setSingleValue("installWelcome", false, function () {
        });
    }
});