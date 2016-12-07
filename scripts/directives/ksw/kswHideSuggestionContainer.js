"use strict";
(function () {
    angular.module('kswDirectiveModule')
        .directive("kswHideSuggestionContainer", ["EventService", "$window", function (EventService, $window) {
            return {
                restrict: "A",
                link: function (scope, element, attrs) {
                    angular.element(document).click(function (e) {
                        var container = angular.element(".people-picker, .mini-people-picker-container, #suggestedEmployeesContainer, #suggestedHashTagsContainer");
                        if (container.has(e.target).length === 0) {
                            container.hide();
                        }
                    });
                }
            }
        }]);
})();