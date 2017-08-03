(function () {
    'use strict';

    angular
        .module('app')
        .factory('chatData', chatData);
    chatData.$inject = ['url', '$rootScope','chatSocket'];
    function chatData( url, $rootScope, chatSocket) {

        var vm = this;

        vm.userList = [];
       // function for work with the backend, message - object or array
        vm.func = {
            //-- need rewrite
            login : function(message){},
            logout: function (message) {},
            reply: function (message) {},
            chat:function (message) {},
            changeStatusUser:function (message) {},
            //---------------------------------------do not change, only call
            sendMessage : function(obj_message) {
                    chatSocket.send("/app/chat.private", {},obj_message);
            },
            changeStatusSelf : function(status) {
                chatSocket.send("/app/change."+status, {},{});
            },
            initStompClient : function(){
                initStompClient();
            }
        };

        var initStompClient = function() {
            chatSocket.init(url.socket);
            //  chatSocket.init('/WSChatWeb/wschat');

            chatSocket.connect(function(frame) {

                // $scope.username = frame.headers['user-name'];

                chatSocket.subscribe("/topic.login", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.login(message.body);
                });

                chatSocket.subscribe("/topic.logout", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.logout(message.body);
                });

                chatSocket.subscribe("/topic/chat."+$rootScope.user.compId, function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.chat(message.body);
                });

                chatSocket.subscribe("/queue/reply/"+$rootScope.user.compId+"/"+$rootScope.user.userId, function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.reply(message.body);
                });


                chatSocket.subscribe("/topic/public.changedStatus", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.changeStatusUser(message.body);
                })

            }, function(error) {
                console.log("ERRRRRORRRR",error);
            });
        };



        return vm.func;

        //
        // var userStateCollection = {};
        // //$timeout(changeUserStatus, 3000);
        //
        // function changeUserStatus() {
        //     userStateCollection = {id: 3, status: '1'};
        //     $rootScope.$broadcast("updatesUserStatus");
        // }
        //
        //
        // var userCollection = [];
        // userCollection = [
        //     {id: 1, name: 'Ivan', status: '3', newMessage: false},
        //     {id: 2, name: 'Oleg', status: '2', newMessage: true},
        //     {id: 3, name: 'Kosty', status: '3', newMessage: false},
        //     {id: 4, name: 'Ivan', status: '1', newMessage: false},
        //     {id: 5, name: 'Ivan', status: '3', newMessage: true},
        //     {id: 7, name: 'Kosty', status: '3', newMessage: false},
        //     {id: 8, name: 'Ivan', status: '3', newMessage: false},
        //     {id: 10, name: 'Kosty', status: '3', newMessage: false},
        //     {id: 11, name: 'Ivan', status: '3', newMessage: false},
        //     {id: 13, name: 'Kosty', status: '3', newMessage: false}
        // ];
        //
        //
        // return {
        //     getUsers: userCollection ,
        //     getUserStateCollection: function (){return userStateCollection}
        // };

    }
})();