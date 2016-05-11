angular.module('stravaApp').controller('DataAggregationCtrl', function ($scope, PerformanceData, FlowControl, SessionData) {
    $scope.datavisible = function () {
        if (FlowControl.active_section === 'data') {
            return true;
        } else {
            return false;
        }
    }

    //  console.log('dataAggregationCtrl, SessionData: ', SessionData);
    $scope.performance = PerformanceData;

    $scope.$watch('performance.leaderboard', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.activity = SessionData.activity_name;
            $scope.segment = SessionData.segment_name;
            $scope.ride = PerformanceData.ride;
            $scope.leaderboard = PerformanceData.leaderboard;
            //  $scope.efforts_hr = PerformanceData.efforts_hr;
            console.log('dataAggregationCtrl, SessionData/PerformanceData: ', SessionData, PerformanceData);
        } else {
            console.log('derp derp derp derp');
        }
    });
    
})
