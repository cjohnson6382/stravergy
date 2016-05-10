var express = require('express');
var leaderboard_helper = require('../modules/leaderboard.js');
var router = express.Router();
var strava = require('strava-v3');

/*
function sendAll (done, response_object, res) {
    if (done === 2) {
        res.end(JSON.stringify(response_object));
    }
} 
*/

router.get('/', function (req, res) {
    var quintile;
    req.session.segmentid = req.query.segmentid
    //  implement this on the client side!!!!
    //      the client is supposed to validate input
    if (0 < req.query.quintile < 6) {
        quintile = req.query.quintile;
    }

    var done = 0;
    var response_object = {};

    var leaderboard_parameters = {
        access_token: req.session.access_token,
        id: req.session.segmentid,
        context_entries: 2,
    };

    leaderboard_helper.getLeaderboardForSegment(leaderboard_parameters, quintile, function (ride, leaderboard) {
        response_object['leaderboard'] = leaderboard;
        response_object['ride'] = ride
        done++;
        console.log('leaderboard and ride data');
        //  sendAll(done, response_object, res);
        res.end(JSON.stringify(response_object));
    });

    var user_parameters = {
        athlete_id: req.session.athlete,
        id: req.session.segmentid,
        access_token: req.session.access_token
    };

/*
    leaderboard_helper.getUserStatsForSegment(user_parameters, function (user) {
        response_object['user'] = user;
        done++;
        console.log('user data');
        leaderboard_helper.sentAll(done, response_object, res);
    });
*/
});

module.exports = router;
