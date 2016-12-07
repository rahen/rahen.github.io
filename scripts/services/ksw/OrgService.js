"use strict";
(function () {
    angular.module("app")
        .factory("OrgService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {

                var createOrg = function (org) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        organizationName: org.name,
                        domain: org.domain
                    };
                    return ApiService.post("/api/registerOrganization", data);
                };

                var getAllEmployeesOfOrgs = function (orgEmployeesParams, orgId) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();

                    orgEmployeesParams = orgEmployeesParams || {
                        orgIds: [],
                        searchKey: '',
                        includeOrgs: false
                    };

                    if(orgId){
                        orgEmployeesParams.orgIds.push(orgId)
                    }else{
                        orgEmployeesParams.orgIds =[currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id]
                    }

                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgIds: orgEmployeesParams.orgIds,
                        searchKey: orgEmployeesParams.searchKey,
                        includeOrgs: orgEmployeesParams.includeOrgs
                    };
                    return ApiService.post("/api/connections/getAllEmployeesOfOrgs",data);
                };
                return {
                    createOrg: createOrg,
                    getAllEmployeesOfOrgs: getAllEmployeesOfOrgs
                };
            }]);
})();