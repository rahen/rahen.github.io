"use strict";
(function () {
    angular.module("kswFilterModule")
        .filter("kswImageFilter", ["ApiService", function (ApiService) {
              return function (input, imageSize, id, isOrg) {
               var o=isOrg?{dir:'/getOrgProfilePictureThumbnail/',name:'/org.png'}:{dir:'/getProfilePictureThumbnail/',name:'/profile.jpg'};
               return ApiService.fileCdnServer + o.dir + id + '/' + imageSize + o.name;
              }
        }]);
})();