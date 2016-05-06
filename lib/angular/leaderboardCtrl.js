angular.module('stravaApp').controller('LeaderboardCtrl', function ($scope, PerformanceData, SessionData, FlowControl) {
    $scope.leaderboardvisibile = function () {
        if (FlowControl.active_section === 'leaderboard') {
            return true;
        } else {
            return false;
        }
    };

    $scope.session = SessionData;

    $scope.$watch('session.segment', function (newVal, oldVal, scope) {
        if (newVal) {
            //  console.log('session.segment has changed, and calling leaderboard');
            util.getLeaderboard(sessionStorage.getItem('stravegy_session'), newVal, SessionData.quintile, function (payload) {
                console.log('leaderboard call returned: ', payload);
                $scope.$apply(function () {
                    PerformanceData.leaderboard = payload.leaderboard;
                    PerformanceData.ride = payload.rides;
                    PerformanceData.efforts = payload.efforts;
                }); 
            })  
        }   
    }); 
});
