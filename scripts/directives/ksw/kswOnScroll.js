"use strict";
(function () {
    angular.module('kswDirectiveModule')
        .directive("kswOnScroll", ["EventService", "$window", function (EventService, $window) {
            return {
                restrict: "A",
                scope: {
                    loadMoreSignal: '&'
                },
                link: function (scope, element, attrs) {
                    scope.loadMoreSignal();
                    scope.$watch('scrollPosition', function(){
                        var window = angular.element('#ksw-loader .scrollable .scrollable-content');
                        var innerHeight = window.innerHeight();
                        var scrolledPercentage = (scope.scrollPosition/innerHeight)*100;
                        if ( scrolledPercentage >= 50) {
                            scope.loadMoreSignal();
                        }
                    });
                }
            }

        }]);
})();