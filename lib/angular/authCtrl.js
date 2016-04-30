angular.module('stravaApp').controller('AuthCtrl', function ($scope, SessionData) {
    $scope.authenticate = function () {
        util.authPage(function (url, sessionid) {
            sessionStorage.setItem('stravegy_session', sessionid);  
            //  create auth modal
        });
    }
});
