//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/activities route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/segment';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });

    it('should return an activity object', function () {
        request(url, function (err, res, body) {
            expect(body).to.have.ownProperty('athlete');
            expect(body).to.have.ownProperty('start_date');
            expect(body).to.have.ownProperty('segment_efforts');
        });
    });

    it('the first segment in segment_efforts should have an effort count and an athlete count', function () {
        request(url, function (err, res, body) {
            expect(body[0]).to.have.ownProperty('effort_count');
            expect(body[0]).to.have.ownProperty('athlete_count');
        });
    });
});


