(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope', '$rootScope', 'requestFactory', 'url', 'chatData', 'messagesData', 'usersData', '$state'];
    function ChatCtrl($scope, $rootScope, requestFactory, url, chatData, messagesData, usersData, $state) {
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
                message.userFlag = false;
                messagesData.putMessageByUserId(message.from, message);
                if (vm.currentChatUser !== undefined && message.from === vm.currentChatUser.userId) {
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

        chatData.topicDelivered = function (message) {};
        chatData.topicSeen = function (message) {};



        function sendRead(idArray) {
            console.log("ID ARRRY : ", idArray);
            requestFactory.requestPostData(url.messages_read + '/' + $rootScope.user.compId + '/read', idArray)
                .then(function (gooddata) {
                }, function (errordata) {
                });
        }

        function  getLastMessagesForDialog(){
            requestFactory.requestGET(url.messages_history + '/' + $rootScope.user.compId + '/last/5/' + vm.currentChatUser.userId+ '/' + $rootScope.user.userId, {})
                .then(function (gooddata) {
                    var arrayMessages = gooddata.data;
                    console.log("LOAD LAST 5 MESSAGES : ", arrayMessages);
                    if (!Array.isArray(arrayMessages)) {
                        return;
                    }
                    messagesData.messageDataForLoadMore = arrayMessages[0];
                    $rootScope.$evalAsync(function () {
                        for (var i = 0; i < arrayMessages.length; i += 1) {
                            messagesData.putMessageByUserId(arrayMessages[i].from, arrayMessages[i]);
                        }
                    });
                }, function (errordata) {
                });
        }

        function loadPrevMessages(lastMes) {
            requestFactory.requestGET(url.messages_history + '/' + $rootScope.user.compId + '/history/' + lastMes.from + '/' + lastMes.to + '/' + lastMes.id, {})
                .then(function (gooddata) {
                    var arrayMessages = gooddata.data;
                    console.log("LOAD MORE MESSAGES : ", arrayMessages);
                    if (!Array.isArray(arrayMessages)) {
                        return;
                    }
                    messagesData.messageDataForLoadMore = arrayMessages[0];
                    $rootScope.$evalAsync(function () {
                        for (var i = 0; i < arrayMessages.length; i += 1) {
                            messagesData.putMessageByUserId(arrayMessages[i].from, arrayMessages[i]);
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

            chatData.sendMessage(sendMessage);
            sendMessage.userFlag = true;
            sendMessage.isSending = true;
            var mesIndex = messagesData.putMessageByUserId(vm.currentChatUser.userId, sendMessage);
            console.log(sendMessage);
            vm.newMessage = '';
        }

        function loadMoreMessage() {
            if(messagesData.messageDataForLoadMore){
                loadPrevMessages(messagesData.messageDataForLoadMore);
            }
        }

        $scope.$on('selectUser', function (obj, data) {
            console.log('user selected', data.user);
            vm.currentChatUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            $rootScope.$evalAsync(function () {
                vm.messages = messagesData.getMessageByUserId(data.user.userId);
                console.log('SHOW USER MESSAGES : ', vm.messages);
                //we have unread messages from this user
                if (vm.currentChatUser.countUnread && vm.currentChatUser.countUnread.length > 0) {
                    sendRead(vm.currentChatUser.countUnread);
                } else {
                    //get last 5 messages
                    getLastMessagesForDialog();
                }
                vm.currentChatUser.countUnread = [];
            });

        });
    }
})();