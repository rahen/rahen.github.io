"use strict";
(function(){
    angular.module("app")
        .service("LoggerService",
            ['$log',
            function($log){
            this.enabled = false;
            this.log = function(){
              this.enabled&&$log.log.apply($log,arguments)
            };
            this.error = function(){
              this.enabled&&$log.error.apply($log,arguments)
            };
        }]);
})();