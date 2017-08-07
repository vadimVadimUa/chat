(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$state', '$window', 'url', 'requestFactory', '$http', '$rootScope'];

    function LoginCtrl($scope, $state, $window, url, requestFactory, $http, $rootScope) {
        var vm = this;

        vm.Login = Login;
        vm.url = url;
        vm.loginError = '';
        vm.UserData = {
            username: "dd3",
            userid: 1,
            company: "00013"
        };

        function Login() {
            //-------------------------------------------
            if (vm.UserData.username && vm.UserData.userid && vm.UserData.company) {
                // var url = $state.href('chat');
                // $window.open(url, "C-Sharpcorner", "width=700,height=500");
                console.log(vm.url.login);
                console.log(vm.UserData);
                requestFactory.requestPost(vm.url.login, vm.UserData)
                    .then(function (gooddata) {
                        console.log("recive from backend:",gooddata);
                        $rootScope.user = gooddata.data;
                        $state.go('chat');
                        // var url = $state.href('chat');
                        // $window.open(url, "C-Sharpcorner", "width=700,height=500");
                    }, function (errordata) {
                    console.log('error from backend:',errordata);
                    vm.loginError = 'User data does not match';
                });
            }
        }
    }
})();