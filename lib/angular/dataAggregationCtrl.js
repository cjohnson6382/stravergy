angular.module('stravaApp').controller('DataAggregationCtrl', function ($scope, PerformanceData) {
    $scope.athlete = PerformanceData.athlete;
    $scope.average_hr = PerformanceData.average_hr;
    $scope.leaderboard_hr = PerformanceData.leaderboard_hr;
    $scope.efforts_hr = PerformanceData.efforts_hr;
})
