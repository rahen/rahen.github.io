"use strict";
(function () {
    angular.module("app")
        .factory("KswFilterService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {

                var getSpacesByFilters = function (filterParams) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        limit: filterParams.limit,
                        hashTags: filterParams.hashTags,
                        peopleTags: filterParams.peopleTags,
                        rootHashTag: filterParams.rootHashTag,
                        dateRange: filterParams.dateRange
                    };
                    return ApiService.post("/api/spaces/getSpacesByFilters", data);
                };

                var getActivitiesByHashTag = function (filterParams) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        offset: filterParams.offset,
                        count: filterParams.count,
                        rootHashTag: filterParams.rootHashTag,
                        hashTags: filterParams.hashTags,
                        peopleTags: filterParams.peopleTags,
                        dateRange: filterParams.dateRange,
                        awardIds: filterParams.awardIds,
                        destination: "TagProfile",
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        selectedRuleStatus: ["Expired", "Resolved", "Active"]
                    };
                    return ApiService.post("/api/tag/getActivitiesByHashTag",data);
                };

                return {
                    getSpacesByFilters: getSpacesByFilters,
                    getActivitiesByHashTag: getActivitiesByHashTag
                };
            }]);
})();