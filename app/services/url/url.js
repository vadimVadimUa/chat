(function () {
    'use strict';

    angular
        .module('app')
        .factory('url', url);

    /**
     *
     * @returns
     */

    function url() {
        // var server = "http://localhost:9080/WSChatWeb/";
        var server = "http://localhost:9080/";
        var url = {
            login: server + 'login_custom',
            // socket: '/WSChatWeb/wschat',
            socket: server+'wschat',
            messages_unread: server+'messages/unread',    //  /{companyId}/{userId}   -GET
            message_read:server+'message', //   /{compId}/read   -POST
            messages_read:server+'messages', //   /{compId}/read   -POST
            messages_history: server+'messages'  //  /{companyId}/history/{from}/{to}/{lastMessageId}   -GET
        };
        return url;
    }
})();