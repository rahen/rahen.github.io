"use strict";
(function () {
    angular.module("app")
        .controller("meshLayoutCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService",
            function ($scope, $stateParams, SpaceService, LoggerService) {
                var spaceId = $stateParams.spaceId;
                SpaceService.getSpaceById(spaceId)
                    .then(function (response) {
                        LoggerService.log(response);
                        $scope.space = response.data.data;
                    });
                SpaceService.getFrequentAndRecentRecordAccess()
                    .then(function (response) {
                        LoggerService.log('getFrequentAndRecentRecordAccess');
                        LoggerService.log(response);
                    });
                SpaceService.getRelatedNeighboursWithRelation(spaceId)
                    .then(function (response) {
                        LoggerService.log('getRelatedNeighboursWithRelation');
                        LoggerService.log(response);
                    });
                SpaceService.getSpaceAscendantsBySpaceId(spaceId)
                    .then(function (response) {
                        LoggerService.log('getSpaceAscendantsBySpaceId');
                        LoggerService.log(response);
                    });
            }]);
})();