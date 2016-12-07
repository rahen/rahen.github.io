"use strict";
(function () {
    angular.module('kswDirectiveModule')
        .directive("onResize", ["$window",
            function ($window) {
                return {
                    restrict: 'A',
                    link: function(scope, elem, attrs) { 

                        var w = angular.element($window);
                        
                        scope.getWindowDimensions = function () {
                            return { 'h': w.height(), 'w': w.width() };
                        };

                        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                            
                            scope.onResize = function() {
                                var w = angular.element($window);
                                var h = w.innerHeight()-200;

                                if(attrs["onResize"]=="messageDetails") {
                                    h = w.innerHeight()-368;
                                }
                                scope.config = {                                                       
                                    setHeight: h
                                };
                                $(elem).height(h);
                            };

                            scope.onResize();                    

                        }, true);

                        w.bind('resize', function () {
                            scope.$apply();
                        });
                    }
                } 
        }]);
})();