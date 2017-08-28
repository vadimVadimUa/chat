(function () {
    'use strict';

    angular
        .module('app')
        .service('messagesQueue', messagesQueue);
    messagesQueue.$inject = ['chatData', 'messagesData','$rootScope','$timeout'];

    function messagesQueue(chatData, messagesData,$rootScope,$timeout) {
        var vm = this;
        var sendingState = false;
        var mQueue = [];
        var TIME_ERROR_SEND = 30000;

        /**
         *
         * @param messageObj - userId, index (in messagesData)
         */
        function addToSendQueue(messageObj) {
            if (messageObj.userId === undefined || messageObj.index === undefined) return;
            mQueue.push(messageObj);
            if (!sendingState) {
                sendingState = true;
                sendMessage();
            }
        }

        function sendMessage() {
            if (mQueue[0] === undefined) {
                sendingState = false;
                mQueue = [];
                return;
            }
            var tempMessage = messagesData.getMessageByIndex(mQueue[0].userId, mQueue[0].index);
            chatData.sendMessage({
                id: 0,
                to: tempMessage.to,
                from: tempMessage.from,
                content: tempMessage.content,
                companyId: tempMessage.companyId,
                delivered: false,
                date: tempMessage.date
            });
            $timeout(function(){
                var tempMessage = messagesData.getMessageByIndex(mQueue[0].userId, mQueue[0].index);
                tempMessage.isSending = false;
                tempMessage.isError = true;
                //save data position and index for resend if need
                tempMessage.resendData = mQueue[0];
                messagesData.setMessageByIndex(mQueue[0].userId, mQueue[0].index, tempMessage);
                if (mQueue.length === 1) {
                    sendingState = false;
                    mQueue = [];
                } else {
                    mQueue.shift();
                    sendMessage();
                }
                $rootScope.$broadcast('updateView',{});
            },TIME_ERROR_SEND);
        }

        chatData.topicSend = function (submitMessage) {
            console.log("MESSAGE  IS DELIVERED -------------", submitMessage);
            if(mQueue.length===0) return;
            var tempMessage = messagesData.getMessageByIndex(mQueue[0].userId, mQueue[0].index);
            tempMessage.isSending = false;
            messagesData.setMessageByIndex(mQueue[0].userId, mQueue[0].index, tempMessage);
            $rootScope.$broadcast('updateView',{});
            if (mQueue.length === 1) {
                sendingState = false;
                mQueue = [];
            } else {
                mQueue.shift();
                sendMessage();
            }
        };

        return {
            addToSendQueue: addToSendQueue
        };
    }
})();