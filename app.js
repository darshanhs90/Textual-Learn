var app = require("express")(),
express = require("express"),
server = require("http").Server(app),
io = require("socket.io")(server),
ahttp = require("http"),
longjohn = require("longjohn");
var bodyParser=require('body-parser')
longjohn.async_trace_limit = -1;
var request = require("request"),
https = require("https"),
cors = require("cors"),
Twitter = require("twitter"),
client = new Twitter({
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    access_token_key: "access_token_key",
    access_token_secret: "access_token_secret"
}),
Twitter1 = require("node-tweet-stream"),
tw = new Twitter1({
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    token: "token",
    token_secret: "token_secret"
}),
watson = require("watson-developer-cloud"),
AlchemyAPI = require("alchemy-api"),
alchemy = new AlchemyAPI("id"),
sendgrid = require("sendgrid")("id", "pwd"),
accountSid = "id",
authToken = "token",
clientTwilio = require("twilio")(accountSid, authToken),
Twit = require("twit"),
sanFrancisco = ["-122.75", "36.8", "-121.75", "37.8"],
T = new Twit({
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    access_token: "access_token",
    access_token_secret: "access_token_secret"
}),
OAuth = require("oauth").OAuth,
oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", "access_token", "access_token", "1.0", "oob", "HMAC-SHA1"),
xoauth, Bing = require("node-bing-api")({
    accKey: "accKey"
}),
cfenv = require("cfenv");
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors()), app.use(express["static"](__dirname + "/public"));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url)
});
var querystring = require("querystring"),
xml2js = require("xml2js"),
parser = new xml2js.Parser,
lang = "spa",
getMsg = !1,
textMain = "",
verify = !1,
subscribe = !1;

var number='1';
app.get("/verifycode", function(e, t) {
    number = e.query.number;
    console.log(' changing number');
    console.log(number);
    https.get("https://api.nexmo.com/verify/json?api_key=api_key&api_secret=api_secret&number=" + number + "&brand=Textual Learn", function(e) {
        var r = "";
        e.on("data", function(e) {
            r += e
        }), e.on("end", function() {
            console.log(r);
            JSON.parse(r);
            t.end(r)
        })
    })
});
app.get("/verifycheck", function(e, t) {
    var r = e.query.code,
    n = e.query.request_id;
    console.log(r), console.log(n), https.get("https://api.nexmo.com/verify/check/json?api_key=api_key&api_secret=api_secret&request_id=" + n + "&code=" + r, function(e) {
        var r = "";
        e.on("data", function(e) {
            r += e
        }), e.on("end", function() {
            var e = JSON.parse(r);
            (0 == e.status || "0" == r.status) && (verify = !0), t.end(r)
        })
    })
});
app.get("/changeLanguage", function(e, t) {
    verify = !0, lang = e.query.language, getMsg = e.query.getMsg, t.end()
});
app.get("/stopNotifications", function(e, t) {
    subscribe = !1, t.end()
});
app.get("/subscribe", function(e, t) {
    lang = e.query.lang, getMsg = 1 == e.query.method ? !0 : !1, console.log(getMsg), subscribe = !0, console.log("subscribed");
     t.send(({'number':number}));t.end();
});
setInterval(function() {
    console.log('number'+number);
    console.log("verify is" + verify), console.log("subscribe is " + subscribe), 1 == verify && 1 == subscribe && request("http://randomword.setgetgo.com/get.php", function(e, t, r) {
        textMain = "", textMain += "Word :" + r;
        var n = r;
        request("http://www.oed.com/srupage?operation=searchRetrieve&query=" + n + "&maximumRecords=10&startRecord=1", function(e, t, r) {
            if (!e && 200 == t.statusCode) {
                console.log(r);
                try {
                    parser.parseString(r, function(e, t) {
                        var r = t["srw:searchRetrieveResponse"]["srw:records"][0]["srw:record"][0]["srw:recordData"][0]["sru_dc:dc"][0]["dc:description"][0]._;
                        r = r.replace('<display><span class="display">', ""), r = r.replace("</span></display>", ""), textMain += ' "+Meaning :' + r + " "
                    })
                } catch (s) {
                    console.log(e)
                } finally {
                    request({
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Authorization"
                        },
                        uri: "https://lc-api.sdl.com/translate",
                        body: '{"text":"' + n + '", "from":"eng", "to":"' + lang + '"}',
                        method: "POST"
                    }, function(e, t, r) {
                        var n = r.substring(r.indexOf("translation") + 14, r.length - 2);
                        console.log('number'+number);
                        textMain += "fra" == lang ? " French Translation is :" + n : " Spanish Translation is :" + n, console.log(textMain), 1 == getMsg ? https.get("https://rest.nexmo.com/sms/json?api_key=api_key&api_secret=api_secret&from=num&to="+number+"&text=" + textMain, function(e) {
                            var t = "";
                            e.on("data", function(e) {
                                t += e
                            }), e.on("end", function() {
                                var e = JSON.parse(t);
                                console.log(e)
                            })
                        }) : https.get("https://api.nexmo.com/tts/xml?api_key=api_key&api_secret=api_secret&to="+number+"&text=" + textMain, function(e) {
                            e.on("end", function() {
                                console.log(parsed)
                            })
                        })
                    })
}
}
})
})
}, 15e3);






app.get('/newsms',function(req,res){

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();


});
app.post('/newsms',function(req,res){

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();


});
