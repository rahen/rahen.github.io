"use strict";
(function () {
    angular.module('kswDirectiveModule')
        .directive("kswSpaceOpen", ["$state", function ($state) {
            return {
                restrict: "A",
                scope:{
                    space : '='
                },
                link: function (scope, element, attrs) {
                    var space = scope.space;
                    element.bind('click',function(){
                        switch (space.entityType){
                            case 'Space':
                                $state.go('space.viewAll', {parentSpaceId: space._id});
                                break;
                            case 'WebLink':
                                $state.go('space.viewWebLink', {spaceId: space._id});
                                break;
                            case 'Uploaded':
                                $state.go('space.viewUploaded', {spaceId: space._id});
                                break;
                            case 'Text':
                                $state.go('space.viewText', {spaceId: space._id});
                                break;
                        }
                    });
                }
            }
        }]);
})();