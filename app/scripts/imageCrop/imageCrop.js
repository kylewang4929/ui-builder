"use strict";
angular.module('kyle.imageCrop', [])
    .directive('imageCrop', function (imageCropService) {
        return {
            restrict: 'A',
            template:'<div class="cover">'+
            '<div class="crop-box"><div class="crop-image"></div></div>'+
            '</div>',
            link: function (scope, element, attrs) {
                var activeEle=imageCropService.getActiveEle();
                
                var imageWidth=parseFloat(activeEle.border.width)/parseFloat(activeEle.cropInfo.width);
                var imageHeight=parseFloat(activeEle.border['min-height'])/parseFloat(activeEle.cropInfo.height);
                
                //绘制相应的图片 包括
                $(element).css({
                    'background-image':'url("'+activeEle.url+'")',
                    'background-size':imageWidth+"px "+imageHeight+"px",
                    'width':imageWidth,
                    'height':imageHeight,
                    'left':activeEle.position.left,
                    'top':activeEle.position.top
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
                console.log(ele);
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