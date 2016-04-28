"use strict";
angular.module('browserInfo',[])
    .factory('browserInfo', function () {
        var ua = USERAGENT.analyze(navigator.userAgent);
        var handle = {
            getOs: function () {
                return ua.os;
            }
        };
        return handle;
    });