"use strict";
(function () {
    angular.module("app")
        .controller("jiraHomeCtrl", ["$scope", "JiraHookService", "LoggerService", "UserContextService", "ApiService","$stateParams","OrgProfileService","$mdDialog","OrgService",
            function ($scope, JiraHookService, LoggerService, UserContextService, ApiService, $stateParams, OrgProfileService, $mdDialog, OrgService) {
                var accessToken = UserContextService.getAccessToken();
                var orgId = $stateParams.orgId;
                var getExistingHookUrl = "/api/webhook/hooks/?accessToken="+accessToken+"&orgId="+orgId+"&provider=jira";

                init();

                OrgProfileService.getProfileById(orgId)
                    .then(function (response) {
                        LoggerService.log(response.data);
                        $scope.companyName = response.data.connData.companyName;
                    });

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
                        hookDescription: $scope.newJiraHook.hookDescription,
                        hashTags: hashTags,
                        iconUrl: "",
                        jiraHostUrl: $scope.newJiraHook.jiraHostUrl,
                        orgId: orgId,
                        jiraTaskApprovers: $scope.newJiraHook.approvers,
                        yesVoteNeeded: $scope.newJiraHook.yesVoteNeeded
                    };

                    JiraHookService.createNewHook(newHookParams)
                        .then(function (response) {
                            LoggerService.log(response);
                            init();
                        }, function(err){
                            alert(JSON.parse(err.result));
                        });
                };
                $scope.onTagAdded = function ($tag) {
                    if ($tag.text.indexOf('#') < 0) {
                        $tag.text = '#' + $tag.text;
                    }
                    $tag.text = $tag.text.toUpperCase();
                    LoggerService.log($tag);
                };

                $scope.deleteHook = function(hook){
                  JiraHookService.removeHook(hook)
                      .then(function(response){
                          LoggerService.log(response.data);
                          init();
                      });
                };

                $scope.loadUsers = function(query){
                    return   OrgService.getAllEmployeesOfOrgs(null,orgId)
                        .then(function(response){
                            var users = response.data;
                            LoggerService.log(users);
                            return users.filter(function(user) {
                                return user.title.toLowerCase().indexOf(query.toLowerCase()) != -1;
                            });
                        });
                };

                $scope.openEditJiraHookModal = function(ev, hook){
                    var copyOfHook = angular.copy(hook);
                    $mdDialog.show({
                        controller: "editJiraHookCtrl",
                        templateUrl: 'views/thirdparty/jira/editHook.html',
                        targetEvent: ev,
                        locals:{ hook: copyOfHook}
                    })
                        .then(function (updatedHook) {
                           LoggerService.log(updatedHook);
                            init();
                        }, function () {

                        });
                };

                function init(){
                    $scope.newJiraHook = {
                        hookTags: [],
                        approvers:[]
                    };
                    ApiService.get(getExistingHookUrl)
                        .then(function(response){
                            LoggerService.log(response.data);
                            $scope.allHooks = response.data;
                        });
                }
            }]);
})();