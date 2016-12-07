 "use strict";
(function () {
    angular.module('kswDirectiveModule')
        .directive("kswComposeSignal", ["$parse","SpaceService",
            function ($parse, SpaceService) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: "views/directives/kswComposeSignal.html",
                    controller: function ($scope, $element) {
                        $scope.ifShowHash = false;
                        $scope.showHashTagField = function(){
                            $scope.ifShowHash = ! $scope.ifShowHash;
                        }

                        $scope.addNewTag = function (tag) {
                            if (tag.title.charAt(0) != '#') {
                                tag.title = '#' + tag.title.toUpperCase();
                            }
                            tag.entityType = 'HashTag';
                        };

                        $scope.loadTags = function(query){
                            return SpaceService.getSuggestedHashTags()
                                .then(function(response){
                                    var allTags = _.map(response.data,'title');
                                    return allTags.filter(function(tag) {
                                        return tag.toLowerCase().indexOf(query.toLowerCase()) != -1;
                                    });
                                });
                        };
                    },
                    link: function (scope, element, attrs) {

                    }
                };
            }]);
})();