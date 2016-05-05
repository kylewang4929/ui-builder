"use strict";
angular.module('insert.directive', [])
    .directive('insertEle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function mousedown(e) {
                    
                }
                function mousemove(e) {

                }
                function mouseup(e) {

                }
                
                $(element).on("mousedown",mousedown);
                $(document).on("mousemovie",mousemove);
                $(document).on("mouseup",mouseup);
                
            }
        };
    })