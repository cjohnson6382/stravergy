var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

router.get('/', function (req, res) {
    req.session.activityid = req.query.activitiyid;

    strava.activities.get({ access_token: req.session.access_token, id: req.query.activityid }, function (err, payload) {
        if (err === null) {
            res.end(JSON.stringify(payload));
        } else {
            console.log('error retrieving activity and its segments: ', err, '  ', req.query.activityid);
        }
    });
});

module.exports = router;
