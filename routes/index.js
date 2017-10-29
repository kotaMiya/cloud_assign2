var twitter = require('twitter');
var util = require('util');


var io = require('socket.io');

exports.index = function (http) {
    io = io(http);
    return function (req, res) {
        res.render('index', {title: 'Work AND Study',
                             temp: 'test'});
        if (req.session.oauth) {
            initStream(req.session);
        }
    };
};

var request = require('request');

var headers = {
  'Content-Type':'application/json'
}

var initStream = function (session) {
    var twit = new twitter({
        consumer_key: "A6x1nzmmmerCCmVN8zTgew",
        consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
        access_token_key: session.oauth.access_token,
        access_token_secret: session.oauth.access_token_secret
    });

    twit.stream(
        'statuses/filter.json',
        {track: "work, study"},
        function (stream) {
            stream.on('data', function (data) {
                if (data.user) {
                    var text = data.text;

                    var options = {
                      url: 'http://sentiment.vivekn.com/api/text/',
                      method: 'POST',
                      headers: headers,
                      json: true,
                      form: {"txt":text}
                    }

                    request(options, function (error, response, body) {
                      console.log(body);
                    })
                }
                io.sockets.emit('newTweet', data);

            });
        }
    );
};
