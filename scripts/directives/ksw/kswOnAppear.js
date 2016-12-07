"use strict";
(function(){
    angular.module("kswDirectiveModule")
        .directive("kswOnAppear",function(){
            return function(scope, element, attrs){
                console.log(element);

                var bindToAppear = function(){
                    $('#loader').on('appear',function(ev,all){
                        bindToAppear();
                        console.log("appeared");
                    });
                };

                bindToAppear();
            }
        });
})();