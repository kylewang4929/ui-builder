"use strict";
angular.module('myBuilderApp')
    .directive('rotate', function (builderTool, phoneBuilderTool, activePageService, websiteData, rotateEleCalculate, eleIndicator,$rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var parameter = {
                    cx: 0,
                    cy: 0,
                    flag: false,
                    px: 0,
                    py: 0,
                    eleHeight: 0,
                    eleWidth: 0,
                    rotate: 0,
                    isGroupEle: "",
                    left: 0,
                    right: 0
                };

                /**
                 * 组件的类型 default ele-web ele-phone
                */
                parameter.type = attrs.rotate;

                var groupID = "";
                var firstParentGroupID = "";
                //判断是不是分组
                if ($(element).parents('.position-box[ele-type=group]').length > 0) {
                    parameter.isGroupEle = true;
                    var groupEleList = $(element).parents('.position-box[ele-type=group]');
                    groupID = groupEleList.eq(0).attr('id');
                    firstParentGroupID = groupEleList.eq(groupEleList.length - 1).attr('id');
                }

                builderTool.reviseRotateCss(rotateEleCalculate.getRotate(element), attrs.id);

                $(element).find(" >.rotate").on("mousedown", function (e) {
                    parameter.flag = true;
                    //获取圆心 顶点以及大小等信息
                    var centerOffset = $(element).find(" >.center").offset();

                    //通知拖动开始
                    $rootScope.$emit("eleDragStart");

                    parameter.eleHeight = $(element).get(0).clientHeight;
                    parameter.eleWidth = $(element).get(0).clientWidth;

                    parameter.cx = centerOffset.left;
                    parameter.cy = centerOffset.top;

                    parameter.px = centerOffset.left;
                    //10是线的高度
                    parameter.py = centerOffset.top + parameter.eleHeight / 2 + 10;

                    parameter.left = parseInt($(element).css("left"));
                    parameter.top = parseInt($(element).css("top"));

                    if (parameter.isGroupEle) {
                        $(element).trigger("groupUpdateInit", groupID);
                        e.stopPropagation();
                    }

                    eleIndicator.add($(element), 0, -34, 'rotate');

                });

                function listenMousemove(e) {
                    if (parameter.flag) {
                        var ox = e.pageX - parameter.cx;
                        var oy = e.pageY - parameter.cy;

                        var to = Math.abs(ox / oy);
                        var angle = Math.atan(to) / (2 * Math.PI) * 360;

                        if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系
                        {
                            angle = 270 + (90 - angle);
                        } else if (ox < 0 && oy > 0)//左下角,3象限
                        {
                            angle = 180 + angle;
                        } else if (ox > 0 && oy < 0)//右上角，1象限
                        {
                            angle = angle;
                        } else if (ox > 0 && oy > 0)//右下角，2象限
                        {
                            angle = 180 - angle;
                        }
                        var offsetAngle = angle;
                        element.css("transform", "rotate(" + offsetAngle + "deg)");

                        if (parameter.isGroupEle) {
                            //var elePar={left: offsetX,top: offsetY,width:$(element).outerWidth(),height:$(element).outerHeight()};
                            var elePar = rotateEleCalculate.getSizeAndPosition(parameter.left, parameter.top, $(element).outerWidth(), $(element).outerHeight(), offsetAngle);
                            var triggerData = { ID: groupID, elePar: elePar };
                            $(element).trigger("groupUpdate", triggerData);
                        }
                        eleIndicator.update();

                    }
                }
                function listenMouseup(e) {
                    if (parameter.flag) {
                        parameter.flag = false;

                        $rootScope.$emit("eleDragEnd");

                        if (parameter.type == 'ele-web') {
                            //更新 ID data
                            var eleData = builderTool.getEle(attrs.id, attrs.eleType);
                            websiteData.updateEle(activePageService.getActivePage().value, eleData);

                            //调整光标
                            builderTool.reviseRotateCss(rotateEleCalculate.getRotate(element), attrs.id);
                        }

                        if (parameter.type == 'ele-phone') {
                            //更新 ID data
                            var eleData = phoneBuilderTool.getEle(attrs.id, attrs.eleType);
                            websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);

                            //调整光标
                            builderTool.reviseRotateCss(rotateEleCalculate.getRotate(element), attrs.id);
                        }

                        eleIndicator.remove();

                    }
                }

                $(document).on("mousemove", listenMousemove);
                $(document).on("mouseup", listenMouseup);

                scope.$on('$destroy', function () {
                    $(document).off("mousemove", listenMousemove);
                    $(document).off("mouseup", listenMouseup);
                });

            }
        };
    })
    /**
     * handle 可以指定
     * dragEle 可能是 default ele-web ele-phone
    */
    .directive('dragEle', function (activeSessionService, builderTool, phoneBuilderTool, websiteData, changeSessionTool, rotateEleCalculate, activePageService, $rootScope, eleIndicator) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                /**
                 * 获取传入的方法 scope.dragFunction
                */

                var parameter = {
                    flag: false,
                    left: 0,
                    top: 0,
                    cx: 0,
                    cy: 0,
                    bodyWidth: 0,
                    bodyHeight: 0,
                    eleWidth: 0,
                    eleHeight: 0,
                    type: "",
                    contenteditable: false,
                    currentSession: "",
                    isGroupEle: false,
                    rotate: 0
                };

                var groupID = "";
                var firstParentGroupID = "";
                //判断是不是组
                if ($(element).parents('.position-box[ele-type=group]').length > 0) {
                    parameter.isGroupEle = true;
                    var groupEleList = $(element).parents('.position-box[ele-type=group]');
                    groupID = groupEleList.eq(0).attr('id');
                    firstParentGroupID = groupEleList.eq(groupEleList.length - 1).attr('id');
                }

                /**
                 * 组件的类型 default ele-web ele-phone
                */
                parameter.type = attrs.dragEle;

                var handle = null;
                if (attrs.handle === undefined) {
                    handle = element;
                } else {
                    handle = element.find("." + attrs.handle);
                }
                handle.on("mousedown", function (e) {
                    //e.stopPropagation();
                    if (e.buttons !== 1) {
                        return;
                    }
                    var multipleChoiceState = $(element).attr("multiple-choice");
                    if (multipleChoiceState === 'true') {
                        return;
                    }

                    parameter.flag = true;

                    //判断是否是组里面的元素

                    parameter.left = $(element).get(0).offsetLeft;
                    parameter.top = $(element).get(0).offsetTop;

                    parameter.cx = e.clientX;
                    parameter.cy = e.clientY;

                    parameter.bodyWidth = $("body").width();
                    parameter.bodyHeight = $("body").height();

                    parameter.eleWidth = $(element).outerWidth();
                    parameter.eleHeight = $(element).outerHeight();

                    parameter.contenteditable = $(element).find(".ele .ql-editor").attr("contenteditable");

                    //获取元素的角度
                    parameter.rotate = rotateEleCalculate.getRotate(element);


                    if (parameter.isGroupEle) {
                        $(element).trigger("groupUpdateInit", groupID);
                        e.stopPropagation();
                    }

                    if (parameter.type === 'ele-web') {
                        changeSessionTool.init($(element).parents('.ele-session-box').attr('id'), parameter.top + (parameter.eleHeight / 2));
                    }

                });

                var moveFirstFlag = true;
                function listenMousemove(e) {
                    //编辑状态不可滑动
                    //e.stopPropagation();
                    if (parameter.contenteditable) {
                        return;
                    }
                    if (parameter.flag) {

                        if (moveFirstFlag) {
                            //向下通知 正在移动
                            moveFirstFlag = false;
                            $rootScope.$emit("eleDragStart");

                            //添加指示器                    
                            if (parameter.type == 'ele-web' || parameter.type == 'ele-phone') {
                                eleIndicator.add($(element), 0, -34, 'position');
                            }
                        }

                        var offsetX = e.clientX - parameter.cx;
                        var offsetY = e.clientY - parameter.cy;

                        offsetX += parameter.left;
                        offsetY += parameter.top;
                        if (parameter.type.indexOf('ele') >= 0) {
                            if (parameter.type === 'ele-web') {
                                if (parameter.isGroupEle != true) {
                                    changeSessionTool.moveCheck(e.clientY - parameter.cy);
                                }
                            }
                        } else {
                            if (offsetX < 10) {
                                offsetX = 10;
                            }
                            if (offsetY < 60) {
                                offsetY = 60;
                            }
                            if (offsetX + parameter.eleWidth > parameter.bodyWidth) {
                                offsetX = parameter.bodyWidth - 10 - parameter.eleWidth;
                            }
                            if (offsetY + parameter.eleHeight > parameter.bodyHeight) {
                                offsetY = parameter.bodyHeight - 10 - parameter.eleHeight;
                            }
                        }
                        if (parameter.isGroupEle) {
                            //var elePar={left: offsetX,top: offsetY,width:$(element).outerWidth(),height:$(element).outerHeight()};
                            var outerWidth = $(element).outerWidth();
                            var outerHeight = $(element).outerHeight();
                            var elePar = rotateEleCalculate.getSizeAndPosition(offsetX, offsetY, outerWidth, outerHeight, parameter.rotate);
                            var triggerData = { ID: groupID, elePar: elePar };
                            $(element).trigger("groupUpdate", triggerData);
                            if (elePar.left < 0) {
                                offsetX = (elePar.width - outerWidth) / 2;
                            }
                            if (elePar.top < 0) {
                                offsetY = (elePar.height - outerHeight) / 2;
                            }
                        }
                        $(element).css({ left: offsetX + "px", top: offsetY + "px" });

                        if (parameter.type == 'ele-web' || parameter.type == 'ele-phone') {
                            eleIndicator.update();
                        }

                    }
                }
                function listenMouseup(e) {
                    if (parameter.flag) {
                        parameter.flag = false;

                        //标记移动结束
                        if (moveFirstFlag === false) {
                            moveFirstFlag = true;
                            $rootScope.$emit("eleDragEnd");
                        }

                        /**
                         * 更新web 元素
                        */
                        if (parameter.type === 'ele-web') {
                            var ele = [{ ID: attrs.id, type: attrs.eleType }];
                            if (parameter.isGroupEle != true) {
                                scope.$apply(function () {
                                    changeSessionTool.overCheck(ele);
                                });
                            } else {
                                //更新组
                                var eleData = builderTool.getEle(firstParentGroupID, "group");
                                scope.$apply(function () {
                                    websiteData.updateEle(activePageService.getActivePage().value, eleData);
                                });
                            }
                        }

                        /**
                         * 更新phone元素
                        */
                        if (parameter.type === 'ele-phone') {
                            if (parameter.isGroupEle != true) {
                                var eleData = phoneBuilderTool.getEle(attrs.id, attrs.eleType);
                                scope.$apply(function () {
                                    websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);
                                });
                            } else {
                                var eleData = phoneBuilderTool.getEle(firstParentGroupID, "group");
                                scope.$apply(function () {
                                    websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);
                                });
                            }
                        }

                        if (parameter.type == 'ele-web' || parameter.type == 'ele-phone') {
                            eleIndicator.remove();
                        }
                    }
                }

                $(document).on("mousemove", listenMousemove);
                $(document).on("mouseup", listenMouseup);

                scope.$on("$destroy", function () {
                    $(document).off("mousemove", listenMousemove);
                    $(document).off("mouseup", listenMouseup);
                });

            }
        };
    })

    .directive('resize', function ($timeout, builderTool, phoneBuilderTool, websiteData, rotateEleCalculate, activePageService, $rootScope, imageCropService, eleIndicator) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var parameter = {
                    flag: false,
                    left: 0,
                    top: 0,
                    cx: 0,
                    cy: 0,
                    eleWidth: 0,
                    eleHeight: 0,
                    target: "",
                    isGroupEle: false,
                    rotate: 0,
                    rightRotate: 0
                };

                /**
                 * 组件的类型 ele-web ele-phone
                */
                parameter.type = attrs.resize;

                var groupID = "";
                var firstParentGroupID = "";
                if ($(element).parents('.position-box[ele-type=group]').length > 0) {
                    parameter.isGroupEle = true;
                    var groupEleList = $(element).parents('.position-box[ele-type=group]');
                    groupID = groupEleList.eq(0).attr('id');
                    firstParentGroupID = groupEleList.eq(groupEleList.length - 1).attr('id');
                }

                var eleBox = $(element).find("> .ele-box");
                var eleDom = eleBox.find("> .ele");

                var eleType = $(element).attr('ele-type');

                function fixPosition() {
                    /**
                         * 原因是 图片不需要自动调整高度
                         */

                    var height = eleDom.height() / 2;
                    eleDom.css("margin-top", -height + "px");

                    $(eleDom).resize(function () {

                        //当元素被隐藏的时候不调整高度
                        if (eleDom.is(":hidden")) {
                            return;
                        }

                        if (eleType == 'text') {
                            eleBox.css("min-height", eleDom.height() + "px");
                        } else if (eleDom.height() > parseInt(eleBox.css("min-height"))) {
                            eleBox.css("min-height", eleDom.height() + "px");
                        }

                    });

                    $(element).resize(function () {

                        //当元素被隐藏的时候不调整高度
                        if (eleDom.is(":hidden")) {
                            return;
                        }

                        var height = eleDom.height() / 2;
                        eleDom.css("margin-top", -height + "px");
                    });

                }

                //图片不需要调整  文字边框始终跟随元素
                if (eleType !== "image") {

                    fixPosition();

                    if (attrs.eleType !== 'group') {
                        $(element).on("click", function () {
                            var height = eleDom.height() / 2;
                            eleDom.css("margin-top", -height + "px");
                        });
                    }

                }



                $(element).find(" >.resize").on("mousedown", function (e) {

                    e.stopPropagation();

                    //通知拖动开始
                    $rootScope.$emit("eleDragStart");                    

                    //添加指示器
                    eleIndicator.add($(element), 0, -34, 'size');

                    if (parameter.isGroupEle) {
                        $(element).trigger("groupUpdateInit", groupID);
                    }

                    parameter.flag = true;
                    parameter.left = $(element).get(0).offsetLeft;
                    parameter.top = $(element).get(0).offsetTop;

                    parameter.cx = e.clientX;
                    parameter.cy = e.clientY;

                    parameter.eleWidth = eleBox.get(0).clientWidth;
                    parameter.eleHeight = parseInt(eleBox.css("min-height"));

                    //获取clip
                    parameter.clip = eleDom.css('clip');

                    parameter.imageWidth = eleDom.get(0).offsetWidth;
                    parameter.imageHeight = eleDom.get(0).offsetHeight;

                    if (e.target.className.indexOf("left-top") !== -1) {
                        parameter.target = 0;
                    }
                    if (e.target.className.indexOf("only-top") !== -1) {
                        parameter.target = 1;
                    }
                    if (e.target.className.indexOf("right-top") !== -1) {
                        parameter.target = 2;
                    }
                    if (e.target.className.indexOf("only-right") !== -1) {
                        parameter.target = 3;
                    }
                    if (e.target.className.indexOf("right-bottom") !== -1) {
                        parameter.target = 4;
                    }
                    if (e.target.className.indexOf("only-bottom") !== -1) {
                        parameter.target = 5;
                    }
                    if (e.target.className.indexOf("left-bottom") !== -1) {
                        parameter.target = 6;
                    }
                    if (e.target.className.indexOf("only-left") !== -1) {
                        parameter.target = 7;
                    }

                    //获取元素的旋转角度
                    parameter.rotate = rotateEleCalculate.getRotate(element);
                    parameter.physicsEle = rotateEleCalculate.getSizeAndPosition(parameter.left, parameter.top, parameter.eleWidth, parameter.eleHeight, parameter.rotate);
                    parameter.rightRotate = parseInt(parameter.rotate / 45 + parameter.target) % 8;

                    //当元素是组的时候这里需要记录开始改变大小时的元素状态  方便缩放
                    if (parameter.type == 'ele-web') {
                        parameter.eleData = builderTool.getEle(attrs.id, attrs.eleType);
                    }
                    if (parameter.type == 'ele-phone') {
                        parameter.eleData = phoneBuilderTool.getEle(attrs.id, attrs.eleType);
                    }

                });

                /**
                 * 尺寸判断
                 * 宽高不得小于20
                 * 不符合条件返回false
                 */
                function sizeLimit(width, height) {
                    if (width < 20 || height < 20) {
                        return false;
                    } else {
                        return true;
                    }
                };


                //定义好resize的方法
                function leftTopResize(offsetX, offsetY, rightRotate) {
                    //位置是0

                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;

                    switch (rightRotate) {
                        case 0: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 1: percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 2: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 3: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 4: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 5: percent = (offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 6: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 7: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                    }

                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);

                    if (!sizeLimit(cWidth, cHeight)) {
                        return;
                    }

                    eleBox.css({ "min-height": cHeight + "px", width: cWidth + "px" });
                    //偏移

                    //var newPhysicsEle=rotateEleCalculate.getSizeAndPosition(parameter.left,parameter.top,cWidth,cHeight,parameter.rotate);
                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }
                    $(element).css({ "left": excursionX + "px", "top": excursionY + "px" });

                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {

                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'leftTop', 'scale': percent };
                }
                function leftBottomResize(offsetX, offsetY, rightRotate) {
                    //位置是6
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;

                    switch (rightRotate) {
                        case 0: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 1: percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 2: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 3: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 4: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 5: percent = (offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 6: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 7: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                    }

                    //percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "min-height": cHeight + "px", width: cWidth + "px" });
                    //偏移

                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }

                    element.css({ "top": excursionY, "left": excursionX });
                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {
                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'leftBottom', 'scale': percent };
                }
                function rightTopResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;


                    switch (rightRotate) {
                        case 0: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 1: percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 2: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 3: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 4: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 5: percent = (offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 6: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 7: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                    }

                    //percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "min-height": cHeight + "px", width: cWidth + "px" });
                    //偏移
                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }

                    element.css({ "top": excursionY, "left": excursionX });

                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {
                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'rightTop', 'scale': percent };
                }
                function rightBottomResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;

                    switch (rightRotate) {
                        case 0: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 1: percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 2: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 3: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 4: percent = (offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 5: percent = (offsetY + parameter.eleHeight) / parameter.eleHeight; break;
                        case 6: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                        case 7: percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth; break;
                    }

                    //percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "min-height": cHeight + "px", width: cWidth + "px" });

                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }

                    element.css({ "top": excursionY, "left": excursionX });


                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {
                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'rightBottom', 'scale': percent };
                }
                function onlyLeftResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;

                    var offset = 0;

                    switch (rightRotate) {
                        case 0: offset = -offsetX; break;
                        case 1: offset = -offsetY; break;
                        case 2: offset = offsetX; break;
                        case 3: offset = offsetX; break;
                        case 4: offset = offsetX; break;
                        case 5: offset = offsetY; break;
                        case 6: offset = -offsetX; break;
                        case 7: offset = -offsetX; break;
                    }


                    cWidth = parameter.eleWidth + offset;
                    cHeight = eleBox.css("height");
                    percent = cWidth / parameter.eleWidth;

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "width": cWidth + "px" });

                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }


                    element.css({ "top": excursionY, "left": excursionX });

                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {

                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'left', 'scale': percent };
                }
                function onlyRightResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;
                    var offset = 0;

                    switch (rightRotate) {
                        case 0: offset = -offsetX; break;
                        case 1: offset = -offsetY; break;
                        case 2: offset = offsetX; break;
                        case 3: offset = offsetX; break;
                        case 4: offset = offsetX; break;
                        case 5: offset = offsetY; break;
                        case 6: offset = -offsetX; break;
                        case 7: offset = -offsetX; break;
                    }

                    cWidth = parameter.eleWidth + offset;
                    cHeight = eleBox.css("height");
                    percent = cWidth / parameter.eleWidth;

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "width": cWidth + "px" });


                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }


                    element.css({ "top": excursionY, "left": excursionX });

                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {

                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'right', 'scale': percent };
                }
                function onlyTopResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;
                    var offset = 0;

                    switch (rightRotate) {
                        case 0: offset = -offsetX; break;
                        case 1: offset = -offsetY; break;
                        case 2: offset = offsetX; break;
                        case 3: offset = offsetX; break;
                        case 4: offset = offsetX; break;
                        case 5: offset = offsetY; break;
                        case 6: offset = -offsetX; break;
                        case 7: offset = -offsetX; break;
                    }

                    cHeight = parameter.eleHeight + offset;
                    cWidth = eleBox.css("width");
                    percent = cHeight / parameter.eleHeight;

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "min-height": cHeight + "px" });

                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }

                    element.css({ "top": excursionY, "left": excursionX });


                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {

                    // } else {
                    //     $(element).css("top", parseInt($(element).css("top")) + offset);
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'top', 'scale': percent };
                }
                function onlyBottomResize(offsetX, offsetY, rightRotate) {
                    var percent = 0;
                    var cHeight = 0;
                    var cWidth = 0;
                    var top = 0;
                    var offset = 0;

                    switch (rightRotate) {
                        case 0: offset = -offsetX; break;
                        case 1: offset = -offsetY; break;
                        case 2: offset = offsetX; break;
                        case 3: offset = offsetX; break;
                        case 4: offset = offsetX; break;
                        case 5: offset = offsetY; break;
                        case 6: offset = -offsetX; break;
                        case 7: offset = -offsetX; break;
                    }

                    cHeight = parameter.eleHeight + offset;
                    cWidth = eleBox.css("width");
                    percent = cHeight / parameter.eleHeight;

                    if (!sizeLimit(cWidth, cHeight)) {
                        return null;
                    }

                    eleBox.css({ "min-height": cHeight + "px" });

                    var excursionX = 0;
                    var excursionY = 0;
                    switch (rightRotate) {
                        case 0: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 1: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 2: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 3: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left; break;
                        case 4: excursionY = parameter.top; excursionX = parameter.left; break;
                        case 5: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 6: excursionY = parameter.top; excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                        case 7: excursionY = parameter.top + (parameter.eleHeight - cHeight); excursionX = parameter.left + (parameter.eleWidth - cWidth); break;
                    }


                    element.css({ "top": excursionY, "left": excursionX });

                    //缩放模块
                    // if (eleBox.height() > eleDom.height() || eleType === "image") {

                    // } else {
                    //     eleBox.css("min-height", eleDom.height());
                    // }
                    return { 'type': 'bottom', 'scale': percent };
                }


                var moveFirstFlag = true;
                function listenMousemove(e) {
                    if (parameter.flag) {

                        //偏移值
                        var offsetX = e.clientX - parameter.cx;
                        var offsetY = e.clientY - parameter.cy;

                        if (moveFirstFlag) {
                            //向下通知 正在移动
                            moveFirstFlag = false;
                        }

                        var resizeInfo = {};
                        switch (parameter.target) {
                            case 0: resizeInfo = leftTopResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 1: resizeInfo = onlyTopResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 2: resizeInfo = rightTopResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 3: resizeInfo = onlyRightResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 4: resizeInfo = rightBottomResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 5: resizeInfo = onlyBottomResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 6: resizeInfo = leftBottomResize(offsetX, offsetY, parameter.rightRotate); break;
                            case 7: resizeInfo = onlyLeftResize(offsetX, offsetY, parameter.rightRotate); break;
                        }
                        if (parameter.isGroupEle) {
                            var groupEleLeft = parseInt($(element).css('left'));
                            var groupEleTop = parseInt($(element).css('top'));
                            var outerWidth = $(element).outerWidth();
                            var outerHeight = $(element).outerHeight();
                            var elePar = rotateEleCalculate.getSizeAndPosition(groupEleLeft, groupEleTop, outerWidth, outerHeight, parameter.rotate);
                            var triggerData = { ID: groupID, elePar: elePar };
                            $(element).trigger("groupUpdate", triggerData);
                            if (elePar.left < 0) {
                                offsetX = (elePar.width - outerWidth) / 2;
                                $(element).css({ left: offsetX });
                            }
                            if (elePar.top < 0) {
                                offsetY = (elePar.height - outerHeight) / 2;
                                $(element).css({ top: offsetY + "px" });
                            }
                        }

                        /**
                         * 图片是一个比较特殊的情况
                         * 需要调整裁剪的位置等
                         */
                        if (eleType == "image") {
                            var activePage = activePageService.getActivePage().value;
                            var ele = websiteData.getEle(activePage, attrs.id);
                            imageCropService.resetImage($(element), ele, parameter.eleWidth, parameter.eleHeight, parameter.imageWidth, parameter.imageHeight, parameter.clip);
                        }

                        /**
                         * 如果是手机那边的文字 需要同步border-box 和position-box的大小
                        */
                        if (parameter.type == 'ele-phone' && eleType == 'text') {
                            var borderWidth = parameter.eleData.phoneStyle.scale * parseInt($(element).find('>.ele-box').get(0).offsetWidth);
                            var borderHeight = parameter.eleData.phoneStyle.scale * parseInt($(element).find('>.ele-box').get(0).offsetHeight);
                            $(element).css({ 'width': borderWidth, 'height': borderHeight });
                        }

                        /**
                         * 如果调整的是组的大小的话
                         * 并且拖拽的是四个角落
                         * 要缩放元素
                        */
                        if (eleType == 'group' && (parameter.target == 0 || parameter.target == 2 || parameter.target == 4 || parameter.target == 6)) {
                            if (parameter.type == 'ele-web') {
                                builderTool.zoomEle(parameter.eleData, resizeInfo.scale);
                            }
                            if (parameter.type == 'ele-phone') {
                                phoneBuilderTool.zoomEle(parameter.eleData, resizeInfo.scale);
                            }
                        }

                        //触发更新指示器
                        eleIndicator.update();

                    }
                }
                function listenMouseup(e) {

                    if (parameter.flag) {

                        //清除指示器
                        eleIndicator.remove();

                        parameter.flag = false;

                        //标记移动结束
                        $rootScope.$emit("eleDragEnd");                        
                        if (moveFirstFlag === false) {
                            moveFirstFlag = true;
                        }

                        if (parameter.type == 'ele-web') {
                            if (parameter.isGroupEle !== true) {
                                var eleData = builderTool.getEle(attrs.id, attrs.eleType);
                                websiteData.updateEle(scope.websiteCode.ID, eleData);
                            } else {
                                //更新组
                                var eleData = builderTool.getEle(firstParentGroupID, "group");
                                websiteData.updateEle(activePageService.getActivePage().value, eleData);
                            }
                        }

                        if (parameter.type == 'ele-phone') {
                            if (parameter.isGroupEle !== true) {
                                eleData = phoneBuilderTool.getEle(attrs.id, attrs.eleType);
                                websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);
                            } else {
                                //更新组
                                eleData = phoneBuilderTool.getEle(firstParentGroupID, "group");
                                websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);
                            }
                        }


                    }
                }
                $(document).on("mousemove", listenMousemove);
                $(document).on("mouseup", listenMouseup);

                scope.$on("$destroy", function () {
                    $(document).off("mousemove", listenMousemove);
                    $(document).off("mouseup", listenMouseup);
                });

            }
        };
    })
    .factory('eleIndicator', function (elePosition) {
        /**
         * 组件需要一个显示当前元素大小的组件
         * 这里可以封装一个
         */

        var indicatorHandle = null;
        var eleTarget = null;
        var template = '<div class="ele-indicator"></div>';
        var offset = {
            left: 0,
            top: 0
        }
        var type = 'size';

        var handle = {
            add: function (target, offsetLeft, offsetTop, moduleType) {
                if (moduleType != undefined) {
                    type = moduleType;
                }
                if (offsetLeft != undefined) {
                    offset.left = offsetLeft;
                }
                if (offsetTop != undefined) {
                    offset.top = offsetTop;
                }
                handle.remove();

                var dom = $(template);
                $('body').append(dom);
                indicatorHandle = dom;
                eleTarget = target;

                /**
                 * 根据target的位置设置指示器的位置
                 */
                handle.update();
            },
            remove: function () {
                if (indicatorHandle != null) {
                    indicatorHandle.remove();
                    indicatorHandle = null;
                    eleTarget = null;
                }
            },
            update: function () {
                if (indicatorHandle != null) {
                    switch (type) {
                        case 'size': indicatorHandle.text('W:' + $(eleTarget).get(0).offsetWidth + ' | H:' + $(eleTarget).get(0).offsetHeight); break;
                        case 'position': indicatorHandle.text('X:' + parseInt($(eleTarget).css('left')) + ' | Y:' + parseInt($(eleTarget).css('top'))); break;
                        case 'rotate': indicatorHandle.text(handle.getDeg()+'deg'); break;
                    }
                    //同时还要更新元素的位置
                    var x = elePosition.getLeft(eleTarget.get(0));
                    var y = elePosition.getTop(eleTarget.get(0));
                    indicatorHandle.css({ 'left': x + offset.left, 'top': y + offset.top });
                }
            },
            getDeg:function(){
                var deg = eval('handle.get'+eleTarget.css('transform'));
                if(deg == undefined){
                    deg = 0;
                }
                return deg;
            },
            getmatrix(a, b, c, d, e, f) {
                var aa = Math.round(180 * Math.asin(a) / Math.PI);
                var bb = Math.round(180 * Math.acos(b) / Math.PI);
                var cc = Math.round(180 * Math.asin(c) / Math.PI);
                var dd = Math.round(180 * Math.acos(d) / Math.PI);
                var deg = 0;
                if (aa == bb || -aa == bb) {
                    deg = dd;
                } else if (-aa + bb == 180) {
                    deg = 180 + cc;
                } else if (aa + bb == 180) {
                    deg = 360 - cc || 360 - dd;
                }
                return deg >= 360 ? 0 : deg;
            }
        }
        return handle;
    });