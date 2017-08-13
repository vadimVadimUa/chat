(function () {
    'use strict';

    angular
        .module('app')
        .factory('messagesData', messagesData);
    messagesData.$inject = ['chatUtil'];
    function messagesData(chatUtil) {
        var vm = this;
        // key is user id
        var messageArr = [];
        var messagesQueue = [];


        function getMessageByUserId(userId){
            if(typeof messageArr[userId] === 'undefined'){
                messageArr[userId] = [];
            }
            return messageArr[userId];
        }
        function putMessageByUserId(userId,message) {
            if(typeof messageArr[userId] === 'undefined'){
                messageArr[userId] = [];
            }
            messageArr[userId].push(message);
        }

        vm.service = {
            getMessageByUserId : getMessageByUserId,
            putMessageByUserId : putMessageByUserId,
            messageDataForLoadMore: undefined
        };

        return vm.service;
    }
})();