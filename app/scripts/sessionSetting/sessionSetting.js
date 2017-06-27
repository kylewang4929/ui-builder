"use strict";
angular.module('kyle.sessionSetting', [])
    .directive('sessionBackgroundSettingBox', function (sessionSettingService,websiteData) {
        return {
            restrict: 'A',
            replace: true,
            scope:{

            },
            template: [
                '<div class="color-pick-box lager" id="color-pick-box" drag-ele="default" handle="handle" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">',
                    '<div class="my-color">',
                        '<div class="title handle">',
                            '{{title}}',
                            '<button class="btn btn--xs btn--white btn--icon" lx-ripple ng-click="closeEleSetting()"><i class="mdi mdi-close"></i></button>',
                        '</div>',
                        '<div class="content-box" style="height:480px">' +
                            '<div class="preview-head">' +
                                '<div class="image box" ng-if="boxInitData.option.type == \'image\' || boxInitData.option.type == \'video\'" ng-style="{\'background-image\':\'url(\'+boxInitData.option.image+\')\'}"></div>' +
                                '<div class="color box" ng-if="boxInitData.option.type == \'color\'" ng-style="{\'background-color\':boxInitData.option.color}"></div>' +
                                '<div class="menu" flex-container="row">' +
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-invert-colors"></i> 颜色</lx-button></div>'+
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-image-area"></i> 图片</lx-button></div>'+
                                    '<div flex-item="4" flex-item-order="1"><lx-button lx-color="blue"><i class="mdi mdi-video"></i> 视频</lx-button></div>'+
                                '</div>' +
                                '<div class="button-box">'+
                                    '<lx-button><i class="mdi mdi-settings"></i> 设置</lx-button>'+
                                    '<lx-button class="play-button" ng-class="{true:\'show\',false:\'hide\'}[boxInitData.option.type == \'video\']" ng-click="toggleVideo()">'+
                                        '<i class="mdi mdi-play" ng-show="videoState.state == \'pause\'"></i>'+
                                        '<i class="mdi mdi-pause" ng-show="videoState.state == \'play\'"></i>'+
                                    '</lx-button>'+
                                '</div>'+
                            '</div>' +
                            '<perfect-scrollbar suppress-scroll-x="true" class="preview-list scroll-page small-bar" wheel-propagation="true" wheel-speed="3">'+
                                '<div class="preview-item" ng-click="selectBackground(rowData)" lx-ripple="white" ng-repeat="rowData in previewList" ng-style="{\'background-image\':\'url(\'+rowData.image+\')\'}">'+
                                    '<i class="mdi mdi-video flag" ng-if="rowData.type == \'video\'"></i>'+
                                    '<i class="mdi mdi-image-area flag" ng-if="rowData.type == \'image\'"></i>'+
                                '</div>'+
                            '</perfect-scrollbar>'+
                        '</div>',
                    '</div>',
                '</div>'].join(""),
            link: function (scope, element) {
                scope.boxInitData = sessionSettingService.getInitData();
                scope.title = '更换背景';
                scope.closeEleSetting = function () {
                    sessionSettingService.hideDom();
                };

                scope.videoState = {
                    state : 'pause',
                    handle : null,
                };

                scope.toggleVideo=function(){
                    if(scope.videoState.state == 'pause'){
                        //播放
                        scope.videoState.handle.play();
                    }else{
                        //暂停
                        scope.videoState.handle.pause();   
                    }
                };

                scope.$watch('boxInitData.option.type',function(){
                    if(scope.boxInitData.option.type == 'video'){
                        //获取视频的dom
                        scope.videoState.handle = $('#'+scope.boxInitData.ID+'.ele-session-box .video-background video').get(0);
                        //监听播放完成
                        scope.videoState.handle.onended = function(){
                            scope.$apply(function(){
                                scope.videoState.state='pause';
                            });
                        };
                        scope.videoState.handle.onpause = function(){
                            scope.$apply(function(){
                                scope.videoState.state='pause';
                            });
                        };
                        scope.videoState.handle.onplaying = function(){
                            scope.$apply(function(){
                                scope.videoState.state='play';
                            });
                        };
                        scope.videoState.handle.pause();
                        scope.videoState.state = 'pause';
                    }
                });

                scope.selectBackground = function(data){
                    if(scope.boxInitData.callback!==undefined){
                        scope.boxInitData.callback(data);
                    }
                    scope.videoState.state = 'pause';
                    switch(data.type){
                        case 'image':scope.boxInitData.option.type = 'image';scope.boxInitData.option.image = data.image;break;
                        case 'video':scope.boxInitData.option.type = 'video';scope.boxInitData.option.image = data.image;scope.boxInitData.option.url = data.url;break;
                    }
                    websiteData.updateSessionBackground(data,scope.boxInitData.ID);
                };

                scope.previewList=[
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'image',image:'images/website/bg1.jpg'},
                    {type:'video',url:'http://obo7gtx2x.bkt.clouddn.com/banner1.webm',image:'images/video/banner1.jpg'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'http://obo7gtx2x.bkt.clouddn.com/banner1.webm',image:'images/video/banner1.jpg'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'http://obo7gtx2x.bkt.clouddn.com/banner.mp4',image:'images/video/banner.png'},
                    {type:'image',image:'images/website/headBg.jpg'},
                    {type:'video',url:'http://obo7gtx2x.bkt.clouddn.com/banner.mp4',image:'images/video/banner.png'},
                ];

            }
        };
    })

    .factory('sessionSettingService', function ($rootScope, $compile) {

        var domData = {
            ID: "colorPick", value: '',option:{
                type:'',
                color:'',
                video:'',
                image:''
            }
        };

        var boxInitData = { ID: '', option: {} };

        var handle = {
            getInitData: function () {
                return boxInitData;
            },
            removePlugin: function () {
                if (domData.value !== '') {
                    handle.stopVideo(boxInitData.ID);
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
            updateOption:function(option){
                boxInitData.option = option;
            },
            showDom: function (left, top, ID, option,callback) {
                boxInitData.ID = ID;
                boxInitData.option = option;
                boxInitData.callback = callback;
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
            stopVideo:function(sessionID){
                var video = $('#'+sessionID+'.ele-session-box .video-background video');
                if(video.length !== 0){
                    video.get(0).pause();
                }
            },
            hideDom: function () {
                if (domData.value !== '') {
                    domData.value.hide();
                    //如果有视频 则暂停它
                    handle.stopVideo(boxInitData.ID);
                }
            }
        };
        return handle;
    });