"use strict";
angular.module('kyle.eleSetting', [])
    .directive('eleSettingBox', function (eleSettingService) {
        return {
            restrict: 'A',
            replace: true,
            template:['<div class="color-pick-box lager" id="color-pick-box" drag-ele handle="handle" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">',
                '    <div class="my-color">',
                '        <div class="title handle">',
                '            {{boxInitData.title}}',
                '            <button class="btn btn--xs btn--white btn--icon" lx-ripple ng-click="closeEleSetting()"><i class="mdi mdi-close"></i></button>',
                '        </div>',
                '        <div class="content-box" ng-show=boxInitData.type=="imagedesign" ng-init="tabState=0">',
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
                '                   <perfect-scrollbar class="scroller-page" wheel-propagation="true" suppress-scroll-x="true" wheel-speed="5">',
                '                   <div ng-show="activeLeftMenu==\'background\'">',
                '                       <div class="title-text">颜色</div>',
                '                       <div class="sub-content">',
                '                           <div class="sub-title">背景颜色</div>',
                '                           <div class="color-box z-depth-1"></div>',
                '                       </div>',
                '                   </div>',
                '                   <div ng-show="activeLeftMenu==\'border\'">',
                '                       <div class="title-text">边框</div>',
                '                       <div class="sub-content">',
                '                           <div class="sub-title">边框颜色</div>',
                '                           <div class="color-box z-depth-1"></div>',
                '                       </div>',
                '                       <div class="sub-content">',
                '                           <div class="sub-title">边框大小</div>',
                '                           <div class="border-box z-depth-1" style="padding: 10px">',
                '                               <div class="center input-box z-depth-1">20</div>',
                '                               <div class="top input-box z-depth-1">20</div>',
                '                               <div class="left input-box z-depth-1">20</div>',
                '                               <div class="bottom input-box z-depth-1">20</div>',
                '                               <div class="right input-box z-depth-1">20</div>',
                '                           </div>',
                '                       </div>',
                '                   </div>',
                '                   <div ng-show="activeLeftMenu==\'radius\'">',
                '                       <div class="title-text">圆角</div>',
                '                       <div class="sub-content">',
                '                           <div class="sub-title">圆角度数</div>',
                '                           <div class="radius-box z-depth-1" style="border-radius: 20px">',
                '                               <div class="center input-box z-depth-1">20</div>',
                '                               <div class="top-right input-box z-depth-1">20</div>',
                '                               <div class="top-left input-box z-depth-1">20</div>',
                '                               <div class="bottom-left input-box z-depth-1">20</div>',
                '                               <div class="bottom-right input-box z-depth-1">20</div>',
                '                           </div>',
                '                       </div>',
                '                   </div>',
                '                   </div>',
                '               </div>',
                '           </div>',
                '           <div class="ele-setting-content" ng-init="activeLeftMenu=\'background\'" ng-if="tabState==1"></div>',
                '        </div>',
                '        <div class="content-box" style="height: 400px" ng-show=boxInitData.type=="layers">',

                '        </div>',
                '        <div class="content-box" style="height: 400px" ng-show=boxInitData.type=="animate">',

                '        </div>',
                '    </div>',
                '</div>'].join(""),
            link: function (scope, element) {
                scope.boxInitData=eleSettingService.getInitData();

                scope.$watch("boxInitData",function(){
                    switch (scope.boxInitData.type){
                        case "imagedesign":scope.boxInitData.title="图片设计";break;
                        case "layers":scope.boxInitData.title="布局";break;
                        case "animate":scope.boxInitData.title="动画";break;
                    }
                },true);

                scope.closeEleSetting=function(){
                    eleSettingService.hideDom();
                }
            }
        };
    })
    .directive('eleSettingSlide', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl :function(elem,attrs){
                switch (attrs.eleSettingSlide){
                    case "image":return "scripts/eleSetting/imageSlide.html";
                }
            },
            link: function (scope, element) {
                //初始化
                var mySwiper = $(element).swiper({
                    direction: 'horizontal',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    slidesPerView : 4,
                    slidesOffsetBefore : 20,
                    slidesOffsetAfter : 20
                });
            }
        };
    })
    .factory('eleSettingService', function ($rootScope, $compile) {

        var domData = {
            ID: "colorPick", value: ""
        };

        var boxInitData={type:'',ID:''};

        var handle = {
            getInitData:function(){
                return boxInitData;
            },
            removePlugin:function(){
                if(domData.value!==''){
                    domData.value.remove();
                    domData.value='';
                }
            },
            createDom:function(left,top){
                //初始化
                var dom = $compile("<div ele-setting-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domData.value = dom;
                domData.value.show();
                //边界检查

                setTimeout(function(){
                    var eleHeight = parseInt(domData.value.height());
                    var bodyHeight = parseInt($("body").height());

                    if (top + eleHeight > bodyHeight) {
                        top -= top + eleHeight - bodyHeight;
                    } else if(top<50){
                        top=50;
                    }
                    domData.value.css({left: left, top: top});
                },100);

            },
            showDom: function (left, top ,type , ID) {
                top=top-100;
                boxInitData.type=type;
                boxInitData.ID=ID;
                //获取原始数据

                if (domData.value === "") {
                    //初始化
                    handle.createDom(left, top);
                } else {
                    domData.value.show();
                    //边界检查
                    var eleHeight = parseInt(domData.value.height());
                    var bodyHeight = $("body").height()

                    if (top + eleHeight > bodyHeight) {
                        top -= top + eleHeight - bodyHeight;
                    } else if(top<50){
                        top=50;
                    }
                    domData.value.css({left: left, top: top});
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