(function () {
    'use strict';

    angular
        .module('app')
        .factory('url', url);


    function url() {
        var server = "http://192.168.1.111:9080/WSChatWeb/";
        var url = {
            login: server + 'login_custom'
            // user: server + 'user',
            // usersState: server + "usersState"
        };

        return url;
    }
})();