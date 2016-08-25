"use strict";
angular.module('myBuilderApp')
    .directive('sessionResize', function ($timeout, websiteData) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var par = {};
                par.minHeight = 0;
                par.startY = 0;
                par.currentHeight = 0;
                par.flag = false;

                var sessionID = $(element).attr('id');

                var handle = $(element);
                $(element).find('> .session-resize').on('mousedown', function (e) {
                    e.preventDefault();
                    par.currentHeight = parseInt(handle.css('min-height'));
                    par.startY = e.pageY;
                    par.flag = true;
                    par.minHeight = websiteData.getSessionMinHeight(sessionID);
                });

                function listenMousemove(e) {
                    if (par.flag) {
                        var offsetY = 0;
                        offsetY = e.pageY - par.startY;
                        if (offsetY > 0) {
                            offsetY = offsetY + par.currentHeight;
                        } else if (offsetY + par.currentHeight >= par.minHeight) {
                            offsetY = offsetY + par.currentHeight;
                        } else {
                            return;
                        }
                        $(element).css('min-height', offsetY + 'px');
                    }
                }
                function listenMouseup(e) {
                    if (par.flag) {
                        par.flag = false;
                        //更新数组
                        if (attrs.sessionResize === 'phone') {
                            websiteData.changePhoneSessionHeight(sessionID, parseInt(handle.css('min-height')));
                        } else {
                            websiteData.changeSessionHeight(sessionID, parseInt(handle.css('min-height')));
                        }
                    }
                }

                $(document).on("mousemove", listenMousemove);
                $(document).on("mouseup", listenMouseup);

                scope.$on("$destroy", function () {
                    $(document).off("mousedown", listenMousemove);
                    $(document).off("mouseup", listenMouseup);
                });

            }
        };
    })
    .directive('createThumbnail', function (phoneCreatorServices, creatorServices, $compile) {
        return {
            restrict: 'A',
            scope: { createThumbnail: "=", type: "@", eleType: "@", layout: "@" ,previewHeight: '@'},
            link: function (scope, element, attrs) {

                var previewBox = {
                    width: $(element).width(),
                    height: 'auto'
                };
                if(scope.previewHeight!=undefined){
                    previewBox.height = parseFloat(scope.previewHeight);
                }
                $(element).height(previewBox.height);

                function changeID(obj) {
                    obj.ID = 'preview' + obj.ID;
                    if (obj.eleList !== undefined) {
                        for (var i = 0; i < obj.eleList.length; i++) {
                            changeID(obj.eleList[i]);
                        }
                    } else {
                        return;
                    }
                }

                var dom = "";
                var eleData = jQuery.extend(true, {}, scope.createThumbnail);
                //更改元素的ID
                changeID(eleData);
                if (scope.type === 'phone') {
                    if (scope.eleType === 'session') {
                        dom = phoneCreatorServices.createSession(eleData);
                    }
                    if (scope.eleType === 'ele') {
                        dom = phoneCreatorServices.createEle(eleData);
                    }
                }
                if (scope.type === 'web') {
                    if (scope.eleType === 'session') {
                        dom = creatorServices.createSession(eleData);
                    }
                    if (scope.eleType === 'ele') {
                        dom = creatorServices.createEle(eleData);
                    }
                }

                //添加预览标签
                dom.attr("thumbnail", "true");

                dom = $compile(dom.get(0))(scope);

                //处理不需要的元素
                dom.find('.resize').remove();
                dom.find('.session-resize').remove();
                dom.find('.rotate').remove();
                dom.find('.line').remove();
                dom.find('.ele-label').remove();
                dom.find('.menu-tool-box').remove();

                element.empty();
                element.append(dom);

                var eleList = element.find('.position-box');
                // for (var i = 0; i < eleList.length; i++) {
                //     var ele = eleList.eq(i).find('.ele');
                //     var height = ele.height();
                //     ele.css('margin-top', -height / 2);
                // }

                if (attrs.eleType === 'session' && attrs.type === 'phone') {
                    element.css('top', '50%');
                    element.css('margin-top', -(element.height() * 0.35) / 2);
                }
                if (attrs.eleType === 'session' && attrs.type === 'web') {
                    element.css('top', '50%');
                    element.css('margin-top', -(element.height() * 0.095) / 2);
                }
                if (attrs.eleType === 'session') {

                }
                if (attrs.eleType === 'ele') {
                    var eleDom = $(element).find('> .position-box-parent > .position-box');
                    var borderDom = eleDom.find(' > .ele-box');

                    //先找出宽和高哪个比较大然后再对比
                    var percent = 1;
                    var percentX = 1;
                    var percentY = 1;
                    var scaleFlag = false;
                    if (borderDom.width() > previewBox.width) {
                        percentX = previewBox.width / borderDom.width();
                    }
                    if (borderDom.height() > previewBox.height) {
                        percentY = previewBox.height / parseInt(borderDom.css('min-height'));
                    }

                    if (percentX < percentY) {
                        percent = percentY;
                    } else {
                        percent = percentX;
                    }

                    if (scope.layout === "normal") {
                        eleDom.css('position', 'static');
                    } else {
                        borderDom.css({ "transform": "scale(" + percent + "," + percent + ")", "-ms-transform": "scale(" + percent + "," + percent + ")", "-moz-transform": "scale(" + percent + "," + percent + ")", "-webkit-transform": "scale(" + percent + "," + percent + ")", "-o-transform": "scale(" + percent + "," + percent + ")" });
                        eleDom.css('left', '50%');
                        eleDom.css('top', '50%');
                        eleDom.css('margin-left', -borderDom.width() / 2);
                        eleDom.css('margin-top', -borderDom.height() / 2);
                        //设置origin
                        borderDom.css({ "transform-origin": "50% 50%", "-ms-transform-origin": "50% 50%", "-moz-transform-origin": "50% 50%", "-webkit-transform-origin": "50% 50%", "-o-transform-origin": "50% 50%" });
                    }
                }

            }
        };
    })
    .directive('pageSettingToolModal', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.pageMenuShow = false;
                scope.toggleMenu = function () {
                    scope.pageMenuShow = !scope.pageMenuShow;
                    if (scope.pageMenuShow) {
                        //关闭菜单
                        $rootScope.$broadcast("closeLeftMenu");
                    }
                };
                $(element).find(".tool-modal").height($("body").height() * parseFloat(attrs.pageSettingToolModal));

                function mousedown(e) {
                    scope.$apply(function () {
                        scope.pageMenuShow = false;
                    });
                }

                $("body").on('mousedown', mousedown);

                scope.$on("$destory", function () {
                    $("body").off('mousedown', mousedown);
                });

            }
        };
    })
    .directive('onGroupSizeChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var eleDom = $(element);
                var left = 0;
                var width = 0;
                var height = 0;
                var top = 0;
                var boxDom = eleDom.find(' >.ele-box');
                var elementID = eleDom.attr('id');


                var parentGroup = null;
                if ($(element).parents('.position-box[ele-type=group]').length > 0) {
                    parentGroup = $(element).parents('.position-box[ele-type=group]').eq(0).attr('id');
                }

                //用jquery的监听  由于scope的层级关系这里我处理的有点问题
                var eleList = [];
                $(element).on("groupUpdateInit", function (e, ID) {
                    if (elementID === ID) {
                        $(element).trigger("groupUpdateInit", parentGroup);
                        left = parseInt(eleDom.css('left'));
                        top = parseInt(eleDom.css('top'));
                        width = eleDom.get(0).clientWidth;
                        height = eleDom.get(0).clientHeight;

                        eleList = $(element).find(' >.ele-box >.ele >.position-box-parent >.position-box');
                        for (var i = 0; i < eleList.length; i++) {
                            eleList.get(i).eleLeft = parseInt(eleList.eq(i).css("left"));
                            eleList.get(i).eleTop = parseInt(eleList.eq(i).css("top"));
                        }

                    }
                });

                $(element).on("groupUpdate", function (e, eleData) {
                    var obj = jQuery.extend(true, {}, eleData);

                    //标记宽度的增加
                    if (elementID === obj.ID) {
                        var changeFlag = false;
                        var i = 0;
                        //如果自己需要改变大小在改变之后再把这个信息往上传，如果不需要改变就终止
                        var newWidth = 0;
                        if (obj.elePar.left < 0) {
                            //左边要增大
                            newWidth = width + Math.abs(obj.elePar.left);
                            boxDom.css("width", newWidth);
                            eleDom.css("left", left + obj.elePar.left);
                            changeFlag = true;
                            //同时所有元素向右移动
                            for (i = 0; i < eleList.length; i++) {
                                if (eleList.eq(i).attr('ele-type') === 'group') {
                                    eleList.eq(i).css("left", 0);
                                } else {
                                    eleList.eq(i).css("left", eleList.get(i).eleLeft + Math.abs(obj.elePar.left));
                                }
                            }

                            obj.elePar.left = 0;

                        }
                        if (obj.elePar.left + obj.elePar.width > width) {
                            //右边要增大
                            if (newWidth < obj.elePar.left + obj.elePar.width) {
                                boxDom.css("width", obj.elePar.left + obj.elePar.width);
                                changeFlag = true;
                            }
                        }
                        var newHeight = 0;
                        if (obj.elePar.top < 0) {
                            //上边要增大
                            newHeight = height + Math.abs(obj.elePar.top);
                            boxDom.css("min-height", newHeight);
                            eleDom.css("top", top + obj.elePar.top);
                            changeFlag = true;
                            //同时所有元素向下移动
                            for (i = 0; i < eleList.length; i++) {
                                if (eleList.eq(i).attr('ele-type') === 'group') {
                                    eleList.eq(i).css("top", 0);
                                } else {
                                    eleList.eq(i).css("top", eleList.get(i).eleTop + Math.abs(obj.elePar.top));
                                }
                            }

                            //重置top 为0  让下面的判断正常执行
                            obj.elePar.top = 0;
                        }
                        if (obj.elePar.top + obj.elePar.height > height) {
                            //下边要增大
                            if (newHeight < obj.elePar.top + obj.elePar.height) {
                                boxDom.css("min-height", obj.elePar.top + obj.elePar.height);
                                changeFlag = true;
                            }
                        }


                        if (changeFlag) {
                            //先发初始化指令
                            if (parentGroup !== null) {
                                var eleObj = { width: boxDom.width(), height: boxDom.height(), left: parseInt(eleDom.css('left')), top: parseInt(eleDom.css('top')) };
                                var parentGroupObj = { ID: parentGroup, elePar: eleObj };
                                $(element).trigger("groupUpdate", parentGroupObj);
                            }
                        }

                    }
                });


            }
        };
    })
    ;
