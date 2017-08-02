(function () {
    'use strict';

    angular
        .module('app')
        .factory('chatData', chatData);
    chatData.$inject = ['url', '$timeout', '$rootScope','chatSocket'];

    function chatData( url, $timeout, $rootScope, chatSocket) {

        var vm = this;

        vm.userList = [];

        vm.func = {
            //-- need rewrite
            login : function(message){},
            logout: function (message) {},
            reply: function (message) {},
            chat:function (message) {},
            changeStatusUser:function (message) {},
            //--do not change
            sendMessage : function(obj_message) {
                    chatSocket.send("/app/chat.private", {},obj_message);
            },
            changeStatusSelf : function(status) {
                chatSocket.send("/app/change."+status, {},{});
            }
        };

        var initStompClient = function() {
            chatSocket.init(url.socket);
            //  chatSocket.init('/WSChatWeb/wschat');

            chatSocket.connect(function(frame) {

                // $scope.username = frame.headers['user-name'];

                chatSocket.subscribe("/topic.login", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.login(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.logout", function(message) {
                    // $scope.participants = JSON.parse(message.body);
                    vm.func.logout(JSON.parse(message.body));
                });

                chatSocket.subscribe("/topic.chat."+$rootScope.user.compId, function(message) {
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
                console.log("ERRRRRORRRR",error);
            });
        };

        initStompClient();

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