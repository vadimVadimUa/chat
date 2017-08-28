(function () {
    'use strict';

    angular
        .module('app')
        .controller('usersListCtrl', usersListCtrl);

    usersListCtrl.inject = ['$scope', '$rootScope','chatChildWindowService'];

    function usersListCtrl($scope, $rootScope, chatChildWindowService) {

        var vm = this;
        vm.selectedUser = undefined;
        vm.TotalUsers = 0;
        vm.searchText = '';
        vm.selectUser = selectUser;
        vm.statusChange = statusChange;
        vm.users = chatChildWindowService.usersData ? chatChildWindowService.usersData.users:[];

        vm.statusData = {
            selected: $rootScope.user?$rootScope.user.status:'',
            availableOptions: [
                {id: '0', status: 'online'},
                {id: '1', status: 'not here'},
                {id: '2', status: 'don\'t disturb'}
            ]
        };

        //its event for case if need select user when click message from parent
        chatChildWindowService.sendEvent('listUsersIsReady',{});

        //if select user from parent window
        $rootScope.$on('selectUser',function (event,data) {
            vm.selectedUser = data.user.userId;
        });

        function selectUser(user) {
            vm.selectedUser = user.userId;
            user.newMessage = false;
            $scope.$emit('selectUser', {user: user});
        }

        function statusChange(){
            $rootScope.user.status = vm.statusData.selected;
            chatChildWindowService.sendEvent('updateView',{});
            chatChildWindowService.chatData.changeStatusSelf(vm.statusData.selected);
        }
    }
})();