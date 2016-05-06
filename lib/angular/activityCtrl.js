angular.module('stravaApp').controller('ActivityCtrl', function ($scope, SessionData, PerformanceData, FlowControl) {
    $scope.activitiesVisible = function () {
        if (FlowControl.active_section === 'activity') {
            return true;
        } else {
            return false;
        }

    };

    $scope.go = function () {
        util.getActivities(function (payload) {
            $scope.$apply(function () {
                $scope.activities = payload;
            });
        });
    }

    $scope.getSegments = function (activityid) {
        //  do I need to wrap this in $apply?
        SessionData.activity = activityid;
        FlowControl.active_section = 'segments';
    };

    $scope.metersToMiles = util.metersToMiles;
    $scope.metersToFeet = util.metersToFeet;
});
