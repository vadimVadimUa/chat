(function () {
    'use strict';

    angular
        .module('app')
        .controller('usersListCtrl', usersListCtrl);

    usersListCtrl.inject = ['$scope', 'webSocketRequest', '$rootScope'];

    function usersListCtrl($scope, webSocketRequest, $rootScope) {
        var vm = this;

        vm.selectedUser = 0;
        vm.TotalUsers = 10;
        vm.searchText = '';
        vm.selectUser = selectUser;
        vm.statusChange = statusChange;
        //получение всех юзеров
        vm.users = webSocketRequest.getUsers;

        $rootScope.$on("updatesUserStatus",function(){
            var res = webSocketRequest.getUserStateCollection();
            console.log(res);
            for(var i = 0; i< vm.users.length; i++){
                if(vm.users[i].id === res.id){
                    vm.users[i].status = res.status;
                }
            }
        });

        vm.data = {
            selected: '1',
            availableOptions: [
                {id: '1', status: 'online'},
                {id: '2', status: 'not here'},
                {id: '3', status: 'offline'}
            ]
        };


        function selectUser(user) {
            vm.selectedUser = user.id;
            user.newMessage = false;

            $scope.$emit('selectUser', {index: user.id});

        }

        function userStateOnchange() {
            for (var j = 0; j < vm.users.Count; j++) {
                // при изменении состояния юзера ищем его по имени и изменяем его состояние
                if (vm.usersState[j].id === vm.usersState[i].id) {
                    vm.usersState[j].state = vm.usersState[i].state;
                    vm.usersState.splice(j, 1);
                }
            }
        }
        function statusChange(){
            console.log( vm.data.selected);
        }
    }
})();