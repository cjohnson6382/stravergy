angular.module('stravaApp').controller('ProgressCtrl', function ($scope, LoadingBar) {
    $scope.loadingvisible = function () {
        if (LoadingBar.loading === 'loading') {
            return true;
        } else {
            return false;
        }
    }
/*
    $scope.loading = LoadingBar;

    $scope.$watch('loading.loading', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.$apply();
        } else {
            console.log('more derp derp derp derp');
        }
    });
*/
});
