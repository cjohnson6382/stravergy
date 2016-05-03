var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('activityid in /segment before API call: ', req.query.activityid);
    req.sessionDb.set(req.query.sessionid, { activityid: req.query.activityid });
    strava.activities.get({ access_token: access_token,  id: req.query.activityid }, function (err, payload) {
        if (err === null) {
            //  console.log('segment payload: ', payload.segment_efforts);
            res.end(JSON.stringify(payload));
        } else {
            console.log('error retrieving segments for activity: ', err, '  ', req.query.activityid);
        }
    });
});

module.exports = router;
