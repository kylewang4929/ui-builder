"use strict";
angular.module('myBuilderApp')
    .directive('sessionResize', function ($timeout,websiteData) {
        return {
            restrict: 'A',
            link: function (scope, element,attrs) {
                var par={};
                par.minHeight=0;
                par.startY=0;
                par.currentHeight=0;
                par.flag=false;

                var sessionID=$(element).attr('id');

                var handle=$(element);
                $(element).find('> .session-resize').on('mousedown',function(e){
                    e.preventDefault();
                    par.currentHeight=parseInt(handle.css('min-height'));
                    par.startY= e.pageY;
                    par.flag=true;
                    par.minHeight=websiteData.getSessionMinHeight(sessionID);
                });

                function listenMousemove(e){
                    if(par.flag){
                        var offsetY=0;
                        offsetY=e.pageY-par.startY;
                        if(offsetY>0){
                            offsetY=offsetY+par.currentHeight;
                        }else if(offsetY+par.currentHeight>=par.minHeight){
                            offsetY=offsetY+par.currentHeight;
                        }else{
                            return;
                        }
                        $(element).css('min-height',offsetY+'px');
                    }
                }
                function listenMouseup(e){
                    if(par.flag){
                        par.flag=false;
                        //更新数组
                        if(attrs.sessionResize=='phone'){
                            websiteData.changePhoneSessionHeight(sessionID,parseInt(handle.css('min-height')));
                        }else{
                            websiteData.changeSessionHeight(sessionID,parseInt(handle.css('min-height')));
                        }
                    }
                }

                $(document).on("mousemove",listenMousemove);
                $(document).on("mouseup",listenMouseup);

                scope.$on("$destroy",function(){
                    $(document).off("mousedown",listenMousemove);
                    $(document).off("mouseup",listenMouseup);
                });

            }
        };
    })
    .directive('creator', function (creatorServices,builderTool,websiteData,historyLog,textEditorService,colorPickService,shearPlate,multipleChoiceService,activeEleService,activeSessionService,rightClickMenuService,eleSettingService) {
        return {
            restrict: 'A',
            scope: {
                websiteCode: "="
            },
            link: function (scope, element) {

                builderTool.init(scope);

                //监听刷新命令
                scope.$on("refreshPage",function(e,data){
                    builderTool.refreshPage(data,scope);
                });
                //监听添加元素的命令
                scope.$on("builderAddEle",function(e,sessionID,obj){
                    websiteData.addEle(scope.websiteCode.ID,sessionID,obj,scope);
                });


                element.append(creatorServices.createPage(scope.websiteCode,scope));

                //用来标记当前激活的session是哪个
                var activeSessionID="";
                scope.hoverSession=function(event,id){
                    if(id!=activeSessionID){
                        activeSessionID=id;
                        //设置当前激活的session
                        activeSessionService.setSession(activeSessionID);
                    }
                }


                scope.activeEle=null;
                scope.activeGroup=null;

                scope.editGroup=function(id,e){
                    scope.activeGroup=id;
                    scope.activeEle=null;
                    var target=$(e.target);
                    target.parent('.ele-box').parent('.position-box').addClass('group-active');
                }

                scope.selectEle=function(even,id){
                    if(even.ctrlKey==true && even.buttons==1){
                        //加入
                        if(scope.activeEle!=null){
                            multipleChoiceService.addEle(scope.activeEle.ID);
                        }
                        multipleChoiceService.addEle(id);
                        scope.activeEle=null;
                        return;
                    }

                    rightClickMenuService.hideDom();

                    var multipleChoiceState=$("#"+id+".position-box").attr("multiple-choice");

                    if(multipleChoiceState=='true'){
                        return;
                    }
                    if(scope.activeEle===null || scope.activeEle===undefined){
                        multipleChoiceService.removeEle();
                        scope.activeEle=websiteData.getEle(scope.websiteCode.ID,id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state='select';
                    }else if(scope.activeEle.ID!==id){
                        //关闭编辑器 等各种窗口
                        scope.activeEle=null;
                        activeEleService.clear();
                        if(window.getSelection()){
                            window.getSelection().removeAllRanges();
                        }else{
                            document.getSelection().removeAllRanges();
                        }
                        textEditorService.hideDom();
                        colorPickService.hideBoxDom();
                        colorPickService.hideDom();
                        scope.activeEle=websiteData.getEle(scope.websiteCode.ID,id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state='select';
                    }
                };

                scope.editEle=function(id){

                    var editEleDom=$("#"+id+".position-box");
                    var multipleChoiceState=editEleDom.attr("multiple-choice");
                    if(multipleChoiceState=='true'){
                        return;
                    }

                    textEditorService.showDom(id);
                    colorPickService.hideBoxDom();
                    colorPickService.hideDom();
                    scope.activeEle=websiteData.getEle(scope.websiteCode.ID,id);
                    scope.activeEle.state='edit';
                    editEleDom.addClass("editing");
                };

                scope.deleteSession=function(ID){
                    swal({
                            title: "确定要删除该模块吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "删除",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(confirm){
                            if(confirm){
                                websiteData.deleteSession(ID);
                            }
                        })
                }

                //取消激活
                $(document).on('mousedown',function(event){
                    if(scope.activeGroup!=null){

                        if(event.buttons==1){
                            $(element).find('#'+scope.activeGroup+'.position-box[ele-type=group]').removeClass('group-active');
                            var groupID=$(event.target).parents('.position-box[ele-type=group]').eq(0).attr("id");
                            if(groupID==undefined){
                                //更新
                            }else{
                                scope.activeGroup=groupID;
                            }
                        }

                    }
                    if(scope.activeEle===null || $(event.target).attr('id')==scope.activeEle.ID){
                        return;
                    }
                    scope.$apply(function(){
                        if($(event.target).parents(".position-box").attr("ID")===scope.activeEle.ID){
                            return;
                        }
                        if(scope.activeEle.state==='edit'){
                            //取消编辑状态
                            textEditorService.hideDom();
                            colorPickService.hideBoxDom();
                            colorPickService.hideDom();
                            $("#"+scope.activeEle.ID+".position-box").removeClass("editing");
                            //取消选择
                            if(window.getSelection()){
                                window.getSelection().removeAllRanges();
                            }else{
                                document.getSelection().removeAllRanges();
                            }

                            //更新
                            var eleData=builderTool.getEle(scope.activeEle.ID,scope.activeEle.type);
                            websiteData.updateEle(scope.websiteCode.ID,eleData);
                        }
                        scope.activeEle=null;
                    });
                    //关闭设置菜单
                    eleSettingService.hideDom();
                });

                //一系列键盘监听 快捷键
                function listenKeydown(e){
                    //移动的方法
                    function moveEle(type,e){

                        e.stopPropagation();
                        e.preventDefault();

                        var moveSize=0;
                        var moveDirection="left";

                        switch (type){
                            case "right":moveSize=1;moveDirection="left";break;
                            case "left":moveSize=-1;moveDirection="left";break;
                            case "top":moveSize=-1;moveDirection="top";break;
                            case "bottom":moveSize=1;moveDirection="top";break;
                        }

                        var eleList=multipleChoiceService.getEleList();
                        if(eleList.value.length>0){
                            for(var i=0;i<eleList.value.length;i++){
                                if(eleList.value[i].state){
                                    var eleData=builderTool.getEle(eleList.value[i].ID,eleList.value[i].type);
                                    eleData.position[moveDirection]=(parseInt(eleData.position[moveDirection])+moveSize)+"px";
                                    builderTool.updateEle(eleData);
                                    websiteData.updateEle(scope.websiteCode.ID,eleData);
                                }
                            }
                        }else if(scope.activeEle!==null){
                            var eleData=builderTool.getEle(scope.activeEle.ID,scope.activeEle.type);
                            eleData.position[moveDirection]=(parseInt(eleData.position[moveDirection])+moveSize)+"px";
                            builderTool.updateEle(eleData);
                            websiteData.updateEle(scope.websiteCode.ID,eleData);
                        }
                    }

                    function copy(type){
                        var eleList=multipleChoiceService.getEleList();
                        if(eleList.value.length>0){
                            var eleGroup=[];
                            for(var i=0;i<eleList.value.length;i++){
                                if(eleList.value[i].state){
                                    eleGroup.push(websiteData.getEle(scope.websiteCode.ID,eleList.value[i].ID));
                                }
                            }
                            //加入剪切板
                            shearPlate.setData(type,scope.websiteCode.ID,eleGroup);
                        }else if(scope.activeEle!==null){
                            shearPlate.setData(type,scope.websiteCode.ID,websiteData.getEle(scope.websiteCode.ID,scope.activeEle.ID));
                        }
                    }

                    function paste(type,obj){
                        if(obj.value.length>0){
                            var activeEleList=[];
                            for(var i=0;i<obj.value.length;i++){
                                obj.value[i].position.top=parseInt(obj.value[i].position.top)+20+"px";
                                obj.value[i].position.left=parseInt(obj.value[i].position.left)+20+"px";
                                if(type=='cut'){
                                    websiteData.deleteEle(scope.websiteCode.ID,obj.value[i].ID);
                                }
                                obj.value[i].ID="ele"+parseInt(Math.random()*100000);
                                websiteData.addEle(scope.websiteCode.ID,activeSessionID,obj.value[i],scope);

                                var ele=$("#"+obj.value[i].ID+".position-box");
                                var center={};
                                center.x=ele.offset().left+ele.width()/2;
                                center.y=ele.offset().top+ele.height()/2;
                                var position={};
                                position.left=parseInt(ele.css("left"));
                                position.top=parseInt(ele.css("top"));
                                activeEleList.push({ID:obj.value[i].ID,center:center,position:position,type:obj.value[i].type,state:true});

                            }
                            multipleChoiceService.setEleList(activeEleList);
                        }else{
                            obj.value.position.top=parseInt(obj.value.position.top)+20+"px";
                            obj.value.position.left=parseInt(obj.value.position.left)+20+"px";
                            if(type=='cut'){
                                websiteData.deleteEle(scope.websiteCode.ID,obj.value.ID);
                            }
                            obj.value.ID="a"+parseInt(Math.random()*100000);
                            websiteData.addEle(scope.websiteCode.ID,activeSessionID,obj.value,scope);
                            scope.activeEle=obj.value;
                        }
                    }

                    if (e.ctrlKey && e.keyCode==90){
                        //后退
                        var obj=historyLog.retreatPop();
                        if(obj!=undefined){
                            //更新到数组
                            if(obj.type=="delete"){
                                //插入元素和json
                                websiteData.addEle(scope.websiteCode.ID,obj.value.sessionId, obj.value,scope,'retreat');
                            }
                            if(obj.type=="updateEle"){
                                websiteData.updateEle(scope.websiteCode.ID, obj.value,'retreat');
                                builderTool.updateEle(obj.value);
                            }
                            if(obj.type=="add"){
                                websiteData.deleteEle(scope.websiteCode.ID, obj.value.ID,'retreat');
                            }
                            if(obj.type=='changeSession'){
                                websiteData.changeSession(obj.value.changeSession.endSession,obj.value.changeSession.startSession,obj.value,'forward');
                            }
                            if(obj.type=='group'){
                                var groupEleDom=$("#"+obj.value.ID+".position-box");
                                obj.value.position.left=groupEleDom.css("left");
                                obj.value.position.top=groupEleDom.css("top");
                                //刷新一次元素的位置，当多重合并的时候会出现位置不正确的问题
                                websiteData.unGroupEle(obj.value,'retreat');
                            }
                            if(obj.type=='unGroup'){
                                websiteData.groupEle(obj.value.eleList,'retreat',obj.value.oldID);
                            }
                            if(obj.type=='deleteSession'){
                                websiteData.addSession(obj.value,'retreat');
                            }
                            if(obj.type=='addSession'){
                                websiteData.deleteSession(obj.value.ID,'retreat');
                            }
                            if(obj.type=='changeSessionHeight'){
                                websiteData.changeSessionHeight(obj.value.sessionID,obj.value.height,'retreat');
                            }

                        }
                    }
                    if (e.ctrlKey && e.keyCode==89){
                        //前进
                        var obj=historyLog.forwardPop();
                        if(obj!=undefined){
                            //更新到数组
                            if(obj.type=="delete"){
                                websiteData.addEle(scope.websiteCode.ID,obj.value.sessionId, obj.value,scope,'forward');
                            }
                            if(obj.type=="default"){
                                websiteData.updateEle(scope.websiteCode.ID, obj.value,'forward');
                                builderTool.updateEle(obj.value);
                            }
                            if(obj.type=="add"){
                                websiteData.deleteEle(scope.websiteCode.ID, obj.value.ID,'forward');
                            }
                            if(obj.type=='changeSession'){
                                websiteData.changeSession(obj.value.changeSession.endSession,obj.value.changeSession.startSession,obj.value,'forward');
                            }
                            if(obj.type=='group'){
                                var groupEleDom=$("#"+obj.value.ID+".position-box");
                                obj.value.position.left=groupEleDom.css("left");
                                obj.value.position.top=groupEleDom.css("top");
                                websiteData.unGroupEle(obj.value,'forward');
                            }
                            if(obj.type=='unGroup'){
                                websiteData.groupEle(obj.value.eleList,'retreat',obj.value.oldID);
                            }
                            if(obj.type=='deleteSession'){
                                websiteData.addSession(obj.value,'forward');
                            }
                            if(obj.type=='addSession'){
                                websiteData.deleteSession(obj.value.ID,'forward');
                            }
                            if(obj.type=='changeSessionHeight'){
                                websiteData.changeSessionHeight(obj.value.sessionID,obj.value.height,'forward');
                            }
                        }
                    }
                    if (e.ctrlKey && e.keyCode==88){
                        //剪切
                        copy("cut");
                    }
                    if (e.ctrlKey && e.keyCode==67){
                        //复制
                        copy("copy");
                    }
                    if (e.ctrlKey && e.keyCode==86){
                        //粘贴
                        var obj=jQuery.extend(true, {}, shearPlate.getData());
                        if(obj.value==null){
                            return;
                        }
                        paste(obj.type,obj);
                    }
                    //依次上下左右
                    if(e.keyCode==38){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("top",e);
                        }
                    }
                    if(e.keyCode==40){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("bottom",e);
                        }
                    }
                    if(e.keyCode==37){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("left",e);
                        }
                    }
                    if(e.keyCode==39){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("right",e);
                        }
                    }

                    //删除
                    if(e.keyCode===46){
                        var eleList=multipleChoiceService.getEleList();
                        if(eleList.value.length>0){
                            for(var i=0;i<eleList.value.length;i++){
                                if(eleList.value[i].state){
                                    websiteData.deleteEle(websiteData.getActivePage(),eleList.value[i].ID);
                                }
                            }
                        }else if(scope.activeEle!==null){
                            websiteData.deleteEle(websiteData.getActivePage(),scope.activeEle.ID);
                        }
                    }
                }

                $(document).on("keydown",listenKeydown);

                scope.$on("$destroy",function(){
                    $(document).off("keydown",listenKeydown);
                });

            }
        };
    })
    .directive('creatorPhone', function (phoneCreatorServices,phoneBuilderTool,websiteData,phoneHistoryLog,activeEleService,activeSessionService,rightClickMenuService) {
        return {
            restrict: 'A',
            scope: {
                websiteCode: "="
            },
            link: function (scope, element) {

                phoneBuilderTool.init(scope);

                //监听刷新命令
                scope.$on("refreshPage",function(e,data){
                    phoneBuilderTool.refreshPage(data,scope);
                });

                element.append(phoneCreatorServices.createPage(scope.websiteCode,scope));

                //用来标记当前激活的session是哪个
                var activeSessionID="";
                scope.hoverSession=function(event,id){
                    if(id!=activeSessionID){
                        activeSessionID=id;
                        //设置当前激活的session
                        activeSessionService.setSession(activeSessionID);
                    }
                }


                scope.activeEle=null;
                scope.activeGroup=null;

                scope.editGroup=function(id,e){
                    scope.activeGroup=id;
                    scope.activeEle=null;
                    var target=$(e.target);
                    target.parent('.ele-box').parent('.position-box').addClass('group-active');
                }

                scope.selectEle=function(even,id){

                    rightClickMenuService.hidePhoneDom();

                    if(scope.activeEle===null){
                        scope.activeEle=websiteData.getEle(scope.websiteCode.ID,id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state='select';
                    }else if(scope.activeEle.ID!==id){
                        //关闭编辑器
                        scope.activeEle=null;
                        activeEleService.clear();
                        if(window.getSelection()){
                            window.getSelection().removeAllRanges();
                        }else{
                            document.getSelection().removeAllRanges();
                        }
                        scope.activeEle=websiteData.getEle(scope.websiteCode.ID,id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state='select';
                    }
                };

                scope.deleteSession=function(ID){
                    swal({
                            title: "确定要隐藏该模块吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "隐藏",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(confirm){
                            if(confirm){
                                scope.$apply(function(){
                                    websiteData.hideSession(ID);
                                });
                            }
                        })
                }

                $(document).on('mousedown',function(event){
                    if(scope.activeGroup!=null){
                        if(event.buttons==1){
                            $(element).find('#'+scope.activeGroup+'.position-box[ele-type=group]').removeClass('group-active');
                            var groupID=$(event.target).parents('.position-box[ele-type=group]').eq(0).attr("id");
                            if(groupID==undefined){
                                //更新
                            }else{
                                scope.activeGroup=groupID;
                            }
                        }
                    }
                    if(scope.activeEle===null || $(event.target).attr('id')==scope.activeEle.ID){
                        return;
                    }
                    scope.$apply(function(){
                        if($(event.target).parents(".position-box").attr("ID")===scope.activeEle.ID){
                            return;
                        }
                        scope.activeEle=null;
                    });
                });

                //一系列键盘监听 快捷键
                function listenKeydown(e){
                    //移动的方法
                    function moveEle(type,e){

                        e.stopPropagation();
                        e.preventDefault();

                        var moveSize=0;
                        var moveDirection="left";

                        switch (type){
                            case "right":moveSize=1;moveDirection="left";break;
                            case "left":moveSize=-1;moveDirection="left";break;
                            case "top":moveSize=-1;moveDirection="top";break;
                            case "bottom":moveSize=1;moveDirection="top";break;
                        }

                        if(scope.activeEle!==null){
                            var eleData=phoneBuilderTool.getEle(scope.activeEle.ID,scope.activeEle.type);
                            eleData.position[moveDirection]=(parseInt(eleData.position[moveDirection])+moveSize)+"px";
                            phoneBuilderTool.moveEle(eleData.ID,moveDirection,moveSize);
                            websiteData.updatePhoneEle(scope.websiteCode.ID,eleData);
                        }
                    }

                    if (e.ctrlKey && e.keyCode==90){
                        //后退
                        var obj=phoneHistoryLog.retreatPop();
                        if(obj!=undefined){
                            //更新到数组
                            if(obj.type=="updatePhoneEle"){
                                websiteData.changePhoneSessionHeight(scope.websiteCode.ID, obj.value,'retreat');
                                phoneBuilderTool.updateEle(obj.value);
                            }
                            if(obj.type=="changeSessionHeight"){
                                websiteData.changePhoneSessionHeight(obj.value.sessionID, obj.value.height,'retreat');
                            }
                            if(obj.type=="hideSession"){
                                scope.$apply(function(){
                                    websiteData.showSession(obj.value.sessionID,'retreat');
                                });
                            }
                            if(obj.type=="showSession"){
                                scope.$apply(function(){
                                    websiteData.hideSession(obj.value.sessionID,'retreat');
                                });
                            }
                            if(obj.type=="hideEle"){
                                scope.$apply(function(){
                                    websiteData.showEle(obj.value.ID,'retreat');
                                });
                            }
                            if(obj.type=="showEle"){
                                scope.$apply(function(){
                                    websiteData.hideEle(obj.value.ID,'retreat');
                                });
                            }

                        }
                    }
                    if (e.ctrlKey && e.keyCode==89){
                        //前进
                        var obj=phoneHistoryLog.forwardPop();
                        if(obj!=undefined){
                            if(obj.type=="default"){
                                websiteData.updateEle(scope.websiteCode.ID, obj.value,'forward');
                                phoneBuilderTool.updateEle(obj.value);
                            }
                            if(obj.type=="changeSessionHeight"){
                                websiteData.changePhoneSessionHeight(obj.value.sessionID, obj.value.height,'forward');
                            }
                            if(obj.type=="hideSession"){
                                scope.$apply(function(){
                                    websiteData.showSession(obj.value.sessionID,'forward');
                                });
                            }
                            if(obj.type=="showSession"){
                                scope.$apply(function(){
                                    websiteData.hideSession(obj.value.sessionID,'forward');
                                });
                            }
                            if(obj.type=="hideEle"){
                                scope.$apply(function(){
                                    websiteData.hideEle(obj.value.ID,'retreat');
                                });
                            }
                            if(obj.type=="showEle"){
                                scope.$apply(function(){
                                    websiteData.hideEle(obj.value.ID,'forward');
                                });
                            }
                        }
                    }
                    //依次上下左右
                    if(e.keyCode==38){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("top",e);
                        }
                    }
                    if(e.keyCode==40){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("bottom",e);
                        }
                    }
                    if(e.keyCode==37){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("left",e);
                        }
                    }
                    if(e.keyCode==39){
                        if(scope.activeEle.state=='edit'){

                        }else{
                            moveEle("right",e);
                        }
                    }

                    //删除
                    if(e.keyCode===46){
                        if(scope.activeEle!==null){
                            websiteData.hideEle(scope.activeEle.ID);
                        }
                    }
                }

                $(document).on("keydown",listenKeydown);

                scope.$on("$destroy",function(){
                    $(document).off("keydown",listenKeydown);
                });

            }
        };
    })
    .directive('eleMenu', function ($compile,eleSettingService) {
        return {
            restrict: 'A',
            scope: {eleMenu: "@"},
            link: function (scope, element,attrs) {

                scope.openSettingBox=function(type,e){
                    if(type=='design'){
                        type=attrs.eleType+type;
                    }
                    var ID=attrs.id;
                    var left= e.clientX;
                    var top=e.clientY;
                    eleSettingService.showDom(left,top,type,ID);
                }

                var menu=$("<div class='ele-menu' onmousedown='event.stopPropagation()'>" +
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
    .directive('createThumbnail', function (phoneCreatorServices,creatorServices,$compile) {
        return {
            restrict: 'A',
            scope: {createThumbnail: "=",type:"@",eleType:"@",layout:"@"},
            link: function (scope, element,attrs) {

                var previewBox={
                    width:$(element).width(),
                    height:80
                };

                function changeID(obj){
                    obj.ID='preview'+obj.ID;
                    if(obj.eleList!=undefined){
                        for(var i=0;i<obj.eleList.length;i++){
                            changeID(obj.eleList[i]);
                        }
                    }else{
                        return;
                    }
                }

                var dom="";
                var eleData=jQuery.extend(true, {}, scope.createThumbnail);
                changeID(eleData);
                if(scope.type=='phone'){
                    if(scope.eleType=='session'){
                        dom=phoneCreatorServices.createSession(eleData);
                    }
                    if(scope.eleType=='ele'){
                        dom=phoneCreatorServices.createEle(eleData);
                    }
                }
                if(scope.type=='web'){
                    if(scope.eleType=='session'){
                        dom=creatorServices.createSession(eleData);
                    }
                    if(scope.eleType=='ele'){
                        dom=creatorServices.createEle(eleData);
                    }
                }

                //添加预览标签
                dom.attr("thumbnail","true");

                dom = $compile(dom.get(0))(scope);

                //处理不需要的元素
                dom.find('.resize').remove();
                dom.find('.session-resize').remove();
                dom.find('.rotate').remove();
                dom.find('.line').remove();
                dom.find('.ele-label').remove();
                dom.find('.menu-tool-box').remove();

                element.empty();
                element.append(dom);

                var eleList=element.find('.position-box');
                for(var i=0;i<eleList.length;i++){
                    var ele=eleList.eq(i).find('.ele');
                    var height=ele.height();
                    ele.css('margin-top',-height/2);
                }

                if(attrs.eleType=='session'&& attrs.type=='phone'){
                    element.css('top','50%');
                    element.css('margin-top',-(element.height()*0.35)/2);
                }
                if(attrs.eleType=='session'&& attrs.type=='web'){
                    element.css('top','50%');
                    element.css('margin-top',-(element.height()*0.095)/2);
                }
                if(attrs.eleType=='session'){

                }
                if(attrs.eleType=='ele'){
                    var eleDom=$(element).find(' > .position-box');
                    var borderDom=eleDom.find(' > .ele-box');

                    //先找出宽和高哪个比较大然后再对比
                    var percent=1;
                    var percentX=1;
                    var percentY=1;
                    var scaleFlag=false;
                    if(borderDom.width()>previewBox.width){
                        percentX=previewBox.width/borderDom.width();
                    }
                    if(borderDom.height()>previewBox.height){
                        percentY=previewBox.height/parseInt(borderDom.css('min-height'));
                    }

                    if(percentX>percentY){
                        percent=percentY;
                    }else{
                        percent=percentX;
                    }

                    if(scope.layout=="normal"){
                        eleDom.css('position','static');
                    }else{
                        borderDom.css({"transform":"scale("+percent+","+percent+")","-ms-transform":"scale("+percent+","+percent+")","-moz-transform":"scale("+percent+","+percent+")","-webkit-transform":"scale("+percent+","+percent+")","-o-transform":"scale("+percent+","+percent+")"});
                        eleDom.css('left','50%');
                        eleDom.css('top','50%');
                        eleDom.css('margin-left',-borderDom.width()/2);
                        eleDom.css('margin-top',-borderDom.height()/2);
                        //设置origin
                        borderDom.css({"transform-origin":"50% 50%","-ms-transform-origin":"50% 50%","-moz-transform-origin":"50% 50%","-webkit-transform-origin":"50% 50%","-o-transform-origin":"50% 50%"});
                    }
                }

            }
        };
    })
    .directive('pageSettingToolModal', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.pageMenuShow=false;
                scope.toggleMenu=function(){
                    scope.pageMenuShow=!scope.pageMenuShow;
                    if(scope.pageMenuShow){
                        //关闭菜单
                        $rootScope.$broadcast("closeLeftMenu");
                    }
                }
                $(element).find(".tool-modal").height($("body").height()*parseFloat(attrs.pageSettingToolModal));

                function mousedown(e){
                    scope.$apply(function(){
                        scope.pageMenuShow=false;
                    });
                }

                $("body").on('mousedown',mousedown);

                scope.$on("$destory",function(){
                    $("body").off('mousedown',mousedown);
                })

            }
        }
    })
    .directive('onGroupSizeChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element,attrs) {
                var eleDom=$(element);
                var left=0;
                var width=0;
                var height=0;
                var top=0;
                var boxDom=eleDom.find(' >.ele-box');
                var elementID=eleDom.attr('id');


                var parentGroup=null;
                if($(element).parents('.position-box[ele-type=group]').length>0){
                    parentGroup=$(element).parents('.position-box[ele-type=group]').eq(0).attr('id');
                }

                //用jquery的监听  由于scope的层级关系这里我处理的有点问题
                var eleList=[];
                $(element).on("groupUpdateInit",function(e,ID){
                    if(elementID==ID){
                        $(element).trigger("groupUpdateInit",parentGroup);
                        left=parseInt(eleDom.css('left'));
                        top=parseInt(eleDom.css('top'));
                        width=eleDom.get(0).clientWidth;
                        height=eleDom.get(0).clientHeight;

                        eleList=$(element).find(' >.ele-box >.ele >.position-box');
                        for(var i=0;i<eleList.length;i++){
                            eleList.get(i).eleLeft=parseInt(eleList.eq(i).css("left"));
                            eleList.get(i).eleTop=parseInt(eleList.eq(i).css("top"));
                        }

                    }
                });

                $(element).on("groupUpdate",function(e,obj){
                    var obj=jQuery.extend(true, {}, obj);

                    //标记宽度的增加
                    if(elementID==obj.ID){
                        var changeFlag=false;
                        //如果自己需要改变大小在改变之后再把这个信息往上传，如果不需要改变就终止
                        var newWidth=0;
                        if(obj.elePar.left<0){
                            //左边要增大
                            newWidth=width+Math.abs(obj.elePar.left);
                            boxDom.css("width",newWidth);
                            eleDom.css("left",left+obj.elePar.left);
                            changeFlag=true;
                            //同时所有元素向右移动
                            for(var i=0;i<eleList.length;i++){
                                if(eleList.eq(i).attr('ele-type')=='group'){
                                    eleList.eq(i).css("left",0);
                                }else{
                                    eleList.eq(i).css("left",eleList.get(i).eleLeft+Math.abs(obj.elePar.left));
                                }
                            }

                            obj.elePar.left=0;

                        }
                        if(obj.elePar.left+obj.elePar.width>width){
                            //右边要增大
                            if(newWidth<obj.elePar.left+obj.elePar.width){
                                boxDom.css("width",obj.elePar.left+obj.elePar.width);
                                changeFlag=true;
                            }
                        }
                        var newHeight=0;
                        if(obj.elePar.top<0){
                            //上边要增大
                            newHeight=height+Math.abs(obj.elePar.top);
                            boxDom.css("min-height",newHeight);
                            eleDom.css("top",top+obj.elePar.top);
                            changeFlag=true;
                            //同时所有元素向下移动
                            for(var i=0;i<eleList.length;i++){
                                if(eleList.eq(i).attr('ele-type')=='group'){
                                    eleList.eq(i).css("top",0);
                                }else{
                                    eleList.eq(i).css("top",eleList.get(i).eleTop+Math.abs(obj.elePar.top));
                                }
                            }

                            //重置top 为0  让下面的判断正常执行
                            obj.elePar.top=0;
                        }
                        if(obj.elePar.top+obj.elePar.height>height){
                            //下边要增大
                            if(newHeight<obj.elePar.top+obj.elePar.height){
                                boxDom.css("min-height",obj.elePar.top+obj.elePar.height);
                                changeFlag=true;
                            }
                        }


                        if(changeFlag){
                            //先发初始化指令
                            if(parentGroup!=null){
                                var eleObj={width:boxDom.width(),height:boxDom.height(),left:parseInt(eleDom.css('left')),top:parseInt(eleDom.css('top'))};
                                var parentGroupObj={ID:parentGroup,elePar:eleObj};
                                $(element).trigger("groupUpdate",parentGroupObj);
                            }
                        }

                    }
                });


            }
        };
    })
;
