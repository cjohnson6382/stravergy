var express = require('express');
var router = express.Router();
var util = require('../modules/util.js');
var strava = require('strava-v3');

var stravaScopes = 'view_private';

router.get('/', function (req, res) {
    util.getCredentials(function (credentials) {
        //  console.log('credentials retrieved from file: ', credentials);
        res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
        var url = strava.oauth.getRequestAccessURL({
            client_id: credentials.client_id,
            redirect_uri: credentials.redirect_uri,
            scope: stravaScopes,
            response_type: 'code'
        });
    
        res.end(JSON.stringify({url: url}));
    });
});

module.exports = router;
