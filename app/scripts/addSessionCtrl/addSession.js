"use strict";
angular.module('addSession', [])
    .directive('addSessionBox', function (websiteData,elePosition,levelScroll) {
        return {
            restrict: 'A',
            scope: {
                closeHandle: '&',
                targetSession: '@'
            },
            templateUrl: "views/addSession/sessionList.html",
            link: function (scope, element, attrs) {
                var mainScrollHandle = $('#main-editor-scroll');

                var mySwiper = $(element).find(".swiper-container").swiper({
                    direction: 'horizontal',
                    slidesPerView: "auto"
                });

                //模拟数据暂时先放着
                var defaultSessionData = {
                    "ID": "session1",
                    "type": "session",
                    "name": "Banner",
                    "background": {
                        "url": "images/website/bg1.jpg"
                    },
                    "style": {
                        "min-height": "500px",
                        "background-size": "cover",
                        "background-position-x": "center",
                        "background-position-y": "center",
                        "background-repeat": "no-repeat",
                        "position": "relative"
                    },
                    "phoneStyle": {
                        "min-height": "430px"
                    },
                    "eleList": [],
                    "eleTemplateType": "session-default",
                };

                scope.sessionList = [
                    {
                        preview: 'images/session/session1.png',
                        sessionData: defaultSessionData
                    },
                    {
                        preview: 'images/session/session2.png',
                        sessionData: defaultSessionData
                    },
                    {
                        preview: 'images/session/session3.png',
                        sessionData: defaultSessionData
                    },
                    {
                        preview: 'images/session/session4.png',
                        sessionData: defaultSessionData
                    },
                    {
                        preview: 'images/session/session5.png',
                        sessionData: defaultSessionData
                    }
                ];
                scope.addSession = function (obj) {
                    var dom = websiteData.addSession(angular.copy(obj.sessionData), scope.targetSession, { isShow: false });
                    dom.addClass('base-session-show-transition');
                    //显示session
                    dom.height(obj.sessionData.style['min-height']);

                    //监听动画，结束后清除
                    dom.one("transitionend", function () {
                        dom.removeClass('base-session-show-transition');
                        dom.height('auto');
                        //调整位置 居中
                        var y = elePosition.getTop(dom[0]);
                        var start = mainScrollHandle.scrollTop();
                        var scrollEnd = 0;
                        scrollEnd = y + parseInt(obj.sessionData.style['min-height']) / 2 - $("body").height() / 2;
                        levelScroll.scrollTop(mainScrollHandle, scrollEnd);
                    });
                    scope.closeHandle().call(this,function(){
                        
                    });
                }

            }
        };
    })
    .directive('addSessionHandle', function ($compile, $timeout, elePosition, levelScroll, $rootScope) {
        return {
            restrict: 'A',
            scope: {},
            template: '<div class="add-session-handle bottom z-depth-2" ng-class="{true:\'open\'}[showFlag]"><i class="mdi mdi-plus"></i></div>',
            replace: true,
            link: function (scope, element, attrs) {

                var sessionID = $(element).parents('.ele-session-box').attr('id');

                scope.show = function () {
                    scope.showFlag = true;
                    //插入dom到session下面
                    if (dom === "") {
                        dom = $compile(template)(scope);
                        parentSessionDom.after(dom);
                    }

                    $timeout(function () {

                        //计算绝对位置 滚动滚动条到屏幕中间
                        var y = elePosition.getTop(dom[0]);
                        var start = mainScrollHandle.scrollTop();

                        var scrollEnd = 0;
                        scrollEnd = y + addSessionBoxHeight / 2 - $("body").height() / 2;

                        levelScroll.scrollTop(mainScrollHandle, scrollEnd);

                        dom.addClass("in");

                    });
                }

                scope.hide = function (callback) {
                    //隐藏
                    $timeout(function () {
                        scope.showFlag = false;
                    }, 300);
                    //形变开始
                    $rootScope.$emit("addSessionOpenStart");
                    dom.removeClass("in");
                    dom.one("transitionend", function () {
                        //形变结束
                        $rootScope.$emit("addSessionOpenEnd");
                        if(callback!=undefined){
                            callback();
                        }
                    });
                }

                //记录高度 由于动画的原因无法正常获取高度                
                var addSessionBoxHeight = 200;

                //存储滚动条到handle
                var mainScrollHandle = $('#main-editor-scroll');

                var parentSessionDom = $(element).parent(".ele-session-box");
                scope.showFlag = false;
                var template = "<div class='add-session-box' add-session-box close-handle='hide' target-session='" + sessionID + "'></div>";
                var dom = "";

                //用来捕捉鼠标点击事件 如果不是在可触范围内 则隐藏按钮
                var mouseDownEvent = function (e) {
                    if (scope.showFlag === true) {
                        var target = e.target;
                        if (target === dom[0] || dom[0] === $(target).parents(".add-session-box")[0] || target === element[0] || $(target).parents(".add-session-box")[0] === element[0]) {
                            //不需要隐藏
                        } else {
                            //隐藏
                            $timeout(function () {
                                //开始形变
                                $rootScope.$emit("addSessionOpenStart");
                                dom.removeClass("in");
                                dom.one("transitionend", function () {
                                    //形变结束
                                    $rootScope.$emit("addSessionOpenEnd");
                                });
                                $timeout(function () {
                                    scope.showFlag = false;

                                }, 300);
                            }, 100);
                        }

                    }
                };

                $("body").on("mousedown", mouseDownEvent);

                $(element).on("click", function (e) {
                    if (!scope.showFlag) {
                        scope.show();
                    } else {
                        scope.hide();
                    }
                });

                scope.$on("$destroy", function () {
                    $("body").off("mousedown", mouseDownEvent);
                    if (dom !== "") {
                        dom.remove();
                    }
                });

            }
        };
    });