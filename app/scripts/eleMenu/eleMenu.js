"use strict";
angular.module('eleMenu', [])
    .directive('eleMenu', function ($compile, eleSettingService, eleMenuServices, imageLibraryService, imageCropService, activeEleService) {
        return {
            restrict: 'A',
            template: "<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 image-button' lx-ripple ng-click='changeImage()'><i class='mdi mdi-repeat'></i><span>更换</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 image-button' lx-ripple ng-click='openCrop()'><i class='mdi mdi-crop'></i><span>裁剪</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 text-button' lx-ripple><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 group-button' lx-ripple><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 all-button' lx-ripple ng-click=openSettingBox('design',$event)><i class='mdi mdi-checkerboard'></i><span>设计</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 all-button' lx-ripple ng-click=openSettingBox('layers',$event)><i class='mdi mdi-layers'></i><span>布局</span></button>" +
            "<button class='btn btn--l btn--blue btn--fab z-depth-1 all-button' lx-ripple ng-click=openSettingBox('animate',$event)><i class='mdi mdi-auto-fix'></i><span>动画</span></button>" +
            "</div>",
            link: function (scope, element, attrs) {


                //监听属性 同步更改
                scope.changeImage = function () {
                    imageLibraryService.showDom(1);
                };

                scope.openSettingBox = function (type, e) {
                    var activeEle = activeEleService.getEle();
                    if (type === 'design') {
                        type = activeEle.value.type + type;
                    }
                    var ID = activeEle.value.ID;
                    var left = e.clientX;
                    var top = e.clientY;
                    eleSettingService.showDom(left, top, type, ID);
                };
                scope.openCrop = function () {
                    imageCropService.openCrop(angular.copy(activeEleService.getEle().value));
                };

            }
        };
    })

    .directive('phoneEleMenu', function ($compile, eleSettingService, eleMenuServices) {
        return {
            restrict: 'A',
            template: "<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
            "</div>",
            link: function (scope, element, attrs) {
                scope.eleMenu = eleMenuServices.getType();
            }
        };
    })

    .factory("eleMenuServices", function ($rootScope, $compile, elePosition, $timeout) {

        var dom = null;
        var activeEle = {};
        var mode = "";

        //事件
        var deleteEleEvent = "";
        var updateEleEvent = "";
        var dragStartOff = "";
        var dragEndOff = "";
        var levelScrollStart = "";
        var levelScrollEnd = "";
        var addSessionOpenStart = "";
        var addSessionOpenEnd = "";


        var menuType = { ID: "", value: "" };

        var handle = {
            init: function (data) {

                /*
                    特殊的情况需要隐藏
                */

                deleteEleEvent = $rootScope.$on("deleteEle", function () {
                    handle.hideDom();
                });
                updateEleEvent = $rootScope.$on("updateEle", function () {
                    if (activeEle.ID === "") {
                        return;
                    }
                    handle.showDom(activeEle.ID, activeEle.type);
                });

                dragStartOff = $rootScope.$on("eleDragStart", function () {
                    handle.hideDom();
                });
                dragEndOff = $rootScope.$on("eleDragEnd", function () {
                    if (activeEle.ID === "") {
                        return;
                    }
                    handle.showDom(activeEle.ID, activeEle.type);
                });

                levelScrollStart = $rootScope.$on("levelScrollStart", function () {
                    handle.hideDom();
                });
                levelScrollEnd = $rootScope.$on("levelScrollEnd", function () {
                    if (activeEle.ID === "") {
                        return;
                    }
                    handle.showDom(activeEle.ID, activeEle.type);
                });

                addSessionOpenStart = $rootScope.$on("addSessionOpenStart", function () {
                    handle.hideDom();
                });
                addSessionOpenEnd = $rootScope.$on("addSessionOpenEnd", function () {
                    if (activeEle.ID === "") {
                        return;
                    }
                    handle.showDom(activeEle.ID, activeEle.type);
                });

                mode = data;
            },
            getType: function () {
                return menuType;
            },
            setType: function (type) {
                menuType.value = type;
            },
            createDom: function (eleID, type, x, y) {
                var template = "";
                switch (mode) {
                    case "web": template = "<div class='ele-menu-box' ele-menu='" + type + "'></div>"; break;
                    case "phone": template = "<div class='ele-menu-box' phone-ele-menu='" + type + "'></div>"; break;
                }

                template = $compile(template)($rootScope);

                template.hide();

                $("#main-editor-scroll").append(template);

                dom = template;

                dom.css({ left: x, top: y + 10 });

                dom.find("button").css("display", "none");
                dom.find("." + type + "-button").css("display", "inline-block");
                dom.find(".all-button").css("display", "inline-block");

                dom.show();

                dom.addClass('active');                

            },
            showDom: function (eleID, type) {

                this.setType(type);

                //计算相对位置
                activeEle.ID = eleID;
                activeEle.type = type;
                var eleDom = $("#" + eleID);

                var x = elePosition.getLeft(eleDom.get(0));
                var y = elePosition.getTop(eleDom.get(0)) + eleDom.height();

                if (dom === null) {
                    this.createDom(eleID, type, x, y);
                } else {
                    dom.css({ left: x, top: y + 10 });
                    //更新type属性
                    dom.attr("ele-menu", type);

                    dom.find("button").css("display", "none");
                    dom.find("." + type + "-button").css("display", "inline-block");
                    dom.find(".all-button").css("display", "inline-block");

                    dom.show();

                    $timeout(function(){
                        dom.addClass('active');                        
                    });

                }
            },
            hideDom: function (flag) {
                if (flag) {
                    activeEle.ID = "";
                    activeEle.type = "";
                }
                if (dom !== null) {
                    dom.hide();
                    dom.removeClass('active');
                }
            },
            removePlugin: function () {
                if (dom !== null) {
                    dom.remove();
                    dom = null;
                    //注销监听
                    dragStartOff();
                    dragEndOff();
                    deleteEleEvent();
                    updateEleEvent();
                    addSessionOpenEnd();
                    addSessionOpenStart();
                }
            }
        };

        return handle;
    });
