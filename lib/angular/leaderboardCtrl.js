angular.module('stravaApp').controller('LeaderboardCtrl', function ($scope, PerformanceData, SessionData, FlowControl, LoadingBar) {
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
            LoadingBar.loading = 'loading';
            //  console.log('angular/leaderboard newVal: ', newVal);
            //  console.log('session.segment has changed, and calling leaderboard');
            util.getLeaderboard(newVal, SessionData.quintile, function (payload) {
                LoadingBar.loading = 'done';
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
