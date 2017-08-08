(function () {
    'use strict';

    angular
        .module('app')
        .factory('url', url);


    function url() {
        var server = "http://192.168.1.108:9080/WSChatWeb/";
        var url = {
            login: server + 'login_custom',
            socket: '/WSChatWeb/wschat',
            messages_unread: server+'messages/unread/',
            message_read:server+'message/read',
            messages_read:server+'messages/read'
        };
        return url;
    }
})();