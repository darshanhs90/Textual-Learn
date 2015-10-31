var app = require('express')();
var express=require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ahttp = require('http');
//if (process.env.NODE_ENV !== 'production'){
var longjohn= require('longjohn');
//}
longjohn.async_trace_limit = -1;  // unlimited
var request = require('request');
var https = require('https');
var cors = require('cors');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token_key: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
});
var Twitter1 = require('node-tweet-stream'),
    tw = new Twitter1({
        consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
        consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
        token: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
        token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
    });
var watson = require('watson-developer-cloud');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('0554d03cab53ef907d02d27eaea5c2938b471ef1');
var sendgrid = require('sendgrid')('hsdars', 'Password90-');
var accountSid = 'AC07275e4294f1b0d42623c3ec9559911e';
var authToken = '650d049a9bd99323fb899ce4b9e84fcc';
var clientTwilio = require('twilio')(accountSid, authToken);
var Twit = require('twit');
var sanFrancisco = ['-122.75', '36.8', '-121.75', '37.8']
var T = new Twit({
    consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
})

var OAuth = require('oauth').OAuth,
    oauth = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        "LmNp3JwAQZnuBr4SQFaM7UZG3",
        "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD",
        "1.0",
        "oob",
        "HMAC-SHA1"
    );
var xoauth;

var Bing = require('node-bing-api')({
    accKey: "l11l8D4FBj6XkyHh3NzeMINbdY+s19eUoxrRgvgQQgQ"
});

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
app.use(cors());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
server.listen(appEnv.port, appEnv.bind, function() {
//server.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});







var querystring = require('querystring');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();




var lang = 'spa';
var getMsg = false;
var textMain = '';



var verify = false,subscribe=false;
var number;

app.get('/verifycode', function(reqst, rspns) {
    number = reqst.query.number;
    console.log(number);
    https.get('https://api.nexmo.com/verify/json?api_key=638c2b46&api_secret=60539549&number=' + number + '&brand=Textual Learn',
        function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                console.log(body);
                var parsed = JSON.parse(body);
                rspns.end(body);
            });
        });
});

//nexmo verifycheck
app.get('/verifycheck', function(reqst, rspns) {
    var code = reqst.query.code;
    var reqstid = reqst.query.request_id;
    console.log(code);
    console.log(reqstid);
    https.get('https://api.nexmo.com/verify/check/json?api_key=638c2b46&api_secret=60539549&request_id=' + reqstid + '&code=' + code,
        function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                if (parsed.status == 0|| body.status=='0')
                    verify = true;
                rspns.end(body);

            });

        });
});
app.get('/changeLanguage', function(reqst, rspns) {
    verify=true;
    lang=reqst.query.language;
    getMsg=reqst.query.getMsg;
    rspns.end();
});


app.get('/stopNotifications', function(reqst, rspns) {
    subscribe=false;
    rspns.end();
});

app.get('/subscribe', function(reqst, rspns) {
    lang=reqst.query.lang;
    getMsg=(reqst.query.method==1)?true:false;
    console.log(getMsg)
    subscribe=true;
    console.log('subscribed');
    rspns.end();
});

setInterval(function() {
    console.log('verify is'+verify);
    console.log('subscribe is '+subscribe);
    if (verify == true && subscribe==true) {

        request('http://randomword.setgetgo.com/get.php', function(error, response, body) {
            textMain = '';
            textMain += "Word :" + body;
            var textString = body;

            request('http://www.oed.com/srupage?operation=searchRetrieve&query=' + textString + '&maximumRecords=10&startRecord=1', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    try {
                        parser.parseString(body, function(err, result) {
                            var text = (result['srw:searchRetrieveResponse']['srw:records'][0]['srw:record'][0]['srw:recordData'][0]['sru_dc:dc'][0]['dc:description'][0]['_']);
                            text = text.replace('<display><span class="display">', '');
                            text = text.replace('</span></display>', '');
                            textMain += ' "+Meaning :' + text + " ";
                        });
                    } catch (err) {
                        console.log(error);
                    } finally {
                        request({
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": "LC apiKey=XULSIJ4hvHamC%2FpjbRIOIw%3D%3D"
                            },
                            uri: 'https://lc-api.sdl.com/translate',
                            body: '{"text":"' + textString + '", "from":"eng", "to":"' + lang + '"}',
                            method: 'POST'
                        }, function(err, res, body) {
                            var translation = (body.substring(body.indexOf('translation') + 14, body.length - 2));
                            if (lang == 'fra')
                                textMain += " French Translation is :" + translation;
                            else
                                textMain += " Spanish Translation is :" + translation;
                            console.log(textMain);


                            if (getMsg==true) {
                                https.get('https://rest.nexmo.com/sms/json?api_key=638c2b46&api_secret=60539549&from=12092664035&to=14697672278&text=' + textMain,
                                    function(response) {
                                        var body = '';
                                        response.on('data', function(d) {
                                            body += d;
                                        });
                                        response.on('end', function() {
                                            // Data reception is done, do whatever with it!
                                            var parsed = JSON.parse(body);
                                            console.log(parsed);

                                        });
                                    });

                            } else {
                                https.get('https://api.nexmo.com/tts/xml?api_key=638c2b46&api_secret=60539549&to=14697672278&text=' + textMain,
                                    function(response) {

                                        response.on('end', function() {
                                            console.log(parsed);

                                        });
                                    });
                            }


                        });
}
};
});


});
}
}, 15000);