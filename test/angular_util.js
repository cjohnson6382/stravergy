//  note that the server needs to be running to do these tests

var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('request');
var util = require('../lib/angular/util.js');
var assert = require('chai').assert;

describe('angular util.js', function () {

    describe('averaging functions', function () {

        var sample = [
            { name: 'a', average_hr: 125, elapsed_time: 300 },
            { name: 'b', elapsed_time: 375},
            { name: 'c', average_hr: 150, elapsed_time: 325 },
            { name: 'd', average_hr: 175, elapsed_time: 350 },
            { name: 'e', elapsed_time: 400 }
        ];

        describe('_getAverage', function () {
            it('returns avg hr for a leaderboard array', function () {
                var spy = sinon.spy(util, '_averageProperty');

                util._getAverage(sample);

                spy.restore();
                sinon.assert.calledWith(spy, sample);
            });
        });

        describe('_averageProperty', function () {
            it('average specified property for objects in array', function () {
                expect(util._averageProperty(sample, 'elapsed_time').to.equal(350));
            });
        });
    });

    //  example id used in Strava API documentation: 321934
    describe('_secondsToStandardTime', function () {
        it('should convert integer into h:mm:ss', function () {
            expect(util._secondsToStandardTime(60*60*1 + 60*15 + 45)).to.equal('1:15:45');
        });

        it('should convert integer to mm:ss', function () {
            expect(util._secondsToStandardTime(60*45 + 30)).to.equal('45:30');
        });
    });

    describe('_xmlhttp', function () {
        it('makes an XHR call to the server', function () {
            var spy = sinon.spy();
            var stub = sinon.stub(XMLHttpRequest, 'send');

            stub.yields();
            util._xhlhttp('http://example.com', 'GET', spy);
            stub.restore();

            sinon.assert.calledOnce(spy);
        });
    });

    describe('metersToMiles', function () {
        it('converts meters to miles (distance)', function () {
            expect(util.metersToMiles(1609.34)).to.equal(1);
        });
    });

    describe('metersToFeet', function () {
        it('converts meters to feet (elevation)', function () {
            expect(util.metersToFeet(1000)).to.equal(3281);
        });
    });

    describe('getLeaderboard', function () {
        it('', function () {
            var spy = sinon.spy();
            var stub = sinon.stub(util, '_xmlhttp');

            stub.yields();
            //  util.getLeaderboard(segmentid, quintile, callback);
            util.getLeaderboard(229781, 1, spy);
            stub.restore();

            sinon.assert.calledOnce(spy);
        });
    });
});
