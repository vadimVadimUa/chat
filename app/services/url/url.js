(function () {
    'use strict';

    angular
        .module('app')
        .factory('url', url);


    function url() {
        var server = "http://192.168.1.105:9080/WSChatWeb/";
        var url = {
            login: server + 'login_custom',
            socket: server+'wschat',
                                    // /messages/unread/{company}/{userId}
            messages_unread:server+'/messages/unread/'

            // user: server + 'user',
            // usersState: server + "usersState"
        };

        return url;
    }
})();