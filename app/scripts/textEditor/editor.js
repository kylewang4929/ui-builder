"use strict";
angular.module('kyle.editor', [])
    .directive('fullText', function (textEditorService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var ele = $(element).find(".ele");
                var quill = new Quill(ele.get(0));

                var selectionState = {};

                element.on("dblclick", function () {
                    //注入editor对象
                    var multipleChoiceState=$(element).attr("multiple-choice");
                    if(multipleChoiceState === 'true'){
                        return;
                    }

                    textEditorService.setEditorHandle(quill);

                    //开启编辑状态
                    ele.find(".ql-editor").attr("contenteditable", true);
                    ele.find(".ql-editor").addClass("open-user-select");
                    ele.find(".ql-editor").focus();

                    //全选
                    quill.setSelection(0, quill.getLength(), 'user');

                });

                function getTextData(start, end) {

                    var base = {
                        font: "微软雅黑",
                        size: 0,
                        Bold: false,
                        Italic: false,
                        Underline: false,
                        color: "rgba(255,255,255,1)",
                        background: "rgba(255,255,255,0)",
                        Strikethrough: false,
                        align: "left",
                        lineHeight: "100",
                        space: "0"
                    };

                    var text = quill.getContents(start, end);
                    text = text.ops;
                    var htmlDom = $(quill.getHTML());
                    if (htmlDom.css("text-align") === 'left' || htmlDom.css("text-align") === 'center' || htmlDom.css("text-align") === 'right') {
                        base.align = htmlDom.css("text-align");
                    } else {
                        base.align = "left";
                    }
                    //获取插件支持的属性
                    for (var i = 0; i < text.length; i++) {
                        //为空时的处理
                        //由于回车会生成一个换行符影响计算 这里把换行符过滤
                        if (text[i].attributes === undefined || text[i].insert.charCodeAt() === 10) {
                            continue;
                        }
                        if (i === 0) {
                            base.font = text[i].attributes.font || "Arial";
                            base.size = text[i].attributes.size || 0;
                            base.Bold = text[i].attributes.bold || false;
                            base.Strikethrough = text[i].attributes.strikethrough || false;
                            base.Italic = text[i].attributes.italic || false;
                            base.Underline = text[i].attributes.underline || false;
                            base.color = text[i].attributes.color || "rgba(255,255,255,1)";
                            base.background = text[i].attributes.background || "rgba(255,255,255,0)";
                        } else {
                            if (base.font !== text[i].attributes.font) {
                                base.font = "Arial";
                            }
                            if (base.size !== text[i].attributes.size) {
                                base.size = 0;
                            }
                            if (base.Bold !== text[i].attributes.bold) {
                                base.Bold = false;
                            }
                            if (base.Strikethrough !== text[i].attributes.strikethrough) {
                                base.Strikethrough = false;
                            }
                            if (base.Italic !== text[i].attributes.italic) {
                                base.Italic = false;
                            }
                            if (base.Underline !== text[i].attributes.underline) {
                                base.Underline = false;
                            }
                            if (base.color !== text[i].attributes.color) {
                                base.color = "rgba(255,255,255,1)";
                            }
                            if (base.background !== text[i].attributes.background) {
                                base.background = "rgba(255,255,255,0)";
                            }
                        }
                    }

                    //转换成整形
                    if (base.size !== "") {
                        base.size = parseInt(base.size);
                    }

                    //扩展属性
                    base.lineHeight = parseInt(ele.css("line-height"));
                    base.spacing = parseInt(ele.css("letter-spacing"));

                    return base;
                }

                quill.on('selection-change', function (range, source) {
                    if (source === 'api') {
                        return;
                    }

                    if (range) {

                        textEditorService.setRange(range);
                        selectionState.start = range.start;
                        selectionState.end = range.end;

                        if (range.start === range.end) {
                            //焦点但是没有选中
                            if (quill.getContents(range.start, range.start + 1).ops[0].attributes === undefined) {
                                //上一个字符没有属性 继承下一个字符
                                scope.$apply(function () {
                                    textEditorService.setTextData(getTextData(range.start - 1, range.end));
                                });
                            } else {
                                //下一个字符没有属性 继承上一个
                                scope.$apply(function () {
                                    textEditorService.setTextData(getTextData(range.start, range.end + 1));
                                });
                            }

                        } else {
                            //选中
                            scope.$apply(function () {
                                textEditorService.setTextData(getTextData(range.start, range.end));
                            });

                        }
                    } else {
                    }

                });

            }
        };
    })
    .directive('editorSizeBox', function (textEditorService) {
        return {
            restrict: 'A',
            template: ['<div class="tool-modal" drag-ele="default" handle="handle" onmousedown=event.stopPropagation()>',
                '        <div class="title handle">',
                '            文字大小',
                '            <button class="btn btn--xs btn--white btn--icon right-button" lx-ripple="" ng-click="closeSizeBox()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="content-max content">',
                '           <perfect-scrollbar class="scroller" wheel-propagation="true" wheel-speed="5">',
                '               <div class="slide-box" ng-model="textData.value.size" text-editor-slider slide-type="size" max-value="100"><div class="slide-value">{{textData.value.size}}</div><div class="slide-line z-depth-1"><div class="slide-point z-depth-1"></div></div></div>',
                '               <div class="item" ng-click="setFontSize(\'18px\')" ng-style={"font-size":"18px"}><span>ABCD</span></div>',
                '               <div class="item" ng-click="setFontSize(\'28px\')" ng-style={"font-size":"28px"}><span>ABCD</span></div>',
                '               <div class="item" ng-click="setFontSize(\'38px\')" ng-style={"font-size":"38px"}><span>ABCD</span></div>',
                '           </perfect-scrollbar>',
                '        </div>',
                '    </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                scope.closeSizeBox=function(){
                    textEditorService.hideSetSizeBox();
                };

                scope.setFontSize=function(size){
                    textEditorService.formatText("size",size);
                };
            }
        };
    })
    .directive('textEditorSlider', function ($timeout,textEditorService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element,attrs,ngModel) {

                function setView(value){
                    ngModel.$setViewValue(value);
                    textEditorService.formatText(attrs.slideType,value+"px");
                }

                $timeout(function(){

                    ngModel.$formatters.push(function(){
                        var left=(ngModel.$modelValue/attrs.maxValue)*par.eleWidth-par.handleWidth/2;
                        handle.css("left",left+"px");
                    });

                    var par={};
                    var handle=$(element).find('.slide-point');

                    par.handleWidth=handle.width();
                    par.eleWidth=element.find('.slide-line').get(0).clientWidth;

                    //初始化
                    handle.css("left",(ngModel.$modelValue/attrs.maxValue)*par.eleWidth-par.handleWidth/2+"px");

                    $(element).find('.slide-line').on('mousedown',function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        par.flag = true;
                        par.left = handle.offset().left;

                        par.cx = parseInt(handle.css("left"));

                        var offsetX = e.pageX - par.left;
                        offsetX = par.cx + offsetX - par.handleWidth / 2;

                        if (offsetX < -par.handleWidth / 2) {
                            offsetX = -par.handleWidth / 2;
                        }
                        if (offsetX > par.eleWidth - par.handleWidth / 2) {
                            offsetX = par.eleWidth - par.handleWidth / 2;
                        }

                        handle.css("left", offsetX);

                        offsetX+=par.handleWidth/2;
                        var value=(offsetX/par.eleWidth).toFixed(2);
                        scope.$apply(function(){
                            setView(parseInt(value*attrs.maxValue));
                        });
                    });

                    function listenMousemove(e){
                        if (par.flag) {
                            var offsetX = e.pageX - par.left;
                            offsetX = par.cx + offsetX;

                            if (offsetX < -par.handleWidth / 2) {
                                offsetX = -par.handleWidth / 2;
                            }
                            if (offsetX > par.eleWidth - par.handleWidth / 2) {
                                offsetX = par.eleWidth - par.handleWidth / 2;
                            }

                            handle.css("left", offsetX);

                            offsetX+=par.handleWidth/2;

                            var value=(offsetX/(par.eleWidth)).toFixed(2);
                            scope.$apply(function(){
                                setView(parseInt(value*attrs.maxValue));
                            });
                        }
                    }
                    function listenMouseup(e){
                        if (par.flag) {
                            par.flag = false;
                        }
                    }

                    $(document).on("mousemove", listenMousemove);
                    $(document).on("mouseup",listenMouseup);

                    scope.$on("$destroy",function(){
                        $(document).off("mousemove", listenMousemove);
                        $(document).off("mouseup",listenMouseup);
                    });
                });

            }
        };
    })
    .directive('editorFontBox', function (textEditorService,fontList) {
        return {
            restrict: 'A',
            template: ['<div class="tool-modal" drag-ele="default" handle="handle" onmousedown=event.stopPropagation()>',
                '        <div class="title handle">',
                '            字体',
                '            <button class="btn btn--xs btn--white btn--icon right-button" lx-ripple="" ng-click="closeFontBox()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="option"><button class="btn btn--m btn--white btn--raised" ng-class="{true:\'active\'}[activeTab==0]" ng-click="activeTab=0" lx-ripple>中文</button> <button class="btn btn--m btn--white btn--raised" ng-class="{true:\'active\'}[activeTab==1]" ng-click="activeTab=1" lx-ripple>英文</button></div>',
                '        <div class="content" ng-show="activeTab==0">',
                '           <perfect-scrollbar class="scroller" wheel-propagation="true" wheel-speed="5">',
                '               <div class="item" ng-click="setFontType(font)" ng-repeat="font in cnFontList track by $index" ng-style={"font-family":font}><span>{{font}}</span></div>',
                '           </perfect-scrollbar>',
                '        </div>',
                '        <div class="content" ng-show="activeTab==1">',
                '           <perfect-scrollbar class="scroller" wheel-propagation="true" wheel-speed="5">',
                '               <div class="item" ng-click="setFontType(font)" ng-repeat="font in enFontList track by $index" ng-style={"font-family":font}><span>{{font}}</span></div>',
                '           </perfect-scrollbar>',
                '        </div>',
                '    </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                scope.closeFontBox=function(){
                    textEditorService.hideSetFontBox();
                };

                scope.activeTab=0;

                scope.enFontList=fontList.getList('en');
                scope.cnFontList=fontList.getList('cn');

                scope.setFontType=function(font){
                    textEditorService.formatText("font",font);
                };

            }
        };
    })
    .directive('editorSpacingBox', function (textEditorService) {
        return {
            restrict: 'A',
            template: ['<div class="tool-modal" drag-ele="default" handle="handle" onmousedown=event.stopPropagation()>',
                '        <div class="title handle">',
                '            间距',
                '            <button class="btn btn--xs btn--white btn--icon right-button" lx-ripple="" ng-click="closeSpacingBox()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="content-max content">',
                '           <perfect-scrollbar class="scroller" wheel-propagation="true" wheel-speed="5">',
                '               <div class="slide-box" ng-model="textData.value.spacing" text-editor-slider slide-type="spacing" max-value="60"><div class="slide-value">{{textData.value.spacing}}</div><div class="slide-line z-depth-1"><div class="slide-point z-depth-1"></div></div></div>',
                '               <div class="item" ng-click="setSpacingSize(\'5px\')" ng-style={"letter-spacing":"5px"}><span>ABCD</span></div>',
                '               <div class="item" ng-click="setSpacingSize(\'10px\')" ng-style={"letter-spacing":"10px"}><span>ABCD</span></div>',
                '               <div class="item" ng-click="setSpacingSize(\'15px\')" ng-style={"letter-spacing":"15px"}><span>ABCD</span></div>',
                '           </perfect-scrollbar>',
                '        </div>',
                '    </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                scope.closeSpacingBox=function(){
                    textEditorService.hideSetSpacingBox();
                };
                scope.setSpacingSize=function(setSpacing){
                    textEditorService.formatText("spacing",setSpacing);
                };
            }
        };
    })
    .directive('editorLineHeightBox', function (textEditorService) {
        return {
            restrict: 'A',
            template: ['<div class="tool-modal" drag-ele="default" handle="handle" onmousedown=event.stopPropagation()>',
                '        <div class="title handle">',
                '            行高',
                '            <button class="btn btn--xs btn--white btn--icon right-button" lx-ripple="" ng-click="closeLineHeightBox()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="content-max content">',
                '           <perfect-scrollbar class="scroller" wheel-propagation="true" wheel-speed="5">',
                '               <div class="slide-box" ng-model="textData.value.lineHeight" text-editor-slider slide-type="lineHeight" max-value="100"><div class="slide-value">{{textData.value.lineHeight}}</div><div class="slide-line z-depth-1"><div class="slide-point z-depth-1"></div></div></div>',
                '               <div class="item" ng-click="setLineHeightSize(\'20px\')" ng-style={"line-height":"20px"}><span>ABCD<br>EFG</span></div>',
                '               <div class="item" ng-click="setLineHeightSize(\'30px\')" ng-style={"line-height":"30px"}><span>ABCD<br>EFG</span></div>',
                '               <div class="item" ng-click="setLineHeightSize(\'40px\')" ng-style={"line-height":"40px"}><span>ABCD<br>EFG</span></div>',
                '           </perfect-scrollbar>',
                '        </div>',
                '    </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                scope.closeLineHeightBox=function(){
                    textEditorService.hideSetLineHeightBox();
                };
            }
        };
    })
    .directive('textEditor', function (userProfile, siteConfig, colorPickService, textEditorService) {
        return {
            restrict: 'A',
            template: ['<div class="text-editor z-depth-2" drag-ele="default" handle="handle" ng-mousedown="$event.stopPropagation();closeAllMenu();">',
                '    <div class="handle"><i class="mdi mdi-drag-vertical"></i></div>',
                '    <div class="content-box">',
                '        <div class="row">',
                '            <div class="item">',
                '                <i class="mdi mdi-format-text icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised" ng-click="setFont($event)" lx-ripple><span>{{textData.value.font}}</span><i',
                '                        class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <i class="mdi mdi-format-size icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised" ng-click="setSize($event)" lx-ripple><span>{{textData.value.size}}px</span><i',
                '                        class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setAlign(\'left\')" ng-class="{true:\'active\'}[textData.value.align==\'left\']" lx-ripple><i class="mdi mdi-format-align-left"></i></button>',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setAlign(\'center\')" ng-class="{true:\'active\'}[textData.value.align==\'center\']" lx-ripple><i class="mdi mdi-format-align-center"></i></button>',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setAlign(\'right\')" ng-class="{true:\'active\'}[textData.value.align==\'right\']" lx-ripple><i class="mdi mdi-format-align-right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <div class="line"></div>',
                '            </div>',
                '            <div class="item">',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setBold()" lx-ripple ng-class="{true:\'active\'}[textData.value.Bold]"><i class="mdi mdi-format-bold"></i></button>',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setItalic()" lx-ripple ng-class="{true:\'active\'}[textData.value.Italic]"><i class="mdi mdi-format-italic"></i></button>',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setUnderline()" lx-ripple ng-class="{true:\'active\'}[textData.value.Underline]"><i class="mdi mdi-format-underline"></i></button>',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="setStrikethrough()" lx-ripple ng-class="{true:\'active\'}[textData.value.Strikethrough]"><i class="mdi mdi-format-clear"></i></button>',
                '            </div>',
                '        </div>',
                '        <div class="row">',
                '            <div class="item">',
                '                <i class="mdi mdi-format-line-spacing icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised" ng-click="setLineHeight($event)" lx-ripple><span>{{textData.value.lineHeight}}px</span><i',
                '                        class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <i class="mdi mdi-alphabetical icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised"  ng-click="setSpacing($event)" lx-ripple><span>{{textData.value.spacing}}px</span><i',
                '                        class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <i class="mdi mdi-invert-colors icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised color-button" color-pick-box-ele="editorColor" ng-model="textData.value.color" lx-ripple>',
                '                    <div class="color-box" ng-style="{\'background-color\':textData.value.color}">',
                '                    </div>',
                '                    <div class="color-box-bg" style="background-image:url(\'images/point.png\')"></div>',
                '                    <i class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <i class="mdi mdi-format-color-fill icon-label"></i>',
                '                <button class="btn btn--m btn--white btn--raised color-button" color-pick-box-ele="editorBackground" ng-model="textData.value.background" lx-ripple>',
                '                    <div class="color-box" ng-style="{\'background-color\':textData.value.background}">',
                '                    </div>',
                '                    <div class="color-box-bg" style="background-image:url(\'images/point.png\')"></div>',
                '                    <i class="mdi mdi-menu-down right"></i></button>',
                '            </div>',
                '            <div class="item">',
                '                <div class="line"></div>',
                '            </div>',
                '            <div class="item">',
                '                <button class="btn btn--m btn--black btn--flat icon-button" ng-click="clearTextFormat()" lx-ripple><i class="mdi mdi-eraser"></i></button>',
                '            </div>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join(""),
            replace: true,
            link: function (scope, element) {
                scope.textData = textEditorService.getTextData();

                var par = {
                    height: 0,
                    width: 0,
                    bodyHeight: 0,
                    bodyWidth: 0
                };
                par.height = element.height();
                par.width = element.width();

                scope.closeAllMenu = function () {
                    colorPickService.hideBoxDom();
                    colorPickService.hideDom();
                    textEditorService.hideSetSizeBox();
                    textEditorService.hideSetFontBox();
                    textEditorService.hideSetSpacingBox();
                    textEditorService.hideSetLineHeightBox();
                };

                scope.setAlign = function (value) {
                    textEditorService.formatLine("align", value);
                    scope.textData.value.align = value;
                };
                scope.setBold = function () {
                    textEditorService.formatText("bold", !scope.textData.value.Bold);
                    scope.textData.value.Bold = !scope.textData.value.Bold;
                };
                scope.setItalic = function () {
                    textEditorService.formatText("italic", !scope.textData.value.Italic);
                    scope.textData.value.Italic = !scope.textData.value.Italic;
                };
                scope.setUnderline = function () {
                    textEditorService.formatText("underline", !scope.textData.value.Underline);
                    scope.textData.value.Underline = !scope.textData.value.Underline;
                };
                scope.setStrikethrough = function () {
                    textEditorService.formatText("strike", !scope.textData.value.Strikethrough);
                    scope.textData.value.Strikethrough = !scope.textData.value.Strikethrough;
                };
                scope.clearTextFormat = function () {
                    textEditorService.clearTextFormat();
                };
                scope.setSize = function (event) {
                    textEditorService.showSetSizeBox($(event.target).offset().left, $(event.target).offset().top);
                };
                scope.setFont = function (event) {
                    textEditorService.showSetFontBox($(event.target).offset().left, $(event.target).offset().top);
                };
                scope.setSpacing = function (event) {
                    textEditorService.showSetSpacingBox($(event.target).offset().left, $(event.target).offset().top);
                };
                scope.setLineHeight = function (event) {
                    textEditorService.showSetLineHeightBox($(event.target).offset().left, $(event.target).offset().top);
                };

            }
        };
    })
    .factory('textEditorService', function ($rootScope, $compile) {
        var textData = {ID: "textData", value: {
            font: "微软雅黑",
            size: "30",
            lineHeight: 150,
            spacing: 10,
            align: "left",
            Bold: false,
            Italic: false,
            Underline: false,
            Strikethrough: false,
            color: "rgb(255,255,255)",
            background: "rgba(255,255,255,0)"
        }};

        var domHandle = {ID: "domHandle", value: ""};

        var textBoxHandle = {ID: "textBoxHandle", value: ""};

        var editorHandle = {ID: "editorHandle", value: ""};

        var setSizeBoxDom = {ID: "setSizeBoxDom", value: ""};
        var setFontBoxDom = {ID: "setFontBoxDom", value: ""};
        var setSpacingBoxDom = {ID: "setSpacingBoxDom", value: ""};
        var setLineHeightBoxDom = {ID: "setLineHeightBoxDom", value: ""};


        var range = {};

        var handle = {
            removePlugin: function () {
                if (domHandle.value !== '') {
                    domHandle.value.remove();
                    domHandle.value = '';
                }
                if (setSizeBoxDom.value !== '') {
                    setSizeBoxDom.value.remove();
                    setSizeBoxDom.value = '';
                }
                if (setFontBoxDom.value !== '') {
                    setFontBoxDom.value.remove();
                    setFontBoxDom.value = '';
                }
                if (setSpacingBoxDom.value !== '') {
                    setSpacingBoxDom.value.remove();
                    setSpacingBoxDom.value = '';
                }
            },
            setRange: function (data) {
                range = data;
            },
            getRange: function () {
                return range;
            },
            clearTextFormat: function () {
                editorHandle.value.setText(editorHandle.value.getText());
                editorHandle.value.setSelection(range.start, range.end);
            },
            formatText: function (index, value) {
                if(index==='spacing'){
                    textBoxHandle.value.find(".ele").css('letter-spacing',value);
                    return;
                }
                if(index==='lineHeight'){
                    textBoxHandle.value.find(".ele").css('line-height',value);
                    return;
                }

                if (editorHandle.value !== '') {
                    editorHandle.value.formatText(range.start, range.end, index, value);

                    //设置选择范围
                    if (index === 'color' || index === 'background') {
                        if (window.getSelection()) {
                            window.getSelection().removeAllRanges();
                        } else {
                            document.getSelection().removeAllRanges();
                        }
                    } else {
                        if (index !== 'size') {
                            editorHandle.value.setSelection(range.start, range.end);
                        }
                    }
                }
            },
            formatLine: function (index, value) {
                if (editorHandle.value !== '') {
                    editorHandle.value.formatLine(range.start, range.end, index, value);
                    if (index === 'color' || index === 'background') {
                        if (window.getSelection()) {
                            window.getSelection().removeAllRanges();
                        } else {
                            document.getSelection().removeAllRanges();
                        }
                    } else {
                        editorHandle.value.setSelection(range.start, range.end);
                    }
                }
            },
            prepareFormat: function (index, value) {
                if (editorHandle.value !== '') {
                    editorHandle.value.prepareFormat(index, value);
                }
            },
            getTextData: function () {
                return textData;
            },
            setTextData: function (data) {
                textData.value = data;
            },
            setEditorHandle: function (editor) {
                editorHandle.value = editor;
            },
            createDom: function () {
                var dom = $compile("<div text-editor></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domHandle.value = dom;
            },
            showDom: function (id) {
                if (domHandle.value !== '') {
                    //存在dom
                    domHandle.value.show();
                } else {
                    this.createDom();
                    domHandle.value.show();
                }
                textBoxHandle.value = $("#" + id);

                var par = {
                    height: 0,
                    width: 0,
                    bodyHeight: 0,
                    bodyWidth: 0
                };

                //调整位置

                par.height = domHandle.value.height();
                par.width = domHandle.value.width();
                par.bodyHeight = $("body").height();
                par.bodyWidth = $("body").width();

                var offsetLeft = textBoxHandle.value.offset().left - par.width / 2 + textBoxHandle.value.width() / 2 + 20;
                var offsetTop = textBoxHandle.value.offset().top - par.height - 20;

                if (offsetLeft < 10) {
                    offsetLeft = 10;
                }
                if (offsetTop < 60) {
                    offsetTop = 60;
                }
                if (offsetLeft + par.width > par.bodyWidth) {
                    offsetLeft = par.bodyWidth - 10 - par.width;
                }
                if (offsetTop + par.height > par.bodyHeight) {
                    offsetTop = par.bodyHeight - 10 - par.height;
                }

                domHandle.value.css({left: offsetLeft + "px", top: offsetTop + "px"});

            },
            hideDom: function () {
                if (domHandle.value !== '') {
                    domHandle.value.hide();
                    //关闭编辑状态
                    var ele = textBoxHandle.value.find(".ele");
                    ele.find('.ql-editor').removeClass("open-user-select");
                    ele.find('.ql-editor').removeAttr("contenteditable", true);

                    if (setSizeBoxDom.value !== '') {
                        setSizeBoxDom.value.hide();
                    }
                    if (setFontBoxDom.value !== '') {
                        setFontBoxDom.value.hide();
                    }
                    if (setSpacingBoxDom.value !== '') {
                        setSpacingBoxDom.value.hide();
                    }
                    if (setLineHeightBoxDom.value !== '') {
                        setLineHeightBoxDom.value.hide();
                    }

                }
            },
            createSetSizeBox: function () {
                var dom = $compile("<div editor-size-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                setSizeBoxDom.value = dom;
            },
            showSetSizeBox: function (left, top) {
                if (setSizeBoxDom.value === "") {
                    //初始化
                    this.createSetSizeBox();
                }
                setSizeBoxDom.value.show();
                //边界检查
                var eleHeight = parseInt(setSizeBoxDom.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                setSizeBoxDom.value.css({left: left, top: top+30});
            },
            hideSetSizeBox: function () {
                if (setSizeBoxDom.value !== '') {
                    setSizeBoxDom.value.hide();
                }
            },
            createSetFontBox: function () {
                var dom = $compile("<div editor-font-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                setFontBoxDom.value = dom;
            },
            showSetFontBox: function (left,top) {
                if (setFontBoxDom.value === "") {
                    //初始化
                    this.createSetFontBox();
                }
                setFontBoxDom.value.show();
                //边界检查
                var eleHeight = parseInt(setFontBoxDom.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                setFontBoxDom.value.css({left: left, top: top+30});
            },
            hideSetFontBox: function () {
                if (setFontBoxDom.value !== '') {
                    setFontBoxDom.value.hide();
                }
            },
            createSetSpacingBox: function () {
                var dom = $compile("<div editor-spacing-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                setSpacingBoxDom.value = dom;
            },
            showSetSpacingBox: function (left,top) {
                if (setSpacingBoxDom.value === "") {
                    //初始化
                    this.createSetSpacingBox();
                }
                setSpacingBoxDom.value.show();
                //边界检查
                var eleHeight = parseInt(setSpacingBoxDom.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                setSpacingBoxDom.value.css({left: left, top: top+30});
            },
            hideSetSpacingBox: function () {
                if (setSpacingBoxDom.value !== '') {
                    setSpacingBoxDom.value.hide();
                }
            },
            createSetLineHeightBox: function () {
                var dom = $compile("<div editor-line-height-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                setLineHeightBoxDom.value = dom;
            },
            showSetLineHeightBox: function (left,top) {
                if (setLineHeightBoxDom.value === "") {
                    //初始化
                    this.createSetLineHeightBox();
                }
                setLineHeightBoxDom.value.show();
                //边界检查
                var eleHeight = parseInt(setLineHeightBoxDom.value.height());
                var bodyHeight = parseInt($("body").height());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else {

                }
                setLineHeightBoxDom.value.css({left: left, top: top+30});
            },
            hideSetLineHeightBox: function () {
                if (setLineHeightBoxDom.value !== '') {
                    setLineHeightBoxDom.value.hide();
                }
            }
        };
        return handle;
    })
;