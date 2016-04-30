var express = require('express');
var router = express.Router();

router.get('/auth', function (req, res) {
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

module.exports = router;
