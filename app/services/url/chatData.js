(function () {
    'use strict';

    angular
        .module('app')
        .factory('chatData', chatData);
    chatData.$inject = ['url', '$rootScope','chatSocket','$state','$timeout'];
    function chatData( url, $rootScope, chatSocket, $state,$timeout) {
        if($rootScope.user === undefined) {
            $state.go('login');
        }
        var vm = this;
       // function for work with the backend, message - object or array
        vm.func = {
            //-- need rewrite
            login : function(message){},
            logout: function (message) {},
            reply: function (message) {},
            chat:function (message) {},
            changeStatusUser:function (message) {},
            connectionError:function (message) {},
            topicSeen : function(submitMessage){},
            topicDelivered : function(submitMessage){},
            //-----------------do not change, only call
            sendMessage : function(obj_message) {
                    console.log(obj_message);
                    chatSocket.send("/app/private", {},angular.toJson(obj_message));
            },
            // status 0 - 1 - 2
            changeStatusSelf : function(status) {
                chatSocket.send("/app/change."+status, {},{});
                console.log('set status :'+status);
            },
            messageSeen : function(submitMessage){
                chatSocket.send('/app/message.seen',{},angular.toJson(submitMessage));
                console.log('set message submit',submitMessage);
            },

            initStompClient : function(){
                initStompClient();
            }
        };



        var initStompClient = function() {
            chatSocket.init(url.socket);
            //  chatSocket.init('/WSChatWeb/wschat');

            chatSocket.connect(function(frame) {

                $rootScope.isConnected = true;

                chatSocket.subscribe("/topic.login", function(message) {
                    vm.func.login(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.logout", function(message) {
                    vm.func.logout(JSON.parse(message.body));
                });

                chatSocket.subscribe("/app/topic/chat."+$rootScope.user.compId, function(message) {
                    vm.func.chat(JSON.parse(message.body));
                });

                chatSocket.subscribe("/queue/reply/"+$rootScope.user.compId+"/"+$rootScope.user.userId, function(message) {
                    vm.func.reply(JSON.parse(message.body));
                });


                chatSocket.subscribe("/topic/public.changedStatus", function(message) {
                    vm.func.changeStatusUser(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.seen", function(message) {
                    vm.func.topicSeen(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.delivered", function(message) {
                    vm.func.topicDelivered(JSON.parse(message.body));
                });

            }, function(error) {
                console.log("Connection error with server, reconnect after 10sec...",error);
                vm.func.connectionError(error);
                $timeout(initStompClient, 15000);
            });
        };

        return vm.func;
    }
})();