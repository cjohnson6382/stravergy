var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

router.get('/', function (req, res) {
    //  console.log('in callback: ', req.query.code);
    strava.oauth.getToken(req.query.code, function (err, payload) {
        if (err === null) {
            //  console.log('access token payload: ', payload);
            access_token = payload.access_token;
            req.sessionDb.set(req.query.sessionid, {access_token: access_token, athelete: access_token.athlete}, function () {
                res.end('authentication successful!');
            });
        } else {
            console.log('error getting token: ', err);
        }
    });
});

module.exports = router;
