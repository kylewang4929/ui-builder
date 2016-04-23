"use strict";
angular.module('myBuilderApp')

    /**
     * pc 上的session
     */
    .directive('headDefault', function (creatorServices) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session'>" +
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        "</div>";
                }else{
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session' session-resize ng-mouseover=hoverSession($event,'"+data.ID+"')>" +
                        '<div class="session-resize only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>'+
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        "<div class='menu-tool-box'>" +
                        '<div class="fab">'+
                        '<button class="fab__primary btn btn--m btn--blue btn--fab" lx-ripple tooltip-position="top">'+
                        '<i class="mdi mdi-dots-horizontal"></i>'+
                        '<i class="mdi mdi-close"></i>'+
                        '</button>'+

                        '<div class="fab__actions fab__actions--left">'+
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="更换背景" tooltip-position="bottom"><i class="mdi mdi-image-area"></i></button>'+
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="设置" tooltip-position="bottom"><i class="mdi mdi-settings"></i></button>'+
                        '</div>'+
                        '</div>'+
                        "</div>";
                }

                return template;
            },
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                //插入背景
                var dom=$(element);
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                if(data.class!==undefined){
                    for(var i=0;i<data.class.length;i++){
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom=dom.find(".ele-session");

                for (var i = 0; i < data.eleList.length; i++) {
                    sessionDom.append(creatorServices.createEle(data.eleList[i]));
                }

                return function (scope, element, attrs) {

                }
            }
        }
    })
    .directive('sessionDefault', function (creatorServices) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session'>" +
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        "</div>";
                }else{
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session' session-resize ng-mouseover=hoverSession($event,'"+data.ID+"')>" +
                        '<div class="session-resize only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>'+
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        "<div class='menu-tool-box'>" +
                        '<div class="fab">'+
                        '<button class="fab__primary btn btn--m btn--blue btn--fab" lx-ripple tooltip-position="top">'+
                        '<i class="mdi mdi-dots-horizontal"></i>'+
                        '<i class="mdi mdi-close"></i>'+
                        '</button>'+

                        '<div class="fab__actions fab__actions--left">'+
                        '<button id="deleteSessionButton" class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="删除" tooltip-position="bottom" ng-click=deleteSession("'+data.ID+'")><i class="mdi mdi-delete"></i></button>'+
                        '<button id="moveUpButton" class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="向上移动" tooltip-position="bottom"><i class="mdi mdi-chevron-double-up"></i></button>'+
                        '<button id="moveDownButton" class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="向下移动" tooltip-position="bottom"><i class="mdi mdi-chevron-double-down"></i></button>'+
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="更换背景" tooltip-position="bottom"><i class="mdi mdi-image-area"></i></button>'+
                        '<button class="btn btn--s btn--white btn--fab" lx-ripple lx-tooltip="设置" tooltip-position="bottom"><i class="mdi mdi-settings"></i></button>'+
                        '</div>'+
                        '</div>'+
                        "</div>";
                }

                return template;
            },
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                //插入背景
                var dom=$(element);
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                if(data.class!==undefined){
                    for(var i=0;i<data.class.length;i++){
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom=dom.find(".ele-session");

                for (var i = 0; i < data.eleList.length; i++) {
                    sessionDom.append(creatorServices.createEle(data.eleList[i]));
                }

                return function (scope, element, attrs) {

                }
            }
        }
    })


    /**
     * pc 上的元素
     */

    .directive('eleTextDefault', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);

                var template="";

                if(attrs.thumbnail){
                    var template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    var template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" full-text ele-menu="text" drag-ele="ele" rotate resize ng-dblclick=editEle(\'' + data.ID + '\') ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" ondragstart="event.preventDefault()" onmousedown=event.stopPropagation();><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" ondragstart="event.preventDefault()"></div>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
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
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);

                eleApplyService.defaultApply(element,data);
            }
        }
    })
    .directive('eleImageDefault', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                            '                    <div class="ele ele-image" style="background-image:url(' + data.url + ')" ondragstart=event.preventDefault()></div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" ele-menu="image" drag-ele="ele" rotate resize ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" ondragstart="event.preventDefault()"><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" ondragstart="event.preventDefault()"></div>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                            '                    <div class="ele ele-image" style="background-image:url(' + data.url + ')" ondragstart=event.preventDefault()></div>',
                        '                </div>',
                        '            </div>'].join("");
                }
                return template;
            },
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);
                eleApplyService.defaultApply(element,data);
            }
        }
    })
    .directive('eleGroupDefault', function (eleApplyService,creatorServices) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                            '                   <div class="group-over">',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" on-group-size-change class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" ele-menu="group" drag-ele="ele" resize>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
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
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                var dom=$(element);
                var domStyle=dom.find(" >.ele-box >.ele");
                for(var i=0;i<data.eleList.length;i++){
                    domStyle.append(creatorServices.createEle(data.eleList[i]));
                }

                return function (scope, element, attrs) {
                    var data=JSON.parse(attrs.eleConfig);
                    eleApplyService.defaultApply(element,data);
                }
            }
        }
    })
    .directive('eleMenuDefault', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box ele"></div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" ele-menu="menu" drag-ele="ele" rotate resize ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" ondragstart="event.preventDefault()" onmousedown=event.stopPropagation();><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" ondragstart="event.preventDefault()"></div>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box ele"></div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);

                //插入item
                var dom=$(element);
                var domMenu=dom.find(" >.ele-box >.ele");

                var menuLength=data.item.length;
                for(var i=0;i<menuLength;i++){
                    var domItem=$("<div class='menu-item' id="+data.item[i].ID+">"+data.item[i].name+"</div>");
                    domItem.css({"width":(100/menuLength).toFixed(2)+"%","float":"left"});
                    domMenu.append(domItem);
                }

                eleApplyService.defaultApply(element,data);
            }
        }
    })
    
    
    /**
     * mobile 上的session
     */
    
    .directive('headDefaultPhone', function (phoneCreatorServices) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session')>" +
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        '</div>';
                }else{
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session' session-resize='phone' phone-right-click-menu-init ng-mouseover=hoverSession($event,'"+data.ID+"')>" +
                        '<div class="session-resize phone only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>'+
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        '<div class="menu-tool-box phone">' +
                        '<button class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="隐藏" tooltip-position="bottom" ng-click=deleteSession("'+data.ID+'")><i class="mdi mdi-delete"></i></button>'+
                        '</div>'+
                        '</div>';
                }

                return template;
            },
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                //插入背景
                var dom=$(element);
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                //渲染手机专属的样式覆盖旧的
                $.each(data.phoneStyle, function (index, value) {
                    dom.css(index, value);
                });

                if(data.class!==undefined){
                    for(var i=0;i<data.class.length;i++){
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom=dom.find(".ele-session");

                for (var i = 0; i < data.eleList.length; i++) {
                    var eleDom=phoneCreatorServices.createEle(data.eleList[i]);
                    sessionDom.append(eleDom);
                    if(data.eleList[i].showState==false){
                        eleDom.css('display','none');
                    }
                }

                return function (scope, element, attrs) {

                }
            }
        }
    })
    .directive('sessionDefaultPhone', function (phoneCreatorServices) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session')>" +
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        '</div>';
                }else{
                    template="<div class='ele-session-box' id="+data.ID+" ele-type='session' session-resize='phone' phone-right-click-menu-init ng-mouseover=hoverSession($event,'"+data.ID+"')>" +
                        '<div class="session-resize phone only-bottom z-depth-2" ele-type="resize"><i ele-type="resize" class="mdi mdi-arrow-down-bold"></i></div>'+
                        '<div class="over-shadow"></div>'+
                        '<div class="ele-session"></div>'+
                        "<div class='menu-tool-box phone'>" +
                        '<button class="btn btn--s btn--red btn--fab" lx-ripple lx-tooltip="隐藏" tooltip-position="bottom" ng-click=deleteSession("'+data.ID+'")><i class="mdi mdi-delete"></i></button>'+
                        "</div>"+
                        '</div>';
                }

                return template;
            },
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                //插入背景
                var dom=$(element);
                dom.css("background-image", "url(" + data.background.url + ")");
                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                //渲染手机专属的样式覆盖旧的
                $.each(data.phoneStyle, function (index, value) {
                    dom.css(index, value);
                });

                if(data.class!==undefined){
                    for(var i=0;i<data.class.length;i++){
                        dom.addClass(data.class[i]);
                    }
                }

                //插入元素
                var sessionDom=dom.find(".ele-session");

                for (var i = 0; i < data.eleList.length; i++) {
                    var eleDom=phoneCreatorServices.createEle(data.eleList[i]);
                    sessionDom.append(eleDom);
                    if(data.eleList[i].showState==false){
                        eleDom.css('display','none');
                    }
                }

                return function (scope, element, attrs) {

                }
            }
        }
    })
    
    
    /**
     * mobile 上的元素
     */
    .directive('eleTextDefaultPhone', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">文本</div>',
                        '                <div class="ele-box">',
                        '                    <div class="ele ele-text">',
                        data.textValue,
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" phone-ele-menu="text" phone-drag-ele="ele" phone-rotate phone-resize ng-dblclick=editEle(\'' + data.ID + '\') ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" ondragstart="event.preventDefault()" onmousedown=event.stopPropagation();><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" ondragstart="event.preventDefault()"></div>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
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
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);

                eleApplyService.phoneDefaultApply(element,data);

                //放在后面是为了覆盖前面的样式
                var dom=$(element);
                var domBorder=dom.find(' >.ele-box');
                domBorder.css({"transform":"scale("+data.phoneStyle.scale+","+data.phoneStyle.scale+")","-ms-transform":"scale("+data.phoneStyle.scale+","+data.phoneStyle.scale+")","-moz-transform":"scale("+data.phoneStyle.scale+","+data.phoneStyle.scale+")","-webkit-transform":"scale("+data.phoneStyle.scale+","+data.phoneStyle.scale+")","-o-transform":"scale("+data.phoneStyle.scale+","+data.phoneStyle.scale+")"});
                domBorder.css({"transform-origin":"0% 0%","-ms-transform-origin":"0% 0%","-moz-transform-origin":"0% 0%","-webkit-transform-origin":"0% 0%","-o-transform-origin":"0% 0%"});

                $.each(data.phoneStyle.border, function (index, value) {
                    if(index=='width'){
                        dom.css(index, parseInt(value)*data.phoneStyle.scale);
                    }
                    if(index=='min-height'){
                        dom.css('height', parseInt(value)*data.phoneStyle.scale);
                    }
                    domBorder.css(index, value);
                });

            }
        }
    })
    .directive('eleImageDefaultPhone', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                            '                    <div class="ele ele-image" style=background-image:url(' + data.url + ') ondragstart=event.preventDefault()></div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" phone-ele-menu="image" phone-drag-ele="ele" phone-rotate phone-resize ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="rotate" ondragstart="event.preventDefault()" onmousedown=event.stopPropagation();><i class="mdi mdi-refresh"></i></div>',
                        '                <div class="line" ondragstart="event.preventDefault()"></div>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="ele-label">图片</div>',
                        '                <div class="ele-box">',
                            '                    <div class="ele ele-image" style=background-image:url(' + data.url + ') ondragstart=event.preventDefault()></div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);

                eleApplyService.phoneDefaultApply(element,data);

                var dom=$(element);
                var domBorder=dom.find(' >.ele-box');
                domBorder.css('width', parseInt(data.phoneStyle.border['width'])*data.phoneStyle.scale);
                domBorder.css('min-height', parseInt(data.phoneStyle.border['min-height'])*data.phoneStyle.scale);

            }
        }
    })
    .directive('eleGroupDefaultPhone', function (eleApplyService,phoneCreatorServices,$compile) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">组</div>',
                        '                <div class="ele-box">',
                            '                   <div class="group-over">',
                        '                   </div>',
                        '                    <div class="ele ele-group">',
                        '                    </div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" on-group-size-change class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" phone-ele-menu="group" phone-drag-ele="ele" phone-resize>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
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
            replace: true,
            compile:function(element, attrs){
                var data=JSON.parse(attrs.eleConfig);
                var dom=$(element);
                var domStyle=dom.find(" >.ele-box >.ele");
                for(var i=0;i<data.eleList.length;i++){
                    domStyle.append(phoneCreatorServices.createEle(data.eleList[i]));
                }
                return function (scope, element, attrs) {
                    var data=JSON.parse(attrs.eleConfig);
                    eleApplyService.phoneDefaultApply(element,data);
                }
            }
        }
    })
    .directive('eleMenuDefaultPhone', function (eleApplyService) {
        return {
            restrict: 'AE',
            template:function(element,attrs){
                var data=JSON.parse(attrs.eleConfig);
                var template="";
                if(attrs.thumbnail){
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box">',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box phone ele"><i class="mdi mdi-menu"></i></div>',
                        '                </div>',
                        '            </div>'].join("");
                }else{
                    template=['<div id="' + data.ID + '" ele-type="'+data.type+'" class="position-box" ng-class="{true:\'active\'}[activeEle.ID==\'' + data.ID + '\']" phone-ele-menu="menu" phone-drag-ele="ele" phone-resize ng-mousedown=selectEle($event,\'' + data.ID + '\')>',
                        '                <div class="center" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize left-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize right-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-left" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-right" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-top" ondragstart="event.preventDefault()"></div>',
                        '                <div class="resize only-bottom" ondragstart="event.preventDefault()"></div>',
                        '                <div class="ele-label">导航</div>',
                        '                <div class="ele-box">',
                        '                   <div class="menu-box phone ele"><i class="mdi mdi-menu"></i></div>',
                        '                </div>',
                        '            </div>'].join("");
                }

                return template;
            },
            replace: true,
            link: function (scope, element, attrs) {
                var data=JSON.parse(attrs.eleConfig);

                var dom=$(element);
                var domStyle = dom.find(" >.ele-box >.ele");
                domStyle.find('i').css("color", data.phoneStyle.style['color']);
                domStyle.find('i').css("font-size", data.phoneStyle.style['font-size']);


                eleApplyService.phoneDefaultApply(element,data);
            }
        }
    })
    
    
    /**
     * 渲染方法
     */
    .factory('eleApplyService', function () {
        var handle={
            defaultApply:function(dom,data){
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
            phoneDefaultApply:function(dom,data){
                dom = $(dom);
                dom.attr('scale',data.phoneStyle.scale);

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
    })
;