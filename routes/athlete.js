var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    strava.athlete.get({ access_token: access_token }, function (err, payload) {
        if (err === null) {
            console.log('athlete ID: ', payload.id);
            req.sessionDb.set(req.query.sessionid, {athleteid: payload.id});
            res.end(JSON.stringify(payload));
        } else {
            console.log('error getting athlete: ', err);
        }
    });
});

module.exports = router;
