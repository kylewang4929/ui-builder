"use strict";
angular.module('kyle.sessionSetting', [])
    .directive('sessionBackgroundSettingBox', function (sessionSettingService) {
        return {
            restrict: 'A',
            replace: true,
            template: [
                '<div class="color-pick-box lager" id="color-pick-box" drag-ele="default" handle="handle" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">',
                    '<div class="my-color">',
                        '<div class="title handle">',
                            '{{title}}',
                            '<button class="btn btn--xs btn--white btn--icon" lx-ripple ng-click="closeEleSetting()"><i class="mdi mdi-close"></i></button>',
                        '</div>',
                        '<div class="content-box" style="height:480px">' +
                            '<div class="preview-head">' +
                                '<div class="image box" ng-if="boxInitData.option.type == \'image\'" ng-style="{\'background-image\':\'url(\'+boxInitData.option.image+\')\'}"></div>' +
                                '<div class="video box" ng-if="boxInitData.option.type == \'video\'"></div>' +
                                '<div class="color box" ng-if="boxInitData.option.type == \'color\'" ng-style="{\'background-color\':boxInitData.option.color}"></div>' +
                                '<div class="menu" flex-container="row">' +
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-invert-colors"></i> 颜色</lx-button></div>'+
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-image-area"></i> 图片</lx-button></div>'+
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-video"></i> 视频</lx-button></div>'+
                                '</div>' +
                                '<div class="button-box">'+
                                    '<lx-button lx-color="blue"><i class="mdi mdi-settings"></i> 设置</lx-button>'+
                                    '<lx-button lx-color="blue" class="play-button" ng-if="boxInitData.option.type == \'video\'"><i class="mdi mdi-play"></i></lx-button>'+
                                '</div>'+
                            '</div>' +
                            '<perfect-scrollbar suppress-scroll-x="true" class="preview-list" wheel-propagation="true" wheel-speed="3">'+
                                '<div class="preview-item" ng-repeat="rowData in previewList" ng-style="{\'background-image\':\'url(\'+rowData.image+\')\'}">'+
                                    '<i class="mdi mdi-video flag" ng-if="rowData.type == \'video\'"></i>'+
                                    '<i class="mdi mdi-image-area flag" ng-if="rowData.type == \'image\'"></i>'+
                                '</div>'+
                            '</perfect-scrollbar>'+
                        '</div>',
                    '</div>',
                '</div>'].join(""),
            link: function (scope, element) {
                scope.boxInitData = sessionSettingService.getInitData();
                console.log(scope.boxInitData);
                scope.title = '更换背景';
                scope.closeEleSetting = function () {
                    sessionSettingService.hideDom();
                };

                scope.previewList=[
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'images/video/banner.mp4',image:'images/video/banner.png'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'images/video/banner.mp4',image:'images/video/banner.png'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'images/video/banner.mp4',image:'images/video/banner.png'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'images/video/banner.mp4',image:'images/video/banner.png'},
                    
                ];

            }
        };
    })

    .factory('sessionSettingService', function ($rootScope, $compile) {

        var domData = {
            ID: "colorPick", value: ""
        };

        var boxInitData = { ID: '', option: {} };

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
            updatePosition: function (data, left, top) {
                var eleHeight = parseInt(data.value.height());
                var eleWidth = parseInt(data.value.width());
                var bodyHeight = parseInt($("body").height());
                var bodyWidth = parseInt($("body").width());

                if (top + eleHeight > bodyHeight) {
                    top -= top + eleHeight - bodyHeight;
                } else if (top < 50) {
                    top = 50;
                }

                if (left + eleWidth > bodyWidth) {
                    left -= left + eleWidth - bodyWidth;
                } else if (top < 50) {
                    left = 50;
                }
                data.value.css({ left: left, top: top });
            },
            createDom: function (left, top) {
                //初始化
                var dom = $compile("<div session-background-setting-box></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                domData.value = dom;
                domData.value.show();
                //边界检查

                setTimeout(function () {
                    handle.updatePosition(domData, left, top);
                }, 100);

            },
            showDom: function (left, top, ID, option) {
                boxInitData.ID = ID;
                boxInitData.option = option;
                //获取原始数据
                if (domData.value === "") {
                    //初始化
                    handle.createDom(left, top);
                } else {
                    domData.value.show();
                    //边界检查
                    handle.updatePosition(domData, left, top);
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