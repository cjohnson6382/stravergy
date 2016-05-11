angular.module('stravaApp').controller('ActivityCtrl', function ($scope, SessionData, PerformanceData, FlowControl, LoadingBar) {
    $scope.activitiesVisible = function () {
        if (FlowControl.active_section === 'activity') {
            return true;
        } else {
            return false;
        }
    };

    $scope.go = function () {
        LoadingBar.loading = 'loading';
        util.getActivities(function (payload) {
            $scope.$apply(function () {
                LoadingBar.loading = 'done';
                $scope.activities = payload;
            });
        });
    }

    $scope.getSegments = function (activityid, name) {
        SessionData.activity = activityid;
        SessionData.activity_name = name;
        FlowControl.active_section = 'segments';
        
    };

    $scope.metersToMiles = util.metersToMiles;
    $scope.metersToFeet = util.metersToFeet;
});
