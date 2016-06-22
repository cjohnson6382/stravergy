//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/activities route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/activity';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });

    it('should return an array of activities', function () {
        request(url, function (err, res, body) {
            expect(body).to.be.a('array');
        });
    });

    it('first item in array should be an object with athlete and start_date properties', function () {
        request(url, function (err, res, body) {
            expect(body[0]).to.have.ownProperty('athlete');
            expect(body[0]).to.have.ownProperty('start_date');
        });
    });
});


