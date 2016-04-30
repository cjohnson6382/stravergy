angular.module('stravaApp').controller('ActivityCtrl', function ($scope, SessionData, PerformanceData) {
    $scope.activities = util.getActivities;

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
