"use strict";
(function(){
    angular.module("app")
        .factory("SignalLoaderService",["ApiService","UserContextService",function(ApiService,UserContextService){
            var SignalLoaderService = function(){
              this.signals = [];
                this.busy = false;
            };

            var getSignals = function (offset) {
                var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                var data = {
                    accessToken: UserContextService.getAccessToken(),
                    orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                    offset: offset,
                    count: 10
                };
                return ApiService.post('/corporateHub/getMainHubActivities', data);
            };

        }])
})();