"use strict";
angular.module('kyle.imageCrop', [])
    .directive('imageCrop', function (imageCropService) {
        return {
            restrict: 'A',
            template:'<div class="cover">'+
            '</div>'+
            '<div class="crop-box">'+
            '<div class="handle left"></div>'+
            '<div class="handle right"></div>'+
            '<div class="handle top"></div>'+
            '<div class="handle bottom"></div>'+
            '<div class="handle left-top"><div class="vertical"></div><div class="horizontal"></div></div>'+
            '<div class="handle right-top"><div class="vertical"></div><div class="horizontal"></div></div>'+
            '<div class="handle left-bottom"><div class="vertical"></div><div class="horizontal"></div></div>'+
            '<div class="handle right-bottom"><div class="vertical"></div><div class="horizontal"></div></div>'+
            '</div>',
            link: function (scope, element, attrs) {
                var activeEle=imageCropService.getActiveEle();
                
                var imageWidth=parseFloat(activeEle.border.width)/parseFloat(activeEle.cropInfo.width);
                var imageHeight=parseFloat(activeEle.border['min-height'])/parseFloat(activeEle.cropInfo.height);
                
                //绘制相应的图片 包括
                $(element).css({
                    
                    'width':imageWidth,
                    'height':imageHeight,
                    'left':activeEle.position.left,
                    'top':activeEle.position.top
                });
                
                $(element).find('.cover').css({
                    'width':"100%",
                    'height':"100%",
                    'left':"0px",
                    'top':"0px",
                    'background-image':'url("'+activeEle.url+'")',
                    'background-size':imageWidth+"px "+imageHeight+"px"
                });
                
                //设置crop－box
                
                $(element).find('.crop-box').css({
                    'width':parseFloat(activeEle.cropInfo.width)*100+"%",
                    'height':parseFloat(activeEle.cropInfo.height)*100+"%",
                    'left':"0px",
                    'top':"0px",
                    'background-image':'url("'+activeEle.url+'")',
                    'background-size':imageWidth+"px "+imageHeight+"px"
                });
                
                
            }
        }
    })
    .factory("imageCropService",function (eleMenuServices,$compile,$rootScope) {
        var activeEle={};
        var activeEleDom="";
        var menuDom="";
        
        
        var handle={
            openCrop:function (ele) {
                activeEle=ele;
                //先隐藏原元素
                activeEleDom=$("#"+activeEle.ID).hide();
                eleMenuServices.hideDom();
                //插入新的元素 用来裁剪
                menuDom='<div image-crop class="crop-image-box"></div>';
                menuDom = $compile(menuDom)($rootScope);
                
                //找到当前元素的上一个session
                activeEleDom.parents(".ele-session").eq(0).append(menuDom);
            },
            getActiveEle:function(){
                return activeEle;
            }
        };
        return handle;
    });