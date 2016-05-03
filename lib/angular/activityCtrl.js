angular.module('stravaApp').controller('ActivityCtrl', function ($scope, SessionData, PerformanceData) {
    $scope.activitiesVisible = function () {
        return true;
    };

    $scope.go = function () {
        util.getActivities(function (payload) {
            console.log('util.getActivities returned: ', payload[0], payload.length);
            $scope.activties = payload;
        });
    }
    $scope.metersToMiles = function (meters) {
        miles = meters/1609.34;
        return Math.round(miles*100)/100
    }

    //  fix me: need to set this to something before calling the segmentCtrl
    SessionData.activity = '';

    $scope.metersToFeet = function (meters) {
        feet = meters * 3.28084;
        return Math.round(feet)
    }
});
