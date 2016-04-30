angular.module('stravaApp').controller('SegmentCtrl', function ($scope, SessionData) {
    //  takes SessionData.activity as arg
    $scope.segments = util.getSegments;
    
    //  fixme: need to set segment on SessionData
    $scope.pickSegment = function (segment) {
        SessionData.segment = 'segment';
    }
});
