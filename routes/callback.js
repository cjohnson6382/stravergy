var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
var util = require('../modules/util.js');

router.get('/', function (req, res) {
    strava.oauth.getToken(req.query.code, function (err, payload) {
        if (err === null) {
            access_token = payload.access_token;

            util.generateSessionId(function (sessionid) {
                req.sessionDb.set(sessionid, { sessionid: sessionid, access_token: access_token, athlete: payload.athlete }, function (payload) {
                    //  console.log('in routes/auth: sessionid inserted into db: ', payload);
                    console.log('in routes/callback: sessionid inserted into db');
                    res.end(JSON.stringify('authentication successful'));
                }); 
            });
        } else {
            console.log('error getting token: ', err);
        }
    });
});

module.exports = router;
