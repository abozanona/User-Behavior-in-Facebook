var result = undefined;
$(document).ready(function () {

    getSingleValue("yourLastChoice", function (data) {
        if(data)
            $('#lastchoice').html(data);
        else
            $('#lastchoice').text('');
    });
    collectResult(function (result) {
        $('#json-renderer').jsonViewer(result, {collapsed: true,withQuotes: false});
    });
    $("#submit").click(function () {
        if(result){
            submitStudyResults(result, function () {
                var today=(+new Date());
                setSingleValue("weekPeriod", today, function () {
                });
                clearCashAfterSubmit(function () {
                    alert("Data were sent to the server successfully. Thanks.");
                    location.reload();
                });
                setSingleValue("yourLastChoice", "Your last choice was: <i>This time only</i>", function () {

                });
            });
        }
    });
    $("#submitAlways").click(function () {
        setSingleValue("isAutoSave", true, function () {
            if(result){
                submitStudyResults(result, function () {
                    var today=(+new Date());
                    setSingleValue("weekPeriod", today, function () {
                    });
                    clearCashAfterSubmit(function () {
                        alert("Data were sent to the server successfully. Thanks.");
                        location.reload();
                    });
                    setSingleValue("yourLastChoice", "Your last choice was: <i>Submit always</i>", function () {

                    });
                });
            }
        });
    });
    $("#submitNotToday").click(function () {
        var today=(+new Date());
        setSingleValue("weekPeriod", today, function () {
            clearCashAfterSubmit(function () {
                alert("We won't send data about you today.");
                location.reload();
            });
            setSingleValue("yourLastChoice", "Your last choice was: <i>Don't send and clear</i>", function () {

            });
        });
    });
});
