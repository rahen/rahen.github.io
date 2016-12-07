"use strict";

(function () {
    angular.module("app")
        .factory("SearchService", ["ApiService", "UserContextService", function (ApiService, UserContextService) {
            
            var defaults={
                accessToken: UserContextService.getAccessToken(),
                entityId: UserContextService.getCurrentUserId(),
                searchKey: '',
                excludeRequestingEntity: false,
                limit: -1
            }
            
            var api=function(method){
                return "/api/connections/"+method;
            }
            
            var extend=function(options){
                return angular.extend({}, defaults, options||{});
            }

            var suggestPublicly = function (searchKey) {
                var data = extend({searchKey: searchKey, limit:5});
                return  ApiService.post(api('getSuggestedPublicOrgsAndUsers'),data);
            };
            
            var searchPublicly = function (searchKey) {
                var data = extend({searchKey: searchKey});
                return  ApiService.post(api('searchPublicOrgsAndUsers'),data);
            };
            
            return {
                suggestPublicly: suggestPublicly,
                searchPublicly: searchPublicly
            };
        }]);
})();