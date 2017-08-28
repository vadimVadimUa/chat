(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$state', '$window', 'url', 'requestFactory', '$http', '$rootScope','chatParentWindowService','usersData'];

    function LoginCtrl($scope, $state, $window, url, requestFactory, $http, $rootScope,chatParentWindowService,usersData) {
        var vm = this;

        vm.chatLoading = false;
        vm.countUsers = 0;
        vm.Login = Login;
        vm.logout = logout;
        vm.openChat = openChat;
        vm.url = url;
        vm.loginError = '';
        vm.UserData = {
            username: "dd3",
            userid: 1,
            company: "00013"
        };

        function logout() {
            chatParentWindowService.close();
            requestFactory.requestPost(vm.url.logout, {})
                .then(function (gooddata) {
                }, function (errordata) {
                });
            console.log('LOGOUT');
            delete $rootScope.user;
            $window.location.reload();
        }

        function openChat() {
          chatParentWindowService.openChatWindow();
        }

        $scope.$on('unreadMessageIsLoaded',function (event,data) {
            vm.chatLoading = false;
            vm.countUsers = usersData.users.length;
        });

        function Login() {
            //-------------------------------------------
            if (vm.UserData.username && vm.UserData.userid>=0 && vm.UserData.company) {
                console.log(vm.url.login);
                console.log(vm.UserData);
                vm.chatLoading = true;
                requestFactory.requestPost(vm.url.login, vm.UserData)
                    .then(function (gooddata) {
                        console.log("recive from backend:",gooddata);
                        $rootScope.user = gooddata.data;
                        $rootScope.user.countUnread = []; //only for testing, when message from to, where id = id
                        chatParentWindowService.init();
                    }, function (errordata) {
                    console.log('error from backend:',errordata);
                    vm.loginError = 'User data does not match';
                });
            }
        }
    }
})();