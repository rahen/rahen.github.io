"use strict";
(function () {
    angular.module("app")
        .controller("newUploadCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService", "SignalService", "$state",
            function ($scope, $stateParams, SpaceService, LoggerService, SignalService, $state) {
                $scope.newUpload = {
                    spaceId: $stateParams.spaceId,
                    fileUrl: [],
                    title: '',
                    tags: [],
                    fileExtension: '',
                    file: {
                        name:'',
                        fileBase64:''
                    }
                };

                $scope.uploadOnChange = function () {
                    LoggerService.log(window.event.target.files[0]);
                    var selectedFile = window.event.target.files[0];

                    var fileReader = new FileReader();
                    fileReader.onload = function (fileLoadedEvent) {
                        var attachmentData = fileLoadedEvent.target.result.replace(/^data(.*?),/, '');
                        $scope.newUpload.title = selectedFile.name;
                        $scope.newUpload.file.name = selectedFile.name;
                        $scope.newUpload.file.fileBase64 = attachmentData;
                        $scope.newUpload.fileExtension =  selectedFile.name.substr(selectedFile.name.lastIndexOf('.'), selectedFile.type.length);
                        $scope.$apply();
                        LoggerService.log($scope.newUpload);
                    }
                    fileReader.readAsDataURL(selectedFile);
                    $scope.$apply();
                };

                $scope.addNewTag = function (tag) {
                    if (tag.charAt(0) != '#') {
                        tag = '#' + tag;
                    }
                    $scope.newUpload.tags.push(tag);
                };

                $scope.saveNewUpload = function () {
                    SignalService.attachNewFileMobile($scope.newUpload.file)
                        .then(function (response) {
                            $scope.newUpload.fileUrl.push(response.data.url);
                            SpaceService.saveFileToSpace($scope.newUpload)
                                .then(function (response) {
                                    if (response.data.code) {
                                        LoggerService.log(response);
                                        $state.go('space.viewUploaded', {spaceId: response.data.data._id});
                                    }
                                });
                        });
                };

            }]);
})();