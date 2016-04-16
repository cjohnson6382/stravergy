'use strict';

var fs = require('fs');
var async = require('async');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var http = require('http');

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
        fs.readfile('./data/strava_config', function (err, payload) {
            if (err === null) {
                callback(null, JSON.parse(payload));
            } else {
                console.log('error opening credentials file: ', err);
                return;
            }
        });
    },
//  Routes
    function (credentials, callback) {
        app.get('/', function (req, res) {
            fs.readFile('index.html', function (err, content) {
                if (err === null) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                } else {
                    console.log('error loading index.html: ', err);
                }
            });
        });
        app.get('/auth', upload.single(), function (req, res) {
            res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
            strava.oauth.getRequestAccessURL({
                client_id: credentials.client_id, 
                redirect_uri: credentials.redirect_uri, 
                scope: stravaScopes,
                response_type: 'code' 
            }, function (err, payload) {
                if (err === null) {
                    console.log('response to getRequestAccessURL: ', payload);
                    res.end(payload);
                } else { 
                    console.log('error fetching access URL in auth: ', err)
                }
            });
        });
        app.get('/callback', function (req, res) {
            strava.oauth.getToken(req.code, function (err, payload) {
                if (err === null) {
                    console.log('access token payload: ', payload);
                    access_token = payload.access_token;
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
                    res.end(payload);
                } else {
                    console.log('error getting athlete: ', err);
                }
            });
        });
        app.get('/activity', function (req, res) {
            //  this is not what I want; I want to list activities --
                //  need to go through the actual REST API to do this
                //  b/c not implemented in the javascript
            strava.activities.listActivities({ access_token: access_token }, function (err, payload) {
                if (err === null) {
                    console.log('activities list: ', payload);
                    res.end(payload);
                } else {
                    console.log('error getting activities', err);
                }
            });
        });
        app.get('/segment', upload.single(), function (req, res) {
            strava.segments.get({ access_token: access_token,  id: req.body.segmentid }, function (err, payload) {
                if (err === null) {
                    console.log('segment payload: ', payload);
                    res.end(payload);
                } else {
                    console.log('error retrieving segment: ', err);
                }
            });
        });
        app.get('/leaderboard', upload.single(), function (req, res) {
            strava.segments.listLeaderboard({ access_token: access_token, id: req.body.segmentid }, function (err, payload) {               
                if (err === null) {
                    console.log('payload for listLeaderboard: ', payload);
                    //  leaderboard calls only get parts of the leaderboard;
                        //  will need to get the first part of the leaderboard to determine total people on it
                        //  then loop through the leaderboard..... this is gonna get ugly, fast
                        //      if the segment has 7k attempts, and you only get 10%, you're still making 70 api calls

                    //  looks like you may be able to get the entire leaderboard in one call?
                    var total_entries = payload.entry_count;
                    strava.segments.listLeaderboard({ access_token: access_token, id: req.body.segmentid, per_page: total_entries }, function (err, payload) {
                        if (err === null) {
                            console.log('payload for FULL leaderboard: ', payload);
                        } else {
                            console.log('error retrieving full loaderboard: ', err);
                        }
                    });
                } else {
                    console.log('error while fetching leaderboard for segment: ', req.body.segmentid, ' error: ', err);
                }
            });
        });
    }
], function (err, results) {
    if (err === null) {
        http.createServer(app).listen(80, function () {
            console.log('starting the server in standard HTTP mode');
        });
    } else {
        console.log('error starting the server: ', err);
    }
});
