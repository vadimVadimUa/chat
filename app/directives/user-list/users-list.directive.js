(function() {
    'use strict';

    angular
        .module('app')
        .directive('usersList', usersList);

    usersList.inject = [''];
    function usersList() {

        return {
            bindToController: true,
            templateUrl: "directives/user-list/users-list.html",
            controller: "usersListCtrl",
            controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            scope: {
            }
        };

        function link(scope, element, attrs) {

        }
    }
})();