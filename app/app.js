'use strict';
(function () {
    'use strict';

    //'...','...','scroll libs (down scroll message container)', 'webSocket libs (https://github.com/AngularClass/angular-websocket)', 'websocket'
    angular.module('app', ['ui.router', 'ngMaterial', 'luegg.directives', 'ngWebSocket', 'bd.sockjs'])
        .config(['$httpProvider',function ($httpProvider) {
            //$httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.withCredentials = true;
        }]);

    angular.module('app').run(['$rootScope','$state',function ($rootScope,$state) {
        if($rootScope.user === undefined) {
            $state.go('login');
        }
    }]);
})();

