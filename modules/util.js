fs = require('fs');

function getCredentials (callback) {
    fs.readFile('./data/strava_config', function (err, payload) {
        if (err === null) {
            callback(JSON.parse(payload.toString('utf8'))); 
        } else {
            console.log('error opening credentials file: ', err);
            return;
        }   
    }); 
}

module.exports = {
    getCredentials: getCredentials,
};
