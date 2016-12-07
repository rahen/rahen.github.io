"use strict";
(function () {
    angular.module('app')
        .factory('ApiService', ["$q", "$http", function ($q, $http) {
            var localUrl = "http://localhost:3000";
            var baseDevUrl = "https://dev-frontserver.herokuapp.com";
            var bsDevUrl = "http://bs-dev-main.herokuapp.com";
            var baseProdUrl = "https://prod-frontserver.herokuapp.com";
            var baseUrl = baseProdUrl;
            var chatServerUrl = "https://prod-chatserver.herokuapp.com";
            var fileCdnServer = "http://prod-cdn.herokuapp.com";
            var thirdPartyServiceUrl = "http://polar-scrubland-5825.herokuapp.com";
            var post = function (url, data, serverUrl) {
                var deferred = $q.defer();
                $http({
                    url: serverUrl == null ? baseUrl + url : serverUrl + url,
                    method: "POST",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    var result = {};
                    result.data = data;
                    result.status = status;
                    result.headers = headers;
                    result.config = config;
                    deferred.resolve(result);
                }).error(function (result, status) {
                    var error = {
                        result: result,
                        status: status
                    };
                    deferred.reject(error);

                });
                return deferred.promise;
            };

            var get = function (url, serverUrl) {
                var deferred = $q.defer();
                $http({
                    url: serverUrl == null ? baseUrl + url : serverUrl + url,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    var result = {};
                    result.data = data;
                    result.status = status;
                    result.headers = headers;
                    result.config = config;
                    deferred.resolve(result);
                }).error(function (result, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            };

            var remove = function (url, serverUrl) {
                var deferred = $q.defer();
                $http({
                    url: serverUrl == null ? baseUrl + url : serverUrl + url,
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    var result = {};
                    result.data = data;
                    result.status = status;
                    result.headers = headers;
                    result.config = config;
                    deferred.resolve(result);
                }).error(function (result, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            };

            var update = function (url, data, serverUrl) {
                var deferred = $q.defer();
                $http({
                    url: serverUrl == null ? baseUrl + url : serverUrl + url,
                    method: "PUT",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    var result = {};
                    result.data = data;
                    result.status = status;
                    result.headers = headers;
                    result.config = config;
                    deferred.resolve(result);
                }).error(function (result, status) {
                    var error = {
                        result: result,
                        status: status
                    };
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            var fileUpload = function (url, data, serverUrl) {
                var deferred = $q.defer();
                $http({
                    url: serverUrl == null ? baseUrl + url : serverUrl + url,
                    method: "POST",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    var result = {};
                    result.data = data;
                    result.status = status;
                    result.headers = headers;
                    result.config = config;
                    deferred.resolve(result);
                }).error(function (result, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            };

            var getProfileThumbnail = function (id, imageSize, isOrg) {
                if (isOrg) {
                    return fileCdnServer +
                        '/getOrgProfilePictureThumbnail/' +
                        id +
                        '/' +
                        imageSize +
                        '/org.jpg';
                }

                return fileCdnServer +
                    '/getProfilePictureThumbnail/' +
                    id +
                    '/' +
                    imageSize +
                    '/profile.jpg';
            };

            return {
                post: post,
                apiUrl: baseUrl,
                chatServerUrl: chatServerUrl,
                fileCdnServer: fileCdnServer,
                getProfileThumbnail: getProfileThumbnail,
                postWithHeader: fileUpload,
                thirdPartyServiceUrl: thirdPartyServiceUrl,
                get: get,
                remove: remove,
                update: update
            };
        }]);
})();