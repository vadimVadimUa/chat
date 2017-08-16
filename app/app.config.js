angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm'
                })
                .state('chat', {
                url: '/chat',
                templateUrl: 'templates/chat/chat.html',
                controller: 'ChatCtrl',
                controllerAs: 'vm',
                    onEnter:['$rootScope','$state',function($rootScope,$state){
                            if($rootScope.user === undefined ) $state.go('login');
                        }]
                });
        }
    ]);