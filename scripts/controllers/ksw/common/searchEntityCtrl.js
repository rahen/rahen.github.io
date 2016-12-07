"use strict";

(function () {
    angular.module("app")
        .controller("searchEntityCtrl", ["$scope", "SearchService", "$timeout", function ($scope, SearchService, $timeout) {
            $scope.selectedEntity = [];
            $scope.allResults = [];
            $scope.newResults = [];
            $scope.loadEntity = function (query) {
                //return SearchService.searchPrivately(query);
                return SearchService.suggestPublicly(query)
                    .then(function (response) {
                        var data = response.data||[];
                        var results = data.filter(function (o) { return o.title.toLowerCase().indexOf(query.toLowerCase()) != -1; });
                        $scope.newResults = results;
                        console.log(results);
                        return results;
                    });
            };

            // $scope.onEntitySelected = function ($tag) {
            //     if ($tag.entityType == "Person") {
            //         var userPublicProfile = '#!/public/view/user/' + $tag._id;
            //         window.open(userPublicProfile, '_blank');
            //     }
            // };
            
        }]);
})();