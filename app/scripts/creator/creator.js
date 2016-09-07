"use strict";
angular.module('creator', [])
    .directive('creator', function (creatorServices, builderTool, websiteData, historyLog,
    textEditorService, colorPickService, shearPlate, multipleChoiceService, activeEleService,
    activeSessionService, rightClickMenuService, eleSettingService,sessionSettingService,shortcuts,
    activePageService,eleMenuServices,imageLibraryService,imageCropService) {
        return {
            restrict: 'A',
            scope: {
                websiteCode: "="
            },
            link: function (scope, element) {

                //初始化eleMenu组件
                eleMenuServices.init("web");

                var shortcutsCode=shortcuts.get();

                builderTool.init(scope);
                websiteData.initScope(scope);

                //监听刷新命令
                scope.$on("refreshPage", function (e, data) {
                    builderTool.refreshPage(data, scope);
                });
                //监听添加元素的命令
                scope.$on("builderAddEle", function (e, sessionID, obj) {
                    websiteData.addEle(scope.websiteCode.ID, sessionID, obj, scope);
                });


                element.append(creatorServices.createPage(scope.websiteCode, scope));

                //用来标记当前激活的session是哪个
                var activeSessionID = "";
                scope.hoverSession = function (event, id) {
                    if (id !== activeSessionID) {
                        activeSessionID = id;
                        //设置当前激活的session
                        activeSessionService.setSession(activeSessionID);
                    }
                };


                scope.activeEle = null;
                activeEleService.clear();
                
                
                scope.activeGroup = null;

                scope.editEleGroup = function (e,id) {
                    scope.activeGroup = id;
                    scope.activeEle = null;
                    var target = $(e.target);
                    target.parent('.ele-box').parent('.position-box').addClass('group-active');
                };

                scope.selectEle = function (even, id) {
                    if (even[shortcutsCode.ADD.ctrlKey] === true && even.buttons === shortcutsCode.ADD.keyCode) {
                        //加入
                        if (scope.activeEle !== null) {
                            multipleChoiceService.addEle(scope.activeEle.ID);
                        }
                        multipleChoiceService.addEle(id);
                        scope.activeEle = null;
                        //清除激活的元素
                        activeEleService.clear();
                        return;
                    }

                    rightClickMenuService.hideDom();

                    var multipleChoiceState = $("#" + id + ".position-box").attr("multiple-choice");

                    if (multipleChoiceState === 'true') {
                        return;
                    }
                    if (scope.activeEle === null || scope.activeEle === undefined) {
                        multipleChoiceService.removeEle();
                        scope.activeEle = websiteData.getEle(scope.websiteCode.ID, id);
                        //设置激活的元素
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state = 'select';
                    } else if (scope.activeEle.ID !== id) {
                        //关闭编辑器 等各种窗口
                        scope.activeEle = null;
                        //清除激活的元素
                        activeEleService.clear();
                        if (window.getSelection()) {
                            window.getSelection().removeAllRanges();
                        } else {
                            document.getSelection().removeAllRanges();
                        }
                        textEditorService.hideDom();
                        colorPickService.hideBoxDom();
                        colorPickService.hideDom();
                        scope.activeEle = websiteData.getEle(scope.websiteCode.ID, id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state = 'select';
                    }
                };

                /**
                 * 编辑文字的方法
                 * 传入ID，添加相关的css，移除基本样式，进入编辑状态
                 */
                scope.editEleText = function (id) {

                    var editEleDom = $("#" + id + ".position-box");
                    var multipleChoiceState = editEleDom.attr("multiple-choice");
                    if (multipleChoiceState === 'true') {
                        return;
                    }

                    textEditorService.showDom(id);
                    colorPickService.hideBoxDom();
                    colorPickService.hideDom();
                    scope.activeEle = websiteData.getEle(scope.websiteCode.ID, id);
                    scope.activeEle.state = 'edit';
                    activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                    editEleDom.addClass("editing");
                };
                scope.editEleImage= function(id){
                    //调用打开编辑图片
                    activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                    imageCropService.openCrop(angular.copy(scope.activeEle));
                };
                /**
                 * 编辑图片的方法
                 *
                 */
                scope.editImage = function (id){
                    
                };

                /**
                 * session方面的操作
                 */
                scope.changeBackground = function(e,ID){
                    //获取session的资料
                    var eleData={};
                    eleData = websiteData.getSession(ID);
                    var backgroundObj = {
                        color:eleData.background.color,
                        video:eleData.background.videoUrl,
                        type:eleData.background.type
                    };
                    //根据不同的类型从不同的地方获取预览图
                    switch(eleData.background.type){
                        case 'image':backgroundObj.image = eleData.background.url;break;
                        case 'video':backgroundObj.image = eleData.background.previewImage;break;
                    }
                    //计算left和top
                    sessionSettingService.showDom(e.clientX-180,e.clientY+20,eleData.ID,backgroundObj,function(data){
                    });
                };

                scope.deleteSession = function (ID) {
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
                        function (confirm) {
                            if (confirm) {
                                websiteData.deleteSession(ID);
                            }
                        });
                };

                //取消激活
                $(document).on('mousedown', function (event) {

                    //关闭sessionsetting 菜单
                    sessionSettingService.hideDom();
                    
                    if (scope.activeGroup !== null) {

                        if (event.buttons === 1) {
                            $(element).find('#' + scope.activeGroup + '.position-box[ele-type=group]').removeClass('group-active');
                            var groupID = $(event.target).parents('.position-box[ele-type=group]').eq(0).attr("id");
                            if (groupID === undefined) {
                                //更新
                            } else {
                                scope.activeGroup = groupID;
                            }
                        }

                    }
                    if (scope.activeEle === null || $(event.target).attr('id') === scope.activeEle.ID) {
                        return;
                    }
                    scope.$apply(function () {
                        if ($(event.target).parents(".position-box").attr("ID") === scope.activeEle.ID) {
                            return;
                        }
                        if (scope.activeEle.state === 'edit') {
                            //取消编辑状态
                            textEditorService.hideDom();
                            colorPickService.hideBoxDom();
                            colorPickService.hideDom();
                            $("#" + scope.activeEle.ID + ".position-box").removeClass("editing");
                            //取消选择
                            if (window.getSelection()) {
                                window.getSelection().removeAllRanges();
                            } else {
                                document.getSelection().removeAllRanges();
                            }

                            //更新
                            var eleData = builderTool.getEle(scope.activeEle.ID, scope.activeEle.type);
                            websiteData.updateEle(scope.websiteCode.ID, eleData);
                        }
                        scope.activeEle = null;
                        activeEleService.clear();                        
                    });
                    //关闭设置菜单
                    eleSettingService.hideDom();
                });

                //一系列键盘监听 快捷键
                function listenKeydown(e) {
                    //移动的方法
                    function moveEle(type, e) {

                        e.stopPropagation();
                        e.preventDefault();

                        var moveSize = 0;
                        var moveDirection = "left";

                        switch (type) {
                            case "right": moveSize = 1; moveDirection = "left"; break;
                            case "left": moveSize = -1; moveDirection = "left"; break;
                            case "top": moveSize = -1; moveDirection = "top"; break;
                            case "bottom": moveSize = 1; moveDirection = "top"; break;
                        }

                        var eleList = multipleChoiceService.getEleList();
                        var eleData = {};
                        if (eleList.value.length > 0) {
                            for (var i = 0; i < eleList.value.length; i++) {
                                if (eleList.value[i].state) {
                                    eleData = builderTool.getEle(eleList.value[i].ID, eleList.value[i].type);
                                    eleData.position[moveDirection] = (parseInt(eleData.position[moveDirection]) + moveSize) + "px";
                                    builderTool.updateEle(eleData);
                                    websiteData.updateEle(scope.websiteCode.ID, eleData);
                                }
                            }
                        } else if (scope.activeEle !== null) {
                            eleData = builderTool.getEle(scope.activeEle.ID, scope.activeEle.type);
                            eleData.position[moveDirection] = (parseInt(eleData.position[moveDirection]) + moveSize) + "px";
                            builderTool.updateEle(eleData);
                            websiteData.updateEle(scope.websiteCode.ID, eleData);
                        }
                    }

                    function copy(type) {

                        //如果当前有输入框焦点的话则屏蔽（编辑模式下的快捷键冲突的问题）
                        if($(':focus').length>0){
                            return;
                        }

                        var eleList = multipleChoiceService.getEleList();
                        if (eleList.value.length > 0) {
                            var eleGroup = [];
                            for (var i = 0; i < eleList.value.length; i++) {
                                if (eleList.value[i].state) {
                                    eleGroup.push(websiteData.getEle(scope.websiteCode.ID, eleList.value[i].ID));
                                }
                            }
                            //加入剪切板
                            shearPlate.setData(type, scope.websiteCode.ID, eleGroup);
                        } else if (scope.activeEle !== null) {
                            shearPlate.setData(type, scope.websiteCode.ID, websiteData.getEle(scope.websiteCode.ID, scope.activeEle.ID));
                        }
                    }

                    function paste(type, obj) {

                        //如果当前有输入框焦点的话则屏蔽（编辑模式下的快捷键冲突的问题）
                        if($(':focus').length>0){
                            return;
                        }

                        if (obj.value.length > 0) {
                            var activeEleList = [];
                            for (var i = 0; i < obj.value.length; i++) {
                                obj.value[i].position.top = parseInt(obj.value[i].position.top) + 20 + "px";
                                obj.value[i].position.left = parseInt(obj.value[i].position.left) + 20 + "px";
                                if (type === 'cut') {
                                    websiteData.deleteEle(scope.websiteCode.ID, obj.value[i].ID);
                                }
                                //替换ID
                                obj.value[i]=builderTool.changeEleId(obj.value[i]);
                                websiteData.addEle(scope.websiteCode.ID, activeSessionID, obj.value[i], scope);

                                var ele = $("#" + obj.value[i].ID + ".position-box");
                                var center = {};
                                center.x = ele.offset().left + ele.width() / 2;
                                center.y = ele.offset().top + ele.height() / 2;
                                var position = {};
                                position.left = parseInt(ele.css("left"));
                                position.top = parseInt(ele.css("top"));
                                activeEleList.push({ ID: obj.value[i].ID, center: center, position: position, type: obj.value[i].type, state: true });

                            }
                            multipleChoiceService.setEleList(activeEleList);
                        } else {
                            obj.value.position.top = parseInt(obj.value.position.top) + 20 + "px";
                            obj.value.position.left = parseInt(obj.value.position.left) + 20 + "px";
                            if (type === 'cut') {
                                websiteData.deleteEle(scope.websiteCode.ID, obj.value.ID);
                            }
                            obj.value=builderTool.changeEleId(obj.value);
                            websiteData.addEle(scope.websiteCode.ID, activeSessionID, obj.value, scope);
                            scope.activeEle = obj.value;
                            //设置激活元素
                            activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));                    
                        }
                    }
                    //后退                    
                    if (e[shortcutsCode.UNDO.ctrlKey] && e.keyCode === shortcutsCode.UNDO.keyCode && !e[shortcutsCode.REDO.shiftKey]) {
                        var obj = historyLog.retreatPop();
                        if (obj !== undefined) {
                            //更新到数组
                            if (obj.type === "delete") {
                                //插入元素和json
                                websiteData.addEle(scope.websiteCode.ID, obj.value.sessionId, obj.value, scope, 'retreat');
                            }
                            if (obj.type === "updateEle") {
                                websiteData.updateEle(scope.websiteCode.ID, obj.value, 'retreat');
                                builderTool.updateEle(obj.value);
                            }
                            if (obj.type === "add") {
                                websiteData.deleteEle(scope.websiteCode.ID, obj.value.ID, 'retreat');
                            }
                            if (obj.type === 'changeSession') {
                                websiteData.changeSession(obj.value.changeSession.endSession, obj.value.changeSession.startSession, obj.value, 'forward');
                            }
                            if (obj.type === 'group') {
                                var groupEleDom = $("#" + obj.value.ID + ".position-box");
                                obj.value.position.left = groupEleDom.css("left");
                                obj.value.position.top = groupEleDom.css("top");
                                //刷新一次元素的位置，当多重合并的时候会出现位置不正确的问题
                                websiteData.unGroupEle(obj.value, 'retreat');
                            }
                            if (obj.type === 'unGroup') {
                                websiteData.groupEle(obj.value.eleList, 'retreat', obj.value.oldID);
                            }
                            if (obj.type === 'deleteSession') {
                                websiteData.reductionSession(obj.value, 'retreat');
                            }
                            if (obj.type === 'addSession') {
                                websiteData.deleteSession(obj.value.ID, 'retreat');
                            }
                            if (obj.type === 'changeSessionHeight') {
                                websiteData.changeSessionHeight(obj.value.sessionID, obj.value.height, 'retreat');
                            }
                            if (obj.type === "updateSession") {
                                scope.$apply(function () {
                                    websiteData.updateSession(obj.value, 'retreat');
                                    var backgroundObj={};                                    
                                    switch (obj.value.background.type){
                                        case "image":
                                        backgroundObj = {
                                            image:obj.value.background.url,
                                            color:obj.value.background.color,
                                            video:'',
                                            type:obj.value.background.type
                                        };
                                        break;
                                        case "video":
                                        backgroundObj = {
                                            image:obj.value.background.previewImage,
                                            color:obj.value.background.color,
                                            video:obj.value.background.url,
                                            type:obj.value.background.type
                                        };
                                        break;
                                    }
                                    sessionSettingService.updateOption(backgroundObj);
                                });
                            }

                        }
                    }
                    //前进                    
                    if (e[shortcutsCode.REDO.ctrlKey] && e.keyCode === shortcutsCode.REDO.keyCode && e[shortcutsCode.REDO.shiftKey]) {
                        var obj = historyLog.forwardPop();
                        if (obj !== undefined) {
                            //更新到数组
                            if (obj.type === "delete") {
                                websiteData.addEle(scope.websiteCode.ID, obj.value.sessionId, obj.value, scope, 'forward');
                            }
                            if (obj.type === "updateEle") {
                                websiteData.updateEle(scope.websiteCode.ID, obj.value, 'forward');
                                builderTool.updateEle(obj.value);
                            }
                            if (obj.type === "add") {
                                websiteData.deleteEle(scope.websiteCode.ID, obj.value.ID, 'forward');
                            }
                            if (obj.type === 'changeSession') {
                                websiteData.changeSession(obj.value.changeSession.endSession, obj.value.changeSession.startSession, obj.value, 'forward');
                            }
                            if (obj.type === 'group') {
                                var groupEleDom = $("#" + obj.value.ID + ".position-box");
                                obj.value.position.left = groupEleDom.css("left");
                                obj.value.position.top = groupEleDom.css("top");
                                websiteData.unGroupEle(obj.value, 'forward');
                            }
                            if (obj.type === 'unGroup') {
                                websiteData.groupEle(obj.value.eleList, 'retreat', obj.value.oldID);
                            }
                            if (obj.type === 'deleteSession') {
                                websiteData.reductionSession(obj.value, 'forward');
                            }
                            if (obj.type === 'addSession') {
                                websiteData.deleteSession(obj.value.ID, 'forward');
                            }
                            if (obj.type === 'changeSessionHeight') {
                                websiteData.changeSessionHeight(obj.value.sessionID, obj.value.height, 'forward');
                            }
                            if (obj.type === "updateSession") {
                                scope.$apply(function () {
                                    websiteData.updateSession(obj.value, 'forward');
                                    var backgroundObj={};
                                    switch (obj.value.background.type){
                                        case "image":
                                        backgroundObj = {
                                            image:obj.value.background.url,
                                            color:obj.value.background.color,
                                            video:'',
                                            type:obj.value.background.type
                                        };
                                        break;
                                        case "video":
                                        backgroundObj = {
                                            image:obj.value.background.previewImage,
                                            color:obj.value.background.color,
                                            video:obj.value.background.url,
                                            type:obj.value.background.type
                                        };
                                        break;
                                    }
                                    sessionSettingService.updateOption(backgroundObj);
                                });
                            }
                        }
                    }
                    if (e[shortcutsCode.CUT.ctrlKey] && e.keyCode === shortcutsCode.CUT.keyCode) {
                        //剪切
                        copy("cut");
                    }
                    if (e[shortcutsCode.COPY.ctrlKey] && e.keyCode === shortcutsCode.COPY.keyCode) {
                        //复制
                        copy("copy");
                    }
                    if (e[shortcutsCode.PASTE.ctrlKey] && e.keyCode === shortcutsCode.PASTE.keyCode) {
                        //粘贴
                        var obj = jQuery.extend(true, {}, shearPlate.getData());
                        if (obj.value === null) {
                            return;
                        }
                        paste(obj.type, obj);
                    }
                    //依次上下左右
                    if (e.keyCode === shortcutsCode.MOVE_TOP.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("top", e);
                        }
                    }
                    if (e.keyCode === shortcutsCode.MOVE_DOWN.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("bottom", e);
                        }
                    }
                    if (e.keyCode === shortcutsCode.MOVE_LEFT.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("left", e);
                        }
                    }
                    if (e.keyCode === shortcutsCode.MOVE_RIGHT.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("right", e);
                        }
                    }

                    //删除
                    if (e.keyCode === shortcutsCode.DELETE.keyCode) {
                        var eleList = multipleChoiceService.getEleList();
                        if (eleList.value.length > 0) {
                            for (var i = 0; i < eleList.value.length; i++) {
                                if (eleList.value[i].state) {
                                    websiteData.deleteEle(activePageService.getActivePage().value, eleList.value[i].ID);
                                }
                            }
                        } else if (scope.activeEle !== null) {
                            websiteData.deleteEle(activePageService.getActivePage().value, scope.activeEle.ID);
                        }
                    }
                }

                $(document).on("keydown", listenKeydown);

                /**
                 * 销毁相关插件和监听
                 */
                scope.$on("$destroy", function () {
                    $(document).off("keydown", listenKeydown);
                    eleMenuServices.removePlugin();
                    imageLibraryService.removePlugin();
                });

            }
        };
    })
    .directive('creatorPhone', function (phoneCreatorServices, phoneBuilderTool, websiteData, phoneHistoryLog, activeEleService, activeSessionService, rightClickMenuService,shortcuts,eleMenuServices,multipleChoiceService) {
        return {
            restrict: 'A',
            scope: {
                websiteCode: "="
            },
            link: function (scope, element) {
                //初始化eleMenu
                eleMenuServices.init("phone");
                
                var shortcutsCode=shortcuts.get();

                phoneBuilderTool.init(scope);
                websiteData.initScope(scope);
                

                //监听刷新命令
                scope.$on("refreshPage", function (e, data) {
                    phoneBuilderTool.refreshPage(data, scope);
                });

                element.append(phoneCreatorServices.createPage(scope.websiteCode, scope));

                //用来标记当前激活的session是哪个
                var activeSessionID = "";
                scope.hoverSession = function (event, id) {
                    if (id !== activeSessionID) {
                        activeSessionID = id;
                        //设置当前激活的session
                        activeSessionService.setSession(activeSessionID);
                    }
                };


                scope.activeEle = null;
                activeEleService.clear();
                
                scope.activeGroup = null;

                scope.editEleGroup = function (e,id) {
                    scope.activeGroup = id;
                    
                    //清除激活元素
                    scope.activeEle = null;
                    activeEleService.clear();
                    
                    var target = $(e.target);
                    target.parent('.ele-box').parent('.position-box').addClass('group-active');
                };

                scope.selectEle = function (even, id) {

                    if (even[shortcutsCode.ADD.ctrlKey] === true && even.buttons === shortcutsCode.ADD.keyCode) {
                        //加入
                        if (scope.activeEle !== null) {
                            multipleChoiceService.addEle(scope.activeEle.ID);
                        }
                        multipleChoiceService.addEle(id);
                        scope.activeEle = null;
                        //清除激活的元素
                        activeEleService.clear();
                        return;
                    }


                    rightClickMenuService.hidePhoneDom();
                    
                    var multipleChoiceState = $("#" + id + ".position-box").attr("multiple-choice");
                    if (multipleChoiceState === 'true') {
                        return;
                    }

                    if (scope.activeEle === null) {
                        scope.activeEle = websiteData.getEle(scope.websiteCode.ID, id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state = 'select';
                    } else if (scope.activeEle.ID !== id) {
                        //关闭编辑器
                        scope.activeEle = null;
                        activeEleService.clear();
                        if (window.getSelection()) {
                            window.getSelection().removeAllRanges();
                        } else {
                            document.getSelection().removeAllRanges();
                        }
                        scope.activeEle = websiteData.getEle(scope.websiteCode.ID, id);
                        activeEleService.setEle(jQuery.extend(true, {}, scope.activeEle));
                        scope.activeEle.state = 'select';
                    }
                };

                
                scope.deleteSession = function (ID) {
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
                        function (confirm) {
                            if (confirm) {
                                scope.$apply(function () {
                                    websiteData.hideSession(ID);
                                });
                            }
                        });
                };

                $(document).on('mousedown', function (event) {
                    if (scope.activeGroup !== null) {
                        if (event.buttons === 1) {
                            $(element).find('#' + scope.activeGroup + '.position-box[ele-type=group]').removeClass('group-active');
                            var groupID = $(event.target).parents('.position-box[ele-type=group]').eq(0).attr("id");
                            if (groupID === undefined) {
                                //更新
                            } else {
                                scope.activeGroup = groupID;
                            }
                        }
                    }
                    if (scope.activeEle === null || $(event.target).attr('id') === scope.activeEle.ID) {
                        return;
                    }
                    scope.$apply(function () {
                        if ($(event.target).parents(".position-box").attr("ID") === scope.activeEle.ID) {
                            return;
                        }
                        scope.activeEle = null;
                        activeEleService.clear();
                        
                    });
                });

                //一系列键盘监听 快捷键
                function listenKeydown(e) {
                    //移动的方法
                    function moveEle(type, e) {

                        e.stopPropagation();
                        e.preventDefault();

                        var moveSize = 0;
                        var moveDirection = "left";

                        switch (type) {
                            case "right": moveSize = 1; moveDirection = "left"; break;
                            case "left": moveSize = -1; moveDirection = "left"; break;
                            case "top": moveSize = -1; moveDirection = "top"; break;
                            case "bottom": moveSize = 1; moveDirection = "top"; break;
                        }

                        if (scope.activeEle !== null) {
                            var eleData = phoneBuilderTool.getEle(scope.activeEle.ID, scope.activeEle.type);
                            eleData.phoneStyle.position[moveDirection] = (parseInt(eleData.phoneStyle.position[moveDirection]) + moveSize) + "px";
                            phoneBuilderTool.moveEle(eleData.ID, moveDirection, moveSize);
                            websiteData.updatePhoneEle(scope.websiteCode.ID, eleData);
                        }
                    }

                    if (e[shortcutsCode.UNDO.ctrlKey] && e.keyCode === shortcutsCode.UNDO.keyCode && !e[shortcutsCode.REDO.shiftKey]) {
                        //后退
                        var obj = phoneHistoryLog.retreatPop();
                        if (obj !== undefined) {
                            //更新到数组
                            if (obj.type === "updatePhoneEle") {
                                websiteData.updatePhoneEle(scope.websiteCode.ID, obj.value, 'retreat');
                                phoneBuilderTool.updateEle(obj.value);
                            }
                            if (obj.type === "changeSessionHeight") {
                                websiteData.changePhoneSessionHeight(obj.value.sessionID, obj.value.height, 'retreat');
                            }
                            if (obj.type === "hideSession") {
                                scope.$apply(function () {
                                    websiteData.showSession(obj.value.sessionID, 'retreat');
                                });
                            }
                            if (obj.type === "showSession") {
                                scope.$apply(function () {
                                    websiteData.hideSession(obj.value.sessionID, 'retreat');
                                });
                            }
                            if (obj.type === "hideEle") {
                                scope.$apply(function () {
                                    websiteData.showEle(obj.value.ID, 'retreat');
                                });
                            }
                            if (obj.type === "showEle") {
                                scope.$apply(function () {
                                    websiteData.hideEle(obj.value.ID, 'retreat');
                                });
                            }
                        }
                    }
                    if (e[shortcutsCode.REDO.ctrlKey] && e.keyCode === shortcutsCode.REDO.keyCode && e[shortcutsCode.REDO.shiftKey]) {
                        //前进
                        var obj = phoneHistoryLog.forwardPop();
                        if (obj !== undefined) {
                            if (obj.type === "updatePhoneEle") {
                                websiteData.updatePhoneEle(scope.websiteCode.ID, obj.value, 'forward');
                                phoneBuilderTool.updateEle(obj.value);
                            }
                            if (obj.type === "changeSessionHeight") {
                                websiteData.changePhoneSessionHeight(obj.value.sessionID, obj.value.height, 'forward');
                            }
                            if (obj.type === "hideSession") {
                                scope.$apply(function () {
                                    websiteData.showSession(obj.value.sessionID, 'forward');
                                });
                            }
                            if (obj.type === "showSession") {
                                scope.$apply(function () {
                                    websiteData.hideSession(obj.value.sessionID, 'forward');
                                });
                            }
                            if (obj.type === "hideEle") {
                                scope.$apply(function () {
                                    websiteData.hideEle(obj.value.ID, 'retreat');
                                });
                            }
                            if (obj.type === "showEle") {
                                scope.$apply(function () {
                                    websiteData.hideEle(obj.value.ID, 'forward');
                                });
                            }
                        }
                    }
                    //依次上下左右
                    if (shortcutsCode.MOVE_TOP.keyCode === e.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("top", e);
                        }
                    }
                    if (shortcutsCode.MOVE_DOWN.keyCode === e.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("bottom", e);
                        }
                    }
                    if (shortcutsCode.MOVE_LEFT.keyCode === e.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("left", e);
                        }
                    }
                    if (shortcutsCode.MOVE_RIGHT.keyCode === e.keyCode) {
                        if (scope.activeEle.state === 'edit') {

                        } else {
                            moveEle("right", e);
                        }
                    }

                    //删除
                    if (shortcutsCode.DELETE.keyCode === e.keyCode) {
                        if (scope.activeEle !== null) {
                            websiteData.hideEle(scope.activeEle.ID);
                        }
                    }
                }

                $(document).on("keydown", listenKeydown);

                scope.$on("$destroy", function () {
                    $(document).off("keydown", listenKeydown);
                    
                    eleMenuServices.removePlugin();
                });

            }
        };
    })

    /********************************* service ***********************/
    .factory('creatorServices', function ($compile) {
        var handle = {
            createPage: function (data, scope) {
                var dom = $('<div></div>');
                var sessionDom = "";
                var sessionList = data.sessionList;
                for (var i = 0; i < sessionList.length; i++) {
                    sessionDom = this.createSession(sessionList[i]);
                    sessionDom = $compile(sessionDom.get(0))(scope);
                    dom.append(sessionDom);
                }
                return dom;
            },
            createSession: function (data) {
                var dom = "<div class='ele-session-box-container' " + data.eleTemplateType + "></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;                
                return dom;
            },
            createEle: function (data) {
                var dom = null;
                switch (data.type) {
                    case "text": dom = this.createText(data); break;
                    case "image": dom = this.createImage(data); break;
                    case "menu": dom = this.createMenu(data); break;
                    case "group": dom = this.createGroup(data); break;
                }
                return dom;
            },
            createText: function (data) {
                var dom = "<div class='position-box-parent' " + data.eleTemplateType + " template-type=\'" + data.eleTemplateType + "\'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            },
            createGroup: function (data) {
                var dom = "<div class='position-box-parent' " + data.eleTemplateType + " template-type=\'" + data.eleTemplateType + "\'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;                
                return dom;
            },
            createImage: function (data) {
                var dom = "<div class='position-box-parent' " + data.eleTemplateType + " template-type=\'" + data.eleTemplateType + "\'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;                
                return dom;
            },
            createMenu: function (data) {
                var dom = "<div class='position-box-parent' " + data.eleTemplateType + " template-type=\'" + data.eleTemplateType + "\'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;                
                return dom;
            }
        };
        return handle;
    })
    .factory('phoneCreatorServices', function ($compile) {
        var handle = {
            createPage: function (data, scope) {
                var dom = $('<div></div>');
                var sessionDom = "";
                var sessionList = data.sessionList;
                for (var i = 0; i < sessionList.length; i++) {
                    sessionDom = this.createSession(sessionList[i]);
                    sessionDom = $compile(sessionDom.get(0))(scope);
                    dom.append(sessionDom);
                    if (sessionList[i].showState === false) {
                        sessionDom.css('display', 'none');
                    }
                }
                return dom;
            },
            createSession: function (data) {
                var dom = "<div class='ele-session-box-container' " + data.eleTemplateType + "-phone" + "></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            },
            createEle: function (data) {
                var dom = null;
                switch (data.type) {
                    case "text": dom = this.createText(data); break;
                    case "image": dom = this.createImage(data); break;
                    case "menu": dom = this.createMenu(data); break;
                    case "group": dom = this.createGroup(data); break;
                }
                return dom;
            },
            createText: function (data) {
                var eleTemplateType = data.eleTemplateType + "-phone";

                var dom = "<div class='position-box-parent' " + eleTemplateType + " template-type='" + data.eleTemplateType +"'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            },
            scaleText: function (string, scale) {
                if (scale === undefined || scale === null) {
                    scale = 1;
                }
                var scaleString = "";
                while (string.indexOf("font-size:") !== -1) {
                    scaleString += string.substring(0, string.indexOf("font-size:") + 10);
                    string = string.substring(string.indexOf("font-size:") + 10, string.length);
                    var textSize = string.substring(0, string.indexOf(";"));
                    scaleString += parseInt(textSize) * scale + "px";
                    string = string.substring(string.indexOf(";"), string.length);
                }
                scaleString += string;
                return scaleString;
            },
            createGroup: function (data) {
                var eleTemplateType = data.eleTemplateType + "-phone";

                var dom = "<div class='position-box-parent' " + eleTemplateType + " template-type='" + data.eleTemplateType +"'></div>";

                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            },
            createImage: function (data) {
                var eleTemplateType = data.eleTemplateType + "-phone";

                var dom = "<div class='position-box-parent' " + eleTemplateType + " template-type='" + data.eleTemplateType +"'></div>";

                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            },
            createMenu: function (data) {
                var eleTemplateType = data.eleTemplateType + "-phone";

                var dom = "<div class='position-box-parent' " + eleTemplateType + " template-type='" + data.eleTemplateType +"'></div>";
                dom = $(dom);
                dom.get(0).eleConfig=data;
                return dom;
            }
        };
        return handle;
    });