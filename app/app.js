'use strict';
(function () {
    'use strict';

    //'...','...','scroll libs (down scroll message container)', 'webSocket libs (https://github.com/AngularClass/angular-websocket)', 'websocket'
    angular.module('app', ['ui.router', 'ngMaterial', 'luegg.directives','ngAnimate', 'toastr'])
        .config(['$httpProvider','toastrConfig',function ($httpProvider,toastrConfig) {
            $httpProvider.defaults.withCredentials = true;
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 2,
                newestOnTop: false,
                positionClass: 'toast-bottom-right',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body',
                timeOut: 5000,
                closeButton: true
            });
        }]);

    angular.module('app').run(['$rootScope','$state',
        function ($rootScope,$state) {
        //only for testing
        $state.defaultErrorHandler(function() {
        });
        if(window.opener === undefined){
            $state.go('login');
        }
    }]);
})();

