angular.module('stravaApp').controller('AuthPageInstanceCtrl', function ($scope, $uibModalInstance, url) {
    $scope.auth_url = url;
    var currentInterval = setInterval(function () {
        var loc = document.getElementById('authframe').contentWindow.location.pathname.includes('/callback');
        if (loc === true) {
            clearInterval(currentInterval);
            $uibModalInstance.close(document.getElementById('authframe').contentWindow);
        }
    }, 200);
});
