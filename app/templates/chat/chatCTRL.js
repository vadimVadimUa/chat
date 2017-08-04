(function () {
    'use strict';


    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$scope','$rootScope', 'webSocketRequest', 'requestFactory','$interval','url','chatData','messagesData'];
    function ChatCtrl($scope,$rootScope, webSocketRequest, requestFactory,  $interval, url,chatData,messagesData) {

        var vm = this;
        var currentUser;

        vm.showLogo = true;
        //true = скрол вниз false = скрол вверх
        vm.scroll = true;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;

        vm.newMessage = "";

        vm.messages = [
            {
                id: 12,
                to: 4,
                from: 0,
                content: "33333",
                companyId: "00013",
                delivered: false,
                date: 1500908062800,
                userFlag: true
            },
            {
                id: 13,
                to: 4,
                from: 1,
                content: "11111",
                companyId: "00013",
                delivered: false,
                date: 1500908062800,
                userFlag: false
            }
        ];

        setInterval(function () {
            {
               processMessages( [{
                id: 13,
                to: 4,
                from: 1,
                content: "11111",
                companyId: "00013",
                delivered: false,
                date: 1500908062800,
                userFlag: false
            }])
            }},3000
        )

        chatData.reply = function (message) {
            console.log("RESIVE 'reply' event:",message);
            messagesData.putMessageByUserId(message.from, message);
            $scope.$apply();
        };

        requestFactory.requestGet(url.messages_unread+$rootScope.user.compId+'/'+$rootScope.user.userId)
            .then(function (gooddata) {
                console.log("recive unread message:",gooddata);
                processMessages(gooddata.data);
            }, function (errordata) {
                console.log('error get unread message:',errordata);
            });


        function processMessages(messagesArr) {
            if(!Array.isArray(messagesArr)) return;
            messagesArr.forEach(function(item, key){
                item.userFlag= false;
                messagesData.putMessageByUserId(item.from, item);
                $scope.$apply();
            });
        }

        function sentMessage() {
            if(vm.newMessage === '')return;
            var sendMessage = {
                id: 0,
                to: currentUser.userId,
                from: $rootScope.user.userId,
                content: vm.newMessage,
                companyId: $rootScope.user.compId,
                delivered: false,
                date: new Date().getTime()
            };
            sendMessage.userFlag = true;
            // vm.messages.push(sendMessage);
            messagesData.putMessageByUserId(currentUser.userId, sendMessage);
            chatData.sendMessage(sendMessage);
            console.log(sendMessage);
            vm.newMessage = '';
        }
        function loadMoreMessage(){
            console.log('load')
        }
        $scope.$on('selectUser', function(obj, data){
            console.log('user selected',data.user);
            currentUser = data.user;
            vm.showLogo = false;
            //get reference array (vm.messages get reference array in messagData;
            vm.messages = messagesData.getMessageByUserId(data.user.userId);
            console.log(vm.messages);
            //vm.messages  = requestFactory.request(null,null ,data);
        });
    }
})();