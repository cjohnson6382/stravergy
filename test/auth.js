//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/auth route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/auth';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });

    it('should return an auth URL string', function () {
        request(url, function (err, res, body) {
            expect(body).to.be.a('string');
            expect(body).to.match(/^http/);
        });
    });
});


