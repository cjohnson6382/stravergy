'use strict';

//  IMPORTS
var async = require('async');
var express = require('express');
var https = require('https');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//  strava.<api endpoint>.<api endpoint option>(args,callback)

var app = express();

function genuuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

//  middleware
app.use(session({
    genid: function () {
        return genuuid();
    },
    secret: 'stravacalafragalisticexpaladocious',
    name: 'stravegy.sid',
    //  store: new MongoStore({ url: 'mongodb://localhost:27017/stravegy' }),
    store: new MongoStore({ url: 'mongodb://localhost/stravegy' }),
    ttl: 60 * 30,
    resave: true,
    saveUninitialized: true
}));

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
var resources = require('./routes/resources.js');

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
    app.use('/resources', resources),
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
