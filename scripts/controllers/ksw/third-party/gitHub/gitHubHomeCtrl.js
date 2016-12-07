"use strict";
(function () {
    angular.module("app")
        .controller("gitHubHomeCtrl", ["$scope", "GitHookService", "UserContextService", "LoggerService", "$state", "ApiService", "ToasterService","$stateParams","OrgProfileService","$mdDialog",
            function ($scope, GitHookService, UserContextService, LoggerService, $state, ApiService, ToasterService, $stateParams, OrgProfileService, $mdDialog) {

                var accessToken = UserContextService.getAccessToken();
                var orgId = $stateParams.orgId;
                var getExistingHookUrl = "/api/webhook/hooks/?accessToken=" + accessToken + "&orgId=" + orgId + "&provider=github";

                init();

                OrgProfileService.getProfileById(orgId)
                    .then(function (response) {
                        LoggerService.log(response.data);
                        $scope.companyName = response.data.connData.companyName;
                    });

                GitHookService.getAllRepositories()
                    .then(function (response) {
                        LoggerService.log(response.data);
                        $scope.repositories = response.data.data;
                    });

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
                    LoggerService.log($tag);
                };

                $scope.saveIntegration = function () {
                    var hashTags = [];
                    angular.forEach($scope.hookTags, function (tag) {
                        hashTags.push({
                            entityType: "HashTag",
                            title: tag.text
                        });
                    });
                    var newHookParam = {
                        repository: $scope.selectedRepository,
                        events: $scope.selectedHookEvents,
                        hashTag: hashTags,
                        orgId: orgId
                    };
                    GitHookService.createNewWebHook(newHookParam)
                        .then(function (response) {
                            LoggerService.log(response.data);
                            ToasterService.successToaster("New hook added");
                            init();
                        }, function (err) {
                            LoggerService.log(err);
                            ToasterService.successToaster(err.result.message);
                            init();
                        });
                };

                $scope.openEditGitHookModal = function(ev, hook){
                    var copyOfHook = angular.copy(hook);
                    $mdDialog.show({
                        controller: "editGitHookCtrl",
                        templateUrl: 'views/thirdparty/github/editHook.html',
                        targetEvent: ev,
                        locals:{ hook: copyOfHook}
                    })
                        .then(function (updatedHook) {
                            LoggerService.log(updatedHook);
                            init();
                        }, function () {

                        });
                };

                $scope.deleteHook = function (hook) {
                    GitHookService.deleteHook(hook, orgId)
                        .then(function (response) {
                            LoggerService.log(response.data);
                            init();
                        });
                };

                function init() {
                    $scope.hookTags = [];
                    $scope.hookEvents = GitHookService.getGitEvents();
                    $scope.selectedHookEvents = [];
                    ApiService.get(getExistingHookUrl)
                        .then(function (response) {
                            LoggerService.log(response.data);
                            $scope.allHooks = response.data;
                        });
                }
            }]);
})();