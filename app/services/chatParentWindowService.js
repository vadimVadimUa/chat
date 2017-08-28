(function () {
    'use strict';

    angular
        .module('app')
        .service('chatParentWindowService', chatParentWindowService);

    chatParentWindowService.$inject = ['$rootScope', '$state', 'chatData', 'usersData', 'messagesData', 'messagesQueue','toastr'];

    function chatParentWindowService($rootScope, $state, chatData, usersData, messagesData, messagesQueue,toastr) {
        var vm = this;
        var chatHandler = null;
        window.reciveFromChat = reciveFromChat;
        var userForOpen = undefined;


        function reciveFromChat(event_name, data) {
            console.log(event_name, data);
            switch (event_name) {
                case 'chatWindowReady':
                    startChatProcess();
                    break;
                case 'updateView':
                    $rootScope.$evalAsync();
                    break;
                case 'listUsersIsReady':
                    if(userForOpen!==undefined){
                        chatHandler.sendToChat('selectUser',{
                            user:userForOpen
                        });
                        userForOpen = undefined;
                    }
                    break;
                default:$rootScope.$broadcast(event_name,data);
            }
        }

        function init() {
            chatData.initStompClient();
        }


        function startChatProcess() {
            chatHandler.sendToChat('allChatServiceRefer', {
                selfUserData: $rootScope.user,
                messagesData:messagesData,
                usersData:usersData,
                chatData:chatData,
                messagesQueue:messagesQueue
            });
        }


        $rootScope.$on('chat_reply', function (event, message) {
            if (chatHandler == undefined || chatHandler.closed) {
                console.log("RESIVE 'reply' event : ", message);
                $rootScope.$evalAsync(function () {
                    messagesData.putMessageByUserId(message.from, message);
                    if (usersData.getUserByID(message.from) !== undefined) {
                        if (messagesData.getMessageForLoadMore(message.from) === undefined) {
                            messagesData.setMessageForLoadMore(message.from, message);
                        }
                        usersData.getUserByID(message.from).countUnread.push(message);
                        $rootScope.user.unread += 1;
                        toastr.info(message.content, usersData.getUserByID(message.from).userName,{
                            onTap:function(){
                                userForOpen = usersData.getUserByID(message.from);
                                openChatWindow();
                            }
                        });
                    }
                });
            }
        });

        $rootScope.$on('chat_reply', function (event, data) {
            if (chatHandler && !chatHandler.closed) chatHandler.sendToChat('chat_reply', data);
        });

        $rootScope.$on('updateView', function (event, data) {
            if (chatHandler && !chatHandler.closed) chatHandler.sendToChat('updateView', data);
        });

        function openChatWindow() {
            if (chatHandler == null || chatHandler.closed) {
                var url = $state.href('chat');
                chatHandler = window.open(url, '_blank','resizable=1,width=700,height=500' );
            } else chatHandler.focus();
        }


        return {
            openChatWindow: openChatWindow,
            init: init
        }
    }
})();