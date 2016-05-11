var strava = require('strava-v3');

function _getQuintile (leaderboard_entries) {
    return Math.ceil(leaderboard_entries/5);
}

function _getPageRange(quintile, quintile_size) {
    return {
        //  quintile * quintile_size is the LAST entry you should get
        //  quintile-1*quintile is the FIRST entry you should get
        start: Math.floor((quintile-1)*quintile_size/200),
        end: Math.ceil(quintile*quintile_size/200)
    };
}

function _getRemainderLeaderboard(parameters, bounds, callback) {
    var leaderboard_entries = [];

    var start = bounds.start;
    var end = bounds.end;

    var done = end-start;
    var count = 0;

    //  looping calls to get the parts of the leaderboard you want
    for (var i = start + 1; i < end + 1; i++) {
        parameters.page = i;
        strava.segments.listLeaderboard(parameters, function (err, payload) {
            if (err === null) {
                var entries = payload.entries.slice(0, payload.entries.length - 6);
                //  concat each call onto the leaderboard_entries 
                leaderboard_entries = leaderboard_entries.concat(entries);
                count++;
                if (count === done) {
                    sendLeaderboardEntries(leaderboard_entries, callback);
                }
           } else {
                console.log('error retrieving full loaderboard: ', err);
            }
        });
    }
};

function sendLeaderboardEntries (leaderboard_entries, callback) {
    callback(leaderboard_entries);
}

function getLeaderboardForSegment (parameters, quintile, callback) {
    parameters.per_page = 1;

    strava.segments.listLeaderboard(parameters, function (err, payload) {
        if (err === null) {
            //  first entry is from the leaderboard, 
            //      the next 5 are athlete's stats plus 
            //      those of the two above and below him/her on the leaderboard
            var ride = payload.entries[3];
            var total_entries = payload.entry_count;
            var start_end;

            if (0 < quintile && quintile < 6) {
                start_end = _getPageRange(quintile, _getQuintile(total_entries));
            } else {
                start_end = {start: 1, end: Math.ceil(total_entries/200)};
            }

            parameters.per_page = 200;

            _getRemainderLeaderboard(parameters, start_end, function (leaderboard) {
                callback(ride, leaderboard);
            });

        } else {
            console.log('error getting leaderboard entries: ', err);
        }
    });
}

module.exports = {
    getLeaderboardForSegment: getLeaderboardForSegment,
}
