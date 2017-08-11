(function () {
    'use strict';

    angular
        .module('app')
        .service('chatUtil', chatUtil);


    function chatUtil() {
        var vm = this;

        function convertSymbolsToHTML(stringToConvert) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };

            return stringToConvert.replace(/[&<>"']/g, function (m) {
                return map[m];
            });
        }
        vm.utils = {
            convertSymbolsToHTML: convertSymbolsToHTML
        };
    }
})();