"use strict";
angular.module('insert.directive', [])
    .directive('insertEle', function ($rootScope,LxNotificationService) {
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
                        }
                    }
                }
                function mouseup(e) {
                    if(par.flag){
                        par.flag=false;
                        
                        if(par.moveFlag){
                            //正常处理
                            par.moveFlag=false;
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