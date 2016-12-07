"use strict";
(function(){
    angular.module("app")
        .controller("editGitHookCtrl", ["$scope","$mdDialog","GitHookService","hook","LoggerService", function($scope, $mdDialog, GitHookService, hook, LoggerService){
            $scope.hook = hook;



            $scope.hookHashTags = _.pluck($scope.hook.hashTags,'title');
            $scope.selectedHookEvents = $scope.hook.hookEvents;
            $scope.hookEvents = GitHookService.getGitEvents();


            LoggerService.log($scope.selectedHookEvents);

            $scope.toggleSelectionHookEvent = function (event) {
                var idx = $scope.selectedHookEvents.indexOf(event.name);
                if (idx > -1) {
                    $scope.selectedHookEvents.splice(idx, 1);
                }
                else {
                    $scope.selectedHookEvents.push(event.name);
                }
            };

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
                angular.forEach($scope.hookHashTags, function (tag) {
                    hashTags.push({
                        entityType: "HashTag",
                        title: tag.text
                    });
                });

                $scope.hook.hashTags = hashTags;
                $scope.hook.hookEvents =  $scope.selectedHookEvents;
                GitHookService.updateHook($scope.hook)
                    .then(function(response){
                        $mdDialog.hide(response.data.data);
                    });
            };
        }]);
})();