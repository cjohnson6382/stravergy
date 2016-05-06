fs = require('fs');

function generateSessionId (callback) {
    var crypto = require('crypto');
    var hash = crypto.createHash('md5');
    //  hashing the date to create a 'unique' value - so bad; 
    //  should instead get the _id field from the DB and return that
    var data = new Date();  
    hash.on('readable', () => {
        var hashed = hash.read();
        if (hashed) {
            //  console.log('hashed your data', hashed.toString('hex'));
            callback(hashed.toString('hex'));
        }   
    }); 
    hash.write(data.toString());
    hash.end();
}

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
    generateSessionId: generateSessionId
};
