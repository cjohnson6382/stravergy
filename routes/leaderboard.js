var express = require('express');
var leaderboard_helper = require('../modules/leaderboard.js');
var router = express.Router();
var strava = require('strava-v3');

function sendAll (done, response_object, res) {
    if (done === 2) {
        res.end(JSON.stringify(response_object));
    }
} 

router.get('/', function (req, res) {
    var segmentid = parseInt(req.query.segmentid, 10);
    req.sessionDb.set(req.query.sessionid, { segmentid: segmentid }, function (payload) {
        console.log('', payload);
    });
    var quintile;
    //  implement this on the client side!!!!
    //      the client is supposed to validate input
    if (0 < req.query.quintile < 6) {
        quintile = req.query.quintile;
    }

    var leaderboard_parameters = {
        access_token: access_token,
        id: segmentid,
        context_entries: 2,
    };

    var done = 0;
    var response_object = {};

    leaderboard_helper.getLeaderboardForSegment(leaderboard_parameters, quintile, function (ride, leaderboard) {
        //  console.log('routes/leaderbard.js getLeaderboardForSegment callback: ', leaderboard);
        //  console.log('ride in leaderbard.js getLeaderboardForSegment callback: ', ride);

        response_object['leaderboard'] = leaderboard;
        response_object['ride'] = ride
        done++;
        console.log('leaderboard and ride data');
        sendAll(done, response_object, res);
    });

    req.sessionDb.get(req.query.sessionid, 'athlete', function (athleteid) {
        console.log('routes/leaderboard: db response, getting athleteid: ', athleteid);
        var user_parameters = {
            athlete_id: athleteid,
            id: segmentid,
            access_token: access_token
        };

        leaderboard_helper.getUserStatsForSegment(user_parameters, function (user) {
            console.log('\n\nin leaderboard.js, getUserStatsForSegment callback: ', user.length);
            response_object['user'] = user;
            done++;
            console.log('user data');
            leaderboard_helper.sentAll(done, response_object, res);
        });
    });
});

module.exports = router;
