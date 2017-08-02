(function () {
    'use strict';


    angular
        .module('app')
        .controller('ChatCtrl', ChatCtrl);

    ChatCtrl.inject = ['$scope', 'webSocketRequest', 'requestFactory','chatSocket','$interval','url'];
    function ChatCtrl($scope, webSocketRequest, requestFactory, chatSocket, $interval, url) {

        var vm = this;


        // var typing = undefined;
        //
        // $scope.username     = '';
        // $scope.sendTo       = 'everyone';
        // $scope.participants = [];
        // $scope.messages     = [];
        // $scope.newMessage   = '';
        //
        // $scope.sendMessage = function() {
        //     var destination = "/app/chat.message";
        //
        //     if($scope.sendTo != "everyone") {
        //         destination = "/app/chat.private." + $scope.sendTo;
        //         $scope.messages.unshift({message: $scope.newMessage, username: 'you', priv: true, to: $scope.sendTo});
        //     }
        //
        //     chatSocket.send(destination, {}, JSON.stringify({message: $scope.newMessage}));
        //     $scope.newMessage = '';
        // };
        //
        // $scope.startTyping = function() {
        //     // Don't send notification if we are still typing or we are typing a private message
        //     if (angular.isDefined(typing) || $scope.sendTo != "everyone") return;
        //
        //     typing = $interval(function() {
        //         $scope.stopTyping();
        //     }, 500);
        //
        //     chatSocket.send("/topic/chat.typing", {}, JSON.stringify({username: $scope.username, typing: true}));
        // };
        //
        // $scope.stopTyping = function() {
        //     if (angular.isDefined(typing)) {
        //         $interval.cancel(typing);
        //         typing = undefined;
        //
        //         chatSocket.send("/topic/chat.typing", {}, JSON.stringify({username: $scope.username, typing: false}));
        //     }
        // };
        //
        // $scope.privateSending = function(username) {
        //     $scope.sendTo = (username != $scope.sendTo) ? username : 'everyone';
        // };
        //
        // var initStompClient = function() {
        //     chatSocket.init(url.socket);
        //     //  chatSocket.init('/WSChatWeb/wschat');
        //
        //     chatSocket.connect(function(frame) {
        //
        //         // $scope.username = frame.headers['user-name'];
        //
        //         chatSocket.subscribe("/topic.login", function(message) {
        //             $scope.participants = JSON.parse(message.body);
        //         });
        //
        //         chatSocket.subscribe("/topic.logout", function(message) {
        //             $scope.participants = JSON.parse(message.body);
        //         });
        //
        //         chatSocket.subscribe("/topic.chat."+$rootScope.user.compId, function(message) {
        //             $scope.participants = JSON.parse(message.body);
        //         });
        //
        //
        //         chatSocket.subscribe("/queue/reply/"+$rootScope.user.compId+"/"+$rootScope.user.userId, function(message) {
        //             $scope.participants = JSON.parse(message.body);
        //         });
        //
        //
        //         chatSocket.subscribe("/topic/public.changedStatus", function(message) {
        //             $scope.participants = JSON.parse(message.body);
        //         });
        //
        //         // chatSocket.subscribe("/topic.logout", function(message) {
        //         //     $scope.participants.unshift({username: JSON.parse(message.body).username, typing : false});
        //         // });
        //         //
        //         // chatSocket.subscribe("/topic/chat.logout", function(message) {
        //         //     var username = JSON.parse(message.body).username;
        //         //     for(var index in $scope.participants) {
        //         //         if($scope.participants[index].username == username) {
        //         //             $scope.participants.splice(index, 1);
        //         //         }
        //         //     }
        //         // });
        //         //
        //         // chatSocket.subscribe("/topic/chat.typing", function(message) {
        //         //     var parsed = JSON.parse(message.body);
        //         //     if(parsed.username == $scope.username) return;
        //         //
        //         //     for(var index in $scope.participants) {
        //         //         var participant = $scope.participants[index];
        //         //
        //         //         if(participant.username == parsed.username) {
        //         //             $scope.participants[index].typing = parsed.typing;
        //         //         }
        //         //     }
        //         // });
        //         //
        //         // chatSocket.subscribe("/topic/chat.message", function(message) {
        //         //     $scope.messages.unshift(JSON.parse(message.body));
        //         // });
        //         //
        //         // chatSocket.subscribe("/user/exchange/amq.direct/chat.message", function(message) {
        //         //     var parsed = JSON.parse(message.body);
        //         //     parsed.priv = true;
        //         //     $scope.messages.unshift(parsed);
        //         // });
        //         //
        //         // chatSocket.subscribe("/user/exchange/amq.direct/errors", function(message) {
        //         //     toaster.pop('error', "Error", message.body);
        //         // });
        //
        //     }, function(error) {
        //         // toaster.pop('error', 'Error', 'Connection error ' + error);
        //         console.log("ERRRRRORRRR",error);
        //
        //     });
        // };
        //
        // initStompClient();




        vm.showLogo = true;
        //true = скрол вниз false = скрол вверх
        vm.scroll = true;
        vm.sentMessage = sentMessage;
        vm.loadMoreMessage = loadMoreMessage;

        vm.newMessage = "";

        vm.messages = [
                {
                    message: "ghbdtnwertwertwegdfsgsdfg sdfgs dfgsdfgsdf gsdfgsdfg sdfgsdfgsdfgsrgsdasdf adsf adsf asdf asdf asdf asdf asdf asdf asdf fgs dfgsdfg",
                    date: 1500908062800,
                    userFlag: true
                },
                {message: "ghbdtn", date: 1500908062800, userFlag: false},
                {message: "ghbdtn", date: 1500908062800, userFlag: true},
                {message: "ghbdtn", date: 1500908062800, userFlag: true},
                {message: "ghbdtn", date: 1500908062800, userFlag: false},
                {message: "ghbdtn", date: 1500908062800, userFlag: false},
                {message: "ghbdtn", date: 1500908062800, userFlag: true}
            ];

        function sentMessage() {
            if(vm.newMessage === '')return;
            vm.messages.push({message: vm.newMessage, date: new Date().getTime(), userFlag: true})
            vm.newMessage = '';
        }
        function loadMoreMessage(){
            console.log('load')
        }
        $scope.$on('selectUser', function(obj, data){
            console.log(data);
            vm.showLogo = false;
            //vm.messages  = requestFactory.request(null,null ,data);
            console.log( vm.messages);
        });
    }
})();