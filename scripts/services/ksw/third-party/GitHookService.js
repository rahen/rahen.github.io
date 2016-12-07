"use strict";
(function () {
    angular.module("app")
        .factory("GitHookService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {
                var getAuthorizedAccount = function () {
                    var data = {
                        knotSuiteAccessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/gitHub/getAuthorizedAccount", data, ApiService.thirdPartyServiceUrl);
                };

                var getAllRepositories = function () {
                    var getAllRepoUrl = "/api/webhook/gitRepositories/?accessToken=" + UserContextService.getAccessToken();
                    return ApiService.get(getAllRepoUrl);
                };

                var createNewWebHook = function (newHookParam) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: newHookParam.orgId,
                        repository: {
                            id: newHookParam.repository.id,
                            name: newHookParam.repository.name,
                            fullName: newHookParam.repository.full_name,
                            description: newHookParam.repository.description,
                            user: newHookParam.repository.owner.login
                        },
                        events: newHookParam.events,
                        hashTags: newHookParam.hashTag,
                        provider: "github"
                    };
                    return ApiService.post("/api/webhook/hooks", data);
                };

                var deleteHook = function(hook, orgId){
                    var url = "/api/webhook/hooks/?accessToken="+UserContextService.getAccessToken()
                              +"&orgId="+orgId
                              +"&provider=github&repository=null&webhookId="+hook.webhookId
                              +"&repositoryName="+hook.repository.name
                              +"&repositoryUser="
                              +hook.repository.user+"";
                    return ApiService.remove(url);
                };

                var updateHook = function(updatedHook){
                       var data = {
                           hookEvents: updatedHook.hookEvents,
                           hashTags: updatedHook.hashTags,
                           accessToken: UserContextService.getAccessToken(),
                           provider: 'github'
                       };
                    var url = "/api/webHook/hooks/"+ updatedHook._id;
                    return ApiService.update(url, data);
                };

                var getGitEvents = function (){
                    var events = [
                        {
                            "name": "commit_comment",
                            "title": "Commit comment",
                            "description": "Commit or diff commented on.",
                            "isSupported": true
                        },
                        {
                            "name": "create",
                            "title": "Create",
                            "description": "Branch, or tag created.",
                            "isSupported": true
                        },
                        {
                            "name": "delete",
                            "title": "Delete",
                            "description": "Branch, or tag deleted.",
                            "isSupported": true
                        },
                        {
                            "name": "deployment",
                            "title": "Deployment",
                            "description": "Repository deployed.",
                            "isSupported": false
                        },
                        {
                            "name": "deployment_status",
                            "title": "Deployment status",
                            "description": "Deployment status updated from the API.",
                            "isSupported": true
                        },
                        {
                            "name": "fork",
                            "title": "Fork",
                            "description": "Repository forked.",
                            "isSupported": false
                        },
                        {
                            "name": "gollum",
                            "title": "Gollum",
                            "description": "Wiki page updated.",
                            "isSupported": false
                        },
                        {
                            "name": "issue_comment",
                            "title": "Issue comment",
                            "description": "Issue or pull request commented on.",
                            "isSupported": true
                        },
                        {
                            "name": "issues",
                            "title": "Issues",
                            "description": "Issue opened, closed",
                            "isSupported": true
                        },
                        {
                            "name": "member",
                            "title": "Member",
                            "description": "Collaborator added to a non-organization repository.",
                            "isSupported": false
                        },
                        {
                            "name": "page_build",
                            "title": "Page build",
                            "description": "Pages site built.",
                            "isSupported": false
                        },
                        {
                            "name": "public",
                            "title": "Public",
                            "description": "Repository changes from private to public.",
                            "isSupported": false
                        },
                        {
                            "name": "pull_request",
                            "title": "Pull Request",
                            "description": "Pull Request opened, closed",
                            "isSupported": true
                        },
                        {
                            "name": "pull_request_review_comment",
                            "title": "Pull Request review comment",
                            "description": "Pull Request diff commented on.",
                            "isSupported": false
                        },
                        {
                            "name": "push",
                            "title": "Push",
                            "description": "Git push or force-push to a repository.",
                            "isSupported": true
                        },
                        {
                            "name": "release",
                            "title": "Release",
                            "description": "Release published in a repository.",
                            "isSupported": false
                        },
                        {
                            "name": "status",
                            "title": "Status",
                            "description": "Commit status updated from the API.",
                            "isSupported": false
                        },
                        {
                            "name": "team_add",
                            "title": "Team add",
                            "description": "Team added or modified on a repository.",
                            "isSupported": false
                        },
                        {
                            "name": "watch",
                            "title": "Watch",
                            "description": "User watches a repository.",
                            "isSupported": false
                        }
                    ];
                    return events;
                };
                return {
                    getAuthorizedAccount: getAuthorizedAccount,
                    getAllRepositories: getAllRepositories,
                    createNewWebHook: createNewWebHook,
                    getGitEvents: getGitEvents,
                    deleteHook: deleteHook,
                    updateHook: updateHook
                };
            }]);
})();