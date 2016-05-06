var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

router.get('/', function (req, res) {
    //  listActivities is not yet implemented in the stock Strava nodejs client; had to add it
    strava.activities.listActivities({ access_token: access_token }, function (err, payload) {
        if (err === null) {
            res.end(JSON.stringify(payload));
        } else {
            console.log('error getting activities', err);
        }
    });
});

module.exports = router;
