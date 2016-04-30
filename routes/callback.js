var express = require('express');
var router = express.Router();

router.get('/callback', function (req, res) {
    console.log('in callback: ', req.query.code);
    strava.oauth.getToken(req.query.code, function (err, payload) {
        if (err === null) {
            console.log('access token payload: ', payload);
            access_token = payload.access_token;
            res.end('authentication successful!');

            req.sessionDb.set(req.query.sessionid, {access_token: access_token});
        } else {
            console.log('error getting token: ', err);
        }
    });
});

module.exports = router;
