"use strict";
angular.module('kyle.imageCrop',['dataService'])
    .directive('imageCrop', function (imageCropService, $timeout,builderTool,websiteData,activePageService,elePosition) {
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
            '<div class="handle right-bottom" direction="right-bottom"><div class="vertical"></div><div class="horizontal"></div></div>' +
            '</div>',
            link: function (scope, element, attrs) {

                scope.imageSlide = {
                    value: 100
                };

                var coverDom = $(element).find('.cover');
                var imageCoverDom = $(element).find('.image-cover');
                var coverBox = $(element).find('.crop-box');

                scope.$watch("imageSlide.value", function () {
                    //更新尺寸
                    imageWidth = parseFloat(activeEle.imageSize.width) * parseFloat(scope.imageSlide.value) / 100;
                    imageHeight = parseFloat(activeEle.imageSize.height) * parseFloat(scope.imageSlide.value / 100);

                    //有一种情况是缩小的时候被截取框挡住了 这个时候应该停止缩小
                    if (imageWidth < coverBox.get(0).offsetLeft + coverBox.get(0).offsetWidth) {
                        imageWidth = coverBox.get(0).offsetLeft + coverBox.get(0).offsetWidth;
                        //重新计算比例
                        scope.imageSlide.value = imageWidth * 100 / parseFloat(activeEle.imageSize.width);
                    }
                    if (imageHeight < coverBox.get(0).offsetTop + coverBox.get(0).offsetHeight) {
                        imageHeight = coverBox.get(0).offsetTop + coverBox.get(0).offsetHeight;
                        //重新计算比例
                        scope.imageSlide.value = imageHeight * 100 / parseFloat(activeEle.imageSize.height);
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
                    cropImage(coverBox.get(0).offsetLeft, coverBox.get(0).offsetTop, coverBox.get(0).offsetWidth, coverBox.get(0).offsetHeight);
                });

                /**
                 * cropInfo 里面的比例是指元素大小比图片大小
                 */

                var activeEle = imageCropService.getActiveEle();

                var imageWidth = parseFloat(activeEle.style.width);
                var imageHeight = parseFloat(activeEle.style.height);

                var borderWidth = parseFloat(activeEle.border.width);
                var borderHeight = parseFloat(activeEle.border['min-height']);
                if (borderWidth > imageWidth) {
                    borderWidth = imageWidth;
                } else {

                }
                if (borderHeight > imageHeight) {
                    borderHeight = imageHeight;
                } else {

                }
                /**
                 * 计算图片的缩放比例
                 */
                scope.imageSlide.value = imageWidth / parseFloat(activeEle.imageSize.width) * 100;
                //绘制相应的图片 包括

                var eleOffsetLeft = 0;
                var eleOffsetTop = 0;
                if (activeEle.style.left != 'auto' && activeEle.style.left !== undefined) {
                    eleOffsetLeft = parseInt(activeEle.style.left);
                }
                if (activeEle.style.top != 'auto' && activeEle.style.top !== undefined) {
                    eleOffsetTop = parseInt(activeEle.style.top);
                }

                /**
                 * 这里元素的坐标没有那么简单，值应该是相对于session的
                 */
                var targetEleDom = $('#'+activeEle.ID);
                var sessionDom = targetEleDom.parents('.ele-session').get(0);
                var componentLeft = elePosition.getLeft(targetEleDom.get(0),sessionDom);
                var componentTop = elePosition.getTop(targetEleDom.get(0),sessionDom);
                $(element).css({
                    'width': imageWidth,
                    'height': imageHeight,
                    'left': parseInt(componentLeft) + eleOffsetLeft,
                    'top': parseInt(componentTop) + eleOffsetTop
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
                    'width': borderWidth,
                    'height': borderHeight,
                    'left': -eleOffsetLeft,
                    'top': -eleOffsetTop
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
                function sizeLimit(dom, width, height, direction) {

                    if (width < 80 && height < 80) {
                        return false;
                    } else if (width < 80) {
                        return false;
                    } else if (height < 80) {
                        return false;
                    } else {
                        return true;
                    }
                }

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
                }

                /**
                 * 更改大小的时候的限制
                 */
                function resizeLimit(dom, boxWidth, boxHeight) {
                    var eleLeft = dom.get(0).offsetLeft;
                    var eleTop = dom.get(0).offsetTop;
                    var eleWidth = dom.get(0).offsetWidth;
                    var eleHeight = dom.get(0).offsetHeight;
                    var radio = eleWidth / eleHeight;

                    var flag = true;

                    if (eleLeft < 0) {
                        eleWidth = eleWidth + eleLeft;
                        eleLeft = 0;
                        dom.css({ "width": eleWidth, "left": eleLeft });
                    }
                    if (eleTop < 0) {
                        eleHeight = eleHeight + eleTop;
                        eleTop = 0;
                        dom.css({ "height": eleHeight, "top": eleTop });
                    }
                    if (eleLeft + eleWidth > boxWidth) {
                        eleWidth = boxWidth + eleLeft;
                        dom.css({ "width": eleWidth });
                    }
                    if (eleTop + eleHeight > boxHeight) {
                        eleHeight = boxHeight + eleTop;
                        dom.css({ "height": eleHeight });
                    }

                    var obj = { left: eleLeft, top: eleTop, width: eleWidth, height: eleHeight };
                    return obj;

                }

                /**
                 * 重新计算元素大小
                 */

                function resizeEle(dom, eleInfo, offsetInfo, direction) {

                    function left(dom, eleInfo, offsetInfo) {

                        var left = 0;
                        var width = 0;

                        if (!sizeLimit(dom, eleInfo.eleWidth - offsetInfo.x, undefined, "left")) {
                            return false;
                        }

                        left = eleInfo.eleLeft + offsetInfo.x;
                        width = eleInfo.eleWidth - offsetInfo.x;

                        dom.css({ "width": width });
                        dom.css({ "left": left });

                        var eleObj = resizeLimit(dom, imageWidth, imageHeight);

                        cropImage(eleObj.left, eleObj.top, eleObj.width, eleObj.height);

                    }
                    function right(dom, eleInfo, offsetInfo) {

                        var width = 0;

                        if (!sizeLimit(dom, eleInfo.eleWidth + offsetInfo.x, undefined, "right")) {
                            return false;
                        }

                        width = eleInfo.eleWidth + offsetInfo.x;

                        dom.css({ "width": width });

                        var eleObj = resizeLimit(dom, imageWidth, imageHeight);

                        cropImage(eleObj.left, eleObj.top, eleObj.width, eleObj.height);

                    }
                    function top(dom, eleInfo, offsetInfo) {

                        var height = 0;
                        var top = 0;

                        if (!sizeLimit(dom, undefined, eleInfo.eleHeight - offsetInfo.y, "top")) {
                            return false;
                        }

                        height = eleInfo.eleHeight - offsetInfo.y;
                        top = eleInfo.eleTop + offsetInfo.y;

                        dom.css({ "height": height });
                        dom.css({ "top": top });

                        var eleObj = resizeLimit(dom, imageWidth, imageHeight);

                        cropImage(eleObj.left, eleObj.top, eleObj.width, eleObj.height);

                    }
                    function bottom(dom, eleInfo, offsetInfo) {

                        var height = 0;

                        if (!sizeLimit(dom, undefined, eleInfo.eleHeight + offsetInfo.y, "bottom")) {
                            return false;
                        }
                        height = eleInfo.eleHeight + offsetInfo.y;

                        dom.css({ "height": height });

                        var eleObj = resizeLimit(dom, imageWidth, imageHeight);

                        cropImage(eleObj.left, eleObj.top, eleObj.width, eleObj.height);

                    }
                    function leftTop(dom, eleInfo, offsetInfo) {
                        /**
                         * 先计算宽和高各占的比重
                         */
                        var weight = {
                            x: eleInfo.eleWidth / (eleInfo.eleWidth + eleInfo.eleHeight),
                            y: eleInfo.eleHeight / (eleInfo.eleWidth + eleInfo.eleHeight)
                        };

                        var offsetHeightForX = -(offsetInfo.x / eleInfo.eleWidth) * eleInfo.eleHeight * weight.x;
                        var offsetWidthForX = -offsetInfo.x * weight.x;

                        var offsetHeightForY = -offsetInfo.y * weight.y;
                        var offsetWidthForY = -(offsetInfo.y / eleInfo.eleHeight) * eleInfo.eleWidth * weight.y;


                        var resultWidth = offsetWidthForX + offsetWidthForY + eleInfo.eleWidth;
                        var resultHeight = offsetHeightForX + offsetHeightForY + eleInfo.eleHeight;

                        var resultLeft = -offsetWidthForY - offsetWidthForX + eleInfo.eleLeft;
                        var resultTop = -offsetHeightForY - offsetHeightForX + eleInfo.eleTop;

                        var radio = resultWidth / resultHeight;

                        if (!sizeLimit(dom, resultWidth, resultHeight, "leftTop")) {
                            return false;
                        }

                        if (resultLeft < 0) {
                            resultWidth = resultWidth + resultLeft;
                            var offsetY = resultHeight - resultWidth * (1 / radio);
                            resultHeight = resultWidth * (1 / radio);
                            resultTop = resultTop + offsetY;
                            resultLeft = 0;
                            //按比例算高度

                        } else if (resultTop < 0) {
                            resultHeight = resultHeight + resultTop;
                            var offsetX = resultWidth - resultHeight * (radio);
                            resultWidth = resultHeight * (radio);
                            resultLeft = resultLeft + offsetX;
                            resultTop = 0;
                            //按比例算宽度                                                  
                        }

                        dom.css({ "height": resultHeight, "width": resultWidth });

                        //调整位移
                        dom.css({ "top": resultTop, "left": resultLeft });

                        cropImage(resultLeft, resultTop, resultWidth, resultHeight);

                    }
                    function leftBottom(dom, eleInfo, offsetInfo) {
                        /**
                         * 先计算宽和高各占的比重
                         */
                        var weight = {
                            x: eleInfo.eleWidth / (eleInfo.eleWidth + eleInfo.eleHeight),
                            y: eleInfo.eleHeight / (eleInfo.eleWidth + eleInfo.eleHeight)
                        };

                        var offsetHeightForX = -(offsetInfo.x / eleInfo.eleWidth) * eleInfo.eleHeight * weight.x;
                        var offsetWidthForX = -offsetInfo.x * weight.x;

                        var offsetHeightForY = offsetInfo.y * weight.y;
                        var offsetWidthForY = (offsetInfo.y / eleInfo.eleHeight) * eleInfo.eleWidth * weight.y;


                        var resultWidth = offsetWidthForX + offsetWidthForY + eleInfo.eleWidth;
                        var resultHeight = offsetHeightForX + offsetHeightForY + eleInfo.eleHeight;

                        var resultLeft = -offsetWidthForY - offsetWidthForX + eleInfo.eleLeft;
                        var resultTop = eleInfo.eleTop;

                        var radio = resultWidth / resultHeight;

                        if (!sizeLimit(dom, resultWidth, resultHeight, "leftBottom")) {
                            return false;
                        }

                        if (resultLeft < 0) {
                            resultWidth = resultWidth + resultLeft;
                            var offsetY = resultHeight - resultWidth * (1 / radio);
                            resultHeight = resultWidth * (1 / radio);
                            resultTop = - resultTop + offsetY;
                            resultLeft = 0;
                            //按比例算高度

                        } else if (resultTop < 0) {
                            resultHeight = resultHeight - resultTop;
                            var offsetX = resultWidth - resultHeight * (radio);
                            resultWidth = resultHeight * (radio);
                            resultLeft = resultLeft + offsetX;
                            resultTop = 0;
                            //按比例算宽度                                                  
                        }


                        dom.css({ "height": resultHeight, "width": resultWidth });

                        //调整位移
                        dom.css({ "left": resultLeft });

                        cropImage(resultLeft, resultTop, resultWidth, resultHeight);


                    }
                    function rightTop(dom, eleInfo, offsetInfo) {
                        /**
                         * 先计算宽和高各占的比重
                         */
                        var weight = {
                            x: eleInfo.eleWidth / (eleInfo.eleWidth + eleInfo.eleHeight),
                            y: eleInfo.eleHeight / (eleInfo.eleWidth + eleInfo.eleHeight)
                        };

                        var offsetHeightForX = (offsetInfo.x / eleInfo.eleWidth) * eleInfo.eleHeight * weight.x;
                        var offsetWidthForX = offsetInfo.x * weight.x;

                        var offsetHeightForY = -offsetInfo.y * weight.y;
                        var offsetWidthForY = -(offsetInfo.y / eleInfo.eleHeight) * eleInfo.eleWidth * weight.y;


                        var resultWidth = offsetWidthForX + offsetWidthForY + eleInfo.eleWidth;
                        var resultHeight = offsetHeightForX + offsetHeightForY + eleInfo.eleHeight;

                        var resultLeft = eleInfo.eleLeft;
                        var resultTop = -offsetHeightForY - offsetHeightForX + eleInfo.eleTop;

                        var radio = resultWidth / resultHeight;

                        if (!sizeLimit(dom, resultWidth, resultHeight, "rightTop")) {
                            return false;
                        }

                        if (resultLeft + resultWidth > imageWidth) {
                            resultWidth = imageWidth - resultLeft;
                            var offsetY = resultHeight - resultWidth * (1 / radio);
                            resultHeight = resultWidth * (1 / radio);
                            resultTop = - resultTop + offsetY;
                            //按比例算高度

                        } else if (resultTop < 0) {
                            resultHeight = resultHeight - resultTop;
                            resultWidth = resultHeight * (radio);
                            resultTop = 0;
                            //按比例算宽度                                                  
                        }

                        dom.css({ "height": resultHeight, "width": resultWidth });

                        //调整位移
                        dom.css({ "top": resultTop, "left": resultLeft });

                        cropImage(resultLeft, resultTop, resultWidth, resultHeight);

                    }
                    function rightBottom(dom, eleInfo, offsetInfo) {
                        /**
                         * 先计算宽和高各占的比重
                         */
                        var weight = {
                            x: eleInfo.eleWidth / (eleInfo.eleWidth + eleInfo.eleHeight),
                            y: eleInfo.eleHeight / (eleInfo.eleWidth + eleInfo.eleHeight)
                        };

                        var offsetHeightForX = (offsetInfo.x / eleInfo.eleWidth) * eleInfo.eleHeight * weight.x;
                        var offsetWidthForX = offsetInfo.x * weight.x;

                        var offsetHeightForY = offsetInfo.y * weight.y;
                        var offsetWidthForY = (offsetInfo.y / eleInfo.eleHeight) * eleInfo.eleWidth * weight.y;


                        var resultWidth = offsetWidthForX + offsetWidthForY + eleInfo.eleWidth;
                        var resultHeight = offsetHeightForX + offsetHeightForY + eleInfo.eleHeight;

                        var resultLeft = eleInfo.eleLeft;
                        var resultTop = eleInfo.eleTop;

                        var radio = resultWidth / resultHeight;

                        if (!sizeLimit(dom, resultWidth, resultHeight, "rightBottom")) {
                            return false;
                        }


                        if (resultLeft + resultWidth > imageWidth) {
                            resultWidth = imageWidth - resultLeft;
                            resultHeight = resultWidth * (1 / radio);
                            //按比例算高度

                        } else if (resultTop + resultHeight > imageHeight) {
                            resultHeight = resultHeight - resultTop;
                            resultWidth = resultHeight * (radio);
                            //按比例算宽度                                                  
                        }

                        dom.css({ "height": resultHeight, "width": resultWidth });

                        //调整位移
                        dom.css({ "top": resultTop, "left": resultLeft });

                        cropImage(resultLeft, resultTop, resultWidth, resultHeight);

                    }

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

                }

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

                }
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
                }


                /**
                 * 裁剪元素
                 */
                scope.crop = function () {
                    /**
                     * 需要记录的信息
                     * 第一个：图片的尺寸 就是ele的style中的宽和高
                     * 第二个：clip的信息 这个信息标记了图片的裁剪信息
                     */
                    var updateData = {
                        borderSize: { width: coverBox.get(0).offsetWidth, height: coverBox.get(0).offsetHeight },
                        eleSize: { width: imageCoverDom.get(0).offsetWidth, height: imageCoverDom.get(0).offsetHeight },
                        clip: imageCoverDom.css('clip'),
                        position: { left: parseInt(targetEleDom.get(0).offsetLeft), top: parseInt(targetEleDom.get(0).offsetTop) }
                    };

                    var activeEle = imageCropService.updateCrop(updateData);

                    var activePage = activePageService.getActivePage().value;

                    websiteData.conversionScaleForPhone(activeEle);

                    websiteData.updateEle(activePage, activeEle);

                    builderTool.updateEle(activeEle);                    
                };

                $("body").on("mousemove", mousemove);
                $("body").on("mouseup", mouseup);


                var bodyMouseDown = function (e) {
                    if ($(e.target).parents('[image-crop]').get(0) !== undefined || e.target == element) {
                    } else {
                        //销毁元素
                        scope.$apply(function () {
                            scope.crop();
                        });
                    }
                };

                $("body").on("mousedown", bodyMouseDown);


                imageCropService.setRemoveCallBack(function () {
                    $("body").off("mousemove", mousemove);
                    $("body").off("mouseup", mouseup);
                    $("body").off("mousedown", bodyMouseDown);
                });

            }
        };
    })
    .factory("imageCropService", function (eleMenuServices, $compile, $rootScope) {
        var activeEle = {};
        var activeEleDom = "";
        var menuDom = "";

        var removeCallBack = {};

        var handle = {
            openCrop: function (ele) {
                activeEle = ele;
                //先隐藏原元素
                activeEleDom = $("#" + activeEle.ID).css({'opacity':0,'pointer-events':'none'});
                eleMenuServices.hideDom();
                //插入新的元素 用来裁剪
                menuDom = '<div image-crop class="crop-image-box"></div>';
                menuDom = $compile(menuDom)($rootScope);

                activeEleDom.parents(".ele-session").eq(0).append(menuDom);
            },
            removePlugin: function () {
                menuDom.remove();
                menuDom = {};
                activeEleDom.css({'opacity':1,'pointer-events':'auto'});
                activeEleDom = {};
                activeEle = {};
                //注销相关方法
                removeCallBack();
                removeCallBack = {};
            },
            setRemoveCallBack: function (callback) {
                removeCallBack = callback;
            },
            resetImage: function (dom, ele,originalWidth, originalHeight, originalImageWidth, originalImageHeight, originalClip) {
                // var activePage = activePageService.getActivePage().value;
                // var ele = websiteData.getEle(activePage, $(dom).attr("id"));
                console.log(arguments);
                var position = $(dom);
                var border = position.find("> .ele-box");
                var style = border.find("> .ele");

                //解析clip
                var clipData = handle.parsingClip(originalClip, originalImageWidth, originalImageHeight);

                //计算宽高比 计算被截取后的图片的宽高比
                var realImageWidth = clipData[1] - clipData[3];
                var realImageHeight = clipData[2] - clipData[0];
                var aspectRatio = realImageWidth / realImageHeight;

                var currentWidth = border.get(0).offsetWidth;
                var currentHeight = border.get(0).offsetHeight;

                var widthRadio = currentWidth / originalWidth;
                var heightRadio = currentHeight / originalHeight;

                //根据比例重新调整图片

                function containResetForWidth(styleDom, borderDom, width, originalImageWidth, clipData) {

                    var clip = angular.copy(clipData);

                    var visualWidth = clip[1] - clip[3];
                    var visualHeight = clip[2] - clip[0];

                    var imageWidth = (originalImageWidth * width) / visualWidth;

                    styleDom.css({ "width": imageWidth, "height": "auto" });

                    var imageWidthRadio = originalImageWidth / imageWidth;

                    clip[1] = clip[1] / imageWidthRadio;
                    clip[3] = clip[3] / imageWidthRadio;

                    clip[0] = clip[0] / imageWidthRadio;
                    clip[2] = clip[2] / imageWidthRadio;

                    //重新计算裁剪后的大小
                    visualWidth = clip[1] - clip[3];
                    visualHeight = clip[2] - clip[0];

                    styleDom.css({ "clip": 'rect(' + clip[0] + 'px ' + clip[1] + 'px ' + clip[2] + 'px ' + clip[3] + 'px ' + ')' });

                    var borderHeight = parseInt(borderDom.get(0).offsetHeight);
                    var eleHeight = parseInt(styleDom.get(0).offsetHeight);

                    var styleTop = -clip[0];
                    styleTop = styleTop + (borderHeight - visualHeight) / 2;
                    styleDom.css({ "top": styleTop, "left": -clip[3] });
                }
                function containResetForHeight(styleDom, borderDom, height, originalImageHeight, clipData) {
                    var clip = angular.copy(clipData);

                    var visualWidth = clip[1] - clip[3];
                    var visualHeight = clip[2] - clip[0];

                    var imageHeight = (originalImageHeight * height) / visualHeight;

                    styleDom.css({ "height": imageHeight, "width": "auto" });

                    var imageHeightRadio = originalImageHeight / imageHeight;

                    clip[1] = clip[1] / imageHeightRadio;
                    clip[3] = clip[3] / imageHeightRadio;

                    clip[0] = clip[0] / imageHeightRadio;
                    clip[2] = clip[2] / imageHeightRadio;

                    //重新计算裁剪后的大小
                    visualWidth = clip[1] - clip[3];
                    visualHeight = clip[2] - clip[0];

                    styleDom.css({ "clip": 'rect(' + clip[0] + 'px ' + clip[1] + 'px ' + clip[2] + 'px ' + clip[3] + 'px ' + ')' });

                    var borderWidth = parseInt(borderDom.get(0).offsetWidth);
                    var eleWidth = parseInt(styleDom.get(0).offsetWidth);

                    var styleLeft = -clip[3];
                    styleLeft = styleLeft + (borderWidth - visualWidth) / 2;

                    styleDom.css({ "top": -clip[0], "left": styleLeft });
                }

                if (ele.backgroundSize === "contain") {
                    if (currentWidth < currentHeight) {
                        //宽比较小 宽填充
                        var width = currentWidth;
                        var height = width / aspectRatio;
                        if (height <= currentHeight) {
                            containResetForWidth(style, border, width, originalImageWidth, clipData);
                        } else {
                            height = currentHeight;
                            containResetForHeight(style, border, height, originalImageHeight, clipData);
                        }

                    } else {
                        //高填充 让高等于边框的高度
                        var height = currentHeight;
                        var width = height * aspectRatio;
                        if (width <= currentWidth) {
                            containResetForHeight(style, border, height, originalImageHeight, clipData);
                        } else {
                            width = currentWidth;
                            containResetForWidth(style, border, width, originalImageWidth, clipData);
                        }
                    }
                } else if(ele.backgroundSize === "cover") {
                    if (currentWidth < currentHeight) {
                        //高比较大 高填充
                        var height = currentHeight;
                        var width = height * aspectRatio;
                        if (width <= currentWidth) {
                            width = currentWidth;
                            containResetForWidth(style, border, width, originalImageWidth, clipData);
                        } else {
                            containResetForHeight(style, border, height, originalImageHeight, clipData);                            
                        }

                    } else {
                        //宽填充
                        var width = currentWidth;
                        var height = width / aspectRatio;
                        if (height <= currentHeight) {
                            height = currentHeight;
                            containResetForHeight(style, border, height, originalImageHeight, clipData);
                        } else {
                            containResetForWidth(style, border, width, originalImageWidth, clipData);                            
                        }
                    }
                }


            },
            parsingClip: function (String, width, height) {
                if (String == 'auto') {
                    String = [0, width, height, 0];
                    return String;
                }
                String = String.substring(5, String.length - 1);

                String = String.split(' ');
                for (var i = 0; i < String.length; i++) {
                    String[i] = parseInt(String[i]);
                }

                return String;
            },
            updateCrop: function (updateData) {
                // var activePage = activePageService.getActivePage().value;
                // activeEle = websiteData.getEle(activePage, activeEle.ID);

                var clipData = handle.parsingClip(updateData.clip, updateData.eleSize.width, updateData.eleSize.height);
                //更新元素
                activeEle.border.width = updateData.borderSize.width;
                activeEle.style.width = updateData.eleSize.width;

                activeEle.border['min-height'] = updateData.borderSize.height;
                activeEle.style.height = updateData.eleSize.height;

                activeEle.style.clip = 'rect(' + clipData[0] + 'px ' + clipData[1] + 'px ' + clipData[2] + 'px ' + clipData[3] + 'px ' + ')';

                activeEle.position.left = updateData.position.left + clipData[3];
                activeEle.position.top = updateData.position.top + clipData[0];
                activeEle.style.left = -clipData[3];
                activeEle.style.top = -clipData[0];

                //由于裁剪彻底改变了元素  所以要转换成phone的元素
                // websiteData.conversionScaleForPhone(activeEle);

                // websiteData.updateEle(activePage, activeEle);

                var returnData = angular.copy(activeEle);

                handle.removePlugin();

                return returnData;

            },
            getActiveEle: function () {
                return activeEle;
            }
        };
        return handle;
    });