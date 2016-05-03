angular.module('stravaApp').controller('AuthCtrl', function ($scope, SessionData, $uibModal, $sce) {
    $scope.authvisible = function () {
        return true;
    };

    $scope.authenticate = function () {
        util.authPage(function (url, sessionid) {
            sessionStorage.setItem('stravegy_session', sessionid);
            //  create auth modal
            var trustedUrl = $sce.trustAsResourceUrl(url);   

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: './stubs/authModal.html',
                controller: 'AuthPageInstanceCtrl',
                resolve: {
                    url: function () {
                        return trustedUrl;
                    }
                }
            });

            modalInstance.result.then(function () {
                //  closed
                console.log('authenticated');
                $scope.authvisible = function () {
                    return false;
                };
            }, function () {
                //  dismissed
                console.log('authentication failed');
            });
        });
    }
});
