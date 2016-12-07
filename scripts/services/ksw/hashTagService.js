"use strict";
(function () {
    angular.module("app")
        .factory("hashTagService", ["ApiService", "UserContextService",
            function (ApiService, UserContextService) {
                var getHotHashTagsByPersona = function (limit, searchKey) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        limit: limit,
                        searchKey: searchKey
                    };
                    return ApiService.post("/api/tag/getHotHashTagsByPersona", data);
                };

                var watchHashTags = function (tag) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        hashTags: [tag]
                    };
                    return ApiService.post("/api/tag/watchHashTags", data);
                };

                var unwatchHashTags = function (tag) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToke: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        hashTags: [tag]
                    };
                    return ApiService.post("/api/tag/unwatchHashTags", data);
                };

                var renameHashTag = function (tag, newHashTag) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        oldHashTag: tag,
                        newHashTag: newHashTag
                    };
                    return ApiService.post("/api/tag/renameHashTag", data);
                };
                return {
                    getHotHashTagsByPersona: getHotHashTagsByPersona,
                    watchHashTags: watchHashTags,
                    unwatchHashTags: unwatchHashTags,
                    renameHashTag: renameHashTag
                };
            }]);
})();