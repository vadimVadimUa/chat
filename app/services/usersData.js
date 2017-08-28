(function () {
    'use strict';

    angular
        .module('app')
        .service('usersData', usersData);
    usersData.$inject = ['$rootScope', 'chatData', 'messagesData', 'requestFactory', 'url'];
    function usersData($rootScope, chatData, messagesData, requestFactory, url) {
        var vm = this;

        vm.users = [];
        //object for save index users array, by id
        var users_id = {};

        vm.getUserByID = getUserByID;
        vm.setUserByID = setUserByID;

        chatData.login = function (user) {
            console.log("RESIVE 'login' event:", user);
            $rootScope.$evalAsync(
                function () {
                    if (user.userId !== $rootScope.user.userId) {
                        user.countUnread = [];
                        // vm.users[user.userId] = user;
                        vm.setUserByID(user,user.userId);
                        $rootScope.$broadcast('updateView',{});
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
                        // vm.users[user.userId] = user;
                        vm.setUserByID(user,user.userId);
                        $rootScope.$broadcast('updateView',{});
                    }
                });
        };

        chatData.changeStatusUser = function (usr) {
            console.log("RESIVE 'changeStatus' event:", usr);
            $rootScope.$evalAsync(
                function () {
                    if ($rootScope.user.userId !== usr.userId) {
                        // vm.users[usr.userId].status = usr.status;
                        vm.getUserByID(usr.userId).status = usr.status;
                    }
                    $rootScope.$broadcast('updateView',{});
                });
        };

        chatData.chat = function (users) {
            console.log("RESIVE 'chat' event:", users);

            //save users to array by index - id user
            $rootScope.$evalAsync(function(){
                users.forEach(function (item, key, array) {
                    if (item.userId !== $rootScope.user.userId) {
                        item.countUnread = [];
                        // vm.users[item.userId] = item;
                        vm.setUserByID(item,item.userId);
                    }

            });
            $rootScope.$broadcast('userIsLoading',vm.users);});
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
                $rootScope.$broadcast('unreadMessageIsLoaded',{});
                return;
            }
            console.log('RECIVE MESSAGES UNREAD : ', messagesArr);
            $rootScope.$evalAsync(function () {
                $rootScope.user.unread = 0;
                for (var i = 0; i < messagesArr.length; i++) {
                    if(vm.users[messagesArr[i].from] !== undefined) {
                        messagesArr[i].userFlag = false;
                        messagesData.putMessageByUserId(messagesArr[i].from, messagesArr[i]);
                        vm.users[messagesArr[i].from].countUnread.push(messagesArr[i]);
                        messagesData.setMessageForLoadMore(messagesArr[i].from,messagesArr[i]);
                        $rootScope.user.unread+=1;
                    }
                }
                $rootScope.$broadcast('updateView',{});
                $rootScope.$broadcast('unreadMessageIsLoaded',{});
            });
        }

        function getUserByID(id){
            if(users_id[id]!= undefined){
                return vm.users[users_id[id]];
            }
        }

        function setUserByID(user,id){
            if(users_id[id]==undefined){
                vm.users.push(user);
                users_id[id]=vm.users.length-1;
            } else {
                vm.users[users_id[id]]=user;
        }
    }
    }
})();