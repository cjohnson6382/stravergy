var util = (function () {
    var BASE_URL = 'https://cjohnson.ignorelist.com:4343';
    var METHOD = 'GET';

    return {
        //  takes an array of ride summaries and averages the HR and elapsed time properties
        _getAverage: function (entries) {
            console.log('entries parameter in _getAverage:', entries.length);
            have_hr = entries.filter(function (entry) {
                return entry.average_hr !== null;
            });
           
            var hr_avg = Math.floor(util._averageProperty(have_hr, 'average_hr'));
            var time_avg = util._secondsToStandardTime(util._averageProperty(have_hr, 'elapsed_time'));
        
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
            
            return sum/rider_count;
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
            
            util._xmlhttp(url, METHOD, function (payload) {
                response = JSON.parse(payload);
                callback(response.url, response.sessionid);
            });
        },
        
        getActivities: function (callback) {
            var url = BASE_URL + '/activity';
            util._xmlhttp(url, METHOD, function (response) {
                //  console.log('got data back to client side (json): ', response.length);
                callback(JSON.parse(response));
            });
        },
        
        getSegments: function (activity_id, callback) {
            //  console.log('getSegments is using activity_id: ', activity_id);
            var url = BASE_URL + '/segment?activityid=' + activity_id;
            util._xmlhttp(url, METHOD, function (response) {
                //  console.log('got data back to client side (json): ', response.length);
                callback(JSON.parse(response));
            });
        },
        
        getLeaderboard: function (segment_id, quintile_to_return, callback) {
            var url = BASE_URL + 
                '/leaderboard?segmentid=' + 
                segment_id + 
                '&quintile=' + 
                quintile_to_return; 
        
            util._xmlhttp(url, METHOD, function (response) {
                var parsedResponse = JSON.parse(response);
                //  console.log('efforts parameter to getAverage: ', parsedResponse.user); 
                //  console.log('leaderbord parameter to getAverage: ', parsedResponse.leaderboard); 

                var prettytime = util._secondsToStandardTime(parsedResponse.ride.elapsed_time);
                var ride = { average_hr: parsedResponse.ride.average_hr, elapsed_time: prettytime };
                var leaderboard_data = util._getAverage(parsedResponse.leaderboard);
                //  var efforts_data = util._getAverage(parsedResponse.user);
               
                callback({ 
                    leaderboard: leaderboard_data, 
                    ride: { elapsed_time: ride.elapsed_time, average_hr: ride.average_hr }, 
                    //  efforts: efforts_data 
                });
               // }
            });
        },

        metersToMiles: function (meters) {
            miles = meters/1609.34;
            return Math.round(miles*100)/100;
        },

        metersToFeet: function (meters) {
            feet = meters * 3.28084;
            return Math.round(feet);
        }
    }
})();

module.exports = util;
