"use strict";
angular.module('eleMenu', [])
    .directive('eleMenu', function ($compile, eleSettingService) {
        return {
            restrict: 'A',
            template :"<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1 ng-hide' lx-ripple ng-show=eleMenu=='image'><i class='mdi mdi-crop'></i><span>裁剪</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1 ng-hide' lx-ripple ng-show=eleMenu=='text'><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1 ng-hide' lx-ripple ng-show=eleMenu=='group'><i class='mdi mdi-pencil'></i><span>编辑</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1 ng-hide' lx-ripple ng-hide=eleMenu=='group'||eleMenu=='text' ng-click=openSettingBox('design',$event)><i class='mdi mdi-checkerboard'></i><span>设计</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-click=openSettingBox('layers',$event)><i class='mdi mdi-layers'></i><span>布局</span></button>" +
                    "<button class='btn btn--l btn--blue btn--fab z-depth-1' lx-ripple ng-click=openSettingBox('animate',$event)><i class='mdi mdi-auto-fix'></i><span>动画</span></button>" +
                    "</div>",
            link: function (scope, element, attrs) {
                scope.eleMenu=attrs.eleMenu;
                
                //监听属性 同步更改
                
                scope.openSettingBox = function (type, e) {
                    if (type == 'design') {
                        type = scope.eleMenu + type;
                    }
                    var ID = attrs.id;
                    var left = e.clientX;
                    var top = e.clientY;
                    eleSettingService.showDom(left, top, type, ID);
                }

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
    
    .factory("eleMenuServices",function($rootScope,$compile,elePosition,$timeout){
        
        $rootScope.$on("eleDragStart",function(){
            handle.hideDom();
        });
        $rootScope.$on("eleDragEnd",function(){
            handle.showDom(activeEle.ID,activeEle.type);
        });
        
        var dom=null;
        var activeEle={};
        var mode="";
        var handle={
            init:function(data){
                mode=data;
            },
            createDom:function(eleID,type,x,y){
                var template="";
                switch(mode){
                    case "web":template="<div class='ele-menu-box' ele-menu='"+type+"'></div>";break;
                    case "phone":template="<div class='ele-menu-box' phone-ele-menu='"+type+"'></div>";break;
                }
                
                template = $compile(template)($rootScope);
                
                $("body").append(template);                
                
                dom=template;
                                
                dom.css({left:x,top:y+10});
                                     
            },
            showDom:function(eleID,type){
                //计算相对位置
                activeEle.ID=eleID;
                activeEle.type=type;
                
                var eleDom=$("#"+eleID);
                
                var x=elePosition.getLeft(eleDom.get(0));
                var y=elePosition.getTop(eleDom.get(0))+eleDom.height();
                
                if(dom==null){
                    this.createDom(eleID,type,x,y);
                }else{
                    dom.css({left:x,top:y+10});
                    dom.show();                
                }
            },
            hideDom:function(){
                if(dom!=null){
                    dom.hide();                    
                }
            },
            removePlugin:function(){
                if(dom!=null){
                    dom.remove(); 
                    dom=null;                                     
                }
            }
        };
        
        return handle;
    });
