"use strict";
angular.module('insert.directive', [])
    .directive('insertEle', function ($rootScope,LxNotificationService,websiteData,activeSessionService) {
        return {
            restrict: 'A',
            scope:{
                insertEle:"="
            },
            link: function (scope, element, attrs) {
                
                var flag=false;
                var moveFlag=false;
                var par={
                    flag:false,
                    moveFlag:false,
                    cx:0,
                    cy:0
                };
                
                //scope.insertEle.border.width -- min-height
                var virtualDom=$("<div class='virtual-box'></div>");
                virtualDom.css({width:scope.insertEle.border.width,height:scope.insertEle.border['min-height']});
                
                function mousedown(e) {
                    par.flag=true;
                    par.cx=e.clientX;
                    par.cy=e.clientY;
                }
                function mousemove(e) {
                    if(par.flag){
                        var x=Math.abs(e.clientX-par.cx);
                        var y=Math.abs(e.clientY-par.cy);
                        if((x>5 || y>5) && par.moveFlag==false){
                            par.moveFlag=true;
                            //关闭左菜单
                            scope.$apply(function(){
                               $rootScope.$broadcast("closeLeftMenu"); 
                            });
                            //创建虚拟的元素，跟随鼠标移动
                            $("body").append(virtualDom);
                        }
                        
                        if(par.moveFlag){
                            //调整虚拟元素的位置
                            var width=parseInt(scope.insertEle.border.width);
                            var height=parseInt(scope.insertEle.border['min-height']);
                            virtualDom.css({left:e.clientX-width/2,top:e.clientY-height/2});
                        }
                        
                    }
                }
                function mouseup(e) {
                    if(par.flag){
                        par.flag=false;
                        
                        if(par.moveFlag){
                            //正常处理
                            par.moveFlag=false;
                            virtualDom.remove();
                            
                            //获取当前激活session 和 page
                            var activeSession=activeSessionService.getSession();
                            
                            
                            
                        }else{
                            //提示拖动到页面
                            LxNotificationService.info('拖动元素到页面上即可插入元素');
                        }
                        
                    }
                }
                
                $(element).on("mousedown",mousedown);
                $(document).on("mousemove",mousemove);
                $(document).on("mouseup",mouseup);
                
            }
        };
    })