(function () {
    'use strict';


    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope', '$rootScope', 'webSocketRequest', 'requestFactory', '$interval', 'url', 'chatData', 'messagesData','usersData'];
    function ChatCtrl($scope, $rootScope, webSocketRequest, requestFactory, $interval, url, chatData, messagesData,usersData) {

        var vm = this;
        vm.currentUser = undefined;

        vm.showLogo = true;
        //true = скрол вниз false = скрол вверх
        vm.scroll = true;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;

        vm.newMessage = "";

        vm.messages = [];


        chatData.reply = function (message) {
            console.log("RESIVE 'reply' event:", message);
            $rootScope.$evalAsync(function () {
                message.userFlag = false;
                messagesData.putMessageByUserId(message.from, message);
                if(vm.currentUser !== undefined && message.from === vm.currentUser.userId){
                    sendRead([message.id]);
                } else {
                    usersData.users[message.from].countUnread.push(message.id);
                }
            });
        };

        function sendRead(idArray) {
            console.log("ID ARRRY : ", idArray);
            requestFactory.requestPostData(url.messages_read, idArray)
                .then(function (gooddata) {
                }, function (errordata) {
                });
        }

        function sentMessage() {
            if (vm.newMessage === '')return;
            var sendMessage = {
                id: 0,
                to: vm.currentUser.userId,
                from: $rootScope.user.userId,
                content: vm.newMessage,
                companyId: $rootScope.user.compId,
                delivered: false,
                date: new Date().getTime()
            };
            sendMessage.userFlag = true;
            messagesData.putMessageByUserId(vm.currentUser.userId, sendMessage);
            chatData.sendMessage(sendMessage);
            console.log(sendMessage);
            vm.newMessage = '';
        }

        function loadMoreMessage() {
            console.log('load')
        }

        $scope.$on('selectUser', function (obj, data) {
            console.log('user selected', data.user);
            vm.currentUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            vm.messages = messagesData.getMessageByUserId(data.user.userId);
            var tempIdMes = [];
            sendRead(vm.currentUser.countUnread);
            vm.currentUser.countUnread = [];
            console.log(vm.messages);
            //vm.messages  = requestFactory.request(null,null ,data);
        });
    }
})();