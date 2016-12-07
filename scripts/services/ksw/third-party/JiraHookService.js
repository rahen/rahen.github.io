"use strict";
(function () {
    angular.module("app")
        .factory("JiraHookService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {
                var getAuthorizedAccount = function () {
                    var data = {
                        knotSuitAccessToken: UserContextService.getAccessToken()
                    }
                    return ApiService.post("/api/jira/getAuthorizedAccount", data, ApiService.thirdPartyServiceUrl);
                };
                var createNewHook = function (newHookParams) {
                   var data = {
                       accessToken: UserContextService.getAccessToken(),
                       orgId: newHookParams.orgId,
                       hookName : newHookParams.hookName,
                       description: newHookParams.hookDescription,
                       hashTags: newHookParams.hashTags,
                       provider: "jira",
                       jiraHostUrl: newHookParams.jiraHostUrl,
                       jiraTaskApprovers: newHookParams.jiraTaskApprovers,
                       yesVoteNeeded: newHookParams.yesVoteNeeded
                   };
                    return ApiService.post("/api/webHook/hooks", data);
                };
                var getNewHookUrl = function () {
                    var data = {
                        knotSuiteAccessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/jira/getNewHookUrl", data, ApiService.thirdPartyServiceUrl);
                };
                var getJiraHookById = function (hookId) {
                    var data = {
                        knotSuiteAccessToken: UserContextService.getAccessToken(),
                        "hookId": hookId
                    };
                    return ApiService.post("/api/jira/getHookById", data, ApiService.thirdPartyServiceUrl);
                };
                var updateJiraHook = function (updatedJiraHook) {
                    var url = "/api/webHook/hooks/"+ updatedJiraHook._id;
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        hashTags: updatedJiraHook.newHashTags,
                        hookName: updatedJiraHook.repository.name,
                        hookDescription: updatedJiraHook.repository.description,
                        provider: 'jira'
                    };
                    return ApiService.update(url, data);
                };

                var removeHook = function(hook){
                    var url = "/api/webhook/hooks/?accessToken="+UserContextService.getAccessToken()
                             +"&provider=jira&webhookId="
                             +hook.webhookId;
                    return ApiService.remove(url);
                };

                return {
                    getAuthorizedAccount: getAuthorizedAccount,
                    createNewHook: createNewHook,
                    getNewHookUrl: getNewHookUrl,
                    getJiraHookById: getJiraHookById,
                    updateJiraHook: updateJiraHook,
                    removeHook: removeHook
                };
            }]);
})();