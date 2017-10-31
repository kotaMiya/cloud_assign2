var twitter = require('twitter');
var util = require('util');
var request = require('request');
var io = require('socket.io');

var love_positive_sum = 0;
var love_negative_sum = 0;
var love_neutral_sum = 0;

var hello_positive_sum = 0;
var hello_negative_sum = 0;
var hello_neutral_sum = 0;

var love_num = 0;
var hello_num = 0;
var neutral_num = 0;

var headers = {
  'Content-Type':'application/json'
}

exports.index = function (http) {
    io = io(http); // connect to socket.io
    return function (req, res) {

      // initialise twitter stream
      var initStream = function (session) {
          var twit = new twitter({
              consumer_key: "A6x1nzmmmerCCmVN8zTgew",
              consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
              access_token_key: session.oauth.access_token,
              access_token_secret: session.oauth.access_token_secret
          });

          // get tweets which contain "love" and "hello"
          twit.stream(
              'statuses/filter.json',
              {track: "love, hello"},
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

                          // request to Sentiment API
                          request(options, function (error, response, body) {
                            var temp = JSON.stringify(body);

                            // check which sentiment is the resutl and count the number
                            if(typeof temp != "undefined") {
                              if (text.indexOf('love') != -1 || text.indexOf('love') != -1) {
                                console.log(temp);
                                if (temp.indexOf('Positive') != -1) {
                                  love_positive_sum += 1;
                                } else if (temp.indexOf('Negative') != -1) {
                                  love_negative_sum += 1;
                                } else if (temp.indexOf('Neutral') != -1) {
                                  love_neutral_sum += 1;
                                }
                              }
                              if (text.indexOf('hello') != -1 || text.indexOf('hello')) {
                                if (temp.indexOf('Positive') != -1) {
                                  hello_positive_sum += 1;
                                } else if (temp.indexOf('Negative') != -1) {
                                  hello_negative_sum += 1;
                                } else if (temp.indexOf('Neutral') != -1) {
                                  hello_neutral_sum += 1;
                                }
                              }
                            }

                            console.log("love_pos: " + love_positive_sum);
                            console.log("love_neg: " + love_negative_sum);
                            console.log("love_neu: " + love_neutral_sum);
                            console.log("hello_pos: " + hello_positive_sum);
                            console.log("hello_neg: " + hello_negative_sum);
                            console.log("hello_neu: " + hello_neutral_sum);
                          })
                      }
                      io.sockets.emit('newTweet', data);

                  });
              }
          );
      };


      res.render('index', {title: 'Love AND Hello',
                           love_positive: love_positive_sum,
                           love_negative: love_negative_sum,
                           love_neutral: love_neutral_sum,
                           hello_positive: hello_positive_sum,
                           hello_negative: hello_negative_sum,
                           hello_neutral: hello_neutral_sum});
      // if oauth function complete, start twitter stream.
      if (req.session.oauth) {
          initStream(req.session);
      }
    };
};
