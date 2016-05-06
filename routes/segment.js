var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

router.get('/', function (req, res) {
    
    req.sessionDb.set(req.query.sessionid, { activityid: req.query.activityid }, function (payload) {
        strava.activities.get({ access_token: access_token,  id: req.query.activityid }, function (err, payload) {
            if (err === null) {
                res.end(JSON.stringify(payload));
            } else {
                console.log('error retrieving activity and its segments: ', err, '  ', req.query.activityid);
            }
        });
    });
});

module.exports = router;
