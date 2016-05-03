'use strict';

//  IMPORTS
    //  utility modules
//  var fs = require('fs');
var async = require('async');
var express = require('express');
//  var multer = require('multer');
//  var bodyParser = require('body-parser');
var https = require('https');

        //  for handling POST requests
//  var upload = multer({ dest: 'uploads/' });
//  var urlencodedParser = bodyParser.urlencoded({ extended: false });

        //  main APIs
//  var google = require('googleapis');
var strava = require('strava-v3');

    //  local modules
var db = require('./modules/db.js');
var leaderboard = require('./modules/leaderboard.js');

        //  routes
var root = require('./routes/root.js');
var auth = require('./routes/auth.js');
var callback = require('./routes/callback.js');
var athlete = require('./routes/athlete.js');
var activity = require('./routes/activity.js');
var segment = require('./routes/segment.js');
var leaderboard = require('./routes/leaderboard.js');
var includes = require('./routes/includes.js');
var stubs = require('./routes/stubs.js');
/*
var OAuth2 = google.auth.OAuth2;
var googleScopes = [
    //  google scopes used
];
*/

//  var stravaScopes = 'view_private';
//  strava.<api endpoint>.<api endpoint option>(args,callback)

var app = express();
var sessionDb = new db.DbClass();
var dbMiddleware = function (req, res, next) {
    req.sessionDb = sessionDb;
    next();
}

app.use(dbMiddleware);

var routes = [
    app.use('/', root),
    app.use('/auth', auth),
    app.use('/callback', callback),
    app.use('/athlete', athlete),
    app.use('/activity', activity),
    app.use('/segment', segment),
    app.use('/leaderboard', leaderboard),
    app.use('/includes', includes),
    app.use('/stubs', stubs),
];

var promise = Promise.all(routes);

promise.then(function () {
    var options = {
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
    };

    try {
        https.createServer(options, app).listen(443, function () {
            console.log('starting the server in HTTPS mode');
        });
    } catch (e) {
        console.log('error starting server: ', e);
    }

});
