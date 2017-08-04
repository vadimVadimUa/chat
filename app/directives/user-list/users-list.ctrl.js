(function () {
    'use strict';

    angular
        .module('app')
        .controller('usersListCtrl', usersListCtrl);

    usersListCtrl.inject = ['$scope', 'webSocketRequest', '$rootScope','chatSocket','chatData'];

    function usersListCtrl($scope, webSocketRequest, $rootScope,chatData) {

        var vm = this;
        //default get connection status from $rootScope.isConnected
        vm.isConnected = $rootScope.isConnected;
        vm.selectedUser = undefined;
        vm.TotalUsers = 0;
        vm.searchText = '';
        vm.selectUser = selectUser;
        vm.statusChange = statusChange;
        //temp user if not data
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



        chatData.login = function(message){
            console.log("RESIVE 'login' event:",message);
        };
        chatData.logout = function (message) {
            console.log("RESIVE 'logout' event:",message);
        };
        chatData.reply = function (message) {
            console.log("RESIVE 'reply' event:",message);
        };
        chatData.chat = function (users) {
            console.log("RESIVE 'chat' event:",users);
            vm.users = users.filter(function (item) {
               return item.userId !== $rootScope.user.userId;
            });
        };
        chatData.changeStatus = function (usr) {
            console.log("RESIVE 'changeStatus' event:",usr);
                for(var i = 0; i < vm.users.length; i++) {
                    if (vm.users[i].userId === usr.userId) {
                        console.log('fuund');
                        vm.users[i].status = usr.status;
                        break;
                    }
                }
        };

        chatData.connectionError = function (message) {
            vm.isConnected = false;
        };
        $rootScope.$on("updatesUserStatus",function(){
            var res = webSocketRequest.getUserStateCollection();
            console.log(res);
            for(var i = 0; i< vm.users.length; i++){
                if(vm.users[i].id === res.id){
                    vm.users[i].status = res.status;
                }
            }
        });

        vm.statusData = {
            selected: '0',
            availableOptions: [
                {id: '0', status: 'online'},
                {id: '1', status: 'not here'},
                {id: '2', status: 'offline'}
            ]
        };

        function selectUser(user) {
            vm.selectedUser = user.userId;
            user.newMessage = false;
            $scope.$emit('selectUser', {user: user});
        }

        // function userStateOnchange() {
        //     for (var j = 0; j < vm.users.Count; j++) {
        //         // при изменении состояния юзера ищем его по имени и изменяем его состояние
        //         if (vm.usersState[j].id === vm.usersState[i].id) {
        //             vm.usersState[j].state = vm.usersState[i].state;
        //             vm.usersState.splice(j, 1);
        //         }
        //     }
        // }
        function statusChange(){
           chatData.changeStatusSelf(vm.statusData.selected);
        }
    }
})();