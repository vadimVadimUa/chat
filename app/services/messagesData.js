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
        var messageDataForLoadMore = [];

        function setMessageForLoadMore(userId,message){
            messageDataForLoadMore[userId] = message;
        }

        function getMessageForLoadMore(userId){
            if(messageDataForLoadMore[userId]!==undefined) {
                return messageDataForLoadMore[userId];
            }
        }

        function getMessageByUserId(userId){
            if(messageArr[userId] === undefined){
                messageArr[userId] = [];
            }
            return messageArr[userId];
        }

        function putMessageByUserId(userId,message) {
            if(messageArr[userId] === undefined){
                messageArr[userId] = [];
            }
            messageArr[userId].push(message);
            return  {
                index : messageArr[userId].length-1,
                userId: userId
            };
        }

        function setMessageByIndex(userId,index,message){
            if(messageArr[userId] === undefined){
                messageArr[userId] = [];
            }
            messageArr[userId][index] = message;
        }

        function getMessageByIndex(userId,index){
            if(messageArr[userId] === undefined){
                messageArr[userId] = [];
            }
            return messageArr[userId][index];
        }

        vm.service = {
            getMessageByUserId : getMessageByUserId,
            putMessageByUserId : putMessageByUserId,
            setMessageByIndex: setMessageByIndex,
            getMessageByIndex : getMessageByIndex,
            setMessageForLoadMore: setMessageForLoadMore,
            getMessageForLoadMore : getMessageForLoadMore

        };

        return vm.service;
    }
})();