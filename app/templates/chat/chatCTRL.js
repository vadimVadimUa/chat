(function () {
    'use strict';


    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope','$rootScope', 'webSocketRequest', 'requestFactory','$interval','url','chatData'];
    function ChatCtrl($scope,$rootScope, webSocketRequest, requestFactory,  $interval, url,chatData) {

        var vm = this;
        var currentUser;
        vm.showLogo = true;
        //true = скрол вниз false = скрол вверх
        vm.scroll = true;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;

        vm.newMessage = "";

        vm.messages = [
            {
                id: 12,
                to: 1,
                from: 13,
                content: "ffff",
                companyId: "00013",
                delivered: false,
                date: 1500908062800,
                userFlag: true
            },
            {
                id: 13,
                to: 10,
                from: 13,
                content: "ddddd",
                companyId: "00013",
                delivered: false,
                date: 1500908062800,
                userFlag: false
            }
        ];

        function sentMessage() {
            if(vm.newMessage === '')return;
            var sendMessage = {
                id: undefined,
                to: currentUser.userId,
                from: $rootScope.user.userId,
                content: vm.newMessage,
                companyId: $rootScope.user.compId,
                delivered: false,
                date: new Date().getTime(),
                userFlag: true
            };
            vm.messages.push(sendMessage);
            chatData.sendMessage(sendMessage);
            console.log(sendMessage);
            vm.newMessage = '';
        }
        function loadMoreMessage(){
            console.log('load')
        }
        $scope.$on('selectUser', function(obj, data){
            console.log('user selected',data.user);
            currentUser = data.user;
            vm.showLogo = false;

            //vm.messages  = requestFactory.request(null,null ,data);
            console.log( vm.messages);
        });
    }
})();