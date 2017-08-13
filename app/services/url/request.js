(function () {
    'use strict';

    // angular
    //     .module('app').factory('socketFact', function (socketFactory) {
    //     return socketFactory({
    //         url: 'http://192.168.1.111:9080/WSChatWeb/wschat'
    //     });
    // });

    angular
        .module('app')
        .factory('requestFactory', requestFactory);

    requestFactory.$inject = ['$http', '$q'];

    function requestFactory($http, $q) {
        return {
            requestGet: requestGet,
            requestPost: requestPost,
            requestPostData: requestPostData
        };
        function requestGet(urlPath, data) {
            var defer = $q.defer();
            console.log(data);
            $http({
                method: 'GET',
                url: urlPath,
                data: data
            }).then(function (dataResult) {
                defer.resolve(dataResult);
            },function (dataError) {
                defer.reject(dataError);
            });
            return defer.promise;
        }
        function requestPost(urlPath, data) {
            var defer = $q.defer();
            console.log(data);
            $http({
                method: 'POST',
                url: urlPath,
                params: data,
                headers: {
                    // 'Access-Control-Allow-Origin': 'http://192.168.1.111:9080/',
                    // 'Content-Type': 'application/json; charset=utf-8'

                }
            }).then(function (dataResult) {
                defer.resolve(dataResult);
            },function (dataError) {
                defer.reject(dataError);
            });
            return defer.promise;
        }

        function requestPostData(urlPath, data) {
            var defer = $q.defer();
            console.log(data);
            $http({
                method: 'POST',
                url: urlPath,
                data: data,
                headers: {
                    // 'Access-Control-Allow-Origin': 'http://192.168.1.111:9080/',
                    // 'Content-Type': 'application/json; charset=utf-8'

                }
            }).then(function (dataResult) {
                defer.resolve(dataResult);
            },function (dataError) {
                defer.reject(dataError);
            });
            return defer.promise;
        }
    }
})();