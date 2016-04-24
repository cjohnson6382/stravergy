/*
            var context_entries = 2;
            //  listLeaderboard is max 200 entries; the first call returns with the total number of entries, use that to loop API calls to get all of the entries
            strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 1, context_entries: context_entries }, function (err, payload) {
                if (err === null) {
                    console.log('response to listLeaderboard call: ', payload.entries);
                    //  1 is user, 2* is for 2 context_entries on each side of the user
                    var user_context = 1 + 2 * context_entries;
                    var total_entries = payload.entry_count;
                    //  var pages = Math.ceil(total_entries/200);

                    var user_stats = payload.entries[3];

                    var page_start;
                    var page_end;

                    //  returns a number that = the size of a quintile on the leaderboard
                    function getQuintile (leaderboard_entries) {
                        console.log('leaderboard_entries/5: ', Math.ceil(leaderboard_entries/5));
                        return Math.ceil(leaderboard_entries/5);
                    }

                    function getPageRange(quintile, quintile_size) {
                        console.log('total_entries/quintile_size/quintile: ', total_entries, quintile_size, quintile);
                        return {
                            //  quintile * quintile_size is the LAST entry you should get
                            //  quintile-1*quintile is the FIRST entry you should get
                            start: Math.floor((quintile-1)*quintile_size/200), 
                            end: Math.ceil(quintile*quintile_size/200)
                        };
                    }

                    if (quintile) {
                        console.log('quintile slice requested: ', quintile);
                        var start_end = getPageRange(quintile, getQuintile(total_entries));
                        console.log('start_end: ', start_end);
                        page_start = start_end.start;
                        page_end = start_end.end;
                    } else {
                        page_start = 0;

                        page_end = Math.ceil(total_entries/200);
                    }

                    var pages = page_end - page_start;
                    var count = page_start;
                    console.log('total_entries, page_start, page_end', total_entries, page_start, page_end);

*/
/*
                   var leaderboard_entries = [];

                    //  looping calls to get the parts of the leaderboard you want
                    for (var i = page_start + 1; i < page_end + 1; i++) {
                        strava.segments.listLeaderboard({ access_token: access_token, id: segmentid, per_page: 200, context_entries: context_entries, page: i }, function (err, payload) {
                            var entries = payload.entries.slice(0, payload.entries.length - (context_entries + 1));
                            if (err === null) {
                                //  concat each call onto the leaderboard_entries which is ultimately returned to client
                                leaderboard_entries = leaderboard_entries.concat(entries);
                                count++;
                                console.log('count/pages', count, pages);
                                if (count === pages) {
                                    done(leaderboard_entries);
                                }
                            } else {
                                console.log('error retrieving full loaderboard: ', err);
                            }
                        });
                    }

                    //  done waits for all listLeaderboard calls to return before sending results to client
                    function done (entries) {
                        console.log('leaderboard_entries length before end: ', entries.length);
                        res.end(JSON.stringify({entries: entries, user_ride: user_stats}));
                    }

               } else {
                    console.log('error while fetching leaderboard for segment: ', req.query.segmentid, ' error: ', err);
                }
*/

/*
            var segmentid = parseInt(req.query.segmentid, 10);
            var quintile;
            //  implement this on the client side!!!!
            //      the client is supposed to validate input
            if (0 < req.query.quintile < 6) {
                console.log('Quintile requeted: ', req.query.quintile);
                quintile = req.query.quintile;
            }

            var leaderboard_parameters = {
                access_token: access_token,
                id: segmentid,
                atheleteid: athleteid
            };
*/
//////////////////////////////////////

function getQuintile (leaderboard_entries) {
    console.log('leaderboard_entries/5: ', Math.ceil(leaderboard_entries/5));
    return Math.ceil(leaderboard_entries/5);
}

function getPageRange(quintile, quintile_size) {
    console.log('total_entries/quintile_size/quintile: ', total_entries, quintile_size, quintile);
    return {
        //  quintile * quintile_size is the LAST entry you should get
        //  quintile-1*quintile is the FIRST entry you should get
        start: Math.floor((quintile-1)*quintile_size/200),
        end: Math.ceil(quintile*quintile_size/200)
    };
}

function getRemainderLeaderboard(parameters, callback) {
    var leaderboard_entries = [];

    var start = parameters.start_end.start;
    var end = parameters.start_end.end;
    delete parameters.start_end;

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

function getLeaderboardForSegment (parameters_object, callback) {
    var first_call_parameters = parameters_object;
    first_call_paramters.context_entries = 2;
    first_call_parameters.per_page = 1;

    strava.segments.listLeaderboard(first_call_parameters, function (err, payload) {
        if (err === null) {
            //  res.send!!!

            //  first entry is from the leaderboard, the next 5 are athlete's stats plus those of the two above and below him/her on the leaderboard
            var ride = payload.entries[3];
            var total_entries = payload.entry_count;
            var start_end;
            if (quintile) {
                start_end = getPageRange(quintile, getQuintile(total_entries));
            } else {
                start_end = {start: 1, end: Math.ceil(total_entries/200)};
            }

            var parameters = {
                start_end: start_end,
                access_token: access_token,
                id: segmentid,
                per_page: 200,
                context_entries: 2
            };

            getRemainderLeaderboard(parameters, function (leaderboard) {
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
            console.log('error getting athlete efforts for segment'. err);
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



////////////////////////////////////////
            var sent = 0;


            getLeaderboardForSegment(leaderboard_parameters, function (ride, leaderboard) {
                res.send(JSON.stringify({type: 'leaderboard', leaderboard: leaderboard}));
                sent++;
                res.send(JSON.stringify({type: 'ride', ride: ride}));
                sent++;
                console.log('send leaderboard and ride data');
                sentAll(sent);
            });

            getUserStatsForSegment(user_parameters, function (user) {
                res.send(JSON.stringify({type: 'user', user: user}));
                sent++;
                console.log('send user data');
                sentAll(sent);
            });
