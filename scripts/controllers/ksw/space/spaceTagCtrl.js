"use strict";
(function () {
    angular.module("app")
        .controller("spaceTagCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService",
            function ($scope, $stateParams, SpaceService, LoggerService) {

                var spaceId = $stateParams.spaceId;
                $scope.tags = [];
                $scope.saveTags = function () {
                    LoggerService.log($scope.tags);
                    SpaceService.addTag(spaceId, $scope.tags)
                        .then(function (response) {
                            if (response.data.code) {
                                $scope.space.tags = _.union($scope.space.tags, _.pluck($scope.tags, 'text'));
                                $scope.tags = [];
                            }
                        });
                };
                $scope.removeTag = function (tag) {
                    SpaceService.deleteTag(spaceId, tag)
                        .then(function (response) {
                            if(response.data.code){
                                var tagIndex = $scope.space.tags.indexOf(tag);
                                $scope.space.tags.splice(tagIndex, 1);
                            }
                        });
                };

                $scope.loadTags = function(query){
                    return SpaceService.getSuggestedHashTags()
                        .then(function(response){
                            return _.map(response.data,'title');
                        });
                };

            }]);
})();