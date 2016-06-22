//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/includes route', function () {
    
    describe('top level route (stravegy.js)', function () {
        var url = 'https://cjohnson.ignorelist.com:4343/includes/stravegy.js';
    
        it('should return status 200', function () {
            request(url, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
            });
        });
    });

    describe('one level down route (/controllers/activityCtrl.js)', function () {
        var url = 'https://cjohnson.ignorelist.com:4343/includes/controllers/activityCtrl.js';
    
        it('should return status 200', function () {
            request(url, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
            });
        });
    });
});


