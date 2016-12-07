"use strict";
(function () {
    angular.module("app")
        .controller("newSpaceOrDocCtrl", ["$scope", "$state", "$stateParams", "SpaceService", "LoggerService","UserContextService",
            function ($scope, $state, $stateParams, SpaceService, LoggerService, UserContextService) {
                $scope.newSpaceOrDoc = {
                    tags: [],
                    parentId: $stateParams.spaceId,
                    entityType: $stateParams.entityType
                };

                $scope.docHashTags = [];

                LoggerService.log(UserContextService.getCurrentUserData());

                $scope.addNewTag = function (tag) {
                    if (tag.text.charAt(0) != '#') {
                        tag.text = '#' + tag.text.toUpperCase();
                    }
                    $scope.newSpaceOrDoc.tags.push(tag.text);
                    LoggerService.log($scope.newSpaceOrDoc.tags);
                };

                $scope.loadTags = function(query){
                    return SpaceService.getSuggestedHashTags()
                        .then(function(response){
                            return _.map(response.data,'title');
                        });
                };

                $scope.save = function () {
                    $scope.newSpaceOrDoc.title = $scope.newSpaceOrDoc.spaceName;
                    SpaceService.create($scope.newSpaceOrDoc)
                        .then(function (response) {
                            LoggerService.log(response);
                            if(response.data.code){
                                switch (response.data.data.entityType){
                                    case 'Space':
                                        $state.go('space.viewAll', {parentSpaceId: response.data.data._id});
                                        break;
                                    case 'Text':
                                        $state.go('space.viewText', {spaceId: response.data.data._id});
                                        break;
                                }
                            }
                        });
                };
            }]);
})();