"use strict";
angular.module('kyle.rightClickMenu', [])
    .directive('rightClickMenuInit', function (rightClickMenuService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                rightClickMenuService.createDom(scope);
                scope.$on("$destroy",function(){
                    rightClickMenuService.removePlugin();
                });
            }
        };
    })
    .directive('phoneRightClickMenuInit', function (rightClickMenuService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                rightClickMenuService.createPhoneDom(scope);
                scope.$on("$destroy",function(){
                    rightClickMenuService.removePhonePlugin();
                });
            }
        };
    })
    .directive('rightClickMenuEditEle', function () {
        return {
            restrict: 'A',
            scope:{rightClickMenuEditEle:"="},
            link: function (scope, element) {
                element.on("click",function(){
                    $("#"+scope.rightClickMenuEditEle+".position-box").trigger("dblclick");
                });
            }
        };
    })
    .directive('rightClickMenu', function (rightClickMenuService,websiteData,shearPlate,$rootScope,multipleChoiceService,builderTool,activePageService) {
        return {
            restrict: 'A',
            template: ['<div class="right-click-menu-box close-user-select z-depth-2" onmousedown="event.stopPropagation()" ng-click="hideDom()">',
                '            <div class="right-click-menu-list">',
                '                <div class="right-click-menu-item border" right-click-menu-edit-ele="activeID" ng-show="rightMenuType==\'text\'||rightMenuType==\'group\'"><i class="mdi mdi-pencil"></i>编辑</div>',
                '                <div class="right-click-menu-item border" right-click-menu-edit-ele="activeID" ng-show="rightMenuType==\'image\'"><i class="mdi mdi-image-area"></i>裁剪</div>',
                '                <div class="right-click-menu-item" ng-show="rightMenuType!=\'session\'" ng-click="copy(\'copy\')"><i class="mdi mdi-content-copy"></i>复制</div>',
                '                <div class="right-click-menu-item border" ng-show="rightMenuType!=\'session\'" ng-click="copy(\'cut\')"><i class="mdi mdi-content-cut"></i>剪切</div>',
                '                <div class="right-click-menu-item" ng-show="rightMenuType!=\'session\'"><i class="mdi mdi-layers"></i>图层</div>',
                '                <div class="right-click-menu-item" ng-click="unGroup()" ng-show="rightMenuType==\'group\'"><i class="mdi mdi-ungroup"></i>解除合并</div>',
                '                <div class="right-click-menu-item" ng-click="group()" ng-show="rightMenuType==\'multipleChoice\'"><i class="mdi mdi-group"></i>合并</div>',
                '                <div class="right-click-menu-item" ng-show="rightMenuType==\'session\'"><i class="mdi mdi-image-area"></i>更换背景</div>',
                '                <div class="right-click-menu-item" ng-show="rightMenuType==\'session\'"><i class="mdi mdi-chevron-double-up"></i>上移</div>',
                '                <div class="right-click-menu-item border" ng-show="rightMenuType==\'session\'"><i class="mdi mdi-chevron-double-down"></i>下移</div>',
                '                <div class="right-click-menu-item" ng-show="rightMenuType==\'session\'" ng-click="copySession()"><i class="mdi mdi-content-copy"></i>复制模块</div>',
                '                <div class="right-click-menu-item border" ng-show="rightMenuType==\'session\'" ng-class="{true:\'disable\'}[shearPlateHandle.value==null]" ng-click="paste()"><i class="mdi mdi-content-paste"></i>粘贴</div>',
                '                <div class="right-click-menu-item" ng-click="deleteEle()"><i class="mdi mdi-delete"></i>删除</div>',
                '            </div>',
                '        </div>'].join(""),
            replace: true,
            link: function (scope, element) {
                scope.rightMenuType="";
                scope.activeID="";

                scope.shearPlateHandle=shearPlate.getHandle();

                function listenContextmenu(e){
                    var eleList=multipleChoiceService.getEleList().value;
                    var index=0;
                    for(var i=0;i<eleList.length;i++){
                        if(eleList[i].state==true){
                            index++;
                        }
                    }

                    if(index>0){
                        scope.$apply(function(){
                            scope.rightMenuType="multipleChoice";
                            rightClickMenuService.showDom(e.pageX, e.pageY);
                        });
                        return false;
                    }

                    if(rightClickMenuService.searchEleParent(e.target)){
                        var activeObj=rightClickMenuService.searchEleParent(e.target);
                        scope.$apply(function(){
                            scope.rightMenuType=activeObj.type;
                            scope.activeID=activeObj.ID;
                            //展开菜单
                            rightClickMenuService.showDom(e.pageX, e.pageY);
                        });
                    }
                    return false;
                }
                function listenMousedown(e){
                    rightClickMenuService.hideDom();
                }

                $(document).on("contextmenu",listenContextmenu);
                $(document).on("mousedown", listenMousedown);

                scope.$on("$destroy",function(){
                    $(document).off("contextmenu",listenContextmenu);
                    $(document).off("mousedown", listenMousedown);
                });

                scope.hideDom=function(){
                    rightClickMenuService.hideDom();
                }

                scope.deleteEle=function(){
                    websiteData.deleteEle(activePageService.getActivePage().value,scope.activeID);
                }

                scope.group=function(){
                    var eleList=multipleChoiceService.getEleList().value;
                    for(var i=0;i<eleList.length;i++){
                        if(eleList[i].state!=true){
                            eleList.splice(i,1);
                        }
                    }
                    websiteData.groupEle(eleList);
                }

                scope.unGroup=function(){
                    websiteData.unGroupEle(builderTool.getEle(scope.activeID,'group'));
                }

                //type 可能为cut copy
                scope.copy=function(type){
                    var pageId=activePageService.getActivePage().value;
                    shearPlate.setData(type,pageId,websiteData.getEle(pageId,scope.activeID));
                }

                scope.paste=function(){
                    var obj=jQuery.extend(true, {}, shearPlate.getData());
                    if(obj.value==null){
                        return;
                    }
                    obj.value.position.top=0+"px";
                    obj.value.position.left=0+"px";
                    if(obj.type==='copy'){
                        obj.value.ID="a"+parseInt(Math.random()*100000);
                        $rootScope.$broadcast("builderAddEle",scope.activeID,obj.value);
                    }else{
                        //先删除旧元素再通知插入新元素
                        websiteData.deleteEle(activePageService.getActivePage().value,obj.value.ID);
                        obj.value.ID="a"+parseInt(Math.random()*100000);
                        $rootScope.$broadcast("builderAddEle",scope.activeID,obj.value);
                    }
                }
            }
        };
    })
    .directive('phoneRightClickMenu', function (rightClickMenuService) {
        return {
            restrict: 'A',
            template: ['<div class="right-click-menu-box z-depth-2" onmousedown="event.stopPropagation()" ng-click="hideDom()">',
                '            <div class="right-click-menu-list">',
                '                <div class="right-click-menu-item" ng-click="deleteEle()"><i class="mdi mdi-eye"></i>隐藏</div>',
                '            </div>',
                '        </div>'].join(""),
            replace: true,
            link: function (scope, element) {

                scope.rightMenuType="";
                scope.activeID="";

                function listenContextmenu(e){
                    if(rightClickMenuService.searchEleParent(e.target)){
                        var activeObj=rightClickMenuService.searchEleParent(e.target);
                        scope.$apply(function(){
                            scope.rightMenuType=activeObj.type;
                            scope.activeID=activeObj.ID;
                            //展开菜单
                            rightClickMenuService.showPhoneDom(e.pageX, e.pageY);
                        });
                    }
                    return false;
                }
                function listenMousedown(e){
                    rightClickMenuService.hidePhoneDom();
                }

                $(document).on("contextmenu",listenContextmenu);
                $(document).on("mousedown", listenMousedown);

                scope.$on("$destroy",function(){
                    $(document).off("contextmenu",listenContextmenu);
                    $(document).off("mousedown", listenMousedown);
                });

                scope.hideDom=function(){
                    rightClickMenuService.hidePhoneDom();
                }

                scope.deleteEle=function(){

                }
            }
        };
    })
    .factory('rightClickMenuService', function ($rootScope, $compile) {

        var rightClickMenuDom={ID:"rightClickMenuDom",value:""};
        var phoneRightClickMenuDom={ID:"phoneRightClickMenuDom",value:""};

        var handle = {
            removePlugin:function(){
                rightClickMenuDom.value.remove();
            },
            removePhonePlugin:function(){
                phoneRightClickMenuDom.value.remove();
            },
            createDom:function(scope){
                var dom = $compile("<div right-click-menu></div>")(scope);
                dom = $(dom);
                $("body").append(dom);
                rightClickMenuDom.value = dom;
            },
            createPhoneDom:function(scope){
                var dom = $compile("<div phone-right-click-menu></div>")(scope);
                dom = $(dom);
                $("body").append(dom);
                phoneRightClickMenuDom.value = dom;
            },
            showPhoneDom:function(x,y){
                if(phoneRightClickMenuDom.value===''){
                    this.createDom();
                }
                //调整位置和显示

                phoneRightClickMenuDom.value.css({left:x,top:y});
                phoneRightClickMenuDom.value.show();
                //边界检测
                var bodyHeight=$("body").height();
                var eleOffsetY=phoneRightClickMenuDom.value.get(0).offsetTop;
                var eleHeight=phoneRightClickMenuDom.value.height();
                if(bodyHeight<eleOffsetY+eleHeight){
                    var offsetY=eleOffsetY+eleHeight-bodyHeight;
                    phoneRightClickMenuDom.value.css({top:eleOffsetY-offsetY-20});
                }

                var bodyWidth=$("body").width();
                var eleOffsetX=phoneRightClickMenuDom.value.get(0).offsetLeft;
                var eleWidth=phoneRightClickMenuDom.value.width();
                if(bodyWidth<eleOffsetX+eleWidth){
                    var offsetX=eleOffsetX+eleWidth-bodyWidth;
                    phoneRightClickMenuDom.value.css({left:eleOffsetX-offsetX-20});
                }

            },
            hidePhoneDom:function(){
                if(phoneRightClickMenuDom.value!==''){
                    phoneRightClickMenuDom.value.hide();
                }
            },
            removePhone:function(){
                if(phoneRightClickMenuDom.value!==''){
                    phoneRightClickMenuDom.value.remove();
                }
            },
            showDom:function(x,y){
                if(rightClickMenuDom.value===''){
                    this.createDom();
                }
                //调整位置和显示

                rightClickMenuDom.value.css({left:x,top:y});
                rightClickMenuDom.value.show();
                //边界检测
                var bodyHeight=$("body").height();
                var eleOffsetY=rightClickMenuDom.value.get(0).offsetTop;
                var eleHeight=rightClickMenuDom.value.height();
                if(bodyHeight<eleOffsetY+eleHeight){
                    var offsetY=eleOffsetY+eleHeight-bodyHeight;
                    rightClickMenuDom.value.css({top:eleOffsetY-offsetY-20});
                }

                var bodyWidth=$("body").width();
                var eleOffsetX=rightClickMenuDom.value.get(0).offsetLeft;
                var eleWidth=rightClickMenuDom.value.width();
                if(bodyWidth<eleOffsetX+eleWidth){
                    var offsetX=eleOffsetX+eleWidth-bodyWidth;
                    rightClickMenuDom.value.css({left:eleOffsetX-offsetX-20});
                }

            },
            hideDom:function(){
                if(rightClickMenuDom.value!==''){
                    rightClickMenuDom.value.hide();
                }
            },
            remove:function(){
                if(rightClickMenuDom.value!==''){
                    rightClickMenuDom.value.remove();
                }
            },
            //搜索父元素，确定触发事件的元素是哪个
            searchEleParent:function (obj) {
            while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
                if (obj.className.indexOf("position-box") != -1) {
                    var obj={ID:$(obj).attr("id"),type:$(obj).attr("ele-type")}
                    return obj;
                }
                if (obj.className.indexOf("ele-session-box") != -1) {
                    var obj={ID:$(obj).attr("id"),type:$(obj).attr("ele-type")}
                    return obj;
                }
                obj = obj.parentNode;
            }
            return false;
        }
        };
        return handle;
    })
;