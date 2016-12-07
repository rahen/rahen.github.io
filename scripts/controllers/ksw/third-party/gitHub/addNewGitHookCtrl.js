"use strict";
(function () {
    angular.module("app")
        .controller("addNewGitHookCtrl", ["$scope", "GitHookService", "UserContextService","LoggerService","$state",
            function ($scope, GitHookService, UserContextService,LoggerService,$state) {
                $scope.selectedOrgs = [];
                $scope.toggleSelectionConnection = function (connection) {
                    var idx = $scope.selectedOrgs.indexOf(connection);
                    if (idx > -1) {
                        $scope.selectedOrgs.splice(idx, 1);
                    }
                    else {
                        $scope.selectedOrgs.push(connection);
                    }
                };

                $scope.selectedHookEvents = [];

                $scope.toggleSelectionHookEvent = function(event){
                    var idx = $scope.selectedHookEvents.indexOf(event);
                    if (idx > -1) {
                        $scope.selectedHookEvents.splice(idx, 1);
                    }
                    else {
                        $scope.selectedHookEvents.push(event);
                    }
                };
                $scope.hookEvents = [
                    "commit_comment",
                    "create",
                    "delete",
                    "deployment",
                    "deployment_status",
                    "issue_comment",
                    "issues",
                    "pull_request",
                    "pull_request_review_comment",
                    "push",
                    "release"
                ];
                $scope.userRepositories = [];
                $scope.selectedRepository = {};

                $scope.gitAuthenticatedAccount = {};
                GitHookService.getAuthorizedAccount()
                    .then(function (response) {
                        LoggerService.log(response.data.data);
                        $scope.gitAuthenticatedAccount = response.data.data.userData;
                        LoggerService.log($scope.gitAuthenticatedAccount);
                    });

                GitHookService.getAllRepositories()
                    .then(function(response){
                        LoggerService.log(response.data);
                        $scope.userRepositories = response.data;

                    });


                $scope.corporateConnections = UserContextService.getCorporateConnection();
                $scope.personalAccountInfo = UserContextService.getPersonalAccountInfo();
                $scope.personalAccountInfo.title = $scope.personalAccountInfo.accountType;
                //$scope.corporateConnections.splice(0, 0, $scope.personalAccountInfo);
                $scope.hookTags = [];

                $scope.onTagAdded = function ($tag) {
                    if ($tag.text.indexOf('#') < 0) {
                        $tag.text = '#' + $tag.text;
                    }
                    $tag.text = $tag.text.toUpperCase();
                    LoggerService.log($tag);
                };

                $scope.saveIntegration = function(){
                    var hashTags = [];
                    angular.forEach($scope.hookTags,function(tag){
                       hashTags.push({
                           entityType: "HashTag",
                           title: tag.text
                       }) ;
                    });

                    var newHookParam = {
                        orgList: _.pluck($scope.selectedOrgs,'id'),
                        gitRepo: $scope.selectedRepository,
                        gitEvents: $scope.selectedHookEvents,
                        hashTags: hashTags,
                        iconUrl: ""
                    };
                    LoggerService.log(newHookParam);
                  GitHookService.createNewWebHook(newHookParam)
                      .then(function(response){
                          LoggerService.log(response);
                          $state.go("thirdparty.github");
                      });
                };
            }]);
})();