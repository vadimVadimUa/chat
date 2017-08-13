(function () {
    'use strict';

    angular
        .module('app')
        .factory('messagesData', messagesData);
    messagesData.$inject = [];
    function messagesData() {
        var vm = this;
        // key is user id;
        var messageArr = [];
        var messageQuery = [];



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
            return  {
                index : messageArr[userId].length-1,
                userId:userId
            };
        }

        function setSendingMessageByIndex(userId,index){
            if(typeof messageArr[userId] === 'undefined'){
                messageArr[userId] = [];
            }
            messageArr[userId][index].isSending = false;
        }

        function getMessageByIndex(userId,index){
            if(typeof messageArr[userId] === 'undefined'){
                messageArr[userId] = [];
            }
            return messageArr[userId][index];
        }

        vm.service = {
            getMessageByUserId : getMessageByUserId,
            putMessageByUserId : putMessageByUserId,
            setSendingMessageByIndex: setSendingMessageByIndex,
            getMessageByIndex : getMessageByIndex,
            messageDataForLoadMore: undefined,
            messageQuery : messageQuery
        };

        return vm.service;
    }
})();