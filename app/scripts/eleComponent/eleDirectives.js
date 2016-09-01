"use strict";
angular.module('myBuilderApp')

    /**
     * pc 上的session
     */
    .directive('headDefault', function (creatorServices) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session'>" +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        "</div>";
                } else {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session' session-resize ng-mouseover=hoverSession($event,'" + data.ID + "')>" +
                        '<div class="session-resize only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>' +
                        '<div add-session-handle></div>' +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        "<div class='menu-tool-box'>" +
                        '<div class="fab">' +
                        '<button class="fab__primary btn btn--m btn--blue btn--fab" lx-ripple tooltip-position="top">' +
                        '<i class="mdi mdi-dots-horizontal"></i>' +
                        '<i class="mdi mdi-close"></i>' +
                        '</button>' +

                        '<div class="fab__actions fab__actions--left">' +
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="更换背景" tooltip-position="bottom"><i class="mdi mdi-image-area"></i></button>' +
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="设置" tooltip-position="bottom"><i class="mdi mdi-settings"></i></button>' +
                        '</div>' +
                        '</div>' +
                        "</div>";
                }

                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                //插入背景
                var dom = $(element).find(".ele-session-box");
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                if (data.class !== undefined) {
                    for (var i = 0; i < data.class.length; i++) {
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom = dom.find(".ele-session");

                for (var j = 0; j < data.eleList.length; j++) {
                    sessionDom.append(creatorServices.createEle(data.eleList[j]));
                }

                return function (scope, element, attrs) {

                };
            }
        };
    })
    .directive('sessionDefault', function (creatorServices) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session'>" +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        "</div>";
                } else {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session' session-resize ng-mouseover=hoverSession($event,'" + data.ID + "')>" +
                        '<div class="session-resize only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>' +
                        '<div add-session-handle></div>' +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        "<div class='menu-tool-box'>" +
                        '<div class="fab">' +
                        '<button class="fab__primary btn btn--m btn--blue btn--fab" lx-ripple tooltip-position="top">' +
                        '<i class="mdi mdi-dots-horizontal"></i>' +
                        '<i class="mdi mdi-close"></i>' +
                        '</button>' +

                        '<div class="fab__actions fab__actions--left">' +
                        '<button id="deleteSessionButton" class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="删除" tooltip-position="bottom" ng-click=deleteSession("' + data.ID + '")><i class="mdi mdi-delete"></i></button>' +
                        '<button id="moveUpButton" class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="向上移动" tooltip-position="bottom"><i class="mdi mdi-chevron-double-up"></i></button>' +
                        '<button id="moveDownButton" class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="向下移动" tooltip-position="bottom"><i class="mdi mdi-chevron-double-down"></i></button>' +
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="更换背景" tooltip-position="bottom"><i class="mdi mdi-image-area"></i></button>' +
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="设置" tooltip-position="bottom"><i class="mdi mdi-settings"></i></button>' +
                        '</div>' +
                        '</div>' +
                        "</div>";
                }

                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                //插入背景

                var dom = $(element).find(".ele-session-box");

                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                if (data.class !== undefined) {
                    for (var i = 0; i < data.class.length; i++) {
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom = dom.find(".ele-session");

                for (var j = 0; j < data.eleList.length; j++) {
                    sessionDom.append(creatorServices.createEle(data.eleList[j]));
                }

                return function (scope, element, attrs) {

                };
            }
        };
    })


    /**
     * pc 上的元素
     */

    .directive('eleTextDefault', function (eleApplyService, elePosition,$timeout) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";

                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" full-text drag-ele="ele-web" drag-function="dragFunction" rotate="ele-web" resize="ele-web" ng-dblclick=editEle(\'' + data.ID + '\') ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate text-rotate" onmousedown="event.preventDefault();event.stopPropagation();"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line text-line" onmousedown="event.preventDefault()"></div>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                
                var data = element.context.eleConfig;
                eleApplyService.defaultApply($(element).find(">.position-box"), data);

                $timeout(function(){
                    var ele=$(element).find(">.position-box >.ele-box >.ele");
                    var eleHeight=ele.height();
                    ele.css('margin-top',-eleHeight/2);
                });

            }
        };
    })
    .directive('eleImageDefault', function (eleApplyService) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" background-size="'+data.backgroundSize+'">',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                        '                    <img class="ele ele-image" src="' + data.url + '" onmousedown=event.preventDefault() onmousedown=event.preventDefault()/>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template=['<div background-size="'+data.backgroundSize+'" id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-web" rotate="ele-web" resize="ele-web" ng-dblclick=editImage(\''+data.ID+'\') ng-mousedown=selectEle($event,\''+data.ID+'\')>',
                        '                <div class="rotate" onmousedown="event.preventDefault();event.stopPropagation();"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" onmousedown="event.preventDefault()"></div>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box" onmousedown=event.preventDefault()>',
                        '                    <img class="ele ele-image" src="' + data.url + '" onmousedown=event.preventDefault() onmousedown=event.preventDefault()/>',
                        '                </div>',
                        '            </div>'].join("");
                }
                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                var data = element.context.eleConfig;
                eleApplyService.defaultApply($(element).find(">.position-box"), data);
            }
        };
    })
    .directive('eleGroupDefault', function (eleApplyService, creatorServices) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                        '                   <div class="group-over">',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" on-group-size-change class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-web" resize="ele-web">',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                        '                   <div class="group-over" ng-dblclick=editGroup(\'' + data.ID + '\',$event) ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }
                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                var dom = $(element).find("> .position-box");
                var domStyle = dom.find(" >.ele-box >.ele");
                for (var i = 0; i < data.eleList.length; i++) {
                    domStyle.append(creatorServices.createEle(data.eleList[i]));
                }

                return function (scope, element, attrs) {
                    var data = element.context.eleConfig;
                    eleApplyService.defaultApply($(element).find(">.position-box"), data);
                };
            }
        };
    })
    .directive('eleMenuDefault', function (eleApplyService,$timeout) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box ele"></div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-web" rotate="ele-web" resize="ele-web" ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" onmousedown="event.preventDefault();event.stopPropagation();"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" onmousedown="event.preventDefault()"></div>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box ele"></div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                var data = element.context.eleConfig;

                //插入item
                var dom = $(element).find("> .position-box");
                var domMenu = dom.find(" >.ele-box >.ele");

                var menuLength = data.item.length;
                for (var i = 0; i < menuLength; i++) {
                    var domItem = $("<div class='menu-item' id=" + data.item[i].ID + ">" + data.item[i].name + "</div>");
                    domItem.css({ "width": (100 / menuLength).toFixed(2) + "%", "float": "left" });
                    domMenu.append(domItem);
                }

                $timeout(function(){
                    var ele=$(element).find(">.position-box >.ele-box >.ele");
                    var eleHeight=ele.height();
                    ele.css('margin-top',-eleHeight/2);
                });

                eleApplyService.defaultApply($(element).find(">.position-box"), data);
            }
        };
    })


    /**
     * mobile 上的session
     */

    .directive('headDefaultPhone', function (phoneCreatorServices) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session')>" +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        '</div>';
                } else {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session' session-resize='phone' phone-right-click-menu-init ng-mouseover=hoverSession($event,'" + data.ID + "')>" +
                        '<div class="session-resize phone only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>' +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        '<div class="menu-tool-box phone">' +
                        '<button class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="隐藏" tooltip-position="bottom" ng-click=deleteSession("' + data.ID + '")><i class="mdi mdi-delete"></i></button>' +
                        '</div>' +
                        '</div>';
                }

                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                //插入背景
                var dom = $(element).find(".ele-session-box");
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                //渲染手机专属的样式覆盖旧的
                $.each(data.phoneStyle, function (index, value) {
                    dom.css(index, value);
                });

                if (data.class !== undefined) {
                    for (var i = 0; i < data.class.length; i++) {
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom = dom.find(".ele-session");

                for (var j = 0; j < data.eleList.length; j++) {
                    var eleDom = phoneCreatorServices.createEle(data.eleList[j]);
                    sessionDom.append(eleDom);
                    if (data.eleList[j].showState === false) {
                        eleDom.css('display', 'none');
                    }
                }

                return function (scope, element, attrs) {

                };
            }
        };
    })
    .directive('sessionDefaultPhone', function (phoneCreatorServices) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session')>" +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        '</div>';
                } else {
                    template = "<div class='ele-session-box' id=" + data.ID + " ele-type='session' session-resize='phone' phone-right-click-menu-init ng-mouseover=hoverSession($event,'" + data.ID + "')>" +
                        '<div class="session-resize phone only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>' +
                        '<div class="over-shadow"></div>' +
                        '<div class="ele-session"></div>' +
                        "<div class='menu-tool-box phone'>" +
                        '<button class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="隐藏" tooltip-position="bottom" ng-click=deleteSession("' + data.ID + '")><i class="mdi mdi-delete"></i></button>' +
                        "</div>" +
                        '</div>';
                }

                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                //插入背景
                var dom = $(element).find(".ele-session-box");
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                //渲染手机专属的样式覆盖旧的
                $.each(data.phoneStyle, function (index, value) {
                    dom.css(index, value);
                });

                if (data.class !== undefined) {
                    for (var i = 0; i < data.class.length; i++) {
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom = dom.find(".ele-session");

                for (var j = 0; j < data.eleList.length; j++) {
                    var eleDom = phoneCreatorServices.createEle(data.eleList[j]);
                    sessionDom.append(eleDom);
                    if (data.eleList[j].showState === false) {
                        eleDom.css('display', 'none');
                    }
                }

                return function (scope, element, attrs) {

                };
            }
        };
    })


    /**
     * mobile 上的元素
     */
    .directive('eleTextDefaultPhone', function (eleApplyService,$timeout) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-phone" rotate="ele-phone" resize="ele-phone" ng-dblclick=editEle(\'' + data.ID + '\') ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate text-rotate" onmousedown="event.preventDefault();event.stopPropagation();"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line text-line" onmousedown="event.preventDefault()"></div>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                var data = element.context.eleConfig;

                eleApplyService.phoneDefaultApply($(element).find(">.position-box"), data);

                //放在后面是为了覆盖前面的样式
                var dom = $(element).find(">.position-box");
                var domBorder = dom.find(' >.ele-box');
                domBorder.css({ "transform": "scale(" + data.phoneStyle.scale + "," + data.phoneStyle.scale + ")", "-ms-transform": "scale(" + data.phoneStyle.scale + "," + data.phoneStyle.scale + ")", "-moz-transform": "scale(" + data.phoneStyle.scale + "," + data.phoneStyle.scale + ")", "-webkit-transform": "scale(" + data.phoneStyle.scale + "," + data.phoneStyle.scale + ")", "-o-transform": "scale(" + data.phoneStyle.scale + "," + data.phoneStyle.scale + ")" });
                domBorder.css({ "transform-origin": "0% 0%", "-ms-transform-origin": "0% 0%", "-moz-transform-origin": "0% 0%", "-webkit-transform-origin": "0% 0%", "-o-transform-origin": "0% 0%" });

                $.each(data.phoneStyle.border, function (index, value) {
                    // if (index === 'width') {
                    //     dom.css(index, parseInt(value) * data.phoneStyle.scale);
                    // }
                    // if (index === 'min-height') {
                    //     dom.css('height', parseInt(value) * data.phoneStyle.scale);
                    // }
                    domBorder.css(index, value);
                });

                $timeout(function(){
                    var ele=$(element).find(">.position-box >.ele-box >.ele");
                    var eleHeight=ele.height();
                    ele.css('margin-top',-eleHeight/2);
                    //同时把限制用的外边框也调整下
                    dom.css('height',domBorder.get(0).offsetHeight*data.phoneStyle.scale);
                    dom.css('width',domBorder.get(0).offsetWidth*data.phoneStyle.scale);
                });

            }
        };
    })
    .directive('eleImageDefaultPhone', function (eleApplyService) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" background-size="'+data.backgroundSize+'">',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                        '                    <img class="ele ele-image" src="' + data.url + '" onmousedown=event.preventDefault() onmousedown=event.preventDefault()/>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div background-size="'+data.backgroundSize+'" id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-phone" rotate="ele-phone" resize="ele-phone" ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" onmousedown="event.preventDefault();event.stopPropagation();"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" onmousedown="event.preventDefault()"></div>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box" onmousedown=event.preventDefault()>',
                        '                    <img class="ele ele-image" src="' + data.url + '" onmousedown=event.preventDefault() onmousedown=event.preventDefault()/>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                var data = element.context.eleConfig;
                eleApplyService.phoneDefaultApply($(element).find(">.position-box"), data);
            }
        };
    })
    .directive('eleGroupDefaultPhone', function (eleApplyService, phoneCreatorServices, $compile,$timeout) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                        '                   <div class="group-over">',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" on-group-size-change class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-phone" resize="ele-phone">',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                        '                   <div class="group-over" ng-dblclick=editGroup(\'' + data.ID + '\',$event) ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            compile: function (element, attrs) {
                var data = element.context.eleConfig;
                var dom = $(element).find(">.position-box");
                var domStyle = dom.find(" >.ele-box >.ele");
                for (var i = 0; i < data.eleList.length; i++) {
                    domStyle.append(phoneCreatorServices.createEle(data.eleList[i]));
                }
                return function (scope, element, attrs) {
                    var data = element.context.eleConfig;
                    eleApplyService.phoneDefaultApply($(element).find(">.position-box"), data);

                    $timeout(function(){
                        var ele=$(element).find(">.position-box >.ele-box >.ele");
                        var eleHeight=ele.height();
                        ele.css('margin-top',-eleHeight/2);
                    });

                };
            }
        };
    })
    .directive('eleMenuDefaultPhone', function (eleApplyService,$timeout) {
        return {
            restrict: 'AE',
            template: function (element, attrs) {
                var data = element.context.eleConfig;
                var template = "";
                if (attrs.thumbnail) {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box">',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box phone ele"><i class="mdi mdi-menu"></i></div>',
                        '                </div>',
                        '            </div>'].join("");
                } else {
                    template = ['<div id="' + data.ID + '" ele-type="' + data.type + '" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" drag-ele="ele-phone" resize="ele-phone" ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="center" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-left" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-right" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-top" onmousedown="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" onmousedown="event.preventDefault()"></div>',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box phone ele"><i class="mdi mdi-menu"></i></div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: false,
            link: function (scope, element, attrs) {
                var data = element.context.eleConfig;

                var dom = $(element).find(">.position-box");
                var domStyle = dom.find(" >.ele-box >.ele");
                domStyle.find('i').css("color", data.phoneStyle.style.color);
                domStyle.find('i').css("font-size", data.phoneStyle.style['font-size']);

                $timeout(function(){
                    var ele=$(element).find(">.position-box >.ele-box >.ele");
                    var eleHeight=ele.height();
                    ele.css('margin-top',-eleHeight/2);
                });


                eleApplyService.phoneDefaultApply($(element).find(">.position-box"), data);
            }
        };
    })


    /**
     * 渲染方法
     */
    .factory('eleApplyService', function () {
        var handle = {
            defaultApply: function (dom, data) {
                dom = $(dom);
                $.each(data.position, function (index, value) {
                    dom.css(index, value);
                });
                var domBorder = dom.find(" >.ele-box");
                $.each(data.border, function (index, value) {
                    domBorder.css(index, value);
                });
                var domStyle = domBorder.find(" >.ele");
                $.each(data.style, function (index, value) {
                    domStyle.css(index, value);
                });

            },
            phoneDefaultApply: function (dom, data) {
                dom = $(dom);
                dom.attr('scale', data.phoneStyle.scale);

                $.each(data.position, function (index, value) {
                    dom.css(index, value);
                });
                var domBorder = dom.find(" >.ele-box");
                $.each(data.border, function (index, value) {
                    domBorder.css(index, value);
                });
                var domStyle = domBorder.find(" >.ele");
                $.each(data.style, function (index, value) {
                    domStyle.css(index, value);
                });

                $.each(data.phoneStyle.style, function (index, value) {
                    domStyle.css(index, value);

                });
                $.each(data.phoneStyle.position, function (index, value) {
                    dom.css(index, value);
                });
                $.each(data.phoneStyle.border, function (index, value) {
                    domBorder.css(index, value);
                });
            }
        };
        return handle;
    });