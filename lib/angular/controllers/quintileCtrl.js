angular.module('stravaApp').controller('QuintileCtrl', function ($scope, SessionData) {
    $scope.quintile = 0;
    SessionData.quintile = $scope.quintile;
});
