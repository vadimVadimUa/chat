(function () {
    'use strict';

    angular
        .module('app')
        .service('usersData', usersData);
    usersData.$inject = ['$rootScope','chatData','messagesData','requestFactory'];
    function usersData($rootScope,chatData,messagesData,requestFactory) {
        var vm = this;

        vm.users = [
            {
                userId:0,
                userName: 'test',
                compId: '0013',
                status:0
            },
            {
                userId:1,
                userName: 'test2',
                compId: '0013',
                status:1
            }
            ,
            {
                userId:4,
                userName: 'test4',
                compId: '0013',
                status:2
            }
        ];




        chatData.login = function(user){
            console.log("RESIVE 'login' event:",user);
            $rootScope.$evalAsync(
                vm.users[user.userId]=user );
        };
        chatData.logout = function (user) {
            console.log("RESIVE 'logout' event:",user);
            $rootScope.$evalAsync(
                vm.users[user.userId]=user );
        };

        chatData.changeStatus = function (usr) {
            console.log("RESIVE 'changeStatus' event:",usr);
            $rootScope.$evalAsync(
                vm.users[usr.userId].status = usr.status);
        };

        chatData.chat = function (users) {
            console.log("RESIVE 'chat' event:",users);

            //save users to array by index - id user
            users.forEach(function (item, key, array) {
                if (item.userId != $rootScope.user.userId) {
                    item.countUnread = [];
                    vm.users[item.userId] = item;
                }
            });
            $rootScope.$evalAsync(true);
            getUnreadMessages();
        };

        function getUnreadMessages() {
            requestFactory.requestGet(url.messages_unread + $rootScope.user.compId + '/' + $rootScope.user.userId)
                .then(function (gooddata) {
                    processMessages(gooddata.data);
                }, function (errordata) {
                });
        }
        function processMessages(messagesArr) {
            if (!Array.isArray(messagesArr)) return;
            console.log('RECIVE MESSAGES UNREAD : ', messagesArr);

            $rootScope.$evalAsync(function () {
                for (var i = 0; i < messagesArr.length; i++) {
                    messagesArr[i].userFlag = false;
                    messagesData.putMessageByUserId(messagesArr[i].from, messagesArr[i]);
                    vm.users[messagesArr[i].from].countUnread.push(messagesArr[i].id);
                }
            });
        }

        // this.users = [];
    }
})();