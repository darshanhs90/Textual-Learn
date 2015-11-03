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
        consumer_key: "LmNp3JwAQZnuBr4SQFaM7UZG3",
        consumer_secret: "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD",
        access_token_key: "151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc",
        access_token_secret: "czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw"
    }),
    Twitter1 = require("node-tweet-stream"),
    tw = new Twitter1({
        consumer_key: "LmNp3JwAQZnuBr4SQFaM7UZG3",
        consumer_secret: "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD",
        token: "151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc",
        token_secret: "czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw"
    }),
    watson = require("watson-developer-cloud"),
    AlchemyAPI = require("alchemy-api"),
    alchemy = new AlchemyAPI("0554d03cab53ef907d02d27eaea5c2938b471ef1"),
    sendgrid = require("sendgrid")("hsdars", "Password90-"),
    accountSid = "AC07275e4294f1b0d42623c3ec9559911e",
    authToken = "650d049a9bd99323fb899ce4b9e84fcc",
    clientTwilio = require("twilio")(accountSid, authToken),
    Twit = require("twit"),
    sanFrancisco = ["-122.75", "36.8", "-121.75", "37.8"],
    T = new Twit({
        consumer_key: "LmNp3JwAQZnuBr4SQFaM7UZG3",
        consumer_secret: "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD",
        access_token: "151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc",
        access_token_secret: "czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw"
    }),
    OAuth = require("oauth").OAuth,
    oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", "LmNp3JwAQZnuBr4SQFaM7UZG3", "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD", "1.0", "oob", "HMAC-SHA1"),
    xoauth, Bing = require("node-bing-api")({
        accKey: "l11l8D4FBj6XkyHh3NzeMINbdY+s19eUoxrRgvgQQgQ"
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
    subscribe = !1,
    number;
app.get("/verifycode", function(e, t) {
    number = e.query.number, console.log(number), https.get("https://api.nexmo.com/verify/json?api_key=638c2b46&api_secret=60539549&number=" + number + "&brand=Textual Learn", function(e) {
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
    console.log(r), console.log(n), https.get("https://api.nexmo.com/verify/check/json?api_key=638c2b46&api_secret=60539549&request_id=" + n + "&code=" + r, function(e) {
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
    lang = e.query.lang, getMsg = 1 == e.query.method ? !0 : !1, console.log(getMsg), subscribe = !0, console.log("subscribed"), t.end()
});
setInterval(function() {
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
                            "Authorization": "LC apiKey=XULSIJ4hvHamC%2FpjbRIOIw%3D%3D"
                        },
                        uri: "https://lc-api.sdl.com/translate",
                        body: '{"text":"' + n + '", "from":"eng", "to":"' + lang + '"}',
                        method: "POST"
                    }, function(e, t, r) {
                        var n = r.substring(r.indexOf("translation") + 14, r.length - 2);
                        textMain += "fra" == lang ? " French Translation is :" + n : " Spanish Translation is :" + n, console.log(textMain), 1 == getMsg ? https.get("https://rest.nexmo.com/sms/json?api_key=638c2b46&api_secret=60539549&from=12092664035&to="+number+"&text=" + textMain, function(e) {
                            var t = "";
                            e.on("data", function(e) {
                                t += e
                            }), e.on("end", function() {
                                var e = JSON.parse(t);
                                console.log(e)
                            })
                        }) : https.get("https://api.nexmo.com/tts/xml?api_key=638c2b46&api_secret=60539549&to="+number+"&text=" + textMain, function(e) {
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