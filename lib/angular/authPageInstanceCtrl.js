angular.module('stravaApp').controller('AuthPageInstanceCtrl', function ($scope, $uibModalInstance, url) {
    $scope.auth_url = url;

    //  console.log(document.getElementById('authframe').contentWindow.location.pathname);
    //  this is null because the damned modal isn't going
    var currentInterval = setInterval(function () {
        var loc = document.getElementById('authframe').contentWindow.location.pathname.includes('/callback');
        console.log('loc before modal closes: ', loc);
        if (loc === true) {
            clearInterval(currentInterval);
            $uibModalInstance.close();
        }
    }, 2000);
});
