var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

router.get('/', function (req, res) {
    strava.oauth.getToken(req.query.code, function (err, payload) {
        if (err === null) {
            console.log('oauth callback reached');
            req.session.access_token = payload.access_token;
            req.session.athlete = payload.athlete.id;
            res.end('authentication complete');
        } else {
            console.log('error getting token: ', err);
        }
    });
});

module.exports = router;
