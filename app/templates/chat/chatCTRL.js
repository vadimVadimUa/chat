(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope', '$rootScope','chatChildWindowService', 'requestFactory', 'url','$timeout'];
    function ChatCtrl($scope, $rootScope, chatChildWindowService, requestFactory, url, $timeout) {

        var vm = this;
        vm.currentChatUser = undefined;
        vm.showLogo = true;
        vm.scroll = true;
        vm.loading_more = false;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;
        vm.reSendMessage = reSendMessage;
        vm.newMessage = "";
        vm.messages = [];
        var COUNT_PRE_MESSAGES = 5;

        chatChildWindowService.sendEvent('chatWindowReady',{});

        $rootScope.$on('chat_reply', function (event, message) {
            console.log("RESIVE 'reply' event : ", message);

                vm.scroll = true;
                message.userFlag = false;

                chatChildWindowService.messagesData.putMessageByUserId(message.from, message);
                if (vm.currentChatUser !== undefined && message.from === vm.currentChatUser.userId) {
                    $rootScope.user.unread+=1;
                    sendRead([message]);
                } else {

                    if (chatChildWindowService.usersData.getUserByID(message.from) !== undefined) {
                        $rootScope.user.unread+=1;
                        if(chatChildWindowService.messagesData.getMessageForLoadMore(message.from)===undefined){
                            chatChildWindowService.messagesData.setMessageForLoadMore(message.from,message);
                        }
                        chatChildWindowService.usersData.getUserByID(message.from).countUnread.push(message);
                    }
                }
                chatChildWindowService.sendEvent('updateView',{});
            $rootScope.$evalAsync();
        });


        function sendRead(mesArray) {
            //async send reading message
            if(!Array.isArray(mesArray)){ return; }
            $timeout(function(){
                console.log("UNREAD ARRRY : ", mesArray);
                var tempArr = [];
                mesArray.forEach(function (value,key,array) {
                    chatChildWindowService.chatData.messageSeen({
                        id:value.id,
                        from:value.from,
                        to:value.to
                    });
                    tempArr.push(value.id);
                });
                requestFactory.requestPostData(url.messages_read + '/' + $rootScope.user.compId + '/read', tempArr)
                    .then(function (gooddata) {
                        $rootScope.user.unread-=tempArr.length;
                        chatChildWindowService.sendEvent('updateView',{});
                    }, function (errordata) {
                    });
            },20);
        }


        function loadPrevMessages(lastMes) {
            vm.loading_more = true;
            var reqUrl = url.messages_history + '/' + $rootScope.user.compId + '/last/'+COUNT_PRE_MESSAGES+'/' + vm.currentChatUser.userId+ '/' + $rootScope.user.userId;
            if(lastMes !== undefined) {
                reqUrl = url.messages_history + '/' + $rootScope.user.compId + '/history/' + lastMes.from + '/' + lastMes.to + '/' + lastMes.id;
            }
            requestFactory.requestGet(reqUrl, {})
                .then(function (gooddata) {
                    var arrayMessages = gooddata.data;
                    console.log("LOAD MORE MESSAGES : ", arrayMessages);
                    if (!Array.isArray(arrayMessages) || arrayMessages.length===0) {
                        vm.loading_more = false;
                        return;
                    }
                    var tempUserId = arrayMessages[arrayMessages.length-1].from === $rootScope.user.userId ? arrayMessages[arrayMessages.length-1].to:arrayMessages[arrayMessages.length-1].from;
                    chatChildWindowService.messagesData.setMessageForLoadMore(tempUserId,arrayMessages[arrayMessages.length-1]);

                    $rootScope.$evalAsync(function () {
                        for (var i = 0; i < arrayMessages.length; i += 1) {
                            arrayMessages[i].userFlag = arrayMessages[i].from !== $rootScope.user.userId ? false : true;
                            var userFrom = arrayMessages[i].from === $rootScope.user.userId ? arrayMessages[i].to: arrayMessages[i].from;
                            chatChildWindowService.messagesData.putMessageByUserId(userFrom, arrayMessages[i]);
                        }
                        vm.loading_more = false;
                        $rootScope.$broadcast('updateView',{});
                    });
                }, function (errordata) {
                    vm.loading_more = false;
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
            var messageIndex = chatChildWindowService.messagesData.putMessageByUserId(vm.currentChatUser.userId, sendMessage);
            chatChildWindowService.messagesQueue.addToSendQueue(messageIndex);
            console.log(sendMessage);
            vm.newMessage = '';
        }

        function reSendMessage(message){
            message.isSending = true;
            chatChildWindowService.messagesQueue.addToSendQueue(message.resendData);
            message.isError = false;
        }

        function loadMoreMessage() {
            console.log(chatChildWindowService.messagesData.getMessageForLoadMore(vm.currentChatUser.userId));
            if(chatChildWindowService.messagesData.getMessageForLoadMore(vm.currentChatUser.userId)!== undefined){
                vm.scroll = false;
                loadPrevMessages(chatChildWindowService.messagesData.getMessageForLoadMore(vm.currentChatUser.userId));
            }
        }

        $scope.$on('selectUser', function (obj, data) {
            console.log('user selected', data.user);
            vm.currentChatUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            $rootScope.$evalAsync(function () {
                vm.messages = chatChildWindowService.messagesData.getMessageByUserId(vm.currentChatUser.userId);
                //we have unread messages from this user
                if (vm.currentChatUser.countUnread && vm.currentChatUser.countUnread.length > 0) {

                    sendRead(vm.currentChatUser.countUnread);
                    vm.currentChatUser.countUnread = [];
                } else {
                    //get last 5 messages
                    if(chatChildWindowService.messagesData.getMessageByUserId(vm.currentChatUser.userId).length === 0){
                        loadPrevMessages();
                    }
                }
            });

        });
    }
})();