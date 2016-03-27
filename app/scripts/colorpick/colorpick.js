"use strict";
angular.module('kyle.colorPick', [])
    .directive('colorPickEle', function (colorPickService,$timeout) {
        return {
            restrict: 'A',
            scope: {baseTarget: "@baseTarget",pickType:"@pickType"},
            link: function (scope, element,attrs) {
                //打开颜色选择器
                var colorPick=null;
                $timeout(function(){
                    if (scope.baseTarget === undefined) {
                        colorPick = $(element);
                    } else {
                        colorPick = $("#" + scope.baseTarget);
                    }

                    $(element).on("click", function () {
                        colorPickService.setType(scope.pickType);
                        colorPickService.updateOldColor();
                        var top = colorPick.offset().top;
                        var left = colorPick.offset().left;
                        colorPickService.showDom(left, top);
                    });

                });
            }
        };
    })
    .directive('colorPickBoxEle', function (colorPickService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope:{colorPickBoxEle:"@"},
            link: function (scope, element,attrs,ngModel) {
                //打开颜色选择器
                var colorPick=$(element);

                $(element).on("click", function () {
                    //设置标志 标记这次更改的目标
                    colorPickService.setPickTarget(scope.colorPickBoxEle);
                    colorPickService.setColorHandle(ngModel);
                    colorPickService.updateOldColor();
                    /*********更新颜色到插件 并把model传过去，方便更新***********/
                    var top = colorPick.offset().top+30;
                    var left = colorPick.offset().left;
                    colorPickService.showBoxDom(left, top);
                });

            }
        };
    })
    .directive('colorPickBox', function (userProfile,siteConfig,colorPickService) {
        return {
            restrict: 'A',
            template: ['<div class="color-pick-box" id="color-pick-box" drag-ele handle="handle" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">',
                '    <div class="my-color">',
                '        <div class="title handle">',
                '            文字颜色',
                '            <button class="btn btn--xs btn--white btn--icon" lx-ripple ng-click="closeColorPick()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="content-box">',
                '            <div class="row sub-title">',
                '                <span class="left">主题颜色</span><span class="right">更换</span>',
                '            </div>',
                '            <div class="row color-list z-depth-1">',
                '                <div class="item" ng-repeat="color in themeColor" ng-click="setColor(color.value)" ng-style="{\'background-color\': color.value}"></div>',
                '                <div style="clear: both"></div>',
                '            </div>',
                '            <div class="row sub-title">',
                '                <span class="left">我的颜色</span>',
                '            </div>',
                '            <div class="row color-list box-padding">',
                '                <div class="item-round">',
                '                    <div class="round" color-pick-ele pick-type="add" base-target="color-pick-box"><i class="mdi mdi-plus"></i></div>',
                '                </div>',
                '                <div class="item-round" ng-repeat="color in myColor track by $index">',
                '                    <div class="round" ng-click="setColor(color)" ng-style="{\'background-color\': color}"></div>',
                '                </div>',
                '                <div style="clear: both"></div>',
                '            </div>',
                '            <div class="row add-color">',
                '                <i class="mdi mdi-pencil" color-pick-ele  base-target="color-pick-box">编辑颜色</i>',
                '            </div>',
                '        </div>',
                '    </div>',
                '</div>'].join(""),
            replace: true,
            link: function (scope, element,attrs) {

                scope.myColor=userProfile.getMyColor();
                scope.themeColor=siteConfig.getThemeColor();

                scope.setColor=function(color){
                    colorPickService.changeColor(color);
                    colorPickService.updateOldColor();
                }

                scope.closeColorPick=function(){
                    colorPickService.hideBoxDom();
                }
            }
        }
    })
    .directive('colorPick', function (colorPickService,userProfile) {
        return {
            restrict: 'A',
            template: ['<div class="color-pick" id="color-pick-select" onmousedown="event.stopPropagation()">',
                '        <div class="color-select-box">',
                '            <div class="color-select-box-handle z-depth-1"></div>',
                '            <div class="color-layer main" ng-style="{\'background-color\':hColor}"></div>',
                '            <div class="color-layer white"></div>',
                '            <div class="color-layer black"></div>',
                '        </div>',
                '        <div class="color-line">',
                '            <div class="color-line-handle z-depth-1"></div>',
                '            <img src="images/hue-horizontal.png">',
                '        </div>',
                '        <div class="current-color-box">',
                '            <div class="z-depth-1 current-color" style="background-image: url(\'images/point.png\')">',
                '               <div class="handle-box"></div>',
                '               <div class="main" ng-style="{\'background-image\': \'linear-gradient(to left, rgba(255, 255, 255, 0), \'+currentColor+\')\'}"></div>',
                '            </div>',
                '        </div>',
                '        <div class="color-code" ng-init="tabState=0">',
                '           <div class="tc-white-1" flex-container="row">',
                '               <div flex-item="4" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==0] ng-click="tabState=0" lx-ripple>HEX</button></div>',
                '               <div flex-item="4" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==1] ng-click="tabState=1" lx-ripple>RGB</button></div>',
                '               <div flex-item="4" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==2] ng-click="tabState=2" lx-ripple>HSB</button></div>',
                '           </div>',
                '           <div class="color-code-box" ng-show="tabState==0">',
                '               <lx-text-field label="HEX">',
                '                   <input type="text" ng-model="inputColor.currentColorHEX" ng-blur="currentColorHEXBlur()" ng-keyup="changeHEX()">',
                '               </lx-text-field>',
                '           </div>',
                '           <div class="color-code-box" ng-show="tabState==1">',
                '                <div class="item">',
                '                    <lx-text-field label="R">',
                '                        <input type="text" ng-model="inputColor.currentColorRGB.r" ng-keyup="changeRGB()">',
                '                    </lx-text-field>',
                '                </div>',
                '                <div class="item">',
                '                    <lx-text-field label="G">',
                '                        <input type="text" ng-model="inputColor.currentColorRGB.g" ng-keyup="changeRGB()">',
                '                    </lx-text-field>',
                '                </div>',
                '                <div class="item">',
                '                    <lx-text-field label="B">',
                '                        <input type="text" ng-model="inputColor.currentColorRGB.b" ng-keyup="changeRGB()">',
                '                    </lx-text-field>',
                '                </div>',
                '           </div>',
                '            <div class="color-code-box" ng-show="tabState==2">',
                '                <div class="item">',
                '                    <lx-text-field label="H">',
                '                        <input type="text" ng-model="inputColor.colorHSB.h" ng-keyup="changeHSB()">',
                '                    </lx-text-field>',
                '                </div>',
                '                <div class="item">',
                '                    <lx-text-field label="S">',
                '                        <input type="text" ng-model="inputColor.colorHSB.s" ng-keyup="changeHSB()">',
                '                    </lx-text-field>',
                '                </div>',
                '                <div class="item">',
                '                    <lx-text-field label="B">',
                '                        <input type="text" ng-model="inputColor.colorHSB.b" ng-keyup="changeHSB()">',
                '                    </lx-text-field>',
                '                </div>',
                '            </div>',
                '        </div>',
                '        <div class="bottom-button">',
                '            <div class="item">',
                '                <button class="btn btn--m btn--grey btn--flat" lx-ripple ng-click="cancel()">取消</button>',
                '            </div>',
                '            <div class="item">',
                '                <button class="btn btn--m btn--blue btn--flat" lx-ripple ng-click="confirm()">确定</button>',
                '            </div>',
                '        </div>',
                '    </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                /************************获取初始颜色***************************/

                //当前颜色
                scope.currentColor = "#ffffff";
                //上一次选择的颜色
                scope.pastColor = "#ffffff";
                //主颜色 改变角度的时候要改变
                scope.hColor = "#ff0000";

                scope.inputColor = {
                    colorHSB: {
                        h: 360,
                        s: 0,
                        b: 100
                    },
                    currentColorHEX: "#ffffff",
                    currentColorRGB: {
                        r: 255,
                        g: 255,
                        b: 255
                    }
                };
                scope.opacity=1;

                var colorPickSelect = $(element);

                scope.changePastColor = function (color) {
                    scope.pastColor = color;
                };
                scope.changeCurrentColor = function (color) {
                    scope.currentColor = color;
                    //重新计算各个位置的颜色值

                };

                /*处理颜色*/
                var colorLinePar = {
                    flag: false,
                    left: 0,
                    cx: 0,
                    eleWidth: 0,
                    handleWidth: 0
                };

                var colorLineTarget = $(element).find(".color-line .color-line-handle");
                var colorLine = $(element).find(".color-line");

                colorLinePar.eleWidth = parseInt(colorLine.width());
                colorLinePar.handleWidth = parseInt(colorLineTarget.width());

                colorLine.on("mousedown", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    colorLinePar.flag = true;
                    colorLinePar.left = colorLineTarget.offset().left;

                    colorLinePar.cx = parseInt(colorLineTarget.css("left"));

                    var offsetX = e.pageX - colorLinePar.left;
                    offsetX = colorLinePar.cx + offsetX - colorLinePar.handleWidth / 2;

                    if (offsetX < -colorLinePar.handleWidth / 2) {
                        offsetX = -colorLinePar.handleWidth / 2;
                    }
                    if (offsetX > colorLinePar.eleWidth - colorLinePar.handleWidth / 2) {
                        offsetX = colorLinePar.eleWidth - colorLinePar.handleWidth / 2;
                    }

                    colorLineTarget.css("left", offsetX);

                    offsetX += colorLinePar.handleWidth / 2;

                    scope.inputColor.colorHSB.h = parseInt((1 - offsetX / colorLinePar.eleWidth) * 360);

                    //选中颜色
                    scope.$apply(function () {
                        scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                        //hex 颜色
                        scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        //rgb 颜色
                        scope.inputColor.currentColorRGB = colorPickService.HSBtoRGB(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                    });

                });

                function colorLineMousemove(e){
                    if (colorLinePar.flag) {
                        var offsetX = e.pageX - colorLinePar.left;
                        offsetX = colorLinePar.cx + offsetX;
                        if (offsetX < -colorLinePar.handleWidth / 2) {
                            offsetX = -colorLinePar.handleWidth / 2;
                        }
                        if (offsetX > colorLinePar.eleWidth - colorLinePar.handleWidth / 2) {
                            offsetX = colorLinePar.eleWidth - colorLinePar.handleWidth / 2;
                        }
                        colorLineTarget.css("left", offsetX);

                        offsetX += colorLinePar.handleWidth / 2;
                        scope.inputColor.colorHSB.h = parseInt((1 - offsetX / colorLinePar.eleWidth) * 360);

                        //选中颜色
                        scope.$apply(function () {
                            scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                            //hex 颜色
                            scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                            scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                            //rgb 颜色
                            scope.inputColor.currentColorRGB = colorPickService.HSBtoRGB(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        });

                    }
                }
                function colorLineMouseup(e){
                    if (colorLinePar.flag) {
                        colorLinePar.flag = false;
                    }
                }

                $(document).on("mousemove",colorLineMousemove);
                $(document).on("mouseup", colorLineMouseup);


                /**************************微调颜色******************************/
                var colorSelectPar = {
                    flag: false,
                    left: 0,
                    top: 0,
                    cx: 0,
                    cy: 0,
                    eleWidth: 0,
                    eleHeight: 0,
                    handleWidth: 0,
                    handleHeight: 0
                };
                var colorSelect = $(element).find(".color-select-box");
                var colorSelectTarget = $(element).find(".color-select-box .color-select-box-handle");

                colorSelectPar.eleWidth = parseInt(colorSelect.width());
                colorSelectPar.eleHeight = parseInt(colorSelect.height());
                colorSelectPar.handleWidth = parseInt(colorSelectTarget.width());
                colorSelectPar.handleHeight = parseInt(colorSelectTarget.height());

                colorSelect.on("mousedown", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    colorSelectPar.flag = true;
                    colorSelectPar.left = colorSelectTarget.offset().left;
                    colorSelectPar.top = colorSelectTarget.offset().top;

                    colorSelectPar.cx = parseInt(colorSelectTarget.css("left"));
                    colorSelectPar.cy = parseInt(colorSelectTarget.css("top"));

                    var offsetX = e.pageX - colorSelectPar.left;
                    var offsetY = e.pageY - colorSelectPar.top;
                    offsetX = colorSelectPar.cx + offsetX - colorSelectPar.handleWidth / 2;
                    offsetY = colorSelectPar.cy + offsetY - colorSelectPar.handleHeight / 2;

                    if (offsetX < -colorSelectPar.handleWidth / 2) {
                        offsetX = -colorSelectPar.handleWidth / 2;
                    }
                    if (offsetX > colorSelectPar.eleWidth - colorSelectPar.handleWidth / 2) {
                        offsetX = colorSelectPar.eleWidth - colorSelectPar.handleWidth / 2;
                    }

                    if (offsetY < -colorSelectPar.handleHeight / 2) {
                        offsetY = -colorSelectPar.handleHeight / 2;
                    }
                    if (offsetY > colorSelectPar.eleHeight - colorSelectPar.handleHeight / 2) {
                        offsetY = colorSelectPar.eleHeight - colorSelectPar.handleHeight / 2;
                    }

                    colorSelectTarget.css("left", offsetX);
                    colorSelectTarget.css("top", offsetY);

                    offsetX += colorSelectPar.handleWidth / 2;
                    offsetY += colorSelectPar.handleHeight / 2;

                    scope.inputColor.colorHSB.s = parseInt((offsetX / colorSelectPar.eleWidth) * 100);
                    scope.inputColor.colorHSB.b = parseInt((1 - offsetY / colorSelectPar.eleHeight) * 100);

                    //选中颜色
                    scope.$apply(function () {
                        scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        //rgb 颜色
                        scope.inputColor.currentColorRGB = colorPickService.HSBtoRGB(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                    });

                });

                function colorSelectMousemove(e){
                    if (colorSelectPar.flag) {
                        var offsetX = e.pageX - colorSelectPar.left;
                        var offsetY = e.pageY - colorSelectPar.top;
                        offsetX = colorSelectPar.cx + offsetX;
                        offsetY = colorSelectPar.cy + offsetY;

                        if (offsetX < -colorSelectPar.handleWidth / 2) {
                            offsetX = -colorSelectPar.handleWidth / 2;
                        }
                        if (offsetX > colorSelectPar.eleWidth - colorSelectPar.handleWidth / 2) {
                            offsetX = colorSelectPar.eleWidth - colorSelectPar.handleWidth / 2;
                        }

                        if (offsetY < -colorSelectPar.handleHeight / 2) {
                            offsetY = -colorSelectPar.handleHeight / 2;
                        }
                        if (offsetY > colorSelectPar.eleHeight - colorSelectPar.handleHeight / 2) {
                            offsetY = colorSelectPar.eleHeight - colorSelectPar.handleHeight / 2;
                        }


                        colorSelectTarget.css("left", offsetX);
                        colorSelectTarget.css("top", offsetY);

                        offsetX += colorSelectPar.handleWidth / 2;
                        offsetY += colorSelectPar.handleHeight / 2;

                        scope.inputColor.colorHSB.s = parseInt((offsetX / colorSelectPar.eleWidth) * 100);
                        scope.inputColor.colorHSB.b = parseInt((1 - offsetY / colorSelectPar.eleHeight) * 100);

                        //选中颜色
                        scope.$apply(function () {
                            scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                            scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                            //rgb 颜色
                            scope.inputColor.currentColorRGB = colorPickService.HSBtoRGB(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        });

                    }
                }
                function colorSelectMouseup(e){
                    if (colorSelectPar.flag) {
                        colorSelectPar.flag = false;
                    }
                }

                $(document).on("mousemove", colorSelectMousemove);
                $(document).on("mouseup", colorSelectMouseup);


                /*********************************透明度***************************************/
                /*处理颜色*/
                //opacity透明度
                var transparencyPar = {
                    flag: false,
                    left: 0,
                    cx: 0,
                    eleWidth: 0,
                    handleWidth: 0
                };

                var transparencyBox = $(element).find(".current-color-box .current-color");
                var transparencyHandle = $(transparencyBox).find(".handle-box");

                transparencyPar.eleWidth = parseInt(transparencyBox.width());
                transparencyPar.handleWidth = parseInt(transparencyHandle.width());

                transparencyBox.on("mousedown", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    transparencyPar.flag = true;
                    transparencyPar.left = transparencyHandle.offset().left;

                    transparencyPar.cx = parseInt(transparencyHandle.css("left"));

                    var offsetX = e.pageX - transparencyPar.left;
                    offsetX = transparencyPar.cx + offsetX - transparencyPar.handleWidth / 2;
                    if (offsetX < -transparencyPar.handleWidth / 2) {
                        offsetX = -transparencyPar.handleWidth / 2;
                    }
                    if (offsetX > transparencyPar.eleWidth - transparencyPar.handleWidth / 2) {
                        offsetX = transparencyPar.eleWidth - transparencyPar.handleWidth / 2;
                    }
                    scope.$apply(function () {
                        //获取百分比的数值
                        scope.opacity=(1-offsetX/transparencyPar.eleWidth).toFixed(2)-0.03;
                        transparencyHandle.css("left", offsetX);
                    });


                });

                function transparencyBoxMousemove(e){
                    if (transparencyPar.flag) {
                        var offsetX = e.pageX - transparencyPar.left;
                        offsetX = transparencyPar.cx + offsetX;
                        if (offsetX < -transparencyPar.handleWidth / 2) {
                            offsetX = -transparencyPar.handleWidth / 2;
                        }
                        if (offsetX > transparencyPar.eleWidth - transparencyPar.handleWidth / 2) {
                            offsetX = transparencyPar.eleWidth - transparencyPar.handleWidth / 2;
                        }
                        scope.$apply(function () {
                            scope.opacity=(1-offsetX/transparencyPar.eleWidth).toFixed(2)-0.03;
                            transparencyHandle.css("left", offsetX);
                        });

                    }
                }
                function transparencyBoxMouseup(e){
                    if (transparencyPar.flag) {
                        transparencyPar.flag = false;
                    }
                }

                $(document).on("mousemove",transparencyBoxMousemove);
                $(document).on("mouseup", transparencyBoxMouseup);


                /***********************改变输入框的值的时候的方法**************************/

                scope.currentColorHEXBlur = function () {
                    var pattern = /^#[0-9a-fA-F]{6}$/;
                    //长度为7且不符合条件的时候就可以将其设置为白色
                    if (scope.inputColor.currentColorHEX.match(pattern) === null) {
                        //不合法强制变成白色
                        scope.inputColor.currentColorHEX = "#ffffff";
                        //改变点的位置
                        var left = -colorSelectPar.handleWidth / 2;
                        var top = -colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({left: left + "px", top: top + "px"});
                    }

                    //更新其他颜色值 hColor currentColor colorHSB currentColorRGB
                    scope.currentColor = "#ffffff";
                    scope.inputColor.currentColorRGB.r = 255;
                    scope.inputColor.currentColorRGB.g = 255;
                    scope.inputColor.currentColorRGB.b = 255;

                    scope.inputColor.colorHSB.s = 0;
                    scope.inputColor.colorHSB.b = 100;

                };
                scope.changeHEX = function () {
                    var pattern = /^#[0-9a-fA-F]{6}$/;
                    //长度为7且不符合条件的时候就可以将其设置为白色

                    var lineLeft=0;
                    var selectBoxLeft=0;
                    var selectBoxTop=0;

                    if (scope.inputColor.currentColorHEX.match(pattern) === null && scope.inputColor.currentColorHEX.length >= 7) {
                        //不合法强制变成白色
                        scope.inputColor.currentColorHEX = "#ffffff";

                        //更新其他颜色值 hColor currentColor colorHSB currentColorRGB
                        scope.currentColor = "#ffffff";
                        scope.inputColor.currentColorRGB.r = 255;
                        scope.inputColor.currentColorRGB.g = 255;
                        scope.inputColor.currentColorRGB.b = 255;

                        scope.inputColor.colorHSB.s = 0;
                        scope.inputColor.colorHSB.b = 100;

                        lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                        colorLineTarget.css("left", lineLeft + "px");
                        selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                        colorSelectTarget.css({left: selectBoxLeft + "PX"});
                        selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({top: selectBoxTop + "px"});
                    }
                    if (scope.inputColor.currentColorHEX.match(pattern) !== null && scope.inputColor.currentColorHEX.length === 7) {
                        //更新其他颜色值 hColor currentColor colorHSB currentColorRGB
                        scope.currentColor = scope.inputColor.currentColorHEX;

                        scope.inputColor.currentColorRGB = colorPickService.HEXtoRGB(scope.inputColor.currentColorHEX);

                        scope.inputColor.colorHSB = colorPickService.RGBtoHSB(scope.inputColor.currentColorRGB.r, scope.inputColor.currentColorRGB.g, scope.inputColor.currentColorRGB.b);
                        scope.inputColor.colorHSB.h = parseInt(scope.inputColor.colorHSB.h * 360);
                        scope.inputColor.colorHSB.s = parseInt(scope.inputColor.colorHSB.s * 100);
                        scope.inputColor.colorHSB.b = parseInt(scope.inputColor.colorHSB.b * 100);
                        scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                        //改变点的位置

                        lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                        colorLineTarget.css("left", lineLeft + "px");
                        selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                        colorSelectTarget.css({left: selectBoxLeft + "PX"});
                        selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({top: selectBoxTop + "px"});
                    }

                };
                scope.changeRGB = function () {
                    if (scope.inputColor.currentColorRGB.r < 0 || scope.inputColor.currentColorRGB.r > 255) {
                        scope.inputColor.currentColorRGB.r = 255;
                    }
                    if (scope.inputColor.currentColorRGB.g < 0 || scope.inputColor.currentColorRGB.g > 255) {
                        scope.inputColor.currentColorRGB.g = 255;
                    }
                    if (scope.inputColor.currentColorRGB.b < 0 || scope.inputColor.currentColorRGB.b > 255) {
                        scope.inputColor.currentColorRGB.b = 255;
                    }
                    scope.inputColor.colorHSB = colorPickService.RGBtoHSB(scope.inputColor.currentColorRGB.r, scope.inputColor.currentColorRGB.g, scope.inputColor.currentColorRGB.b);
                    scope.inputColor.colorHSB.h = parseInt(scope.inputColor.colorHSB.h * 360);
                    scope.inputColor.colorHSB.s = parseInt(scope.inputColor.colorHSB.s * 100);
                    scope.inputColor.colorHSB.b = parseInt(scope.inputColor.colorHSB.b * 100);
                    scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                    scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                    scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);

                    var lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                    colorLineTarget.css("left", lineLeft + "px");
                    var selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                    colorSelectTarget.css({left: selectBoxLeft + "PX"});
                    var selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                    colorSelectTarget.css({top: selectBoxTop + "px"});
                };
                scope.changeHSB = function () {
                    if (scope.inputColor.colorHSB.h < 0 || scope.inputColor.colorHSB.h > 360) {
                        scope.inputColor.colorHSB.h = 360;
                    }
                    if (scope.inputColor.colorHSB.s < 0 || scope.inputColor.colorHSB.s > 100) {
                        scope.inputColor.colorHSB.s = 0;
                    }
                    if (scope.inputColor.colorHSB.b < 0 || scope.inputColor.colorHSB.b > 100) {
                        scope.inputColor.colorHSB.b = 100;
                    }
                    //更新其他颜色值 hColor currentColor colorHSB currentColorRGB currentColorHEX
                    scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                    scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                    scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                    scope.inputColor.currentColorRGB = colorPickService.HSBtoRGB(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);

                    var lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                    colorLineTarget.css("left", lineLeft + "px");
                    var selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                    colorSelectTarget.css({left: selectBoxLeft + "PX"});
                    var selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                    colorSelectTarget.css({top: selectBoxTop + "px"});
                };



                /***************************************初始化***********************************************/

                scope.oldColorHandle=colorPickService.getOldColorHandle();
                function initColorPick(){
                    var color=scope.oldColorHandle.value;
                    if(color.indexOf("#")!==-1){
                        //#000000颜色
                        scope.currentColor = color;
                        scope.inputColor.currentColorHEX=color;
                        scope.inputColor.currentColorRGB = colorPickService.HEXtoRGB(color);

                        scope.inputColor.colorHSB = colorPickService.RGBtoHSB(scope.inputColor.currentColorRGB.r, scope.inputColor.currentColorRGB.g, scope.inputColor.currentColorRGB.b);
                        scope.inputColor.colorHSB.h = parseInt(scope.inputColor.colorHSB.h * 360);
                        scope.inputColor.colorHSB.s = parseInt(scope.inputColor.colorHSB.s * 100);
                        scope.inputColor.colorHSB.b = parseInt(scope.inputColor.colorHSB.b * 100);
                        scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                        scope.opacity=1;
                        //改变点的位置

                        var opacityLeft = ((1 - scope.opacity) * transparencyPar.eleWidth) - transparencyPar.handleWidth / 2;
                        transparencyHandle.css("left", opacityLeft + "px");
                        var lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                        colorLineTarget.css("left", lineLeft + "px");
                        var selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                        colorSelectTarget.css({left: selectBoxLeft + "PX"});
                        var selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({top: selectBoxTop + "px"});

                    }else if(color.indexOf("rgba")!==-1){
                        //rgba
                        //去除空格
                        color.replace(/\s/g, "");
                        color=color.substring(5,color.length-1).split(',');

                        scope.inputColor.currentColorRGB.r=color[0];
                        scope.inputColor.currentColorRGB.g=color[1];
                        scope.inputColor.currentColorRGB.b=color[2];
                        scope.opacity=color[3];

                        scope.inputColor.colorHSB = colorPickService.RGBtoHSB(color[0],color[1],color[2]);
                        scope.inputColor.colorHSB.h = parseInt(scope.inputColor.colorHSB.h * 360);
                        scope.inputColor.colorHSB.s = parseInt(scope.inputColor.colorHSB.s * 100);
                        scope.inputColor.colorHSB.b = parseInt(scope.inputColor.colorHSB.b * 100);
                        scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                        scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);

                        var opacityLeft = ((1 - scope.opacity) * transparencyPar.eleWidth) - transparencyPar.handleWidth / 2;
                        transparencyHandle.css("left", opacityLeft + "px");
                        var lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                        colorLineTarget.css("left", lineLeft + "px");
                        var selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                        colorSelectTarget.css({left: selectBoxLeft + "PX"});
                        var selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({top: selectBoxTop + "px"});

                    }else{
                        //rgb
                        color.replace(/\s/g, "");
                        color=color.substring(4,color.length-1).split(',');

                        scope.inputColor.currentColorRGB.r=color[0];
                        scope.inputColor.currentColorRGB.g=color[1];
                        scope.inputColor.currentColorRGB.b=color[2];
                        scope.opacity=1;

                        scope.inputColor.colorHSB = colorPickService.RGBtoHSB(color[0],color[1],color[2]);
                        scope.inputColor.colorHSB.h = parseInt(scope.inputColor.colorHSB.h * 360);
                        scope.inputColor.colorHSB.s = parseInt(scope.inputColor.colorHSB.s * 100);
                        scope.inputColor.colorHSB.b = parseInt(scope.inputColor.colorHSB.b * 100);
                        scope.hColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, 1, 1);
                        scope.currentColor = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);
                        scope.inputColor.currentColorHEX = colorPickService.HSBtoHex(scope.inputColor.colorHSB.h / 360, scope.inputColor.colorHSB.s / 100, scope.inputColor.colorHSB.b / 100);

                        var opacityLeft = ((1 - scope.opacity) * transparencyPar.eleWidth) - transparencyPar.handleWidth / 2;
                        transparencyHandle.css("left", opacityLeft + "px");
                        var lineLeft = ((1 - scope.inputColor.colorHSB.h / 360) * colorLinePar.eleWidth) - colorLinePar.handleWidth / 2;
                        colorLineTarget.css("left", lineLeft + "px");
                        var selectBoxLeft = ((scope.inputColor.colorHSB.s / 100) * colorSelectPar.eleWidth) - colorSelectPar.handleWidth / 2;
                        colorSelectTarget.css({left: selectBoxLeft + "PX"});
                        var selectBoxTop = ((1 - scope.inputColor.colorHSB.b / 100) * colorSelectPar.eleHeight) - colorSelectPar.handleHeight / 2;
                        colorSelectTarget.css({top: selectBoxTop + "px"});
                    }
                }
                scope.$watch("oldColorHandle",function(){
                    //初始化
                    initColorPick();
                },true);

                /******************保存和取消*************************/
                scope.colorPickType=colorPickService.getType();
                scope.cancel = function () {
                    if(scope.colorPickType.value==="default"){
                        //恢复原来的颜色
                        colorPickService.changeColor(colorPickService.getOldColor());
                        initColorPick();
                    }
                    colorPickSelect.hide();
                };
                scope.confirm = function () {
                    if(scope.colorPickType.value==="add"){
                        //插入颜色到我的颜色
                        var color="rgba("+scope.inputColor.currentColorRGB.r+","+scope.inputColor.currentColorRGB.g+","+scope.inputColor.currentColorRGB.b+","+scope.opacity+")";
                        userProfile.addMyColor(color);
                        initColorPick();
                    }
                    colorPickSelect.hide();
                };

                /********************监听几个相关变量********************/
                scope.$watch("inputColor.currentColorRGB",function(){
                    //计算颜色赋值给handle

                    if(scope.colorPickType.value==='default'){

                        var color="rgba("+scope.inputColor.currentColorRGB.r+","+scope.inputColor.currentColorRGB.g+","+scope.inputColor.currentColorRGB.b+","+scope.opacity+")";

                        colorPickService.changeColor(color);
                    }

                },true);

                scope.$watch("opacity",function(){
                    if(scope.colorPickType.value==='default'){

                        var color="rgba("+scope.inputColor.currentColorRGB.r+","+scope.inputColor.currentColorRGB.g+","+scope.inputColor.currentColorRGB.b+","+scope.opacity+")";

                        colorPickService.changeColor(color);
                    }
                },true);


                //销毁处理
                scope.$on("$destroy",function(){
                    $(document).off("mousemove",transparencyBoxMousemove);
                    $(document).off("mouseup", transparencyBoxMouseup);

                    $(document).off("mousemove", colorSelectMousemove);
                    $(document).off("mouseup", colorSelectMouseup);

                    $(document).off("mousemove",colorLineMousemove);
                    $(document).off("mouseup", colorLineMouseup);
                });
            }
        };
    })
    .factory('colorPickService', function ($rootScope, $compile,textEditorService) {

        var oldColor={ID:"oldColor",value:""};

        var colorHandle={ID:"colorHandle",value:""};

        var domData = {
            ID: "colorPick", value: ""
        };
        var domBoxData = {
            ID: "colorPickBox", value: ""
        };

        var colorPickType={ID:"colorPickType",value:"default"}

        var pickTarget="";

        var handle = {
            setPickTarget:function(target){
                pickTarget=target;
            },
            getPickTarget:function(){
                return pickTarget;
            },
            removePlugin:function(){
                if(domData.value!==''){
                    domData.value.remove();
                    domData.value='';
                }
                if(domBoxData.value!==''){
                    domBoxData.value.remove();
                    domBoxData.value='';
                }
            },
            updateOldColor:function(){
                oldColor.value=colorHandle.value.$viewValue;
            },
            getOldColorHandle:function(){
                return oldColor;
            },
            getOldColor:function(){
                return oldColor.value
            },
            getType:function(){
                return colorPickType;
            },
            setType:function(type){
                if(type==undefined){
                    colorPickType.value="default";
                }else{
                    colorPickType.value=type;
                }
            },
            setColorHandle:function(handle){

                colorHandle.value=handle;
            },
            changeColor:function(color){
                if(this.getPickTarget()==='editorColor'){
                    textEditorService.formatText("color",color);
                }
                if(this.getPickTarget()==='editorBackground'){
                    if(color=='rgba(255,255,255,1)'||color=="#ffffff"||color=="#FFFFFF"||color=="rgb(255,255,255)"){
                        //这里是一个bug 不要问为什么 问quill
                        color="rgba(254,255,255,1)"
                    }
                    textEditorService.formatText("background",color);
                }
                colorHandle.value.$setViewValue(color);
            },
            getDefaultColor:function(){
                return "#ffffff";
            },
            createDom:function(left,top){
                //初始化
                var dom = $compile("<div color-pick></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domData.value = dom;
                domData.value.show();
                //边界检查
                var eleHeight = parseInt(domData.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                domData.value.css({left: left, top: top});
            },
            createBoxDom:function(left,top){
                //初始化
                var dom = $compile("<div color-pick-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domBoxData.value = dom;

                domBoxData.value.show();
                //边界检查
                var eleHeight = parseInt(domBoxData.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                domBoxData.value.css({left: left, top: top});
            },
            showDom: function (left, top) {

                if (domData.value === "") {
                    //初始化
                    handle.createDom(left, top);
                } else {
                    domData.value.show();
                    //边界检查
                    var eleHeight = parseInt(domData.value.height());
                    var bodyHeight = parseInt($("body").height());

                    if (top + eleHeight > bodyHeight) {
                        top -= top + eleHeight - bodyHeight;
                    } else {

                    }
                    domData.value.css({left: left, top: top});
                }
            },
            showBoxDom:function(left, top){
                if (domBoxData.value === "") {
                    //初始化
                    handle.createBoxDom(left, top);
                } else {
                    domBoxData.value.show();
                    //边界检查
                    var eleHeight = parseInt(domBoxData.value.height());
                    var bodyHeight = parseInt($("body").height());

                    if (top + eleHeight > bodyHeight) {
                        top -= top + eleHeight - bodyHeight;
                    } else {

                    }
                    domBoxData.value.css({left: left, top: top});
                }
            },
            hideBoxDom: function () {

                if (domBoxData.value !== '') {
                    domBoxData.value.hide();
                }

            },
            hideDom: function () {

                if (domData.value !== '') {
                    domData.value.hide();
                }

            },
            HSBtoRGB: function (h, s, b) {
                if (!h) {
                    h = 1;
                }
                h *= 360;
                var R, G, B, X, C;
                h = (h % 360) / 60;
                C = b * s;
                X = C * (1 - Math.abs(h % 2 - 1));
                R = G = B = b - C;

                h = ~~h;
                R += [C, X, 0, 0, X, C][h];
                G += [X, C, C, X, 0, 0][h];
                B += [0, 0, X, C, C, X][h];
                return {
                    r: Math.round(R * 255),
                    g: Math.round(G * 255),
                    b: Math.round(B * 255)
                };
            },
            HSBtoHex: function (h, s, b) {
                var rgb = this.HSBtoRGB(h, s, b);
                if (this.rgbaIsTransparent(rgb)) {
                    return 'transparent';
                }
                return '#' + ((1 << 24) | (parseInt(rgb.r) << 16) | (parseInt(rgb.g) << 8) | parseInt(rgb.b)).toString(16).substr(1);
            },
            RGBtoHSB: function (r, g, b) {
                r /= 255;
                g /= 255;
                b /= 255;

                var H, S, V, C;
                V = Math.max(r, g, b);
                C = V - Math.min(r, g, b);
                H = (C === 0 ? null :
                        V === r ? (g - b) / C :
                        V === g ? (b - r) / C + 2 :
                    (r - g) / C + 4
                    );
                H = ((H + 360) % 6) * 60 / 360;
                S = C === 0 ? 0 : C / V;
                return {
                    h: this._sanitizeNumber(H),
                    s: S,
                    b: V
                };
            },
            _sanitizeNumber: function (val) {
                if (typeof val === 'number') {
                    return val;
                }
                if (isNaN(val) || (val === null) || (val === '') || (val === undefined)) {
                    return 1;
                }
                if (val.toLowerCase !== undefined) {
                    return parseFloat(val);
                }
                return 1;
            },
            HEXtoRGB: function (hex) {
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                var sColor = hex.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for (var i = 1; i < 7; i += 2) {
                        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    }
                    var RGB = {r: 0, g: 0, b: 0};
                    RGB.r = sColorChange[0];
                    RGB.g = sColorChange[1];
                    RGB.b = sColorChange[2];
                    return RGB;
                } else {
                    return sColor;
                }
            },
            rgbaIsTransparent: function (rgba) {
                return ((rgba.r === 0) && (rgba.g === 0) && (rgba.b === 0) && (rgba.a === 0));
            }
        };
        return handle;
    });