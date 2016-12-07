"use strict";
(function () {
    angular.module("app")
        .controller("viewTextCtrl", ["$scope", "SpaceService", "$stateParams", "LoggerService",
            function ($scope, SpaceService, $stateParams, LoggerService) {
                var spaceId = $stateParams.spaceId;

                $scope.tags = [];

                SpaceService.getSpaceById(spaceId)
                    .then(function (response) {
                        $scope.space = response.data.data;
                        LoggerService.log($scope.space);
                    });
                SpaceService.getFrequentAndRecentRecordAccess()
                    .then(function (response) {

                    });
                SpaceService.getRelatedNeighboursWithRelation(spaceId)
                    .then(function (response) {

                    });
                SpaceService.getSpaceAscendantsBySpaceId(spaceId)
                    .then(function (response) {

                    });
                SpaceService.getSpaceAttributes(spaceId)
                    .then(function (response) {

                    });

                $scope.updateSpace = function () {
                    LoggerService.log($scope.space);
                    SpaceService.updateSpace($scope.space)
                        .then(function (response) {

                        });
                };
            }]);
})();