angular.module('stravaApp').factory('SessionData', function () {
    var session = { 
        activity: '', 
        activity_name: '', 
        segment: '',
        segment_name: '',
        quintile: ''
    };

    return session;
});
