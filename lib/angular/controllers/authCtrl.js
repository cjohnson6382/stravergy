angular.module('stravaApp').controller('AuthCtrl', function ($scope, SessionData, $uibModal, $sce, FlowControl) {
    FlowControl.active_section = 'auth';

    $scope.authvisible = function () {
        if (FlowControl.active_section === 'auth') {
            return true;
        } else {
            return false;
        }
    };

    $scope.authenticate = function () {
        util.authPage(function (url) {
            //  sessionid now comes back on the callback, not the auth
            //  sessionStorage.setItem('stravegy_session', sessionid);
            //  create auth modal
            var trustedUrl = $sce.trustAsResourceUrl(url);   

            var authPopup = window.open(trustedUrl);
            var currentInterval = setInterval(function () {
                var loc = authPopup.document.location.pathname.includes('/callback');
                if (loc === true) {
                    console.log('authenticated');
                    FlowControl.active_section = 'activity';
                    $scope.$apply();
                    clearInterval(currentInterval);
                    authPopup.close();
                }
            }, 300); 
/*
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
                FlowControl.active_section = 'activity';
            }, function () {
                //  dismissed
                console.log('authentication failed');
            });
*/
        });
    }
});
