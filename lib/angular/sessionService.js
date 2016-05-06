angular.module('stravaApp').factory('SessionData', function () {
    var session = { 
        activity: '', 
        segment: '',
        quintile: ''
    };

    return session;
});
