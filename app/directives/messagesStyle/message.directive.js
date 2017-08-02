(function() {
    'use strict';

    angular
        .module('app')
        .directive('messages', messages);

    messages.inject = [''];
    function messages() {

        return {
            bindToController: true,
            templateUrl: "directives/messagesStyle/message.html",
            controller: "usersListCtrl",
            controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            replace:true
        };

        function link(scope, element, attrs) {

        }
    }
})();