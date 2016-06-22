//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/ route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });
});
