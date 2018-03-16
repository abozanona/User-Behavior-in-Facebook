$(document).ready(function () {
    getSingleValue("colors", function (e) {
        if(!e){
            e=[
                "#baffb2",
                "#ffdab2",
                "#ffa3a3",
                "#ccdaff",
                "#cccccc"
            ];
        }
        $("#public").val(e[0]);
        $("#friends").val(e[1]);
        $("#onlyme").val(e[2]);
        $("#custom").val(e[3]);
        $("#unknown").val(e[4]);
    }); 
    // getting the value of the color enable checkbox
    getSingleValue("isFBWEnabled", function (e) {
        if(e)
            $("#isFBWEnabled").attr("checked", true);
        else
            $("#isFBWEnabled").attr("checked", false);
    });
     // setting the value of color enable checkbox when it changed
    $("#isFBWEnabled").change(function() {
        var b=false;
        if($(this).is(":checked")) {
            b=true;
        }
        setSingleValue("isFBWEnabled", b, function () {

        });
    });  
    // user submition
    $("#submit").click(function() {
        var email=$("#email").val();
        subscribe(email, function () {
            $("#submit").attr("disabled", true);
            $("#email").attr("disabled", true);
            $("#submit").html("You subscribed to the study results succ.");
        });
    });
});