"use strict";
(function () {
    angular.module("app")
        .factory("OrgProfileService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {

                var getProfileById = function (orgId) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: orgId
                    };
                    return ApiService.post("/corporateHub/getProfileById", data);
                };

                var getAllConnectionsOfOrgs = function (orgId) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgIds: [orgId],
                        searchKey: "",
                        includeOrgs: false
                    };
                    return ApiService.post("/api/connections/getAllConnectionsOfOrgs", data);
                };

                var hasAdminConnectionToOrg = function (orgId) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: orgId
                    };
                    return ApiService.post("/api/connections/hasAdminConnectionToOrg",data);
                }

                return {
                    getProfileById: getProfileById,
                    getAllConnectionsOfOrgs: getAllConnectionsOfOrgs,
                    hasAdminConnectionToOrg: hasAdminConnectionToOrg
                };
            }]);
})();