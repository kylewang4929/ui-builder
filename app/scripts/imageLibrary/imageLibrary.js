"use strict";
angular.module('kyle.imageLibrary', [])
    .directive('imageLibrary', function (imageLibraryService) {
        return {
            restrict: 'A',
            templateUrl: 'views/imageLibrary/main.html',
            link: function (scope, element,attrs) {
                scope.cancel=function () {
                    imageLibraryService.hideDowm();
                };
                scope.confirm=function () {
                    imageLibraryService.hideDowm();                    
                };
                
                $(element).on("click",function(e){
                    if(element[0] === e.target){
                        imageLibraryService.hideDowm();                        
                    }
                });
                
            }
        };
    })
    .factory('imageLibraryService', function ($rootScope, $compile,$timeout) {
        var data={};
        
        var imageLibraryDom="";
        
        var handle={
            createDom:function () {
                var dom = $compile("<div class='my-modal-box' image-library></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                
                return dom;
            },
            showDom:function () {
                if(imageLibraryDom === ""){
                    imageLibraryDom=this.createDom();
                }else{
                    
                }
                //返回承诺
                $timeout(function(){
                    imageLibraryDom.addClass("open");                    
                },100);
            },
            hideDowm:function(data){
                imageLibraryDom.removeClass("open");
                //把data抛回去
            },
            removePlugin:function () {
                if(imageLibraryDom !== ""){
                    imageLibraryDom.remove();
                }
            }
        };
        
        return handle;
    });