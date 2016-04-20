'use strict';

var fs = require('fs');
var async = require('async');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var https = require('https');

var google = require('googleapis');
var strava = require('strava-v3');

var upload = multer({ dest: 'uploads/' });
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var OAuth2 = google.auth.OAuth2;

var app = express();

var googleScopes = [
    //  google scopes used
];

var stravaScopes = 'view_private';

var access_token = '';

/*

strava.athlete.get({}. function (err, payload) {
    if (!err) 
        console.log('payload: ', payload);
    {} else {
        console.log('error: ', err);
    } 
});

strava.<api endpoint>.<api endpoint option>(args,callback)

//  add the 'access token' option for a user once that user has authorized your app
//      this overrides the default access token supplied in the data/strava_config file
        strava.athlete.get({'access_token':'abcde'},function(err,payload) {
            //do something with your payload
        });

*/

//  OAuth
async.waterfall([
    function (callback) {
        fs.readFile('data/strava_config', function (err, payload) {
            console.log('strava_config file after opening: '
                , JSON.parse(payload.toString('utf8')).client_id);
            if (err === null) {
                //  the JSON is getting all the way to the server starting clause
                //      and its being interpreted as an err!
                callback(null, JSON.parse(payload.toString('utf8'))); 
            } else {
                console.log('error opening credentials file: ', err);
                return;
            }
        });
    },
//  Routes
    function (credentials, callback) {
        app.get('/', function (req, res) {
            fs.readFile('html/index.html', function (err, content) {
                if (err === null) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                } else {
                    console.log('error loading index.html: ', err);
                }
            });
        });
        app.get('/auth', function (req, res) {
            //  console.log('auth called');
            console.log('credentials retrieved from file: ', credentials, '\ncallback: ', credentials.redirect_uri);
            res.writeHead(200, {'Access-Control-Allow-Origin': '*'});

            var url = strava.oauth.getRequestAccessURL({
                client_id: credentials.client_id, 
                redirect_uri: credentials.redirect_uri, 
                scope: stravaScopes,
                response_type: 'code' 
            })
            res.end(url);
        });
        app.get('/callback', function (req, res) {
            console.log('in callback: ', req.query.code);
            strava.oauth.getToken(req.query.code, function (err, payload) {
                if (err === null) {
                    console.log('access token payload: ', payload);
                    access_token = payload.access_token;
                    res.end('authentication successful!');
                    //  storeToken(access_token, );
                } else {
                    console.log('error getting token: ', err);          
                }
            });
        });
        app.get('/athlete', function (req, res) {
            strava.athlete.get({ access_token: access_token }, function (err, payload) {
                if (err === null) {
                    console.log('athlete ID: ', payload.id);
                    athelete_id = payload.id;
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
                    console.log('activities list: ', payload.length);
                    res.end(JSON.stringify(payload));
                } else {
                    console.log('error getting activities', err);
                }
            });
        });
        app.get('/segments', function (req, res) {
            console.log('activityid in /segment before API call: ', req.query.activityid);
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

            strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 200 }, function (err, payload) {
                if (err === null) {
                    //  console.log('payload for listLeaderboard: ', payload.entries);
                    //  leaderboard calls only get parts of the leaderboard
                    var total_entries = payload.entry_count;
                    var pages = Math.ceil(total_entries/200);
                    var leaderboard_entries = payload.entries;
                    var count = 1;
                    console.log('total pages: ', pages);
                    //  leaderboard calls are returning the 'context' stuff -- 2 above and 2 below me, as well as my rank
                    for (var i = 1; i < pages; i++) {
                        strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 200, page: i }, function (err, payload) {
                            if (err === null) {
                                console.log('leaderboard in for loop: ', leaderboard_entries[0].athlete_name, ' ', leaderboard_entries[0].rank, '\npayload: ', payload.entries[0].athlete_name, ' ', payload.entries[0].rank);
                                //  console.log('payload for leaderboard page: ', payload.entries[0]);
                                leaderboard_entries = leaderboard_entries.concat(payload.entries);
                                count++;
                                console.log('count/pages: ', count, pages);
                                if (count === pages) {
                                    done(leaderboard_entries);
                                }
                            } else {
                                console.log('error retrieving full loaderboard: ', err);
                            }
                        });
                    }

                    function done (entries) {
                        console.log('leaderboard_entries length before end: ', leaderboard_entries.length);
                        //  console.log('instance of leaderboard entry: ', leaderboard_entries[0]);
                        res.end(JSON.stringify(entries));
                    }
               } else {
                    console.log('error while fetching leaderboard for segment: ', req.query.segmentid, ' error: ', err);
                }
            });
        });
        callback();
    }
], function (err, results) {
    if (err === null) {
        var options = {
            key: fs.readFileSync('ssl/key.pem'),
            cert: fs.readFileSync('ssl/cert.pem')
        };
        https.createServer(options, app).listen(443, function () {
            console.log('starting the server in HTTPS mode');
        });
    } else {
        console.log('error starting the server: ', err);
    }
});
