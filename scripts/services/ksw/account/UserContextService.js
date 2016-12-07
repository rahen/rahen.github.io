"use strict";

(function () {
    angular.module('app')
        .service('UserContextService', ["ApiService", function (ApiService) {
            var currentlySignedAsAccount = {
                isPersonalAccount: true,
                accountInfo: {}
            };

            this.getCurrentAccountInfo = function () {
                var currentAccount = this.getCurrentlySignedAsAccount();
                return {
                    userName: this.getPersonalAccountInfo().userName,
                    accountId: currentAccount.isPersonalAccount == true ? currentAccount.accountInfo.accountId : currentAccount.accountInfo._id,
                    accountType: currentAccount.isPersonalAccount == true ? currentAccount.accountInfo.accountType : currentAccount.accountInfo.title,
                    isPersonal: currentAccount.isPersonalAccount
                };
            };

            this.getCurrentlySignedAsAccount = function () {
                return JSON.parse(localStorage.getItem("currentlySignedAsAccount"));
            };

            this.getAwardListByUserId = function (userId) {
                var data = {
                    accessToken: this.getAccessToken(),
                    userId: userId,
                    limit: 20
                };
                return ApiService.post('/api/getAwardListByUserId', data);
            };

            this.changeCurrentlySignedAsAccount = function (isPersonalAccount, accountInfo) {
                var currentlySignedAsAccount = {
                    isPersonalAccount: isPersonalAccount,
                    accountInfo: accountInfo
                };
                localStorage["currentlySignedAsAccount"] = JSON.stringify(currentlySignedAsAccount);
            };

            this.getProfileById = function (userId) {
                var data = {
                    accessToken: this.getAccessToken(),
                    id: userId
                }
                return ApiService.post('/personalHub/getProfileById', data);
            };

            this.saveAccessToken = function (accessToken) {
                localStorage["accessToken"] = accessToken;
            };

            this.getAccessToken = function () {
                return localStorage.getItem("accessToken");
            };

            this.isLoggedIn = function () {
                return this.getAccessToken() != null ? true : false;
            };

            this.saveAccountId = function (accountId) {
                localStorage["accountId"] = accountId;
            };

            this.getCurrentUserId = function () {
                if (localStorage["accessToken"] && localStorage["accountId"]) {
                    return localStorage["accountId"];
                }
                return null;
            }

            this.getUserOrganizations = function () {
                var data = {
                    accessToken: LoginService.getAccessToken()
                };
                return ApiService.post('/api/user/getUserOrganizations', data);
            }

            this.personalConnections = function (searchKey) {
                var data = {
                    searchKey: searchKey == "" ? null : searchKey,
                    accessToken: this.getAccessToken(),
                    orgIds: [],
                    includeOrgs: false
                }
                return ApiService.post('/personalHub/personalConnections', data);
            }

            this.saveCurrentUserData = function (currentUserData) {
                localStorage["currentUserData"] = JSON.stringify(currentUserData);
                this.saveAccessToken(currentUserData.accessToken);
                this.saveAccountId(currentUserData.accountId);
            }

            this.getCurrentUserData = function(){
                var currentUserData = JSON.parse(localStorage["currentUserData"]);
                if(!currentUserData)
                    return null;
              return  currentUserData;
            };

            this.saveCurrentUserOrg = function (org) {
                var currentUserData = JSON.parse(localStorage["currentUserData"]);
                currentUserData.corporateConnections.push(org);
                this.saveCurrentUserData(currentUserData);
            }

            this.getPersonalAccountInfo = function () {
                var currentUserData = JSON.parse(localStorage["currentUserData"]);
                return {
                    accountId: currentUserData.accountId,
                    accountType: 'Personal Account',
                    imgSrc: currentUserData.imgSrc,
                    userName: currentUserData.userName,
                    currentUserData: currentUserData
                };
            };

            this.getCorporateConnection = function () {

                var currentUserData = JSON.parse(localStorage["currentUserData"]);
                return currentUserData.corporateConnections;
            };

            this.currentUserOrg = function(){
                var currentUserData = JSON.parse(localStorage["currentUserData"]);
                var corporateConnections = currentUserData.corporateConnections;
                var userOrg = corporateConnections[0];
                return userOrg;
            };

            this.getAllConnectionsOfUser = function (entityId) {
                var data = {
                    accessToken: this.getAccessToken(),
                    entityId: entityId,
                    searchKey: ''
                };
                return ApiService.post('/personalHub/getAllConnectionsOfUser', data);
            };

            this.getCurrentAccountConnections = function (searchKey) {
                var currentlySignedAs = this.getCurrentlySignedAsAccount();
                if (currentlySignedAs.isPersonalAccount) {
                    var data = {
                        searchKey: searchKey == "" ? null : searchKey,
                        accessToken: this.getAccessToken(),
                        orgIds: [],
                        includeOrgs: false
                    }
                    return ApiService.post('/personalHub/personalConnections', data);

                } else {

                    var data = {
                        searchKey: searchKey == "" ? null : searchKey,
                        accessToken: this.getAccessToken(),
                        orgIds: [currentlySignedAs.accountInfo.id],
                        includeOrgs: false
                    }
                    return ApiService.post('/api/connections/getAllEmployeesOfOrgs', data);
                }
            }

            this.getUserOwnedOrganization = function () {
                var data = {
                    accessToken: this.getAccessToken()
                };
                return ApiService.post('/personalHub/corporateConnections', data);
            }

        }]);
})();

