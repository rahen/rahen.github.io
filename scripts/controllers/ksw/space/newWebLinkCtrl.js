"use strict";
(function () {
    angular.module("app")
        .controller("newWebLinkCtrl", ["$scope", "SpaceService", "$state", "$stateParams", "LoggerService",
            function ($scope, SpaceService, $state, $stateParams, LoggerService) {
                $scope.newWebLink = {
                    imgSrc: 'images/space/external-link-icon.png',
                    entityType: 'WebLink',
                    parentId: $stateParams.spaceId,
                    tags: []
                };
                $scope.getLinkDetails = function () {
                    LoggerService.log($scope.newWebLink);
                    SpaceService.ogData($scope.newWebLink.fileUrl)
                        .then(function (response) {
                            if (response.data.code) {
                                LoggerService.log(response);
                                $scope.newWebLink.spaceName = response.data.ogData.title;
                                $scope.newWebLink.docContents = response.data.ogData.title;
                                $scope.newWebLink.imgSrc = response.data.ogData.images.length > 0 ? response.data.ogData.images[0] : 'images/space/external-link-icon.png';
                            }
                        });
                };
                $scope.addNewTag = function (tag) {
                    if (tag.charAt(0) != '#') {
                        tag = '#' + tag;
                    }
                    $scope.newWebLink.tags.push(tag);
                };
                $scope.saveNewWebLink = function () {
                    SpaceService.create($scope.newWebLink)
                        .then(function (response) {
                            LoggerService.log(response);
                            if(response.data.code){
                                $state.go('space.viewWebLink', {spaceId: response.data.data._id});
                            }
                        });
                };
            }]);
})();