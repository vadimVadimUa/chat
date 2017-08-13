
(function() {
    'use strict';

    angular
        .module('app').directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                var code = event.keyCode || event.which;
                if (code === 13) {
                    if (!event.shiftKey) {
                        scope.$evalAsync(function () {
                            scope.$eval(attrs.ngEnter);
                            event.preventDefault();
                        });
                    }
                }
            });
        };
    });

})();