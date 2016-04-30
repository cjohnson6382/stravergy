angular.module('stravaApp').controller('LeaderboardCtrl', function ($scope, PerformanceData, SessionData) {
    //  expects an array of leaderboard entries
    var payload = {};
    $scope.leaderboard = util.getLeaderboard;
/*
    (SessionData.segment, function (payload) {
        $scope.Data = Data;

        //  leaderboard should have some raw entries to it? Do I really care about displaying leaderboard entries?
        //      if I don't, then the leaderboard sectio can be moved up and I don't need the service to connect these vars
        //      in either case, I should prboably keep this stuff so that I can do leaderboard tricks in the future
    
        $scope.Data.leaderboard_elapsed_time = payload.leaderboard.elapsed_time;
        $scope.Data.leaderboard_hr = payload.leaderboard.average_hr;
        
        $scope.Data.elapsed_time = payload.ride.elapsed_time;
        $scope.Data.average_hr = payload.ride.average_hr;
    
        $scope.Data.efforts_elapsed_time = payload.efforts.elapsed_time;
        $scope.Data.efforts_hr = payload.efforts.average_hr;
   });
*/
});
