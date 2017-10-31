
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var uid = require('uid');
var path = require('path');
var util = require('util');

var OAuth = require('oauth').OAuth;
var twitter = require('twitter');

var app = express();

var user = require('./routes/user');

// set application environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    genid: function (req) {
        return uid(30);
    },
    resave: true,
    saveUninitialized: true,
    secret: 'secret'
}));

app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').Server(app);
console.log('Express server listening on port ' + app.get('port'));
server.listen(app.get('port'));


var routes = require('./routes');
app.get('/', routes.index(server));


// twitter session
app.get('/auth/twitter', function (req, res) {
  // get the current url and make new OAuth object
  var url_twitter = req.protocol + '://' + req.headers.host + req.url;
  var point = url_twitter.search('3000');
  point += 4;
  var local_address = url_twitter.substring(7, point);
  var right_address = 'http://' + local_address + '/auth/twitter/callback';
  var oa = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      "A6x1nzmmmerCCmVN8zTgew",
      "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
      "1.0A",
      right_address,
      "HMAC-SHA1"
  );
    // send oauth token to twitter to login
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
        } else {
            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            console.log('oauth.token: ' + req.session.oauth.token);
            req.session.oauth.token_secret = oauth_token_secret;
            console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
        }
    });
});

// call callback page, and if all good, redirect to top page
app.get('/auth/twitter/callback', function (req, res, next) {
    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;

        var url_twitter = req.protocol + '://' + req.headers.host + req.url;
        var point = url_twitter.search('3000');
        point += 4;
        var local_address = url_twitter.substring(7, point);

        var twitter_address = "http://" + local_address + "/auth/twitter/callback";
        console.log(twitter_address);

        var oa = new OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            "A6x1nzmmmerCCmVN8zTgew",
            "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
            "1.0A",
            twitter_address,
            "HMAC-SHA1"
        );

        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                } else {
                    req.session.oauth.access_token = oauth_access_token;
                    req.session.oauth.access_token_secret = oauth_access_token_secret;

                    var twit = new twitter({
                        consumer_key: "A6x1nzmmmerCCmVN8zTgew",
                        consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
                        access_token_key: req.session.oauth.access_token,
                        access_token_secret: req.session.oauth.access_token_secret
                    });

                    res.redirect('/');

                }
            }
        );
    }
});
