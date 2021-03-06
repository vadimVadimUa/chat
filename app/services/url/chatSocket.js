(function () {
    'use strict';


    angular.module('app')
        .factory('chatSocket',  chatSocket);

        chatSocket.$inject=['$rootScope'];

        function chatSocket($rootScope) {
            var stompClient;

            var wrappedSocket = {

                init: function(url) {
                    stompClient = Stomp.over(new SockJS(url));
                },
                connect: function(successCallback, errorCallback) {

                    stompClient.connect({}, function(frame) {
                        $rootScope.$evalAsync(function() {
                            successCallback(frame);
                        });
                    }, function(error) {
                        $rootScope.$evalAsync(function(){
                            errorCallback(error);
                        });
                    });
                },
                subscribe : function(destination, callback) {
                    stompClient.subscribe(destination, function(message) {
                        $rootScope.$evalAsync(function(){
                            callback(message);
                        });
                    });
                },
                send: function(destination, headers, object) {
                    stompClient.send(destination, headers, object);
                },
                disconnect: function () {
                    stompClient.disconnect();
                }
            };
            return wrappedSocket;
        }

})();