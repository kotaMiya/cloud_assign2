var twitter = require('twitter');
var util = require('util');


var io = require('socket.io');

var work_positive_sum = 0;
var work_negative_sum = 0;
var work_neutral_sum = 0;

var study_positive_sum = 0;
var study_negative_sum = 0;
var study_neutral_sum = 0;

var work_num = 0;
var study_num = 0;
var neutral_num = 0;


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

                    // if (text.indexOf('work') != -1) {
                    //   work_num += 1;
                    // } else if (text.indexOf('study') != -1) {
                    //   study_num += 1;
                    // } else {
                    //   neutral_sum += 1;
                    // }
                    //
                    // console.log(work_num);



                    var options = {
                      url: 'http://sentiment.vivekn.com/api/text/',
                      method: 'POST',
                      headers: headers,
                      json: true,
                      form: {"txt":text}
                    }

                    request(options, function (error, response, body) {
                      var temp = JSON.stringify(body);

                      if (text.indexOf('work') != -1 || text.indexOf('work') != -1) {
                        if (temp.indexOf('Positive') != -1) {
                          work_positive_sum += 1;
                        } else if (temp.indexOf('Negative') != -1) {
                          work_negative_sum += 1;
                        } else if (temp.indexOf('Neutral') != -1) {
                          work_neutral_sum += 1;
                        }
                      } else if (text.indexOf('study') != -1 || text.indexOf('study')) {
                        if (temp.indexOf('Positive') != -1) {
                          study_positive_sum += 1;
                        } else if (temp.indexOf('Negative') != -1) {
                          study_negative_sum += 1;
                        } else if (temp.indexOf('Neutral') != -1) {
                          study_neutral_sum += 1;
                        }
                      }

                      console.log(temp);
                      console.log(work_positive_sum);
                      console.log(work_negative_sum);
                      console.log(work_neutral_sum);
                      console.log(study_positive_sum);
                      console.log(study_negative_sum);
                      console.log(study_neutral_sum);
                    })
                }
                io.sockets.emit('newTweet', data);

            });
        }
    );
};
