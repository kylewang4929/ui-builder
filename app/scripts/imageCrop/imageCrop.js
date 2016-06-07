"use strict";
angular.module('kyle.imageCrop', [])
    .directive('imageCrop', function (imageCropService,$timeout) {
        return {
            restrict: 'A',
            template: '<div class="menu z-depth-2">' +
            '<div class="slide-box" ng-model="imageSlide.value" text-editor-slider slide-type="size" max-value="400"><div class="slide-value">{{textData.value.size}}</div><div class="slide-line z-depth-1"><div class="slide-point z-depth-1"></div></div></div>' +
            '<div class="confirm-button" ng-click="crop()"><lx-button lx-color="blue">裁 剪</lx-button></div>' +
            '</div>' +
            '<div class="cover">' +
            '</div>' +
            '<div class="image-cover"></div>' +
            '<div class="crop-box" onmousedown="event.preventDefault()">' +
            '<div class="handle left" direction="left"></div>' +
            '<div class="handle right" direction="right"></div>' +
            '<div class="handle top" direction="top"></div>' +
            '<div class="handle bottom" direction="bottom"></div>' +
            '<div class="handle left-top" direction="left-top"><div class="vertical"></div><div class="horizontal"></div></div>' +
            '<div class="handle right-top" direction="right-top"><div class="vertical"></div><div class="horizontal"></div></div>' +
            '<div class="handle left-bottom" direction="left-bottom"><div class="vertical"></div><div class="horizontal"></div></div>' +
            '<div class="handle right-bottom" direction="left-bottom"><div class="vertical"></div><div class="horizontal"></div></div>' +
            '</div>',
            link: function (scope, element, attrs) {

                scope.imageSlide = {
                    value: 100
                };
                
                var coverDom=$(element).find('.cover');
                var imageCoverDom=$(element).find('.image-cover');
                var coverBox=$(element).find('.crop-box');
                
                /**
                 * 裁剪元素
                 */
                scope.crop=function(){
                    //主要是更新 activeEle.cropInfo background-position  background-size
                    var backgroundSize=coverDom.css('background-size');
                    var backgroundPosition={
                        x:coverBox.get(0).offsetLeft,
                        y:coverBox.get(0).offsetTop
                    };
                    //裁剪的区域占的比例
                    
                    var backgroundSizeValue=backgroundSize.split(" ");
                    
                    var cropWidth=coverBox.get(0).offsetWidth;
                    var cropHeight=coverBox.get(0).offsetHeight;
                    
                    var cropInfo={
                        height: (cropHeight/parseFloat(backgroundSizeValue[1])).toFixed(2),
                        width : (cropWidth/parseFloat(backgroundSizeValue[0])).toFixed(2)
                    };
                    
                    var updateData={
                        backgroundSize:backgroundSize,
                        backgroundPosition:backgroundPosition,
                        cropInfo:cropInfo
                    }
                    
                    imageCropService.updateCrop(updateData);
                    
                }

                scope.$watch("imageSlide.value", function () {
                    //更新尺寸
                    imageWidth = parseFloat(activeEle.imageSize.width) * parseFloat(scope.imageSlide.value) / 100;
                    imageHeight = parseFloat(activeEle.imageSize.height) * parseFloat(scope.imageSlide.value / 100);
                    
                    //有一种情况是缩小的时候被截取框挡住了 这个时候应该停止缩小
                    if(imageWidth < coverBox.get(0).offsetLeft+coverBox.get(0).offsetWidth){
                        imageWidth=coverBox.get(0).offsetLeft+coverBox.get(0).offsetWidth;
                        //重新计算比例
                        scope.imageSlide.value=imageWidth*100/parseFloat(activeEle.imageSize.width);                                          
                    }
                    if(imageHeight < coverBox.get(0).offsetTop+coverBox.get(0).offsetHeight){
                        imageHeight=coverBox.get(0).offsetTop+coverBox.get(0).offsetHeight;   
                        //重新计算比例
                        scope.imageSlide.value=imageHeight*100/parseFloat(activeEle.imageSize.height);                          
                    }
                    
                    
                    
                    $(element).css({
                        'width': imageWidth,
                        'height': imageHeight
                    });
                    coverDom.css({
                        'background-size': imageWidth + "px " + imageHeight + "px"
                    });
                    imageCoverDom.css({
                        'background-size': imageWidth + "px " + imageHeight + "px"
                    });
                    cropImage(coverBox.get(0).offsetLeft,coverBox.get(0).offsetTop , coverBox.get(0).offsetWidth, coverBox.get(0).offsetHeight);                    
                });

                /**
                 * cropInfo 里面的比例是指元素大小比图片大小
                 */

                var activeEle = imageCropService.getActiveEle();

                var imageWidth = parseFloat(activeEle.border.width) / parseFloat(activeEle.cropInfo.width);
                var imageHeight = parseFloat(activeEle.border['min-height']) / parseFloat(activeEle.cropInfo.height);

                /**
                 * 计算图片的缩放比例
                 * background-size 比 原图的尺寸
                 */
                var currentImageSize=activeEle.style['background-size'].split(" ");
                scope.imageSlide.value = parseFloat(currentImageSize[0])/parseFloat(activeEle.imageSize.width)*100;

                //绘制相应的图片 包括
                $(element).css({
                    'width': imageWidth,
                    'height': imageHeight,
                    'left': activeEle.position.left,
                    'top': activeEle.position.top
                });

                coverDom.css({
                    'width': "100%",
                    'height': "100%",
                    'left': "0px",
                    'top': "0px",
                    'background-image': 'url("' + activeEle.url + '")',
                    'background-size': imageWidth + "px " + imageHeight + "px"
                });
                imageCoverDom.css({
                    'width': "100%",
                    'height': "100%",
                    'left': "0px",
                    'top': "0px",
                    'background-image': 'url("' + activeEle.url + '")',
                    'background-size': imageWidth + "px " + imageHeight + "px"
                });

                //设置crop－box

                coverBox.css({
                    'width': parseFloat(activeEle.border.width),
                    'height': parseFloat(activeEle.border['min-height']),
                    'left': "0px",
                    'top': "0px"
                });

                var par = {
                    dragFlag: false,
                    moveFlag: false,
                    eleWidth: 0,
                    eleHeight: 0,
                    eleLeft: 0,
                    eleTop: 0,
                    x: 0,
                    y: 0
                };

                //绑定拖拽的方法
                $(element).find(".handle").on('mousedown', function (e) {
                    par.dragFlag = true;
                    //获取当前元素的尺寸
                    var cropDom = $(element).find('.crop-box');
                    par.eleWidth = cropDom.get(0).offsetWidth;
                    par.eleHeight = cropDom.get(0).offsetHeight;
                    par.eleLeft = parseFloat(cropDom.get(0).offsetLeft);
                    par.eleTop = parseFloat(cropDom.get(0).offsetTop);
                    //记录选中的是哪个
                    par.direction = $(e.currentTarget).attr('direction');

                    //记录起始坐标
                    par.x = e.clientX;
                    par.y = e.clientY;
                });

                coverBox.on('mousedown', function (e) {
                    if ($(e.target).hasClass('handle') || $(e.target.parentNode).hasClass('handle')) {
                        return;
                    }

                    par.moveFlag = true;

                    //获取当前元素的尺寸
                    var cropDom = $(element).find('.crop-box');
                    par.eleWidth = cropDom.get(0).offsetWidth;
                    par.eleHeight = cropDom.get(0).offsetHeight;
                    par.eleLeft = parseFloat(cropDom.get(0).offsetLeft);
                    par.eleTop = parseFloat(cropDom.get(0).offsetTop);

                    //记录起始坐标
                    par.x = e.clientX;
                    par.y = e.clientY;

                });


                /**
                * 调整被裁减图片的选区
                */
                function cropImage(left, top, width, height) {
                    /**
                     * 这个时候需要重绘背景
                     * rect(0px 102px 101px 0px);
                     * top-start left-end top-end left-start
                     */

                    var imageDom = $(element).find('.image-cover');
                    imageDom.css({ 'clip': 'rect(' + top + 'px,' + (left + width) + 'px,' + (top + height) + 'px,' + left + 'px)' });

                }

                /**
                 * 尺寸判断
                 * 宽高不得小于100
                 * 不符合条件返回false
                 */
                function sizeLimit(width, height) {
                    if (width < 80 || height < 80) {
                        return false;
                    } else {
                        return true;
                    }
                };

                /**
                 * 位置限制
                 */
                function positionLimit(dom, left, top, width, height, boxWidth, boxHeight) {
                    if (left < 0 && top < 0) {
                        dom.css({ left: 0, top: 0 });
                        cropImage(0, 0, width, height);
                        return 'left-top';
                    }

                    if (left < 0 && top + height > boxHeight) {
                        dom.css({ left: 0, top: boxHeight - height });
                        cropImage(0, boxHeight - height, width, height);
                        return 'left-bottom';
                    }

                    if (left + width > boxWidth && top < 0) {
                        dom.css({ left: boxWidth - width, top: 0 });
                        cropImage(boxWidth - width, 0, width, height);
                        return 'right-top';
                    }

                    if (left + width > boxWidth && top + height > boxHeight) {
                        dom.css({ left: boxWidth - width, top: boxHeight - height });
                        cropImage(boxWidth - width, boxHeight - height, width, height);
                        return 'right-bottom';
                    }

                    if (left < 0) {
                        dom.css({ left: 0, top: top });
                        cropImage(0, top, width, height);
                        return 'left';
                    }
                    if (top < 0) {
                        dom.css({ left: left, top: 0 });
                        cropImage(left, 0, width, height);
                        return 'top';
                    }
                    if (left + width > boxWidth) {
                        dom.css({ left: boxWidth - width, top: top });
                        cropImage(boxWidth - width, top, width, height);
                        return 'right';
                    }
                    if (top + height > boxHeight) {
                        dom.css({ left: left, top: boxHeight - height });
                        cropImage(left, boxHeight - height, width, height);
                        return 'bottom';
                    }
                    return true;
                };


                /**
                 * 重新计算元素大小
                 */

                function resizeEle(dom, eleInfo, offsetInfo, direction) {

                    function left(dom, eleInfo, offsetInfo) {

                        var left = 0;
                        var width = 0;

                        if (eleInfo.eleLeft + offsetInfo.x <= 0) {
                            offsetInfo.x = -eleInfo.eleLeft;

                            left = eleInfo.eleLeft + offsetInfo.x;
                            width = eleInfo.eleWidth - offsetInfo.x;

                            dom.css({ "width": width });
                            dom.css({ "left": left });

                            cropImage(left, eleInfo.eleTop, width, eleInfo.eleHeight);

                            return;
                        }

                        if (!sizeLimit(eleInfo.eleWidth - offsetInfo.x)) {
                            return false;
                        }

                        left = eleInfo.eleLeft + offsetInfo.x;
                        width = eleInfo.eleWidth - offsetInfo.x;

                        dom.css({ "width": width });
                        dom.css({ "left": left });

                        cropImage(left, eleInfo.eleTop, width, eleInfo.eleHeight);

                    };
                    function right(dom, eleInfo, offsetInfo) {

                        var width = 0;

                        if (eleInfo.eleLeft + eleInfo.eleWidth + offsetInfo.x >= imageWidth) {

                            offsetInfo.x = imageWidth - eleInfo.eleLeft - eleInfo.eleWidth;

                            width = eleInfo.eleWidth + offsetInfo.x;

                            dom.css({ "width": width });

                            cropImage(eleInfo.eleLeft, eleInfo.eleTop, width, eleInfo.eleHeight);

                            return;
                        }

                        if (!sizeLimit(eleInfo.eleWidth + offsetInfo.x)) {
                            return false;
                        }

                        width = eleInfo.eleWidth + offsetInfo.x;

                        dom.css({ "width": width });

                        cropImage(eleInfo.eleLeft, eleInfo.eleTop, width, eleInfo.eleHeight);

                    };
                    function top(dom, eleInfo, offsetInfo) {

                        var height = 0;
                        var top = 0;

                        if (eleInfo.eleTop + offsetInfo.y <= 0) {
                            offsetInfo.y = -eleInfo.eleTop;

                            height = eleInfo.eleHeight - offsetInfo.y;
                            top = eleInfo.eleTop + offsetInfo.y;

                            dom.css({ "height": height });
                            dom.css({ "top": top });

                            cropImage(eleInfo.eleLeft, top, eleInfo.eleWidth, height);

                            return;
                        }

                        if (!sizeLimit(eleInfo.eleHeight - offsetInfo.y)) {
                            return false;
                        }

                        height = eleInfo.eleHeight - offsetInfo.y;
                        top = eleInfo.eleTop + offsetInfo.y;

                        dom.css({ "height": height });
                        dom.css({ "top": top });

                        cropImage(eleInfo.eleLeft, top, eleInfo.eleWidth, height);

                    };
                    function bottom(dom, eleInfo, offsetInfo) {

                        var height = 0;

                        if (eleInfo.eleTop + eleInfo.eleHeight + offsetInfo.y >= imageHeight) {

                            offsetInfo.y = imageHeight - eleInfo.eleTop - eleInfo.eleHeight;

                            height = eleInfo.eleHeight + offsetInfo.y;

                            dom.css({ "height": height });

                            cropImage(eleInfo.eleLeft, eleInfo.eleTop, eleInfo.eleWidth, height);

                            return;
                        }

                        if (!sizeLimit(eleInfo.eleHeight + offsetInfo.y)) {
                            return false;
                        }
                        height = eleInfo.eleHeight + offsetInfo.y;

                        dom.css({ "height": height });

                        cropImage(eleInfo.eleLeft, eleInfo.eleTop, eleInfo.eleWidth, height);

                    };
                    function leftTop(dom, eleInfo, offsetInfo) { };
                    function leftBottom(dom, eleInfo, offsetInfo) { };
                    function rightTop(dom, eleInfo, offsetInfo) { };
                    function rightBottom(dom, eleInfo, offsetInfo) { };

                    switch (direction) {
                        case "left": left(dom, eleInfo, offsetInfo); break;
                        case "right": right(dom, eleInfo, offsetInfo); break;
                        case "top": top(dom, eleInfo, offsetInfo); break;
                        case "bottom": bottom(dom, eleInfo, offsetInfo); break;
                        case "left-top": leftTop(dom, eleInfo, offsetInfo); break;
                        case "left-bottom": leftBottom(dom, eleInfo, offsetInfo); break;
                        case "right-top": rightTop(dom, eleInfo, offsetInfo); break;
                        case "right-bottom": rightBottom(dom, eleInfo, offsetInfo); break;
                    }

                };

                function mousemove(e) {
                    /**
                     * resize 模式
                     */
                    if (par.dragFlag) {
                        //计算位移
                        var x = e.clientX - par.x;
                        var y = e.clientY - par.y;

                        //计算偏移和缩放
                        var eleInfo = {
                            eleWidth: par.eleWidth,
                            eleHeight: par.eleHeight,
                            eleLeft: par.eleLeft,
                            eleTop: par.eleTop
                        };
                        var offsetInfo = { x: x, y: y };
                        resizeEle($(element).find(".crop-box"), eleInfo, offsetInfo, par.direction);
                    }

                    /**
                     * 拖拽模式
                     */
                    if (par.moveFlag) {
                        //计算位移
                        var x = e.clientX - par.x;
                        var y = e.clientY - par.y;

                        x = x + par.eleLeft;
                        y = y + par.eleTop;

                        var cropDom = $(element).find(".crop-box");


                        var positionLimitResults = positionLimit(cropDom, x, y, par.eleWidth, par.eleHeight, imageWidth, imageHeight);
                        if (positionLimitResults !== true) {
                            return;
                        }

                        cropDom.css({ left: x, top: y });
                        cropImage(x, y, par.eleWidth, par.eleHeight);

                    }

                };
                function mouseup(e) {
                    /**
                     * resize 模式
                     */
                    if (par.dragFlag) {
                        par.dragFlag = false;
                    }

                    /**
                     * 拖拽模式
                     */
                    if (par.moveFlag) {
                        par.moveFlag = false;
                    }
                };
                $("body").on("mousemove", mousemove);
                $("body").on("mouseup", mouseup);

                $("body").on("mousedown", function (e) {
                    if ($(e.target).parents('[image-crop]').get(0) != undefined || e.target == element) {
                    } else {
                        //销毁元素
                        scope.$apply(function(){
                            scope.crop();                            
                        });                  
                    }
                });

                scope.$on("$destroy", function () {
                    $("body").off("mousemove", mousemove);
                    $("body").off("mouseup", mouseup);
                });

            }
        };
    })
    .factory("imageCropService", function (eleMenuServices, $compile, $rootScope,websiteData,activePageService,builderTool) {
        var activeEle = {};
        var activeEleDom = "";
        var menuDom = "";


        var handle = {
            openCrop: function (ele) {
                activeEle = ele;
                //先隐藏原元素
                activeEleDom = $("#" + activeEle.ID).hide();
                eleMenuServices.hideDom();
                //插入新的元素 用来裁剪
                menuDom = '<div image-crop class="crop-image-box"></div>';
                menuDom = $compile(menuDom)($rootScope);

                //找到当前元素的上一个session
                activeEleDom.parents(".ele-session").eq(0).append(menuDom);
            },
            removePlugin: function () {
                menuDom.remove();
                menuDom = {};
                activeEleDom.show();
                activeEleDom = {};
                activeEle = {};
            },
            updateCrop:function(updateData){
                /**
                 * 更新数据 backgroundSize backgroundPosition cropInfo
                 */
                var activePage=activePageService.getActivePage().value;
                activeEle=websiteData.getEle(activePage,activeEle.ID);
                
                activeEle.style['background-size']=updateData.backgroundSize;
                activeEle.style['background-position-x']=updateData.backgroundPosition.x;
                activeEle.style['background-position-y']=updateData.backgroundPosition.y;
                
                activeEle.phoneStyle.style['background-size']=updateData.backgroundSize;
                activeEle.phoneStyle.style['background-position-x']=updateData.backgroundPosition.x;
                activeEle.phoneStyle.style['background-position-y']=updateData.backgroundPosition.y;
                
                activeEle.cropInfo=updateData.cropInfo;
                
                //更新元素                
                
                websiteData.updateEle(activePage,activeEle);
                
                //更新元素（dom）
                
                builderTool.updateEle(activeEle);
                
                handle.removePlugin();                                
                
            },
            getActiveEle: function () {
                return activeEle;
            }
        };
        return handle;
    });