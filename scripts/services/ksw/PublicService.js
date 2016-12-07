"use strict";
(function () {
    angular.module("app")
        .factory("PublicService", ["ApiService", function (ApiService) {
            
            var getPublicProfile = function (entityType, entityId) {
                var url = "/api/public/profile/" + entityType + "/" + entityId;
                return ApiService.get(url);
            };
            
            //api/getAllAwards

            var getPublicProfileBadges = function (entityType, entityId) {
                var data = {
                    entityId: entityId,
                    entityType: entityType
                };

                return ApiService.post("/api/badge/getEntityBadges", data);
            };

            return {
                getPublicProfile: getPublicProfile,
                getPublicProfileBadges: getPublicProfileBadges
            };
        }]);
})();