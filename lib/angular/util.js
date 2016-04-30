var util = (function () {
    var BASE_URL = 'https://cjohnson.ignorelist.com:4343';
    var METHOD = 'GET';

    return {
        //  takes an array of ride summaries and averages the HR and elapsed time properties
        _getAverage: function (entries) {
            have_hr = entries.filter(function (entry) {
                return entry.average_hr !== null;
            });
           
            var hr_avg = Math.floor(_averageProperty(have_hr, 'average_hr'));
            var time_avg = _secondsToStandardTime(_averageProperty(have_hr, 'elapsed_time'));
        
            return {average_hr: hr_avg, elapsed_time: time_avg};
        },
        
        //  helper function for getAverage
        _averageProperty: function (rider_array, prop_to_average) {
            var rider_count = rider_array.length;
            var sum =  rider_array.reduce(function (cumulative, current) {
                if (cumulative[prop_to_average] === undefined) {
                    return cumulative + current[prop_to_average];
                } else {
                    return cumulative[prop_to_average] + current[prop_to_average];
                }
            });
            
            return sum/count;
        },
        
        //  xmlhttp request for api calls
        _xmlhttp: function (url, method, callback) {
            var sessionid = sessionStorage.getItem('stravegySession');
        
            if (sessionid) {
                url += '&sessionid=' + sessionid;
            }
        
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    callback(xhr.responseText)
                } else {
                    console.log('error on XHR call: ', xhr.status);
                }
            }
            xhr.send();
        },
        
        //  convert seconds into human readable time
        _secondsToStandardTime: function (seconds) {
            var hours = Math.floor(seconds/3600);
            var minutes = Math.floor((seconds % 3600)/60);
            var seconds = Math.floor(seconds % 60);
        
            var formatted_time = ''; 
            if (hours > 0) {
                formatted_time += hours + ':';
            }   
        
            if (minutes < 1) {
                formatted_time += '00:';
            } else if (minutes < 10) {
                formatted_time += '0' + minutes + ':';
            } else {
                formatted_time += minutes + ':';
            }   
        
            if (seconds < 1) {
                formatted_time += '00';
            } else if (seconds < 10) {
                formatted_time += '0' + seconds;
            } else {
                formatted_time += seconds;
            }   
        
            return formatted_time;
        },
        
        //  exposed functions
        
        authPage: function (callback) {
            var url = BASE_URL + '/auth';
            
            _xmlhttp(url, METHOD, function (response) {
                callback(response.url, response.sessionid);
            });
        },
        
        getActivities: function (callback) {
            var url = BASE_URL + '/activity';
            _xmlhttp(url, METHOD, function (response) {
                callback(JSON.parse(response));
            });
        },
        
        getSegments: function (activity_id, callback) {
            var url = BASE_URL + '/segments?activityid=' + activity_id;
            _xmlhttp(url, METHOD, function (response) {
                callback(JSON.parse(response));
            });
        },
        
        getLeaderboard: function (segment_id, quintile_to_return, callback) {
            var url = BASE_URL + 
                '/leaderboard?segmentid=' + 
                segment_id + 
                '&quintile=' + 
                quintile_to_return; 
        
            _xmlhttp(url, METHOD, function (response) {
                var parsedResponse = JSON.parse(response);
        
                var ride = parsedResponse.ride;
                var leaderboard_data = _getAverage(parsedResponse.leaderboard);
                var efforts_data = _getAverage(parsedResponse.efforts);
               
                callback({ 
                    leaderboard: leaderboard_data, 
                    ride: { elapsed_time: ride.elapsed_time, average_hr: ride.average_hr }, 
                    efforts: efforts_data  
                });
               // }
            });
        }
    }
})();

/*
//  helper functions

var BASE_URL = 'https://cjohnson.ignorelist.com:4343';
var METHOD = 'GET';

//  takes an array of ride summaries and averages the HR and elapsed time properties
function _getAverage (entries) {
    have_hr = entries.filter(function (entry) {
        return entry.average_hr !== null;
    });
   
    var hr_avg = Math.floor(_averageProperty(have_hr, 'average_hr'));
    var time_avg = _secondsToStandardTime(_averageProperty(have_hr, 'elapsed_time'));

    return {average_hr: hr_avg, elapsed_time: time_avg};
}

//  helper function for getAverage
function _averageProperty (rider_array, prop_to_average) {
    var rider_count = rider_array.length;
    var sum =  rider_array.reduce(function (cumulative, current) {
        if (cumulative[prop_to_average] === undefined) {
            return cumulative + current[prop_to_average];
        } else {
            return cumulative[prop_to_average] + current[prop_to_average];
        }
    });
    
    return sum/count;
}

//  xmlhttp request for api calls
function _xmlhttp (url, method, callback) {
    var sessionid = sessionStorage.getItem('stravegySession');

    if (sessionid) {
        url += '&sessionid=' + sessionid;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(xhr.responseText)
        } else {
            console.log('error on XHR call: ', xhr.status);
        }
    }
    xhr.send();
}

//  convert seconds into human readable time
function _secondsToStandardTime (seconds) {
    var hours = Math.floor(seconds/3600);
    var minutes = Math.floor((seconds % 3600)/60);
    var seconds = Math.floor(seconds % 60);

    var formatted_time = ''; 
    if (hours > 0) {
        formatted_time += hours + ':';
    }   

    if (minutes < 1) {
        formatted_time += '00:';
    } else if (minutes < 10) {
        formatted_time += '0' + minutes + ':';
    } else {
        formatted_time += minutes + ':';
    }   

    if (seconds < 1) {
        formatted_time += '00';
    } else if (seconds < 10) {
        formatted_time += '0' + seconds;
    } else {
        formatted_time += seconds;
    }   

    return formatted_time;
}

//  exposed functions

function authPage () {
    var url = BASE_URL + '/auth';
    
    _xmlhttp(url, METHOD, function (response) {
        var authUrl = response.url;
        sessionStorage.setItem('stravegy_session', response.sessionid);

        authWindow = window.open(authUrl, 'authenticate');
        setInterval(function () {
            if (authWindow.location.pathname === '/callback') {
                authWindow.close();
            }
        }, 100);
    });
}

function getActivities (callback) {
    var url = BASE_URL + '/activity';
    _xmlhttp(url, METHOD, function (response) {
        callback(JSON.parse(response));
    });
}

function getSegments(activity_id, callback) {
    var url = BASE_URL + '/segments?activityid=' + activity_id;
    _xmlhttp(url, METHOD, function (response) {
        callback(JSON.parse(response));
    });
}

function getLeaderboard(segment_id, quintile_to_return, callback) {
    var url = BASE_URL + 
        '/leaderboard?segmentid=' + 
        segment_id + 
        '&quintile=' + 
        quintile_to_return; 

    _xmlhttp(url, METHOD, function (response) {
        var parsedResponse = JSON.parse(response);

        var ride = parsedResponse.ride;
        var leaderboard_data = _getAverage(parsedResponse.leaderboard);
        var efforts_data = _getAverage(parsedResponse.efforts);
       
        callback({ 
            leaderboard: leaderboard_data, 
            ride: { elapsed_time: ride.elapsed_time, average_hr: ride.average_hr }, 
            efforts: efforts_data  
        });
       // }
    });
}
*/
