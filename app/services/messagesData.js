(function () {
    'use strict';

    angular
        .module('app')
        .factory('messagesData', messagesData);
            messagesData.$inject = [];
            function messagesData() {
                var vm = this;
                // key is user id
                var messageArr = [];
                var unreadMessage = [];


                putMessageByUserId(0,{
                    id: 13,
                    to: 4,
                    from: 0,
                    content: 'ddddd',
                    companyId: '00013',
                    delivered: false,
                    date: 1500908062800,
                    userFlag: false
                });
                putMessageByUserId(1,{
                    id: 13,
                    to: 4,
                    from: 1,
                    content: 'ffffff',
                    companyId: '00013',
                    delivered: false,
                    date: 1500908062800,
                    userFlag: false
                });

                function getUnreadByUserId(userId) {
                    return unreadMessage[userId] || 0;
                }

                function setUnreadByUserId(userId,count) {
                        vm.service.setUnreadFunct(userId,count);
                        unreadMessage[userId]=count;
                }

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
                    getUnreadByUserId: getUnreadByUserId,
                    setUnreadByUserId:  setUnreadByUserId,
                    setUnreadFunct : function (count) {},
                }

                return vm.service
            }
})();