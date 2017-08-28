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


        // split string by words
        var splitByWords = function(s){
            var res = [];
            s.split(" ").forEach(function(w){
                res = res.concat(w.split('\n'));
            });
            return res;
        };

        /**
         Returns a fixed-length string containing words

         @param str - the string from which the substring will be taken
         @param start - the offset of the first character
         @param maxStringLength - the maximum returned string length
         @param isCutWord - cut word if its length more then max length
         */
        var substringByWords = function(str, start, maxStringLength, isCutWord){
            if(!str) return "";
            if(start >= 0 && maxStringLength > 0){
                var substr = str.substring(start);
                var words = splitByWords(substr);
                var len = 0;
                for (var i = 0; i < words.length; i++){
                    var l = len + words[i].length;
                    if(l <= maxStringLength){
                        len = l + 1;
                    }else {
                        break;
                    }
                }
                if(len > substr.length){
                    return substr;
                }
                if(isCutWord && len == 0) len = maxStringLength;
                return substr.substring(0,len);
            }
            throw new Error("Illegal arguments");
        };

        /**
         * Split by length without cutting the words
         *
         * @param str - string that will be split into a list of fixed-length strings
         * @param maxStringSize - maximum string length
         * @param isCutWord - cut word if its length more then max length
         * @return  array of strings
         */
        var splitByLengthAndWords = function(str, maxStringSize, isCutWord){
            var res = [], lines;
            if(!str) return res;
            var start = 0, len;
            do {
                var subLine = substringByWords(str,start,maxStringSize,isCutWord);
                len = subLine.length;
                if(len > 0) res.push(subLine.trim());
                start += len;
            }while (len > 0);

            return res;
        };


        vm.utils = {
            convertSymbolsToHTML: convertSymbolsToHTML,
            splitByLengthAndWords:splitByLengthAndWords,
            substringByWords:substringByWords
        };
    }
})();