


function countTweets($scope) {
    $scope.count = 0;
    $scope.countLove = 0;
    $scope.countHello = 0;
    $scope.tweets = [
        {user: {screen_name: 'user_name'}, text: 'Text'}
    ];

    var socket = io.connect();
    window.socket = socket;

    // connect socket.io with 'newTweet'
    // get the tweets and if it contains 'love', text color is red, if 'hello', text color is green
    socket.on('newTweet', function (item) {
        $scope.tweets.push(item);
        if (item && !item.limit) {
            $scope.count++;
        }
        if (item.text.indexOf('love') != -1 || item.text.indexOf('love') != -1) {
            $scope.countLove++;
            item.color = '#F58E7E';
        }
        else if (item.text.indexOf('hello') != -1 || item.text.indexOf('hello')) {
            $scope.countHello++;
            item.color = '#8DCF3F';
        }

        if ($scope.tweets.length > 5)
            $scope.tweets.splice(0, 1);
        $scope.$apply();

    })

}


// initialise pie chart data
function remove_data(chart1, chart2) {
  chart1.data.datasets[0].data[0] = 0;
  chart1.data.datasets[0].data[1] = 0;
  chart1.data.datasets[0].data[2] = 0;

  chart2.data.datasets[0].data[0] = 0;
  chart2.data.datasets[0].data[1] = 0;
  chart2.data.datasets[0].data[2] = 0;
}

// update pie chart data
function update_data(chart1, chart2, positive1, negative1, neutral1, positive2, negative2, neutral2) {
  // var value1 = Math.floor(Math.random() * 100);
  // var value2 = Math.floor(Math.random() * 100);
  // var value3 = Math.floor(Math.random() * 100);

  chart1.data.datasets[0].data[0] = positive1;
  chart1.data.datasets[0].data[1] = negative1;
  chart1.data.datasets[0].data[2] = neutral1;

  chart2.data.datasets[0].data[0] = positive2;
  chart2.data.datasets[0].data[1] = negative2;
  chart2.data.datasets[0].data[2] = neutral2;

  console.log(positive1);
  console.log(positive2);
  chart1.update();
  chart2.update();
}
