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

//  this is going to happen once the database is working; after an athlete authorizes,
//      retrieve their info from the DB
//  var athelete_id = ;


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
                    console.log('activities list: ', payload.length, payload);
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
/*
            var context_entries = 2;
            //  listLeaderboard is max 200 entries; the first call returns with the total number of entries, use that to loop API calls to get all of the entries
            strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 1, context_entries: context_entries }, function (err, payload) {
                if (err === null) {
                    console.log('response to listLeaderboard call: ', payload.entries);
                    //  1 is user, 2* is for 2 context_entries on each side of the user
                    var user_context = 1 + 2 * context_entries;
                    var total_entries = payload.entry_count;
                    //  var pages = Math.ceil(total_entries/200);

                    var user_stats = payload.entries[3];

                    var page_start;
                    var page_end;

                    //  returns a number that = the size of a quintile on the leaderboard
                    function getQuintile (leaderboard_entries) {
                        console.log('leaderboard_entries/5: ', Math.ceil(leaderboard_entries/5));
                        return Math.ceil(leaderboard_entries/5);
                    }

                    function getPageRange(quintile, quintile_size) {
                        console.log('total_entries/quintile_size/quintile: ', total_entries, quintile_size, quintile);
                        return {
                            //  quintile * quintile_size is the LAST entry you should get
                            //  quintile-1*quintile is the FIRST entry you should get
                            start: Math.floor((quintile-1)*quintile_size/200), 
                            end: Math.ceil(quintile*quintile_size/200)
                        };
                    }

                    if (quintile) {
                        console.log('quintile slice requested: ', quintile);
                        var start_end = getPageRange(quintile, getQuintile(total_entries));
                        console.log('start_end: ', start_end);
                        page_start = start_end.start;
                        page_end = start_end.end;
                    } else {
                        page_start = 0;
                        page_end = Math.ceil(total_entries/200);
                    }

                    var pages = page_end - page_start;
                    var count = page_start;
                    console.log('total_entries, page_start, page_end', total_entries, page_start, page_end);

*/
/*
                   var leaderboard_entries = [];

                    //  looping calls to get the parts of the leaderboard you want
                    for (var i = page_start + 1; i < page_end + 1; i++) {
                        strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 200, context_entries: context_entries, page: i }, function (err, payload) {
                            var entries = payload.entries.slice(0, payload.entries.length - (context_entries + 1));
                            if (err === null) {
                                //  concat each call onto the leaderboard_entries which is ultimately returned to client
                                leaderboard_entries = leaderboard_entries.concat(entries);
                                count++;
                                console.log('count/pages', count, pages);
                                if (count === pages) {
                                    done(leaderboard_entries);
                                }
                            } else {
                                console.log('error retrieving full loaderboard: ', err);
                            }
                        });
                    }

                    //  done waits for all listLeaderboard calls to return before sending results to client
                    function done (entries) {
                        console.log('leaderboard_entries length before end: ', entries.length);
                        res.end(JSON.stringify({entries: entries, user_ride: user_stats}));
                    }

               } else {
                    console.log('error while fetching leaderboard for segment: ', req.query.segmentid, ' error: ', err);
                }
*/

            var segmentid = parseInt(req.query.segmentid, 10);
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
                atheleteid: athleteid
            };

            function getQuintile (leaderboard_entries) {
                console.log('leaderboard_entries/5: ', Math.ceil(leaderboard_entries/5));
                return Math.ceil(leaderboard_entries/5);
            }

            function getPageRange(quintile, quintile_size) {
                console.log('total_entries/quintile_size/quintile: ', total_entries, quintile_size, quintile);
                return {
                    //  quintile * quintile_size is the LAST entry you should get
                    //  quintile-1*quintile is the FIRST entry you should get
                    start: Math.floor((quintile-1)*quintile_size/200), 
                    end: Math.ceil(quintile*quintile_size/200)
                };
            }

            function getRemainderLeaderboard(parameters, callback) {
                var leaderboard_entries = [];

                var start = parameters.start_end.start;
                var end = parameters.start_end.end;
                delete parameters.start_end;
                
                //  looping calls to get the parts of the leaderboard you want
                for (var i = start + 1; i < end + 1; i++) {
                    parameters.page = i;
                    strava.segments.listLeaderboard(parameters, function (err, payload) {
                        var entries = payload.entries.slice(0, payload.entries.length - 6);
                        if (err === null) {
                            //  concat each call onto the leaderboard_entries which is ultimately returned to client
                            leaderboard_entries = leaderboard_entries.concat(entries);
                            count++;
                            console.log('count/pages', count, pages);
                            if (count === pages) {
                                callback(leaderboard_entries);
                            }
                        } else {
                            console.log('error retrieving full loaderboard: ', err);
                        }
                    });
                }
            };

            function getLeaderboardForSegment (parameters_object, callback) {
                var first_call_parameters = parameters_object;
                first_call_paramters.context_entries = 2;
                first_call_parameters.per_page = 1;

                strava.segments.listLeaderboard(first_call_parameters, function (err, payload) {
                    if (err === null) {
                        //  res.send!!!

                        //  first entry is from the leaderboard, the next 5 are athlete's stats plus those of the two above and below him/her on the leaderboard
                        var ride = payload.entries[3];
                        var total_entries = payload.entry_count;
                        var start_end;
                        if (quintile) {
                            start_end = getPageRange(quintile, getQuintile(total_entries));
                        } else {
                            start_end = {start: 1, end: Math.ceil(total_entries/200)};
                        }

                        var parameters = {
                            start_end: start_end,
                            access_token: access_token,
                            id: segmentid,
                            per_page: 200,
                            context_entries: 2
                        };

                        getRemainderLeaderboard(parameters, function (leaderboard) {
                            console.log('leaderboard_entries length before end: ', leaderboard.length);
                            callback(ride, leaderboard);
                        });
                       
                    } else {
                        console.log('error getting leaderboard entries: ', err);
                    }
                });
            }

            function getUserStatsForSegment (parameters, callback) {
                strava.segments.listEfforts(parameters, function (err, payload) {
                    if (err === null) {
                        //  payload is an array of segment effort objects
                        callback(payload);
                    } else {
                        console.log('error getting athlete efforts for segment'. err);
                    }
                    callback(payload);
                }); 
            }

            function sentAll (sent) {
                if (sent === 3) {
                    console.log('sending end');
                    res.end('end transmission');
                }
            }

            var sent = 0;
            getLeaderboardForSegment(leaderboard_parameters, function (ride, leaderboard) {
                res.send(JSON.stringify({type: 'leaderboard', leaderboard: leaderboard}));
                sent++;
                res.send(JSON.stringify({type: 'ride', ride: ride}));
                sent++;
                console.log('send leaderboard and ride data');
                sentAll(sent);
            });

            getUserStatsForSegment(user_parameters, function (user) {
                res.send(JSON.stringify({type: 'user', user: user}));
                sent++;
                console.log('send user data');
                sentAll(sent);
            });


//            });
//        });
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
