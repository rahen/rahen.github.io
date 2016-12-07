"use strict";
(function(){
    angular.module("app")
        .controller("addAttributeCtrl",["$scope", "$stateParams", "SpaceService", "LoggerService","$mdDialog","OrgService",
            function ($scope, $stateParams, SpaceService, LoggerService, $mdDialog, OrgService) {
                $scope.attributeTypes = [
                    {key: 'string', value: 'Text'},
                    {key: 'number', value: 'Number'},
                    {key: 'boolean', value: 'Yes/No'},
                    {key: 'date', value: 'Date'},
                    {key: 'user', value: 'User Type'}
                ];

                $scope.init = function(){
                    SpaceService.getSpaceById($stateParams.spaceId)
                        .then(function(response){
                            $scope.space = response.data.data;
                            $scope.attribute = {
                                type: $scope.attributeTypes[0],
                                spaceId: $stateParams.spaceId,
                                tags: $scope.space.tags
                            };
                        });
                };

                $scope.init();

                $scope.dateOptions = {
                    changeYear: true,
                    changeMonth: true,
                    yearRange: '1900:-0'
                };

                $scope.hideModal = function () {
                    $mdDialog.cancel();
                };

                OrgService.getAllEmployeesOfOrgs()
                    .then(function(response){
                        var users = response.data;
                        LoggerService.log(users);
                    });

                $scope.loadUsers = function(query){

                 return   OrgService.getAllEmployeesOfOrgs()
                        .then(function(response){
                         var users = response.data;
                         LoggerService.log(users);
                            return users.filter(function(user) {
                                return user.title.toLowerCase().indexOf(query.toLowerCase()) != -1;
                            });
                        });

                    //return SpaceService.getSuggestedHashTags()
                    //    .then(function(response){
                    //        return _.map(response.data,'title');
                    //    });
                };

                $scope.addAttribute = function () {

                    SpaceService.addSpaceAttributes($scope.attribute)
                        .then(function(response){
                            if(response.data.code){
                                $mdDialog.hide($scope.attribute);
                            }
                        });
                };
            }]);
})();