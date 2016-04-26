function _getQuintile (leaderboard_entries) {
    console.log('leaderboard_entries/5: ', Math.ceil(leaderboard_entries/5));
    return Math.ceil(leaderboard_entries/5);
}

function _getPageRange(quintile, quintile_size) {
    console.log('total_entries/quintile_size/quintile: ', total_entries, quintile_size, quintile);
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

    //  looping calls to get the parts of the leaderboard you want
    for (var i = start + 1; i < end + 1; i++) {
        parameters.page = i;
        strava.segments.listLeaderboard(parameters, function (err, payload) {
            var entries = payload.entries.slice(0, payload.entries.length - 6);
            if (err === null) {
                //  concat each call onto the leaderboard_entries which is ultimately returned to client
                leaderboard_entries = leaderboard_entries.concat(entries);
                count++;
                console.log('count/pages', count, pages);
                if (count === pages) {
                    callback(leaderboard_entries);
                }
            } else {
                console.log('error retrieving full loaderboard: ', err);
            }
        });
    }
};

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

            if (quintile) {
                start_end = _getPageRange(quintile, _getQuintile(total_entries));
            } else {
                start_end = {start: 1, end: Math.ceil(total_entries/200)};
            }

            parameters.per_page = 200;

            _getRemainderLeaderboard(parameters, start_end, function (leaderboard) {
                console.log('leaderboard_entries length before end: ', leaderboard.length);
                callback(ride, leaderboard);
            });

        } else {
            console.log('error getting leaderboard entries: ', err);
        }
    });
}

function getUserStatsForSegment (parameters, callback) {
    strava.segments.listEfforts(parameters, function (err, payload) {
        if (err === null) {
            //  payload is an array of segment effort objects
            callback(payload);
        } else {
            console.log('error getting athlete efforts for segment', err);
        }
        callback(payload);
    });
}

function sentAll (sent) {
    if (sent === 3) {
        console.log('sending end');
        res.end('end transmission');
    }
}

module.exports = {
    getUserStatsForSegment: getUserStatsForSegment,
    getLeaderboardForSegment: getLeaderboardForSegment,
    sentAll: sentAll 
}
