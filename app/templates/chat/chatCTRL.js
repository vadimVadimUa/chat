(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope', '$rootScope', 'requestFactory', 'url', 'chatData', 'messagesData', 'usersData', '$state','messagesQueue'];
    function ChatCtrl($scope, $rootScope, requestFactory, url, chatData, messagesData, usersData, $state,messagesQueue) {
        if ($rootScope.user === undefined) {
            $state.go('login');
        }
        chatData.initStompClient();
        var vm = this;
        vm.currentChatUser = undefined;
        vm.showLogo = true;
        //true = скрол вниз false = скрол вверх
        vm.scroll = true;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;
        vm.newMessage = "";
        vm.messages = [];

        chatData.reply = function (message) {
            console.log("RESIVE 'reply' event : ", message);
            $rootScope.$evalAsync(function () {
                vm.scroll = true;
                message.userFlag = false;
                messagesData.putMessageByUserId(message.from, message);
                if (vm.currentChatUser !== undefined && message.from === vm.currentChatUser.userId) {
                    sendRead([message]);
                } else {
                    if (usersData.users[message.from] !== undefined) {
                        usersData.users[message.from].countUnread.push(message);
                    }
                }
            });
        };


        function sendRead(mesArray) {
            console.log("UNREAD ARRRY : ", mesArray);
            var tempArr = [];
            mesArray.forEach(function (value,key,array) {
                chatData.messageSeen({
                    id:value.id,
                    from:value.from,
                    to:value.to
                });
               tempArr.push(value.id);
            });
            requestFactory.requestPostData(url.messages_read + '/' + $rootScope.user.compId + '/read', tempArr)
                .then(function (gooddata) {
                }, function (errordata) {
                });
        }


        function loadPrevMessages(lastMes) {
            var reqUrl = url.messages_history + '/' + $rootScope.user.compId + '/last/5/' + vm.currentChatUser.userId+ '/' + $rootScope.user.userId;
            if(lastMes !== undefined) reqUrl = url.messages_history + '/' + $rootScope.user.compId + '/history/' + lastMes.from + '/' + lastMes.to + '/' + lastMes.id;
            requestFactory.requestGet(reqUrl, {})
                .then(function (gooddata) {
                    var arrayMessages = gooddata.data;
                    console.log("LOAD MORE MESSAGES : ", arrayMessages);
                    if (!Array.isArray(arrayMessages)) {
                        return;
                    }
                    messagesData.messageDataForLoadMore = arrayMessages[arrayMessages.length-1];
                    $rootScope.$evalAsync(function () {
                        for (var i = 0; i < arrayMessages.length; i += 1) {
                            arrayMessages[i].userFlag = arrayMessages[i].from !== $rootScope.user.userId ? false : true;
                            var userFrom = arrayMessages[i].from === $rootScope.user.userId ? arrayMessages[i].to: arrayMessages[i].from;
                            messagesData.putMessageByUserId(userFrom, arrayMessages[i]);
                        }
                    });
                }, function (errordata) {
                });

        }

        function sentMessage() {
            if (vm.newMessage === '') {
                return;
            }
            var sendMessage = {
                id: 0,
                to: vm.currentChatUser.userId,
                from: $rootScope.user.userId,
                content: vm.newMessage,
                companyId: $rootScope.user.compId,
                delivered: false,
                date: new Date().getTime()
            };
            vm.scroll = true;
            sendMessage.userFlag = true;
            sendMessage.isSending = true;
            var messageIndex = messagesData.putMessageByUserId(vm.currentChatUser.userId, sendMessage);
            messagesQueue.addToSendQueue(messageIndex);
            console.log(sendMessage);
            vm.newMessage = '';
        }

        function loadMoreMessage() {
            if(messagesData.messageDataForLoadMore){
                vm.scroll = false;
                loadPrevMessages(messagesData.messageDataForLoadMore);
            }
        }

        $scope.$on('selectUser', function (obj, data) {
            console.log('user selected', data.user);
            vm.currentChatUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            $rootScope.$evalAsync(function () {
                vm.messages = messagesData.getMessageByUserId(vm.currentChatUser.userId);
                console.log('SHOW USER MESSAGES : ', vm.messages);
                //we have unread messages from this user
                if (vm.currentChatUser.countUnread && vm.currentChatUser.countUnread.length > 0) {
                    sendRead(vm.currentChatUser.countUnread);
                    vm.currentChatUser.countUnread = [];
                } else {
                    //get last 5 messages
                    if(messagesData.getMessageByUserId(vm.currentChatUser.userId).length === 0) loadPrevMessages();
                }

            });

        });
    }
})();