//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var request = require('request');


describe('/leaderboard route', function () {
    var url = 'https://cjohnson.ignorelist.com:4343/leaderboard';

    it('should return status 200', function () {
        request(url, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
        });
    });

    it('should return an object with leaderboard and ride properties', function () {
        request(url, function (err, res, body) {
            expect(body).to.have.ownProperty('leaderboard');
            expect(body).to.have.ownProperty('ride');
        });
    });


    describe('leaderboard property', function () {
        it('should be an array', function () {
            request(url, function (err, res, body) {
                expect(body).to.be.a('array');
            });
        });    
   
        it('the array should have leaderboard entries', function () {
            request(url, function (err, res, body) {
                expect(body[0]).to.have.ownProperty('athlete_name');
                expect(body[0]).to.have.ownProperty('rank');
            });
        }); 
    });

    describe('ride property', function () {
        it('should be a single entry', function () {
            request(url, function (err, res, body) {
                expect(body[0]).to.have.ownProperty('athlete_name');
                expect(body[0]).to.have.ownProperty('rank');
            });
        });
    });
});


