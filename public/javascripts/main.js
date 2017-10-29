
function countTweets($scope) {
    $scope.count = 0;
    $scope.countWork = 0;
    $scope.countStudy = 0;
    $scope.tweets = [
        {user: {screen_name: 'user_name'}, text: 'Text'}
    ];

    var socket = io.connect();
    window.socket = socket;

    socket.on('newTweet', function (item) {
        $scope.tweets.push(item);
        if (item && !item.limit) {
            $scope.count++;
        }
        // if (item.limit) {
        //     $scope.countPass += item.limit.track;
        //     console.log(item.limit);
        // }
        // else if ((item.text.indexOf('study') != -1 || item.text.indexOf('study') != -1) &&
        //     (item.text.indexOf('work') != -1 || item.text.indexOf('work') != -1)) {
        //     $scope.countMiddle++;
        // }
        if (item.text.indexOf('work') != -1 || item.text.indexOf('work') != -1) {
            $scope.countWork++;
            item.color = '#F58E7E';
        }
        else if (item.text.indexOf('study') != -1 || item.text.indexOf('study')) {
            $scope.countStudy++;
            item.color = '#8DCF3F';
        }

        // console.log($scope.tweets[0].text);

        if ($scope.tweets.length > 15)
            $scope.tweets.splice(0, 1);
        $scope.$apply();

    })

}
