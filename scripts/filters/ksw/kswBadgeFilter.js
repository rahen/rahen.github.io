"use strict";
(function () {
    angular.module("kswFilterModule")
        .filter("kswBadgeFilter", ["ApiService", function (ApiService) {
            return function (input, id, height, width) {
                return ApiService.fileCdnServer + "/getEntityProfilePictureThumbnail/" + id + "/Badge/" + height + "/" + width;
            }
        }]);
})();
