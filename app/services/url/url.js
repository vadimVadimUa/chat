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
            messages_unread: server+'messages/unread',    //  /{companyId}/{userId}   -GET
            message_read:server+'message', //   /{compId}/read   -POST
            messages_read:server+'messages', //   /{compId}/read   -POST
            messages_history: server+'messages'  //  /{companyId}/history/{from}/{to}/{lastMessageId}   -GET
        };
        return url;
    }
})();