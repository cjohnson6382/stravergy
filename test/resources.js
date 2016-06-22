//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/resources route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/resources/ConnectWithStrava.png';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });
});
