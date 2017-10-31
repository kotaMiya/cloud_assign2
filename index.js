var twitter = require('twitter');
var util = require('util');
var request = require('request');
var io = require('socket.io');

var mac_positive_sum = 3;
var mac_negative_sum = 0;
var mac_neutral_sum = 0;

var windows_positive_sum = 5;
var windows_negative_sum = 0;
var windows_neutral_sum = 0;

var mac_num = 0;
var windows_num = 0;
var neutral_num = 0;

var headers = {
  'Content-Type':'application/json'
}

function hello(attr1, attr2) {
  console.log(attr1);
  console.log(attr2);
}

exports.index = function (http) {
    io = io(http);
    return function (req, res) {
        res.render('index', {title: 'Mac AND Windows',
                             mac_positive: mac_positive_sum,
                             mac_negative: mac_negative_sum,
                             mac_neutral: mac_neutral_sum,
                             windows_positive: windows_positive_sum,
                             windows_negative: windows_negative_sum,
                             windows_neutral: windows_neutral_sum});
        if (req.session.oauth) {
            initStream(req.session);
        }
    };
};

var initStream = function (session) {
    var twit = new twitter({
        consumer_key: "A6x1nzmmmerCCmVN8zTgew",
        consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
        access_token_key: session.oauth.access_token,
        access_token_secret: session.oauth.access_token_secret
    });

    twit.stream(
        'statuses/filter.json',
        {track: "mac, windows"},
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
                      var temp = JSON.stringify(body);

                      if (text.indexOf('mac') != -1 || text.indexOf('mac') != -1) {
                        if (temp.indexOf('Positive') != -1) {
                          mac_positive_sum += 1;
                        } else if (temp.indexOf('Negative') != -1) {
                          mac_negative_sum += 1;
                        } else if (temp.indexOf('Neutral') != -1) {
                          mac_neutral_sum += 1;
                        }
                      } else if (text.indexOf('windows') != -1 || text.indexOf('windows')) {
                        if (temp.indexOf('Positive') != -1) {
                          windows_positive_sum += 1;
                        } else if (temp.indexOf('Negative') != -1) {
                          windows_negative_sum += 1;
                        } else if (temp.indexOf('Neutral') != -1) {
                          windows_neutral_sum += 1;
                        }
                      }

                      // hello(m);
                      data.sentiment = temp;
                      data.id = 0;
                      console.log(data.id);
                      console.log(data);


                      // console.log(temp);
                      console.log(mac_positive_sum);
                      // console.log(work_negative_sum);
                      // console.log(work_neutral_sum);
                      console.log(windows_positive_sum);
                      // console.log(study_negative_sum);
                      // console.log(study_neutral_sum);
                    })
                }
                io.sockets.emit('newTweet', data);

            });
        }
    );
};
