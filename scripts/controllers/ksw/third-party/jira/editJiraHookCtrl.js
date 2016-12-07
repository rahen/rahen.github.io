"use strict";
(function () {
    angular.module("app")
        .controller("editJiraHookCtrl", ["$scope", "JiraHookService", "LoggerService","UserContextService","$mdDialog", "hook",
            function ($scope, JiraHookService, LoggerService, UserContextService, $mdDialog, hook) {

                $scope.hook = hook;

                $scope.hook.hashTags = _.pluck(hook.hashTags,'title');
                LoggerService.log($scope.hook.hashTags);
                $scope.onTagAdded = function ($tag) {
                    if ($tag.text.indexOf('#') < 0) {
                        $tag.text = '#' + $tag.text;
                    }
                    $tag.text = $tag.text.toUpperCase();
                };

                $scope.hideModal = function () {
                    $mdDialog.cancel();
                };

                $scope.updateHook = function () {
                    var hashTags = [];
                    angular.forEach($scope.hook.hashTags, function (tag) {
                        hashTags.push({
                            entityType: "HashTag",
                            title: tag.text
                        });
                    });
                    $scope.hook.newHashTags = hashTags;
                    JiraHookService.updateJiraHook($scope.hook)
                        .then(function(response){
                            $mdDialog.hide(response.data.data);
                        });
                };

            }]);
})();