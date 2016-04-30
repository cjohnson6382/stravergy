var express = require('express');
var router = express.Router();

function sendAll (done, response_object, res) {
    if (done === 2) {
        res.end(JSON.stringify(response_object));
    }
} 

router.get('/leaderboard', function (req, res) {
    var segmentid = parseInt(req.query.segmentid, 10);
    req.sessionDb.set(req.query.sessionid, {segmentid: segmentid});
    var quintile;
    //  implement this on the client side!!!!
    //      the client is supposed to validate input
    if (0 < req.query.quintile < 6) {
        console.log('Quintile requeted: ', req.query.quintile);
        quintile = req.query.quintile;
    }

    var leaderboard_parameters = {
        access_token: access_token,
        id: segmentid,
        context_entries: 2,
        //  atheleteid: athleteid,
    };

    var done = 0;
    var response_object = {};

    getLeaderboardForSegment(leaderboard_parameters, quintile, function (ride, leaderboard) {
        response_object['leaderboard'] = leaderboard;
        done++;
        response_object['ride'] = ride
        console.log('send leaderboard and ride data');
        sendAll(done, response_array, res);
    });

    req.sessionDb.get(req.query.sessionid, 'athleteid', function (athleteid) {
        var user_parameters = {
            athleteid: athleteid,
            access_token: access_token
        };

        getUserStatsForSegment(user_parameters, function (user) {
            response_object['user'] = user
            done++;
            console.log('send user data');
            sendAll(done, response_array, res);
        });
    });
});

module.exports = router;
