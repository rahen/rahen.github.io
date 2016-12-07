"use strict";
(function () {
    angular.module("app")
        .factory("NotificationService", ["ApiService", "UserContextService", function (ApiService, UserContextService) {
            var getNotificationsWithUnseenCount = function () {
                var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                var data = {
                    accessToken: UserContextService.getAccessToken(),
                    userId: UserContextService.getCurrentUserId(),
                    orgId: currentlySignedAs.accountInfo.id,
                    limit: 5,
                    isRead: false,
                    entityId: null,
                    entityType: null,
                    notificationId: null,
                    isMute: null
                };
                return ApiService.post("/api/notification/getNotificationsWithUnseenCount", data);
            };

            return{
                getNotificationsWithUnseenCount: getNotificationsWithUnseenCount
            };
        }]);
})();