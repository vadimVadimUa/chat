(function () {
    'use strict';

    angular
        .module('app')
        .factory('chatData', chatData);
    chatData.$inject = ['url', '$rootScope','chatSocket','$state','$timeout'];
    function chatData( url, $rootScope, chatSocket, $state,$timeout) {
        if($rootScope.user === undefined) $state.go('login');
        //connection status to backend
        $rootScope.isConnected = false;
        var vm = this;
        var _isConnected = false;
        vm.userList = [];
       // function for work with the backend, message - object or array
        vm.func = {
            //-- need rewrite
            login : function(message){},
            logout: function (message) {},
            reply: function (message) {},
            chat:function (message) {},
            changeStatusUser:function (message) {},
            connectionError:function (message) {},
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
            initStompClient : function(){
                initStompClient();
            },
            //property
            connectedStatus: _isConnected
        };



        var initStompClient = function() {
            chatSocket.init(url.socket);
            //  chatSocket.init('/WSChatWeb/wschat');

            chatSocket.connect(function(frame) {

                $rootScope.isConnected = true;
                _isConnected = true;
                // $scope.username = frame.headers['user-name'];

                chatSocket.subscribe("/topic.login", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.login(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.logout", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.logout(JSON.parse(message.body));
                });

                chatSocket.subscribe("/app/topic/chat."+$rootScope.user.compId, function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.chat(JSON.parse(message.body));
                });

                chatSocket.subscribe("/queue/reply/"+$rootScope.user.compId+"/"+$rootScope.user.userId, function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.reply(JSON.parse(message.body));
                });


                chatSocket.subscribe("/topic/public.changedStatus", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.changeStatusUser(JSON.parse(message.body));
                })

            }, function(error) {
                console.log("Connection error with server, reconnect after 10sec...",error);
                vm.func.connectionError(error);
                $timeout(initStompClient, 10000);
                $rootScope.isConnected = _isConnected = false;
            });
        };
        //once initializate after inject for some controller
        initStompClient();

        return vm.func;
    }
})();