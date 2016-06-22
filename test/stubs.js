//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/resources route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/stubs/';

    it('is not currently active', function () {
        expect(true).to.equal(true);
    });
});
