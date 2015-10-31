var querystring = require('querystring');
var request = require('request');
var express = require('express');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var https = require('https');
var cors = require('cors');
var lang = 'spa';
var getMsg = false;
var textMain = '';

var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(cors());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
    //app.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
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
    console.log(verify);
    console.log(subscribe);
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