"use strict";
(function () {
    angular.module("app")
        .controller("jiraSettingsCtrl", ["$scope", "UserContextService", "JiraHookService", "LoggerService", "ApiService", "$state",
            function ($scope, UserContextService, JiraHookService, LoggerService, ApiService, $state) {

                $scope.selectedOrgs = [];
                $scope.newJiraHook = {
                    selectedOrgs: [],
                    hookTags: [],
                    hookUrl: "",
                    hookId: ""
                };

                JiraHookService.getNewHookUrl()
                    .then(function (response) {
                        $scope.newJiraHook.webHookUrl = response.data.hookUrl;
                        $scope.newJiraHook.hookId = response.data.hookId;
                    });


                $scope.toggleSelectionConnection = function (connection) {
                    var idx = $scope.selectedOrgs.indexOf(connection);
                    if (idx > -1) {
                        $scope.newJiraHook.selectedOrgs.splice(idx, 1);
                    }
                    else {
                        $scope.newJiraHook.selectedOrgs.push(connection);
                    }
                };

                $scope.corporateConnections = UserContextService.getCorporateConnection();

                $scope.saveJiraHook = function () {
                    var hashTags = [];
                    angular.forEach($scope.newJiraHook.hookTags, function (tag) {
                        hashTags.push({
                            entityType: "HashTag",
                            title: tag.text
                        });
                    });
                    var newHookParams = {
                        hookName: $scope.newJiraHook.hookName,
                        hashTags: hashTags,
                        iconUrl: "",
                        orgList: _.pluck($scope.newJiraHook.selectedOrgs, 'id'),
                        hookUrl: $scope.newJiraHook.webHookUrl,
                        hookId: $scope.newJiraHook.hookId,
                        jiraHostUrl: $scope.newJiraHook.jiraHostUrl
                    };
                    JiraHookService.createNewHook(newHookParams)
                        .then(function (response) {
                            LoggerService.log(response);
                            $state.go("thirdparty.jira");
                        });
                };
                $scope.onTagAdded = function ($tag) {
                    if ($tag.text.indexOf('#') < 0) {
                        $tag.text = '#' + $tag.text;
                    }
                    $tag.text = $tag.text.toUpperCase();
                    LoggerService.log($tag);
                };
            }]);
})();