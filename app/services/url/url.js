(function () {
    'use strict';

    angular
        .module('app')
        .factory('url', url);


    function url() {
        var server = "http://localhost:9080/WSChatWeb/";
        var url = {
            login: server + 'login_custom',
            socket: server+'wschat',
            messages_unread: server+'messages/unread/',
            message_read:server+'/message/read',
            messages_read:server+'/messages/read'
        };

        return url;
    }
})();