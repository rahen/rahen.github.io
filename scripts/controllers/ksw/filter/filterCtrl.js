"use strict";
(function () {
    angular.module("app")
        .controller("filterCtrl", ["$scope", "$timeout", "$mdSidenav", "$mdUtil", "$log",
            function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
                $scope.toggleFilter = buildToggler('filter');
                
                function buildToggler(navID) {
                    var debounceFn =  $mdUtil.debounce(function(){
                            $mdSidenav(navID)
                              .toggle()
                              .then(function () {
                                angular.element('.md-sidenav-backdrop').hide();                                            
                              });
                          },300);
                      return debounceFn;
                    };
                $scope.toggleFilter();
            }]);
})();