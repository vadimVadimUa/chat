(function () {
    'use strict';

    angular
        .module('app')
        .service('usersData', usersData);
    usersData.$inject = ['$rootScope', 'chatData', 'messagesData', 'requestFactory', 'url'];
    function usersData($rootScope, chatData, messagesData, requestFactory, url) {
        var vm = this;

        vm.users = [];

        chatData.login = function (user) {
            console.log("RESIVE 'login' event:", user);
            $rootScope.$evalAsync(
                function () {
                    if (user.userId !== $rootScope.user.userId) {
                        user.countUnread = [];
                        vm.users[user.userId] = user;
                    }
                }
            );
        };
        chatData.logout = function (user) {
            console.log("RESIVE 'logout' event:", user);
            $rootScope.$evalAsync(
                function () {
                    if (user.userId !== $rootScope.user.userId) {
                        user.countUnread = [];
                        vm.users[user.userId] = user;
                    }
                });
        };

        chatData.changeStatusUser = function (usr) {
            console.log("RESIVE 'changeStatus' event:", usr);
            $rootScope.$evalAsync(
                function () {
                    if ($rootScope.user.userId !== usr.userId) {
                        vm.users[usr.userId].status = usr.status;
                    }

                });
        };

        chatData.chat = function (users) {
            console.log("RESIVE 'chat' event:", users);

            //save users to array by index - id user
            $rootScope.$evalAsync(function(){
                users.forEach(function (item, key, array) {
                    if (item.userId !== $rootScope.user.userId) {
                        item.countUnread = [];
                        vm.users[item.userId] = item;
                    }
            });});
            getUnreadMessages();
        };

        function getUnreadMessages() {
            requestFactory.requestGet(url.messages_unread +'/'+ $rootScope.user.compId + '/' + $rootScope.user.userId)
                .then(function (gooddata) {
                    processMessages(gooddata.data);
                }, function (errordata) {
                });
        }

        function processMessages(messagesArr) {
            if (!Array.isArray(messagesArr)) {
                return;
            }
            console.log('RECIVE MESSAGES UNREAD : ', messagesArr);
            $rootScope.$evalAsync(function () {
                for (var i = 0; i < messagesArr.length; i++) {
                    if(vm.users[messagesArr[i].from] !== undefined) {
                        messagesArr[i].userFlag = false;
                        messagesData.putMessageByUserId(messagesArr[i].from, messagesArr[i]);
                        vm.users[messagesArr[i].from].countUnread.push(messagesArr[i]);
                        messagesData.setMessageForLoadMore(messagesArr[i].from,messagesArr[i]);
                    }
                }
            });
        }
    }
})();