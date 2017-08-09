(function () {
    'use strict';

    angular
        .module('app')
        .controller('usersListCtrl', usersListCtrl);

    usersListCtrl.inject = ['$scope', '$rootScope','chatSocket','chatData','messagesData','requestFactory','url','usersData'];

    function usersListCtrl($scope,  $rootScope,chatData,messagesData,requestFactory,url,usersData) {

        var vm = this;
        //default get connection status from $rootScope.isConnected
        vm.isConnected = $rootScope.isConnected;
        vm.selectedUser = undefined;
        vm.TotalUsers = 0;
        vm.searchText = '';
        vm.selectUser = selectUser;
        vm.statusChange = statusChange;
        //temp user if not data
        vm.users = usersData.users;


        chatData.connectionError = function (message) {
            vm.isConnected = false;
        };

        vm.statusData = {
            selected: $rootScope.user.status,
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

        function statusChange(){
            chatData.changeStatusSelf(vm.statusData.selected);
        }
    }
})();