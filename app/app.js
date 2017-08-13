'use strict';
(function () {
    'use strict';

    //'...','...','scroll libs (down scroll message container)', 'webSocket libs (https://github.com/AngularClass/angular-websocket)', 'websocket'
    angular.module('app', ['ui.router', 'ngMaterial', 'luegg.directives'])
        .config(['$httpProvider',function ($httpProvider) {
            //$httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.withCredentials = true;
        }]);

    angular.module('app').run(['$rootScope','$state',function ($rootScope,$state) {
        $rootScope.user = {
            userId : 3,
            userName : 'robert',
            status: '0',
            unreadCount: [0],
            compId: "00013"
        };
        if($rootScope.user === undefined) {
            $state.go('login');
        }
    }]);
})();

