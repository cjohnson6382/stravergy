var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    fs.readFile('html/index.html', function (err, content) {
        if (err === null) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        } else {
            console.log('error loading index.html: ', err);
        }   
    }); 
});

module.exports = router;

app.get('/auth', function (req, res) {
    //  console.log('auth called');
    console.log('credentials retrieved from file: ', credentials, '\ncallback: ', credentials.redirect_uri);
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});

    var sessionid = util.generateSesionId();

    var url = strava.oauth.getRequestAccessURL({
        client_id: credentials.client_id, 
        redirect_uri: credentials.redirect_uri, 
        scope: stravaScopes,
        response_type: 'code' 
    })  
    res.end({url: url, sessionid: sessionid});
}); 
app.get('/callback', function (req, res) {
    console.log('in callback: ', req.query.code);
    strava.oauth.getToken(req.query.code, function (err, payload) {
        if (err === null) {
            console.log('access token payload: ', payload);
            access_token = payload.access_token;
            res.end('authentication successful!');

            sessionDb.set(req.query.sessionid, {access_token: access_token});
        } else {
            console.log('error getting token: ', err);    
        }   
    }); 
}); 
app.get('/athlete', function (req, res) {
    strava.athlete.get({ access_token: access_token }, function (err, payload) {
        if (err === null) {
            console.log('athlete ID: ', payload.id);
            sessionDb.set(req.query.sessionid, {athleteid: payload.id});
            res.end(JSON.stringify(payload));
        } else {
            console.log('error getting athlete: ', err);
        }
    });
});
app.get('/activity', function (req, res) {
        //  listActivities is not yet implemented in the default nodejs client 
    strava.activities.listActivities({ access_token: access_token }, function (err, payload) {
        if (err === null) {
            console.log('activities list: ', payload.length, payload);
            res.end(JSON.stringify(payload));
        } else {
            console.log('error getting activities', err);
        }
    });
});
app.get('/segments', function (req, res) {
    console.log('activityid in /segment before API call: ', req.query.activityid);
    sessionDb.set(req.query.sessionid, { activityid: req.query.activityid });
    strava.activities.get({ access_token: access_token,  id: req.query.activityid }, function (err, payload) {
        if (err === null) {
            //  console.log('segment payload: ', payload.segment_efforts);
            res.end(JSON.stringify(payload));
        } else {
            console.log('error retrieving segments for activity: ', err, '  ', req.query.activityid);
        }
    });
});
app.get('/leaderboard', function (req, res) {
    var segmentid = parseInt(req.query.segmentid, 10);
    sessionDb.set(req.query.sessionid, {segmentid: segmentid});
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

    var sent = 0;
    getLeaderboardForSegment(leaderboard_parameters, quintile, function (ride, leaderboard) {
        res.send(JSON.stringify({type: 'leaderboard', leaderboard: leaderboard}));
        sent++;
        res.send(JSON.stringify({type: 'ride', ride: ride}));
        sent++;
        console.log('send leaderboard and ride data');
        sentAll(sent);
    });

    sessionDb.get(req.query.sessionid, 'athleteid', function (athleteid) {
        var user_parameters = {
            athleteid: athleteid,
            access_token: access_token
        };

        getUserStatsForSegment(user_parameters, function (user) {
            res.send(JSON.stringify({type: 'user', user: user}));
            sent++;
            console.log('send user data');
            sentAll(sent);
        });
    });
});