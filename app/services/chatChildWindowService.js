(function () {
    'use strict';

    angular
        .module('app')
        .service('chatChildWindowService', chatChildWindowService);

    chatChildWindowService.$inject = ['$rootScope'];

    function chatChildWindowService($rootScope) {
        var vm = this;
        window.sendToChat = reciveEvent;
        vm.messagesData = null;
        vm.usersData = null;
        vm.chatData = null;
        vm.messagesQueue = null;
        vm.sendEvent = sendEvent;

        function sendEvent(event, data) {
            window.opener.reciveFromChat(event, data);
        }

        function reciveEvent(event, data) {
            console.log(event, data);
            $rootScope.$evalAsync(function () {
                switch (event) {
                    case 'allChatServiceRefer':
                        $rootScope.user = data.selfUserData;
                        vm.usersData = data.usersData;
                        vm.messagesData = data.messagesData;
                        vm.chatData = data.chatData;
                        vm.messagesQueue = data.messagesQueue;
                        break;
                    case 'updateView':
                        $rootScope.$evalAsync();
                        break;
                    default:
                        $rootScope.$broadcast(event,data);
                }
            })
        }

        return vm;
    }
})();