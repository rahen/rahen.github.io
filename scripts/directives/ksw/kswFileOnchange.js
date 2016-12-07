"use strict";
(function(){
    angular.module('kswDirectiveModule')
        .directive("kswFileOnChange", ["$parse", function($parse){
            return {
                restrict: "A",
                scope : {
                   kswFileOnChange: '&'
                },
                controller:function($scope, $element, $attrs){

                    var updateFile = function () {
                        $scope.kswFileOnChange();
                        $scope.$apply();
                    };

                    $scope.$watch(function (value) {
                       // console.log('watching:',$element[0].tagName);
                    }, function (value) {
                        // console.log('change:',value);
                        if (!value) {
                            $element.bind('change', updateFile);
                        }
                    });


                },
                link: function (scope, element,attrs,ctrl) {

                }
            };
        }]);
})();