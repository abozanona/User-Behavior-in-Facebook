window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
function getDaysNumber(milliseconds) {
    var millisecondsInDay = (1000*60*60*24);
    return parseInt(milliseconds / millisecondsInDay);
}
function addNumber(array, key, number) {
    if(!array[key])
        array[key] = 0;
    array[key] += number;
}
collectResult(function (results) {
    var friendsConnection = document.getElementById("friendsConnection");
    var maleVsFemale = document.getElementById("maleVsFemale");
    var friendsList = results.users[0].friends;
    var numberOfMutualFriends = 0;
    var approximateMale = 0;
    var approximateFemale = 0;
    for(var i=0;i<friendsList.length; i++){
        numberOfMutualFriends += friendsList[i].mutual_friends;
        if(friendsList[i].gender == 1){
            approximateMale++;
        }
        else if(friendsList[i].gender == 2){
            approximateFemale++;
        }
    }
    friendsConnection.innerText = parseInt(numberOfMutualFriends / friendsList.length) + '%';

    new Chart(maleVsFemale,{
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    approximateMale,
                    approximateFemale,
                ],
                backgroundColor: [
                    window.chartColors.orange,
                    window.chartColors.green,
                ],
                label: 'Male vs female'
            }],
            labels: [
                'Male',
                'Female'
            ]
        },
        options: {
            responsive: true
        }
    });

    var actions = results.actions;
    var howManyPageOpened = [];//contentLoaded
    var howManyPostWasLoaded = [];//postData
    var howManyPostWasLoadedLikes = [];//postData
    var howManyPostWasLoadedComments = [];//postData
    var howManyPostWasLoadedShares = [];//postData
    var howManyPostWasLoadedLetters = [];//postData
    var howManyPostWasLoadedSponsored = [];//postData
    var numberOfPostsByUsers = 0;//postData
    var numberOfPostsByPages = 0;//postData
    var numberOfPostsByOthers = 0;//postData
    var openedPages = [];
    var saveLooked = [];
    var actionsList = [];
    var chattingWithUser = [];
    for(var i=0;i<actions.length;i++){
        var action = actions[i];
        if(action.type == 'contentLoaded'){
            addNumber(howManyPageOpened, getDaysNumber(action.back_time), 1);
        }
        else if(action.type == 'postData'){
            addNumber(howManyPostWasLoaded, getDaysNumber(action.back_time), 1);
            addNumber(howManyPostWasLoadedLikes, getDaysNumber(action.back_time), action.data.likes);
            addNumber(howManyPostWasLoadedComments, getDaysNumber(action.back_time), action.data.comments_shares_viewes[0]);
            addNumber(howManyPostWasLoadedShares, getDaysNumber(action.back_time), action.data.comments_shares_viewes[1]);
            for(var j=0;j<action.data.postDesc.length;j++)
                addNumber(howManyPostWasLoadedLetters, getDaysNumber(action.back_time), action.data.postDesc[j]);
            if(action.data.suggested[1])
                addNumber(howManyPostWasLoadedSponsored, getDaysNumber(action.back_time), 1);
            else
                addNumber(howManyPostWasLoadedSponsored, getDaysNumber(action.back_time), 0);
            for(var j=0;j<action.data.posters.length;j++){
                if(action.data.posters[j] == 'user')
                    numberOfPostsByUsers++;
                else if(action.data.posters[j] == 'page')
                    numberOfPostsByPages++;
                else
                    numberOfPostsByOthers++;
            }
        }
        else if(action.type == 'openPage'){
            addNumber(openedPages, getDaysNumber(action.back_time), 1);
        }
        else if(action.type == 'saveLooked'){
            addNumber(saveLooked, getDaysNumber(action.back_time), action.data.duration);
        }
        else if(action.type == 'action'){
            addNumber(actionsList, getDaysNumber(action.back_time), 1);
        }
        else if(action.type == 'blur'){
            //silence is gold
        }
        else if(action.type == 'focus'){
            //silence is gold
        }
        else if(action.type == 'typing'){
            if(action.data.type == 1)
                addNumber(chattingWithUser, getDaysNumber(action.back_time), 1);
        }
        else if(action.type == 'photos_snowlift'){
            //silence is gold
        }
        else if(action.type == 'closeWindow'){
            //silence is gold
        }
    }

    var myPagesStudy = document.getElementById("myPagesStudy");
    var labels = [];
    var data = [];
    var j=0;
    for(var key in howManyPageOpened){
        j++;
        labels.push(j);
        data.push(howManyPageOpened[key]);
    }
    new Chart(myPagesStudy,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many fb page you opened every time',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: data,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'How many fb page you opened every time'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of pages'
                    }
                }]
            }
        }
    });


    /*

    var saveLooked = [];
    var actionsList = [];
    var chattingWithUser = [];*/

    var myPostsStudy = document.getElementById("myPostsStudy");
    var labels = [];
    var dataPosts = [];
    var dataFamous = [];
    var dataWords = [];
    var dataSponsored = [];
    var j=0;
    for(var key in howManyPostWasLoaded){
        j++;
        labels.push(j);
        dataPosts.push(parseInt(howManyPostWasLoaded[key]));
        dataSponsored.push(parseInt(howManyPostWasLoadedSponsored[key]));
        dataFamous.push(parseInt(howManyPostWasLoadedLikes[key]) + parseInt(howManyPostWasLoadedComments[key]) + parseInt(howManyPostWasLoadedShares[key]));
        dataWords.push(parseInt(howManyPostWasLoadedLetters[key] / 7));
    }
    new Chart(myPostsStudy,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many fb posts was loaded into your screen',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: dataPosts,
                fill: false
            },{
                label: 'How many fb sponsered posts was loaded into your screen',
                backgroundColor: window.chartColors.grey,
                borderColor: window.chartColors.red,
                data: dataSponsored,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'The posts you are seeing'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of posts'
                    }
                }]
            }
        }
    });

    var myWordsStudy = document.getElementById("myWordsStudy");
    new Chart(myWordsStudy,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many words you see every time',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: dataWords,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'The number of words you are seeing'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of words'
                    }
                }]
            }
        }
    });

    var myOwnersStudy = document.getElementById("myOwnersStudy");
    new Chart(myOwnersStudy,{
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    numberOfPostsByUsers,
                    numberOfPostsByPages,
                    numberOfPostsByOthers
                ],
                backgroundColor: [
                    window.chartColors.orange,
                    window.chartColors.green,
                ],
                label: 'Who posts?'
            }],
            labels: [
                'Users',
                'Pages',
                'Others'
            ]
        },
        options: {
            responsive: true
        }
    });

    var labels = [];
    var data = [];
    var j=0;
    for(var key in saveLooked){
        j++;
        labels.push(j);
        data.push(saveLooked[key]);
    }
    var saveLooked = document.getElementById("saveLooked");
    new Chart(saveLooked,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many words you see every time',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: data,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'The number of words you are seeing'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of words'
                    }
                }]
            }
        }
    });

    var labels = [];
    var data = [];
    var j=0;
    for(var key in actionsList){
        j++;
        labels.push(j);
        data.push(actionsList[key]);
    }
    var actionsList = document.getElementById("actionsList");
    new Chart(actionsList,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many words you see every time',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: data,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'The number of words you are seeing'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of words'
                    }
                }]
            }
        }
    });

    var labels = [];
    var data = [];
    var j=0;
    for(var key in chattingWithUser){
        j++;
        labels.push(j);
        data.push(chattingWithUser[key]);
    }
    var chattingWithUser = document.getElementById("chattingWithUser");
    new Chart(chattingWithUser,{
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'How many words you see every time',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: data,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'The number of words you are seeing'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'days'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'number of words'
                    }
                }]
            }
        }
    });

});