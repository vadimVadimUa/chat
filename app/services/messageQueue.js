(function () {
    'use strict';

    angular
        .module('app')
        .service('messagesQueue', messagesQueue);
    messagesQueue.$inject = ['chatData','messagesData'];
    function messagesQueue(chatData,messagesData) {
        var vm = this;
        var sendingState = false;
        var mQueue = [];

        /**
         *
         * @param messageObj - userId, index (in messagesData)
         */
        function addToSendQueue(messageObj){
            console.log(messageObj,"MESSAGE OBJ ------------",messageObj);
            if(messageObj.userId === undefined || messageObj.index === undefined) return;
            mQueue.push(messageObj);
            if(!sendingState){
                sendingState = true;
                sendMessage();
            }
        }

        function sendMessage(){
            if(mQueue[0]===undefined){
                sendingState = false;
                mQueue = [];
                return;
            }
            var tempMessage = messagesData.getMessageByIndex(mQueue[0].userId,mQueue[0].index);
            chatData.sendMessage({
                id: 0,
                to: tempMessage.to,
                from: tempMessage.from,
                content: tempMessage.content,
                companyId: tempMessage.companyId,
                delivered: false,
                date: tempMessage.date
            });
        }

        chatData.topicSend = function (submitMessage) {
            console.log("MESSAGE  IS DELIVERED -------------",submitMessage);
            if(submitMessage.id !== undefined && submitMessage.from !== undefined && submitMessage.to) {
                var tempMessage = messagesData.getMessageByIndex(mQueue[0].userId,mQueue[0].index);
                tempMessage.isSending = false;
                messagesData.setMessageByIndex(mQueue[0].userId,mQueue[0].index,tempMessage);
                sendingState = false;
                if(mQueue.length === 1){
                    mQueue = [];
                } else {
                    mQueue.shift();
                    sendMessage();
                }
            }
        };

        return {
            addToSendQueue: addToSendQueue
        };
    }
})();