"use strict";
angular.module('dataService', ['historyLog','webSiteEditor','phoneSiteEditor'])
    .factory('websiteData', function (historyLog, phoneHistoryLog, phoneBuilderTool, builderTool, $http, $q, $timeout,activePageService,imageCropService) {

        var activePage = "";

        //页面列表的数据
        var data = [];
        var fullData = {};
        var scopeObj={};

        var handle = {
            initScope:function(scope){
                scopeObj=scope;
            },
            getSession:function(ID){
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                var targetSession = undefined;
                angular.forEach(handle,function(obj,index){
                    if(obj.ID == ID){
                        targetSession = angular.copy(obj);
                    }
                });  
                return targetSession;           
            },
            hideSession: function (ID, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                for (var i = 0; i < handle.length; i++) {
                    if (handle[i].ID === ID) {
                        handle[i].showState = false;

                        var obj = { sessionID: ID };
                        phoneHistoryLog.pushHistoryLog(obj, historyType, 'hideSession');

                        //删除元素
                        phoneBuilderTool.hideEle(ID, 'session');
                    }
                }
            },
            hideEleSearchGroup: function (ele, ID) {
                for (var i = 0; i < ele.eleList.length; i++) {
                    if (ele.eleList[i].ID === ID) {
                        return ele.eleList.splice(i, 1)[0];
                    }
                    if (ele.eleList[i].type === 'group') {
                        return this.hideEleSearchGroup(ele.eleList[i], ID);
                    }
                }
            },
            hideEle: function (ID, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }

                var sessionID = $("#" + ID + ".position-box").parents('.ele-session-box').attr("id");

                var handle = this.searchEleHandle(activePageService.getActivePage().value, sessionID);
                for (var i = 0; i < handle.length; i++) {
                    var obj={};
                    if (ID === handle[i].ID) {
                        //找到元素
                        handle[i].showState = false;

                        obj = { sessionID: sessionID, ID: ID };
                        phoneHistoryLog.pushHistoryLog(obj, historyType, 'hideEle');

                        //删除元素
                        phoneBuilderTool.hideEle(ID, 'ele');
                        break;
                    }
                    if (handle[i].type === 'group') {
                        var groupSearch = this.hideEleSearchGroup(handle[i], ID);
                        if (!!groupSearch) {

                            groupSearch.showState = false;

                            handle.push(groupSearch);

                            obj = { sessionID: sessionID, ID: ID };
                            phoneHistoryLog.pushHistoryLog(obj, historyType, 'hideEle');

                            //删除元素
                            phoneBuilderTool.deleteEle(ID);

                            //同时插入一个隐藏的新元素
                            phoneBuilderTool.addEle(sessionID, groupSearch);

                            break;
                        }
                    }
                }
            },
            showSession: function (ID, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                for (var i = 0; i < handle.length; i++) {
                    if (handle[i].ID === ID) {
                        handle[i].showState = true;

                        var obj = { sessionID: ID };
                        phoneHistoryLog.pushHistoryLog(obj, historyType, 'showSession');

                        //删除元素
                        phoneBuilderTool.showEle(ID, 'session');
                    }
                }
            },
            showEle: function (ID, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }

                var sessionID = $("#" + ID + ".position-box").parents('.ele-session-box').attr("id");
                var handle = this.searchEleHandle(activePageService.getActivePage().value, sessionID);
                for (var i = 0; i < handle.length; i++) {
                    if (ID === handle[i].ID) {
                        //找到元素
                        handle[i].showState = true;

                        var obj = { sessionID: sessionID, ID: ID };
                        phoneHistoryLog.pushHistoryLog(obj, historyType, 'showEle');
                        //删除元素
                        phoneBuilderTool.showEle(ID, 'ele');
                    }
                }
            },
            changeSessionHeight: function (sessionID, height, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                for (var i = 0; i < handle.length; i++) {
                    if (sessionID === handle[i].ID) {
                        //加入历史纪录
                        var obj = { sessionID: sessionID, height: handle[i].style['min-height'] };

                        if (historyType === 'retreat' || historyType === 'forward') {
                            builderTool.changeSessionHeight(sessionID, height);
                        }
                        historyLog.pushHistoryLog(obj, historyType, 'changeSessionHeight');

                        handle[i].style['min-height'] = height;
                        break;
                    }
                }
            },
            changePhoneSessionHeight: function (sessionID, height, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                for (var i = 0; i < handle.length; i++) {
                    if (sessionID === handle[i].ID) {
                        //加入历史纪录
                        var obj = { sessionID: sessionID, height: handle[i].phoneStyle['min-height'] };
                        if (historyType === 'retreat' || historyType === 'forward') {
                            builderTool.changeSessionHeight(sessionID, height);
                        }
                        phoneHistoryLog.pushHistoryLog(obj, historyType, 'changeSessionHeight');

                        handle[i].phoneStyle['min-height'] = height;
                        break;
                    }
                }
            },
            getSessionMinHeight: function (sessionID) {
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                var minHeight = 0;
                for (var i = 0; i < handle.length; i++) {
                    if (sessionID === handle[i].ID) {
                        for (var j = 0; j < handle[i].eleList.length; j++) {
                            if (j === 0) {
                                minHeight = parseInt(handle[i].eleList[j].border['min-height']) + parseInt(handle[i].eleList[j].position.top);
                                continue;
                            }

                            if (minHeight < parseInt(handle[i].eleList[j].border['min-height']) + parseInt(handle[i].eleList[j].position.top)) {
                                minHeight = parseInt(handle[i].eleList[j].border['min-height']) + parseInt(handle[i].eleList[j].position.top);
                            }
                        }
                        return minHeight;
                    }
                }
            },
            /**
             * 新建一个session
             */
            addSession:function(obj, targetId , option , historyType){
                //targetId是目标session的Id，也就是说在这个session的后面插入新的session
                if (historyType === undefined) {
                    historyType = 'default';
                }
                //分配新的ID
                obj.ID=builderTool.createID();
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                var targetIndex = 0;
                angular.forEach(handle,function(obj,index){
                    if(obj.ID == targetId){
                        targetIndex = index;
                    }
                });
                //插入session
                if (handle.length > targetIndex + 1) {
                    handle.splice(targetIndex + 1, 0, obj);                    
                } else {
                    //之后
                    handle.push(obj);
                }
                var dom = builderTool.addSession(obj,targetIndex + 1,option);
                historyLog.pushHistoryLog(obj, historyType, 'addSession');
                return dom;
            },
            reductionSession: function (obj, historyType) {
                /**
                 * 还原被删除的session
                 */
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                obj.ID = builderTool.createID();

                if (handle.length > obj.deleteIndex) {
                    //之前
                    handle.splice(obj.deleteIndex, 0, obj);
                } else {
                    //之后
                    handle.push(obj);
                }

                builderTool.addSession(obj,obj.deleteIndex);
                historyLog.pushHistoryLog(obj, historyType, 'addSession');
            },
            deleteSession: function (ID, historyType) {
                if (historyType === undefined) {
                    historyType = 'default';
                }
                var handle = this.searchSessionHandle(activePageService.getActivePage().value);
                for (var i = 0; i < handle.length; i++) {
                    if (handle[i].ID === ID) {
                        var session = handle.splice(i, 1)[0];
                        session.deleteIndex = i;
                        builderTool.deleteSession(ID);
                        //加入历史纪录
                        historyLog.pushHistoryLog(session, historyType, 'deleteSession');

                        return;
                    }
                }
            },
            searchSessionHandle: function (pageID) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === pageID) {
                        return data[i].sessionList;
                    }
                }
            },
            searchEleHandle: function (pageID, sessionID) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === pageID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            if (sessionID === data[i].sessionList[j].ID) {
                                return data[i].sessionList[j].eleList;
                            }
                        }
                    }
                }
            },
            changeSession: function (startSession, endSession, newObj, historyType) {
                //获取元素
                var oldEle = {};
                
                var i=0;
                var j=0;
                var k=0;
                
                for (i = 0; i < data.length; i++) {
                    if (data[i].ID === activePageService.getActivePage().value) {
                        for (j = 0; j < data[i].sessionList.length; j++) {
                            if (data[i].sessionList[j].ID === startSession) {
                                for (k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                    if (data[i].sessionList[j].eleList[k].ID === newObj.ID) {
                                        //原数组删除元素
                                        oldEle = data[i].sessionList[j].eleList.splice(k, 1)[0];
                                        //加入历史数据
                                        if (historyType === 'retreat' || historyType === 'forward') {
                                            builderTool.updateEle(newObj);
                                            builderTool.justChangeSession(startSession, endSession, newObj);
                                        } else {
                                            builderTool.changeSession(startSession, endSession, newObj);
                                        }
                                        oldEle.changeSession = { "startSession": startSession, "endSession": endSession };
                                        historyLog.pushHistoryLog(oldEle, historyType, 'changeSession');


                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }

                //迁移数据
                for (i = 0; i < data.length; i++) {
                    if (data[i].ID === activePageService.getActivePage().value) {
                        for (j = 0; j < data[i].sessionList.length; j++) {
                            if (data[i].sessionList[j].ID === endSession) {
                                var eleData = builderTool.getEle(newObj.ID,newObj.type);

                                //此处应该调用计算phoneStyle的方法

                                eleData.phoneStyle = oldEle.phoneStyle;
                                eleData.phoneStyle.position.top = eleData.position.top;
                                eleData.phoneStyle.position.left = eleData.position.left;
                                if (oldEle.type === 'group') {
                                    for (k = 0; k < oldEle.eleList.length; k++) {
                                        eleData.eleList[k].phoneStyle = oldEle.eleList[k].phoneStyle;
                                        eleData.eleList[k].phoneStyle.position.top = eleData.eleList[k].position.top;
                                        eleData.eleList[k].phoneStyle.position.left = eleData.eleList[k].position.left;
                                    }
                                }

                                this.calculateForPhone(eleData);

                                data[i].sessionList[j].eleList.push(eleData);
                                //更改UI
                                builderTool.changeSession(startSession, endSession, newObj);
                                return;
                            }
                        }
                    }
                }
            },
            calculateForUnGroup: function (eleList, scale) {
                var phoneWidth = 280;
                for (var i = 0; i < eleList.length; i++) {
                    eleList[i].phoneStyle.scale = scale;
                }
            },
            calculateForGroup: function (obj) {
                //手机宽度是280px
                var phoneWidth = 280;
                function calculateEleGroup(obj) {
                    var currentHeight = 0;
                    var maxWidth = 0;
                    var mainScale = obj.phoneStyle.scale;
                    for (var i = 0; i < obj.eleList.length; i++) {
                        //先清除缩放
                        obj.eleList[i].phoneStyle.scale = 1;
                        //先检查元素是否需要缩放
                        width = parseInt(obj.eleList[i].phoneStyle.border.width);
                        if (width > phoneWidth) {
                            //需要缩放
                            obj.eleList[i].phoneStyle.scale = (phoneWidth - 20) / width;
                            /**
                             * 如果是图片的话直接表现到json上去
                            */
                            if(obj.eleList[i].type=='image'){
                                obj.eleList[i].phoneStyle.border.width = parseInt(obj.eleList[i].phoneStyle.border.width) * obj.eleList[i].phoneStyle.scale;
                                obj.eleList[i].phoneStyle.border['min-height'] = parseInt(obj.eleList[i].phoneStyle.border['min-height']) * obj.eleList[i].phoneStyle.scale;
                                obj.eleList[i].phoneStyle.style.width = parseInt(obj.eleList[i].phoneStyle.style.width) * obj.eleList[i].phoneStyle.scale;
                                obj.eleList[i].phoneStyle.style.height = parseInt(obj.eleList[i].phoneStyle.style.height) * obj.eleList[i].phoneStyle.scale;
                                var clip = imageCropService.parsingClip(obj.eleList[i].phoneStyle.style.clip , obj.eleList[i].phoneStyle.style.width , obj.eleList[i].phoneStyle.style.height);
                                clip[0] = clip[0] * obj.eleList[i].phoneStyle.scale;
                                clip[1] = clip[1] * obj.eleList[i].phoneStyle.scale;
                                clip[2] = clip[2] * obj.eleList[i].phoneStyle.scale;
                                clip[3] = clip[3] * obj.eleList[i].phoneStyle.scale;
                                obj.eleList[i].phoneStyle.style.clip = 'rect(' + clip[0] + 'px ' + clip[1] + 'px ' + clip[2] + 'px ' + clip[3] + 'px ' + ')';
                            }
                        }
                        if (i === 0) {
                            maxWidth = width * obj.eleList[i].phoneStyle.scale;
                        }
                        if (width * obj.eleList[i].phoneStyle.scale > maxWidth) {
                            maxWidth = width * obj.eleList[i].phoneStyle.scale;
                        }
                        //调整top
                        obj.eleList[i].phoneStyle.position.top = currentHeight;
                        obj.eleList[i].phoneStyle.position.left = 0;
                        if (obj.eleList[i].type === 'group') {
                            currentHeight += parseInt(obj.eleList[i].phoneStyle.border['min-height']);
                        } else {
                            currentHeight += parseInt(obj.eleList[i].phoneStyle.border['min-height']) * obj.eleList[i].phoneStyle.scale;
                        }
                    }
                    // currentHeight maxWidth就是组的高和宽
                    obj.phoneStyle.border.width = maxWidth;
                    obj.phoneStyle.border['min-height'] = currentHeight;

                    //居中
                    obj.phoneStyle.position.left = (phoneWidth - maxWidth) / 2;

                }

                for (var i = 0; i < obj.eleList.length; i++) {
                    obj.eleList[i].phoneStyle.border.width = obj.eleList[i].border.width;
                    obj.eleList[i].phoneStyle.border['min-height'] = obj.eleList[i].border['min-height'];
                }

                var left = parseInt(obj.phoneStyle.position.left);
                var width = parseInt(obj.phoneStyle.border.width);
                if (width * obj.phoneStyle.scale < 280) {
                    //调整元素
                    this.calculateForPhone(obj);
                } else {
                    //超过了大小 调整组的大小
                    calculateEleGroup(obj);
                }

            },
            calculateForPhone: function (obj) {
                //手机宽度是280px
                var phoneWidth = 280;

                function calculateEle(obj) {
                    var left = parseInt(obj.phoneStyle.position.left);
                    var width = parseInt(obj.phoneStyle.border.width);
                    if (width < phoneWidth) {
                        //需要调整位置 居中
                        obj.phoneStyle.position.left = (phoneWidth - width * obj.phoneStyle.scale) / 2;
                    } else {
                        //缩放并居中 缩到260px
                        obj.phoneStyle.position.left = 10;
                        obj.phoneStyle.scale = (phoneWidth - 20) / width;
                        if (obj.type === 'image') {
                            console.log(obj.phoneStyle.scale);
                            obj.phoneStyle.border.width *= obj.phoneStyle.scale;
                            obj.phoneStyle.border['min-height'] *= obj.phoneStyle.scale;
                        }
                    }
                }

                calculateEle(obj);
            },
            groupEle: function (eleList, historyType, originalID) {
                if (historyType === undefined) {
                    historyType = "default";
                }

                var groupEle = [];
                var par = {};
                par.minTop = 0;
                par.maxTop = 0;
                par.maxLeft = 0;
                par.maxLeft = 0;

                //计算sessionID
                var sessionID = $("#" + eleList[0].ID + ".position-box").parents('.ele-session-box').attr('id');

                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === activePageService.getActivePage().value) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            if (data[i].sessionList[j].ID === sessionID) {
                                for (var q = 0; q < eleList.length; q++) {
                                    if (q === 0) {
                                        par.minTop = eleList[q].position.top;
                                        par.maxTop = eleList[q].position.top + eleList[q].size.height;
                                        par.minLeft = eleList[q].position.left;
                                        par.maxLeft = eleList[q].position.left + eleList[q].size.width;
                                    }

                                    //计算最大和最小值
                                    if (eleList[q].position.top < par.minTop) {
                                        par.minTop = eleList[q].position.top;
                                    }
                                    if (eleList[q].position.top + eleList[q].size.height > par.maxTop) {
                                        par.maxTop = eleList[q].position.top + eleList[q].size.height;
                                    }
                                    if (eleList[q].position.left < par.minLeft) {
                                        par.minLeft = eleList[q].position.left;
                                    }
                                    if (eleList[q].position.left + eleList[q].size.width > par.maxLeft) {
                                        par.maxLeft = eleList[q].position.left + eleList[q].size.width;
                                    }


                                    for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                        if (eleList[q].ID === data[i].sessionList[j].eleList[k].ID) {
                                            //找到匹配的元素
                                            var insetObj=data[i].sessionList[j].eleList.splice(k, 1)[0];
                                            //如果是图片的话需要先将 phoneStyle的style里图片的大小先还原 clip 也要重置
                                            if(insetObj.type == 'image'){
                                                insetObj.phoneStyle.style.width = parseInt(insetObj.phoneStyle.style.width) / insetObj.phoneStyle.scale;
                                                insetObj.phoneStyle.style.height = parseInt(insetObj.phoneStyle.style.height) / insetObj.phoneStyle.scale;
                                                var clip = imageCropService.parsingClip(insetObj.phoneStyle.style.clip , insetObj.phoneStyle.style.width , insetObj.phoneStyle.style.height);
                                                clip[0] = clip[0] / insetObj.phoneStyle.scale;
                                                clip[1] = clip[1] / insetObj.phoneStyle.scale;
                                                clip[2] = clip[2] / insetObj.phoneStyle.scale;
                                                clip[3] = clip[3] / insetObj.phoneStyle.scale;
                                                insetObj.phoneStyle.style.clip = 'rect(' + clip[0] + 'px ' + clip[1] + 'px ' + clip[2] + 'px ' + clip[3] + 'px ' + ')';
                                            }
                                            groupEle.push(insetObj);
                                            break;
                                        }
                                    }

                                    if (q + 1 >= eleList.length) {
                                        //重新计算元素的位置 以及外框的大小 组成新元素
                                        for (var eleListIndex = 0; eleListIndex < groupEle.length; eleListIndex++) {
                                            groupEle[eleListIndex].position.left = parseInt(groupEle[eleListIndex].position.left) - par.minLeft + "px";
                                            groupEle[eleListIndex].position.top = parseInt(groupEle[eleListIndex].position.top) - par.minTop + "px";

                                            //更新手机的json
                                            groupEle[eleListIndex].phoneStyle.position.left = groupEle[eleListIndex].position.left;
                                            groupEle[eleListIndex].phoneStyle.position.top = groupEle[eleListIndex].position.top;
                                        }
                                        //如果指定了ID 则用指定的ID
                                        var newEle = {
                                            "ID": originalID !== undefined ? originalID : builderTool.createID(),
                                            "type": "group",
                                            "style": {},
                                            "position": {
                                                "left": par.minLeft + "px",
                                                "top": par.minTop + "px"
                                            },
                                            "border": {
                                                "width": (par.maxLeft - par.minLeft) + "px",
                                                "min-height": (par.maxTop - par.minTop) + "px"
                                            },
                                            "eleList": groupEle,
                                            "eleTemplateType": "ele-group-default",
                                            "phoneStyle": {
                                                "style": {},
                                                "position": {
                                                    "left": par.minLeft + "px",
                                                    "top": par.minTop + "px"
                                                },
                                                "border": {
                                                    "width": (par.maxLeft - par.minLeft) + "px",
                                                    "min-height": (par.maxTop - par.minTop) + "px"
                                                },
                                                scale: 0.7
                                            }
                                        };

                                        //先计算元素是否超过手机的大小，然后缩放元素
                                        this.calculateForGroup(newEle);
                                        data[i].sessionList[j].eleList.push(newEle);
                                        builderTool.groupEle(newEle, sessionID);
                                        //加入历史纪录
                                        historyLog.pushHistoryLog(newEle, historyType, 'group');

                                    }
                                }

                                return;
                            }
                        }
                    }
                }
            },
            unGroupEle: function (group, historyType) {
                if (historyType === undefined) {
                    historyType = "default";
                }
                var sessionID = $("#" + group.ID + ".position-box").parents('.ele-session-box').attr('id');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === activePageService.getActivePage().value) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            if (data[i].sessionList[j].ID === sessionID) {
                                for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                    if (group.ID === data[i].sessionList[j].eleList[k].ID) {
                                        //找到元素
                                        var eleList = jQuery.extend(true, [], data[i].sessionList[j].eleList[k].eleList);
                                        var groupScale = data[i].sessionList[j].eleList[k].phoneStyle.scale;
                                        //清除组
                                        data[i].sessionList[j].eleList.splice(k, 1);
                                        //从页面删除元素
                                        $timeout(function () {builderTool.deleteEle(group.ID);});

                                        //把元素重新计算和加入原始数组
                                        this.calculateForUnGroup(eleList, groupScale);
                                        var left = parseInt(group.position.left);
                                        var top = parseInt(group.position.top);
                                        var historyLogEleList = [];

                                        for (var q = 0; q < eleList.length; q++) {
                                            eleList[q].position.top = parseInt(eleList[q].position.top) + top;
                                            eleList[q].position.left = parseInt(eleList[q].position.left) + left;

                                            data[i].sessionList[j].eleList.push(eleList[q]);
                                            //插入元素
                                            builderTool.addEle(sessionID, eleList[q]);

                                            var historyData = { ID: eleList[q].ID, position: { left: parseInt(eleList[q].position.left), top: parseInt(eleList[q].position.top) }, size: { width: parseInt(eleList[q].border.width), height: parseInt(eleList[q].border['min-height']) } };
                                            historyLogEleList.push(historyData);
                                        }

                                        //加入历史纪录 利用session这个属性（其实设计很不合理 但是懒得改了）保存原group的ID
                                        var obj = { eleList: historyLogEleList, oldID: group.ID };
                                        historyLog.pushHistoryLog(obj, historyType, 'unGroup');

                                    }
                                }
                            }
                        }
                    }
                }
            },
            getFullDataForCache: function () {
                return fullData;
            },
            getWebsiteData: function () {
                var deferred = $q.defer();

                $http.get("data/data.json").success(function (webData) {
                    //这里应该要处理一下json
                    var pageList = webData.pageList;
                    for (var i = 0; i < pageList.length; i++) {
                        for (var j = 0; j < pageList[i].sessionList.length; j++) {
                            if (pageList[i].sessionList[j].isPointer === 'true') {
                                var target = jQuery.extend(true, [], pageList[i].sessionList[j].target);
                                var targetContent = webData;
                                for (var k = 0; k < target.length; k++) {
                                    targetContent = targetContent[target[i]];
                                }
                                pageList[i].sessionList[j] = targetContent;
                                break;
                            }
                        }
                    }
                    fullData = webData;
                    data = fullData.pageList;

                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            addEle: function (pageID, sessionID, obj, scope, type) {
                
                if(scope===""){
                    scope=scopeObj;
                }
                
                if (type === undefined) {
                    type = "default";
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === pageID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            if (data[i].sessionList[j].ID === sessionID) {

                                data[i].sessionList[j].eleList.push(obj);
                                //插入在dom上面
                                
                                var eleDom = builderTool.addEle(sessionID, obj, scope);
                                historyLog.pushHistoryLog(obj, type, 'add');

                                return eleDom;
                            }
                        }
                    }
                }
            },
            getEleForGroup: function (obj, id) {
                if (obj.ID === id) {
                    return obj;
                }
                for (var i = 0; i < obj.eleList.length; i++) {
                    if (obj.eleList[i].ID === id) {
                        return obj.eleList[i];
                    }
                    if (obj.eleList[i].type === 'group') {
                        var groupSearch = this.getEleForGroup(obj.eleList[i], id);
                        if (groupSearch !== null) {
                            return groupSearch;
                        }
                    }
                }
                if (obj.eleList === undefined) {
                    return null;
                }
            },
            /**
             * 更换图片url
             * 参数pageID 和 元素ID 、元素type、option
             */
            updateImageUrl:function(pageID,eleOpiton,option){

                /**
                 * 更换图片的步骤
                 * 第一步：找到元素的JSON
                 * 第二步：替换相关内容
                 * 第三步：更新页面
                 */

                var eleData = handle.getEle(pageID,eleOpiton.ID);                

                handle.changeImageUrl(eleData,eleOpiton.type,option.url).then(function(data){
                    //更新到JSON和页面
                    handle.updateEle(pageID,data,'default');
                    builderTool.updateEle(data);
                });
            },
            /**
             * 计算图片的大小，
             * 替换元素的旧属性，完成替换URL的操作
             * 异步完成，因为需要获取图片的大小
             */
            changeImageUrl:function(obj,type,url){

                //异步方法
                var d = $q.defer();

                function imageEle(eleData,url){
                    eleData.url = url;
                    //获取图片的宽高
                    var img = new Image();
                    img.src = url;
                    img.onload = function(){
                        eleData.style.width = img.width+'px';
                        eleData.style.height = img.height+'px';
                        eleData.style.clip="rect(0px "+img.width+"px "+img.height+"px 0px)";

                        eleData.border.width = img.width+'px';                        
                        eleData.border['min-height'] = img.height+'px';

                        eleData.imageSize.width = img.width+'px';
                        eleData.imageSize.height = img.height+'px';

                        //手机部分
                        var phoneHeight = img.height * eleData.phoneStyle.scale;
                        var phoneWdith = img.width * eleData.phoneStyle.scale;
                        eleData.phoneStyle.style.width = phoneWdith+'px';
                        eleData.phoneStyle.style.height = phoneHeight+'px';
                        eleData.phoneStyle.style.clip="rect(0px "+phoneWdith+"px "+phoneHeight+"px 0px)";

                        eleData.phoneStyle.border.width = phoneWdith+'px';                        
                        eleData.phoneStyle.border['min-height'] = phoneHeight+'px';

                        d.resolve(eleData);
                    }
                }

                switch (type){
                    case 'image':imageEle(obj,url);break;
                }

                return d.promise;

            },
            /**
             * 获取元素的JSON
             * 参数pageID 和 元素ID
             */
            getEle: function (pageID, id) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == pageID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            
                            if(data[i].sessionList[j].ID == id){
                                return data[i].sessionList[j];
                            }
                            
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                if (data[i].sessionList[j].eleList[k].ID == id) {
                                    return data[i].sessionList[j].eleList[k];
                                }
                                if (data[i].sessionList[j].eleList[k].type == 'group') {
                                    var groupEleData = this.getEleForGroup(data[i].sessionList[j].eleList[k], id);
                                    if (groupEleData != undefined || groupEleData != null) {
                                        return groupEleData;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            deleteEle: function (pageID, id, type) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === pageID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                if (data[i].sessionList[j].eleList[k].ID === id) {
                                    //加入历史纪录
                                    //                                    var obj=data[i].sessionList[j].eleList.splice(k,1);
                                    var copyObj = jQuery.extend(true, {}, data[i].sessionList[j].eleList[k]);
                                    copyObj.sessionId = data[i].sessionList[j].ID;
                                    historyLog.pushHistoryLog(copyObj, type, 'delete');

                                    var obj = data[i].sessionList[j].eleList.splice(k, 1);
                                    builderTool.deleteEle(id);

                                    return obj;
                                }
                            }
                        }
                    }
                }
            },
            updateEle: function (pageID, eleData, type) {
                if (type === undefined) {
                    type = 'default';
                }
                for (var i = 0; i < data.length; i++) {
                    if (pageID === data[i].ID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {

                                if (data[i].sessionList[j].eleList[k].ID === eleData.ID) {
                                    //找到元素 判断元素是否相同
                                    if (_.isEqual(eleData, data[i].sessionList[j].eleList[k]) !== true) {
                                        //加入历史记录 判断是否是从历史记录控制器发过来的更新命令
                                        historyLog.pushHistoryLog(jQuery.extend(true, {}, data[i].sessionList[j].eleList[k]), type, 'updateEle');
                                        eleData = this.retainPhoneStyle(data[i].sessionList[j].eleList[k], eleData);
                                        eleData = this.saveOtherInfo(data[i].sessionList[j].eleList[k], eleData,eleData.type);
                                        eleData.eleTemplateType = data[i].sessionList[j].eleList[k].eleTemplateType;

                                        data[i].sessionList[j].eleList[k] = eleData;
                                    }
                                    return;
                                }

                            }
                        }
                    }
                }
            },
            updatePhoneEle: function (pageID, eleData, type) {
                if (type === undefined) {
                    type = 'default';
                }
                for (var i = 0; i < data.length; i++) {
                    if (pageID === data[i].ID) {
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                if (data[i].sessionList[j].eleList[k].ID === eleData.ID) {
                                    //找到元素 判断元素是否相同
                                    if (_.isEqual(eleData, data[i].sessionList[j].eleList[k]) !== true) {

                                        //加入历史记录 判断是否是从历史记录控制器发过来的更新命令
                                        phoneHistoryLog.pushHistoryLog(angular.copy(data[i].sessionList[j].eleList[k]), type, 'updatePhoneEle');
                                        
                                        /**
                                         * 手机元素比较特殊
                                         * 大部分是保存相关的位置信息 并不会有太多更改
                                         * 所以没有采用web那边的策略做一个中间层用来交换新旧数据
                                         * 但是需要的话也可以加
                                         */
                                        data[i].sessionList[j].eleList[k]=this.savePhoneStyle(angular.copy(data[i].sessionList[j].eleList[k]), eleData);
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
            },
            parsingClip: function (String, width, height) {
                if (String == 'auto') {
                    String = [0, width, height, 0];
                    return String;
                }
                String = String.substring(5, String.length - 1);

                String = String.split(' ');
                for (var i = 0; i < String.length; i++) {
                    String[i] = parseInt(String[i]);
                }

                return String;
            },
            conversionScaleForPhone:function(data){

                function image(){
                    /**
                     * 需要转换的元素有
                     * border的宽高
                     * style的宽高 left top clip
                     */
                    data.phoneStyle.border.width=data.border.width*data.phoneStyle.scale;
                    data.phoneStyle.border['min-height']=data.border['min-height']*data.phoneStyle.scale;

                    if(data.style.width=='auto' || data.style.width==undefined){
                        data.phoneStyle.style.width='auto';
                    }else{
                        data.phoneStyle.style.width=data.style.width*data.phoneStyle.scale;                        
                    }
                    if(data.style.height=='auto' || data.style.width==undefined){
                        data.phoneStyle.style.height='auto';
                    }else{
                        data.phoneStyle.style.height=data.style.height*data.phoneStyle.scale;                        
                    }

                    if(data.style.left=='auto' || data.style.width==undefined){
                        data.phoneStyle.style.left='auto';
                    }else{
                        data.phoneStyle.style.left=data.style.left*data.phoneStyle.scale;                        
                    }
                    if(data.style.top=='auto' || data.style.width==undefined){
                        data.phoneStyle.style.top='auto';
                    }else{
                        data.phoneStyle.style.top=data.style.top*data.phoneStyle.scale;                        
                    }
                    
                    if(data.style.clip==undefined){
                        data.style.clip='auto'
                    }
                    var clip=handle.parsingClip(data.style.clip,data.style.width,data.style.height);

                    angular.forEach(clip,function(obj,index){
                        clip[index]=obj*data.phoneStyle.scale;
                    });
                    
                    data.phoneStyle.style.clip='rect(' + clip[0] + 'px ' + clip[1] + 'px ' + clip[2] + 'px ' + clip[3] + 'px ' + ')';
                    
                }

                switch(data.type){
                    case "image":image();break;
                }

                return data;
            },
            saveOtherInfo:function(oldData, newData,type){
                /*
                    做一个中转
                    保存每个元素特有的内容
                */

                function image(oldObj, newObj){
                    newObj.imageSize=oldObj.imageSize;
                    newObj.backgroundSize=oldObj.backgroundSize;
                    return newObj;
                }
                function text(oldObj, newObj){
                    return newObj;                    
                }
                function menu(oldObj, newObj){
                    return newObj;                    
                }
                function group(oldObj, newObj){
                    /**
                     * 遍历子元素交换特有的内容
                    */
                    angular.forEach(oldObj.eleList,function(oldObj,oldIndex){
                        angular.forEach(newObj.eleList,function(newObj,newIndex){
                            if(oldObj.ID==newObj.ID){
                                handle.saveOtherInfo(oldObj,newObj);
                            }
                        })
                    });
                    return newObj;
                }
                var outputData=newData;
                switch(type){
                    case "image":outputData=image(oldData, newData);break;
                    case "text":outputData=text(oldData, newData);break;
                    case "menu":outputData=menu(oldData, newData);break;
                    case "group":outputData=group(oldData, newData);break;
                }
                return outputData;
            },
            savePhoneStyle: function (oldData, newData) {
                /*
                控制只交换规定的样式
                */
                
                //公共的样式
                oldData.phoneStyle.position.left = newData.phoneStyle.position.left;
                oldData.phoneStyle.position.top = newData.phoneStyle.position.top;
                oldData.phoneStyle.border.width = newData.phoneStyle.border.width;
                oldData.phoneStyle.border['min-height'] = newData.phoneStyle.border['min-height'];
                
                oldData.phoneStyle.scale = newData.phoneStyle.scale;
                if (newData.phoneStyle.position.transform !== undefined) {
                    oldData.phoneStyle.position.transform = newData.phoneStyle.position.transform;
                }

                function image(oldData,newData){
                    oldData.phoneStyle.style.left = newData.phoneStyle.style.left;
                    oldData.phoneStyle.style.top = newData.phoneStyle.style.top;
                    oldData.phoneStyle.style.width = newData.phoneStyle.style.width;
                    oldData.phoneStyle.style.height = newData.phoneStyle.style.height;
                    oldData.phoneStyle.style.clip = newData.phoneStyle.style.clip;
                }

                function group(oldData,newData){
                    for (var i = 0; i < newData.eleList.length; i++) {
                        handle.savePhoneStyle(oldData.eleList[i], newData.eleList[i]);
                    }
                }


                switch(newData.type){
                    case "image":image(oldData,newData);break;
                    case "group":group(oldData,newData);break;
                }
                return oldData;
            },
            retainPhoneStyle: function (oldData, newData) {
                if (newData.type === 'group') {
                    newData.phoneStyle = angular.copy(oldData.phoneStyle);
                    for (var i = 0; i < newData.eleList.length; i++) {
                        newData.eleList[i] = this.retainPhoneStyle(oldData.eleList[i], newData.eleList[i]);
                    }
                } else {
                    newData.phoneStyle = angular.copy(oldData.phoneStyle);
                }
                return newData;
            },
            updateSessionBackground: function () {

            },
            getPage: function (ID) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID === ID) {
                        return data[i];
                    }
                }
            }
        };
        return handle;
    });