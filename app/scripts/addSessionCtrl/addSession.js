"use strict";
angular.module('addSession', [])
    .directive('addSessionBox', function () {
        return {
            restrict: 'A',
            templateUrl:"views/addSession/sessionList.html",
            link: function (scope, element, attrs) {
                var mySwiper = $(element).find(".swiper-container").swiper({
                    direction: 'horizontal',
                    slidesPerView: "auto",
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20
                });
            }
        }
    })
    .directive('addSessionHandle', function ( $compile, $timeout) {
        return {
            restrict: 'A',
            scope: {},
            template: '<div class="add-session-handle bottom z-depth-2" ng-class="{true:\'open\'}[showFlag]"><i class="mdi mdi-plus"></i></div>',
            replace: true,
            link: function (scope, element, attrs) {

                var parentSessionDom = $(element).parent(".ele-session-box");
                scope.showFlag = false;
                var template = "<div class='add-session-box' add-session-box></div>";
                var dom = "";

                //用来捕捉鼠标点击事件 如果不是在可触范围内 则隐藏按钮
                var mouseDownEvent = function (e) {
                    if (scope.showFlag == true) {
                        var target = e.target;
                        if (target == dom[0] || dom[0] == $(target).parents(".add-session-box")[0] || target == element[0] || $(target).parents(".add-session-box")[0] == element[0]) {
                            //不需要隐藏
                        } else {
                            //隐藏
                            $timeout(function () {
                                dom.removeClass("in");
                                scope.showFlag = false;
                            }, 100);

                        }

                    }
                }

                $("body").on("mousedown", mouseDownEvent);

                $(element).on("click", function (e) {
                    if (!scope.showFlag) {
                        scope.showFlag = true;
                        //插入dom到session下面
                        if (dom == "") {
                            dom = $compile(template)(scope);
                            parentSessionDom.after(dom);
                        }
                        
                        $timeout(function () {
                            dom.addClass("in");
                        });
                    } else {
                        //隐藏
                        scope.showFlag = false;
                        dom.removeClass("in");
                    }
                });

                scope.$on("$destroy", function () {
                    $("body").off("mousedown", mouseDownEvent);
                    if (dom != "") {
                        dom.remove();
                    }
                })

            }
        }
    })