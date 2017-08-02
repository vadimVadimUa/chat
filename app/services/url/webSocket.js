(function () {
    'use strict';

    angular
        .module('app')
        .factory('webSocketRequest', webSocketRequest);
    webSocketRequest.inject = ['$websocket', 'url', '$timeout', '$rootScope'];

    function webSocketRequest($websocket, url, $timeout, $rootScope) {


        var userStateCollection = {};
        //$timeout(changeUserStatus, 3000);

        function changeUserStatus() {
            userStateCollection = {id: 3, status: '1'};
            $rootScope.$broadcast("updatesUserStatus");
        }


         var userCollection = [];
        userCollection = [
            {id: 1, name: 'Ivan', status: '3', newMessage: false},
            {id: 2, name: 'Oleg', status: '2', newMessage: true},
            {id: 3, name: 'Kosty', status: '3', newMessage: false},
            {id: 4, name: 'Ivan', status: '1', newMessage: false},
            {id: 5, name: 'Ivan', status: '3', newMessage: true},
            {id: 7, name: 'Kosty', status: '3', newMessage: false},
            {id: 8, name: 'Ivan', status: '3', newMessage: false},
            {id: 10, name: 'Kosty', status: '3', newMessage: false},
            {id: 11, name: 'Ivan', status: '3', newMessage: false},
            {id: 13, name: 'Kosty', status: '3', newMessage: false}
        ];


        return {
            getUsers: userCollection ,
            getUserStateCollection: function (){return userStateCollection}
        };

    }
})();