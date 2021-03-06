'use strict';
(function () {
    'use strict';

    //'...','...','scroll libs (down scroll message container)', 'webSocket libs (https://github.com/AngularClass/angular-websocket)', 'websocket'
    angular.module('app', ['ui.router', 'ngMaterial', 'luegg.directives'])
        .config(['$httpProvider',function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        }]);

    angular.module('app').run(['$rootScope','$state',function ($rootScope,$state) {
        //only for testing
        $state.defaultErrorHandler(function() {
        });
        $state.go('login');
    }]);
})();

