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
            //  console.log('angular/leaderboard newVal: ', newVal);
            //  console.log('session.segment has changed, and calling leaderboard');
            util.getLeaderboard(newVal, SessionData.quintile, function (payload) {
                console.log('leaderboard call returned: ', payload);
                $scope.$apply(function () {
                    FlowControl.active_section = 'data';
                    PerformanceData.leaderboard = payload.leaderboard;
                    PerformanceData.ride = payload.ride;
                    //  PerformanceData.efforts = payload.efforts;
                }); 
            })  
        }   
    }); 
});
