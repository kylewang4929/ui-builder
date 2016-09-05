"use strict";
angular.module('kyle.eleSetting', [])
    .directive('eleSettingBox', function (eleSettingService) {
        return {
            restrict: 'A',
            replace: true,
            scope:{},
            template: ['<div class="color-pick-box lager" id="color-pick-box" drag-ele="default" handle="handle" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">',
                '    <div class="my-color">',
                '        <div class="title handle">',
                '            {{boxInitData.title}}',
                '            <button class="btn btn--xs btn--white btn--icon" lx-ripple ng-click="closeEleSetting()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div ele-setting-box-design-image ng-if=boxInitData.type=="imagedesign"></div>',
                '        <div ele-setting-box-design-text ng-if=boxInitData.type=="textdesign"></div>',
                '        <div ele-setting-box-layers ng-if=boxInitData.type=="layers"></div>',
                '        <div ele-setting-box-animate ng-if=boxInitData.type=="animate"></div>',
                '        <div ele-setting-box-filter ng-if=boxInitData.type=="filter"></div>',
                '    </div>',
                '</div>'].join(""),
            link: function (scope, element) {
                scope.boxInitData = eleSettingService.getInitData();

                scope.$watch("boxInitData", function () {
                    switch (scope.boxInitData.type) {
                        case "imagedesign": scope.boxInitData.title = "图片设计"; break;
                        case "textdesign": scope.boxInitData.title = "文字设计"; break;
                        case "layers": scope.boxInitData.title = "布局"; break;
                        case "animate": scope.boxInitData.title = "动画"; break;
                        case "filter": scope.boxInitData.title = "滤镜"; break;
                    }
                }, true);

                scope.closeEleSetting = function () {
                    eleSettingService.hideDom();
                };
            }
        };
    })

    .directive('eleSettingBoxDesignImage', function (eleSettingService) {
        return {
            restrict: 'A',
            template: [
                '        <div class="content-box" ng-init="tabState=0" style="height:450px">',
                '           <div class="ele-setting-option z-depth-1">',
                '               <div ele-setting-slide="image" style="height: 85px"></div>',
                '                   <div class="tab-box tc-white-1" flex-container="row">',
                '                       <div flex-item="6" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==0] ng-click="tabState=0" lx-ripple>普通状态</button></div>',
                '                       <div flex-item="6" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==1] ng-click="tabState=1" lx-ripple>鼠标悬浮</button></div>',
                '                   </div>',
                '           </div>',
                '           <div class="ele-setting-content" ng-init="activeLeftMenu=\'background\'" ng-if="tabState==0">',
                '               <div class="left-menu">',
                '                   <div class="menu-item" ng-click="activeLeftMenu=\'background\'" ng-class="{true:\'active\'}[activeLeftMenu==\'background\']"><div class="border"></div><i class="mdi mdi-invert-colors"></i></div>',
                '                   <div class="menu-item" ng-click="activeLeftMenu=\'border\'" ng-class="{true:\'active\'}[activeLeftMenu==\'border\']"><div class="border"></div><i class="mdi mdi-checkbox-blank-outline"></i></div>',
                '                   <div class="menu-item" ng-click="activeLeftMenu=\'radius\'" ng-class="{true:\'active\'}[activeLeftMenu==\'radius\']"><div class="border"></div><i class="mdi mdi-crop-free"></i></div>',
                '                   <div class="menu-item" ng-click="activeLeftMenu=\'shadow\'" ng-class="{true:\'active\'}[activeLeftMenu==\'shadow\']"><div class="border"></div><i class="mdi mdi-checkbox-multiple-blank"></i></div>',
                '               </div>',
                '               <div class="right-content">',
                '                   <perfect-scrollbar class="scroller-page small-bar" wheel-propagation="true" suppress-scroll-x="true" wheel-speed="5">',
                '                       <div ng-show="activeLeftMenu==\'background\'">',
                '                           <div class="title-text">颜色</div>',
                '                           <div class="sub-content">',
                '                               <div class="sub-title">背景颜色</div>',
                '                               <div class="color-box z-depth-1"></div>',
                '                           </div>',
                '                       </div>',
                '                       <div ng-show="activeLeftMenu==\'border\'">',
                '                           <div class="title-text">边框</div>',
                '                           <div class="sub-content">',
                '                               <div class="sub-title">边框颜色</div>',
                '                               <div class="color-box z-depth-1"></div>',
                '                           </div>',
                '                           <div class="sub-content">',
                '                               <div class="sub-title">边框大小</div>',
                '                               <div class="border-box z-depth-1" style="padding: 10px">',
                '                                   <div class="center input-box z-depth-1">20</div>',
                '                                   <div class="top input-box z-depth-1">20</div>',
                '                                   <div class="left input-box z-depth-1">20</div>',
                '                                   <div class="bottom input-box z-depth-1">20</div>',
                '                                   <div class="right input-box z-depth-1">20</div>',
                '                               </div>',
                '                           </div>',
                '                       </div>',
                '                       <div ng-show="activeLeftMenu==\'radius\'">',
                '                           <div class="title-text">圆角</div>',
                '                           <div class="sub-content">',
                '                               <div class="sub-title">圆角度数</div>',
                '                               <div class="radius-box z-depth-1" style="border-radius: 20px">',
                '                                   <div class="center input-box z-depth-1">20</div>',
                '                                   <div class="top-right input-box z-depth-1">20</div>',
                '                                   <div class="top-left input-box z-depth-1">20</div>',
                '                                   <div class="bottom-left input-box z-depth-1">20</div>',
                '                                   <div class="bottom-right input-box z-depth-1">20</div>',
                '                               </div>',
                '                           </div>',
                '                       </div>',
                '                   </perfect-scrollbar>'+
                '               </div>',
                '           </div>',
                '           <div class="ele-setting-content" ng-init="activeLeftMenu=\'background\'" ng-if="tabState==1"></div>',
                '        </div>',
            ].join(""),
            link: function (scope, element) {

            }
        };
    })

    .directive('eleSettingBoxDesignText', function (eleSettingService) {
        return {
            restrict: 'A',
            template: [
                '        <div class="content-box" style="height:450px">',
                '        </div>',
            ].join(""),
            link: function (scope, element) {

            }
        };
    })

    .directive('eleSettingBoxLayers', function (eleSettingService) {
        return {
            restrict: 'A',
            template: [
                '        <div class="content-box" style="height:450px">',
                '        </div>',
            ].join(""),
            link: function (scope, element) {

            }
        };
    })

    .directive('eleSettingBoxAnimate', function (eleSettingService) {
        return {
            restrict: 'A',
            template: [
                '        <div class="content-box" style="height:450px">',
                '        </div>',
            ].join(""),
            link: function (scope, element) {

            }
        };
    })

    .directive('eleSettingBoxFilter', function (eleSettingService) {
        return {
            restrict: 'A',
            template: [
                '<div class="content-box" style="height:450px">',
                    '<div class="tab-box z-depth-1 tc-white-1" flex-container="row">',
                        '<div flex-item="6" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==0] ng-click="tabState=0" lx-ripple>系统滤镜</button></div>',
                        '<div flex-item="6" flex-item-order="1"><button class="btn btn--m btn--block btn--blue btn--flat" ng-class={true:"active"}[tabState==1] ng-click="tabState=1" lx-ripple>我的滤镜</button></div>',
                    '</div>',
                    '<perfect-scrollbar style="height:405px" class="scroller-page small-bar" wheel-propagation="true" suppress-scroll-x="true" wheel-speed="5">'+
                        '<div class="image-filter-list">'+
                            '<div class="image-filter-item">'+
                                '<div class="item-box none">'+
                                    '<div class="line"></div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="image-filter-item" ng-repeat="rowData in filterData">'+
                                '<div class="item-box">'+
                                    '<div class="filter-box" ng-style=rowData.style>'+
                                        '<div class="image" ng-style={"background-image":"url("+boxInitData.eleData.url+")"}></div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</perfect-scrollbar>'+
                '</div>',
            ].join(""),
            link: function (scope, element) {

                scope.tabState=0;

                scope.filterData = [
                    {name:'灰度',style:{'-webkit-filter':'grayscale(1)'}},
                    {name:'褐色',style:{'-webkit-filter':'sepia(1)'}},
                    {name:'饱和度',style:{'-webkit-filter':'saturate(.5)'}},
                    {name:'色相旋转',style:{'-webkit-filter':'hue-rotate(90deg)'}},
                    {name:'反色',style:{'-webkit-filter':'invert(1)'}},
                    {name:'亮度',style:{'-webkit-filter':'brightness(.5)'}},
                    {name:'对比度',style:{'-webkit-filter':'contrast(2)'}},
                    {name:'模糊',style:{'-webkit-filter':'blur(2px)'}},
                ];

            }
        };
    })

    .directive('eleSettingSlide', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: function (elem, attrs) {
                switch (attrs.eleSettingSlide) {
                    case "image": return "views/eleSetting/imageSlide.html";
                }
            },
            link: function (scope, element) {
                //初始化
                var mySwiper = $(element).swiper({
                    direction: 'horizontal',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    slidesPerView: 4,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20,
                    mousewheelControl: true
                });
            }
        };
    })
    .factory('eleSettingService', function ($rootScope, $compile) {

        var domData = {
            ID: "colorPick", value: ""
        };

        var boxInitData = { type: '', ID: '' };

        var handle = {
            getInitData: function () {
                return boxInitData;
            },
            removePlugin: function () {
                if (domData.value !== '') {
                    domData.value.remove();
                    domData.value = '';
                }
            },
            updatePosition: function (data,left,top) {
                console.log(data.value.height());
                var eleHeight = parseInt(data.value.height());
                var eleWidth = parseInt(data.value.width());
                var bodyHeight = parseInt($("body").height());
                var bodyWidth = parseInt($("body").width());

                //将位置调整成居中
                top = top - eleHeight / 2;
                left = left - eleWidth / 2;

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight + 50;
                } else if (top < 50) {
                    top = 50;
                }

                if (left + eleWidth > bodyWidth) {
                    left -= left + eleWidth - bodyWidth + 50;
                } else if (top < 50) {
                    left = 50;
                }
                data.value.css({ left: left, top: top });
            },
            createDom: function (left, top) {
                //初始化
                var dom = $compile("<div ele-setting-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domData.value = dom;
                domData.value.show();
                //边界检查

                setTimeout(function () {
                    handle.updatePosition(domData,left,top);
                }, 100);

            },
            updateInitData : function(eleData){
                boxInitData.eleData = eleData;                
            },
            showDom: function (left, top, type, ID,eleData) {
                boxInitData.type = type;
                boxInitData.ID = ID;
                boxInitData.eleData = eleData;
                //获取原始数据

                if (domData.value === "") {
                    //初始化
                    handle.createDom(left, top);
                } else {
                    domData.value.show();
                    //边界检查
                    handle.updatePosition(domData,left,top);
                }
            },
            hideDom: function () {

                if (domData.value !== '') {
                    domData.value.hide();
                }
            }
        };
        return handle;
    })
    ;