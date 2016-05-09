"use strict";
angular.module('eleMenu', [])
    .directive('eleMenu', function ($compile, eleSettingService) {
        return {
            restrict: 'A',
            scope: { eleMenu: "@" },
            link: function (scope, element, attrs) {

                scope.openSettingBox = function (type, e) {
                    if (type == 'design') {
                        type = attrs.eleType + type;
                    }
                    var ID = attrs.id;
                    var left = e.clientX;
                    var top = e.clientY;
                    eleSettingService.showDom(left, top, type, ID);
                }

                var menu = $("<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-show=eleMenu=='image'><i class='mdi mdi-crop'></i><span>裁剪</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-show=eleMenu=='text'><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-show=eleMenu=='group'><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-hide=eleMenu=='group'||eleMenu=='text' ng-click=openSettingBox('design',$event)><i class='mdi mdi-checkerboard'></i><span>设计</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-click=openSettingBox('layers',$event)><i class='mdi mdi-layers'></i><span>布局</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-click=openSettingBox('animate',$event)><i class='mdi mdi-auto-fix'></i><span>动画</span></button>" +
                    "</div>");
                menu = $compile(menu.get(0))(scope);
                element.append(menu);

            }
        };
    })
    .directive('phoneEleMenu', function ($compile, eleSettingService) {
        return {
            restrict: 'A',
            scope: { eleMenu: "@" },
            link: function (scope, element, attrs) {

                scope.openSettingBox = function (type, e) {
                    if (type == 'design') {
                        type = attrs.eleType + type;
                    }
                    var ID = attrs.id;
                    var left = e.clientX;
                    var top = e.clientY;
                    eleSettingService.showDom(left, top, type, ID);
                }

                var menu = $("<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
                    "</div>");
                menu = $compile(menu.get(0))(scope);
                element.append(menu);

            }
        };
    })
    .factory("eleMenuService",function(){
        var handle={
            create:function(){},
            show:function(){},
            removePlugin:function(){}
        };
        
        return handle;
    });