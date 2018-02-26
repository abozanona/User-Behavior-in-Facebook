var ctx = document.getElementById("mostActionsChart");
var myPieChart = new Chart(ctx,{
    type: 'pie',
    data: data,
    options: options
});

data = {
    datasets: [{
        data: [10, 20, 30]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ]
};

options = {
    cutoutPercentage : 20,
    animation: true
};