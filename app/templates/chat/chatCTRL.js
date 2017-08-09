(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope', '$rootScope', 'requestFactory', '$interval', 'url', 'chatData', 'messagesData', 'usersData', '$state'];
    function ChatCtrl($scope, $rootScope, requestFactory, $interval, url, chatData, messagesData, usersData, $state) {
        if ($rootScope.user === undefined) {
            $state.go('login');
        }
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
                if (vm.currentUser !== undefined && message.from === vm.currentUser.userId) {
                    sendRead([message.id]);
                } else {
                    if (Array.isArray(usersData.users[message.from].countUnread)) {
                        usersData.users[message.from].countUnread.push(message.id);
                    } else {
                        usersData.users[message.from].countUnread = [];
                        usersData.users[message.from].countUnread.push(message.id);
                    }
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

            messagesData.putMessageByUserId(vm.currentUser.userId, sendMessage);
            chatData.sendMessage(sendMessage);
            sendMessage.userFlag = true;
            console.log(sendMessage);
            vm.newMessage = '';
        }

        function loadMoreMessage() {
            console.log('load');
        }

        $scope.$on('selectUser', function (obj, data) {
            console.log('user selected', data.user);
            vm.currentUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            $rootScope.$evalAsync(function () {
                vm.messages = messagesData.getMessageByUserId(data.user.userId);
                console.log('SHOW USER MESSAGES :', vm.messages);
            });
            if (vm.currentUser.countUnread.length > 0) sendRead(vm.currentUser.countUnread);
            vm.currentUser.countUnread = [];
            //vm.messages  = requestFactory.request(null,null ,data);
        });
    }
})();