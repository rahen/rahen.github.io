"use strict";
(function () {
    angular.module("app")
        .controller("viewAllHashTagCtrl",
        ["$scope", "hashTagService", "LoggerService", "$mdDialog",
            function ($scope, hashTagService, LoggerService, $mdDialog) {
                $scope.tagGroupBy = [
                    {key: "category", value: "Group by category"},
                    {key: "tagName", value: "Group by name"}
                ];
                $scope.selectedTagGroup = $scope.tagGroupBy[1];
                init();
                $scope.updateTagGroupResults = function (selectedTagGroup) {
                    $scope.selectedGroup = $scope.tagGroupCollection[selectedTagGroup.key];
                };
                $scope.updateTagWatching = function (tag) {
                    tag.groupByProperty = "category";
                    var isWatched = tag.category.indexOf('WATCHED');
                    LoggerService.log(isWatched);
                    if (isWatched == -1) {
                        hashTagService.watchHashTags(tag)
                            .then(function (response) {
                                init();
                            });
                    } else {
                        hashTagService.unwatchHashTags(tag)
                            .then(function (response) {
                                init();
                            });
                    }
                };
                $scope.editHashTag = function (tag,ev) {
                    $mdDialog.show({
                        controller: "editHashTag",
                        templateUrl: '../../../../views/dialogs/editHashTag.html',
                        targetEvent: ev,
                        locals: {hashTag: _.clone(tag)}
                    })
                        .then(function (updatedTag) {
                            hashTagService.renameHashTag(tag,updatedTag)
                                .then(function(response){
                                    init();
                                });
                        }, function () {
                            $scope.alert = 'You cancelled the dialog.';
                        });
                };
                function init() {
                    hashTagService.getHotHashTagsByPersona(null, null)
                        .then(function (response) {
                            var tags = response.data;
                            $scope.tagGroupCollection = {
                                category: {},
                                tagName: {}
                            };
                            $scope.tagGroupCollection["tagName"] = _.groupBy(response.data, function (m) {
                                return m.title.toUpperCase().charAt(1);
                            });
                            angular.forEach(tags, function (tag) {
                                angular.forEach(tag.category, function (item) {
                                    if (!$scope.tagGroupCollection.category.hasOwnProperty(item)) {
                                        $scope.tagGroupCollection.category[item] = [];
                                    }
                                    $scope.tagGroupCollection.category[item].push(tag);
                                });
                            });
                            if ($scope.selectedTagGroup) {
                                $scope.selectedGroup = $scope.tagGroupCollection[$scope.selectedTagGroup.key];
                            } else {
                                $scope.selectedGroup = $scope.tagGroupCollection["category"];
                            }
                            LoggerService.log($scope.tagGroupCollection);
                        });
                }
            }]);
})();