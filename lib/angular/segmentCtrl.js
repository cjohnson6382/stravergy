angular.module('stravaApp').controller('SegmentCtrl', function ($scope, SessionData, FlowControl) {
    //  util.flowController(FlowControl.active_section);
    $scope.segmentsvisible = function () {
        if (FlowControl.active_section === 'segments') {
            return true;
        } else {
            return false;
        }
    };

    //  takes SessionData.activity as arg
    $scope.session = SessionData;

    $scope.$watch('session.activity', function (newVal, oldVal, scope) {
        if (newVal) {
            util.getSegments(newVal, function (activity) {
                $scope.$apply(function () {
                    $scope.segments = activity.segment_efforts;
                });
            })
        }
    });
    
    $scope.getLeaderboard = function (segment, name) {
        SessionData.segment = segment;
        SessionData.segment_name = name;
        FlowControl.active_section = 'leaderboard';

        console.log('session data after segment is selected: ', SessionData);
    }


    $scope.metersToMiles = util.metersToMiles;
    $scope.metersToFeet = util.metersToFeet;
});
