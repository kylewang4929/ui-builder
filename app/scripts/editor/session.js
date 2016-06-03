"use strict";
angular.module('sessionEditor',[])
    .factory('changeSessionTool', function (builderTool, websiteData,activePageService) {
        var parameter = {};
        parameter.currentSession = {};
        parameter.sessionHeight = [];
        parameter.eleCenterY = 0;

        var handle = {
            init: function (sessionID, centerY) {
                parameter.eleCenterY = centerY;
                parameter.sessionHeight = [];
                //获取当前session和session的高度
                parameter.currentSession.ID = sessionID;
                var sessionList = $("#edit-space .ele-session-box");
                for (var i = 0; i < sessionList.length; i++) {
                    var obj = {};
                    obj.ID = sessionList.eq(i).attr('id');
                    obj.height = sessionList.get(i).offsetHeight;
                    parameter.sessionHeight.push(obj);
                    if (obj.ID === parameter.currentSession.ID) {
                        parameter.currentSession.index = i;
                        parameter.currentSession.height = obj.height;
                    }
                }
            },
            moveCheck: function (offsetY) {
                var unActiveSession = [];
                var sessionHeight = 0;
                var i=0;           
                if (offsetY < -parameter.eleCenterY) {
                    unActiveSession = [];
                    sessionHeight = 0;
                    for (i = parameter.currentSession.index - 1; i >= 0; i--) {
                        sessionHeight += parameter.sessionHeight[i].height;
                        if (Math.abs(offsetY) < sessionHeight + parameter.eleCenterY) {
                            //重置
                            $(".ele-session-box .over-shadow").css("display", "none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState = true;
                            parameter.targetSession = parameter.sessionHeight[i].ID;
                            unActiveSession = $(".ele-session-box[id!=" + parameter.sessionHeight[i].ID + "] .over-shadow");
                            unActiveSession.css("display", "block");
                            break;
                        }
                    }
                }
                if (offsetY > parameter.currentSession.height - parameter.eleCenterY) {
                    //向下
                    unActiveSession = [];
                    sessionHeight = 0;
                    for (i = parameter.currentSession.index; i < parameter.sessionHeight.length; i++) {
                        if (parameter.sessionHeight[i + 1] === undefined) { return; }
                        sessionHeight += parameter.sessionHeight[i].height;
                        if (Math.abs(offsetY) > sessionHeight - parameter.eleCenterY) {
                            $(".ele-session-box .over-shadow").css("display", "none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState = true;
                            parameter.targetSession = parameter.sessionHeight[i + 1].ID;
                            unActiveSession = $(".ele-session-box[id!=" + parameter.targetSession + "] .over-shadow");
                            unActiveSession.css("display", "block");
                        }
                    }
                }
                if (offsetY >= -parameter.eleCenterY && offsetY <= parameter.currentSession.height - parameter.eleCenterY) {
                    $(".ele-session-box .over-shadow").css("display", "none");
                    parameter.changeSessionState = false;
                }
            },
            overCheck: function (ele) {
                $(".ele-session-box .over-shadow").css("display", "none");
                var i=0;
                if (parameter.changeSessionState) {
                    //切换session操作
                    for (i = 0; i < ele.length; i++) {
                        websiteData.changeSession(parameter.currentSession.ID, parameter.targetSession, builderTool.getEle(ele[i].ID, ele[i].type));
                    }
                    return parameter.targetSession;
                } else {
                    for (i = 0; i < ele.length; i++) {
                        var eleData = builderTool.getEle(ele[i].ID, ele[i].type);
                        websiteData.updateEle(activePageService.getActivePage().value, eleData);
                    }
                    return false;
                }
            }
        };
        return handle;
    })
    .factory('changeSessionToolForMultiple', function (builderTool, phoneBuilderTool,websiteData,activePageService) {
        var parameter = {};
        parameter.currentSession = {};
        parameter.sessionHeight = [];
        parameter.eleCenterY = 0;
        var moduleType="";

        var handle = {
            init: function (sessionID, centerY,moduleCode) {
                
                /**
                 * moduleType 标记是phone 还是web
                 */
                
                if(moduleCode === undefined){
                    moduleType="web";
                }else{
                    moduleType=moduleCode;
                }
                
                parameter.eleCenterY = centerY;
                parameter.sessionHeight = [];
                //获取当前session和session的高度
                parameter.currentSession.ID = sessionID;
                var sessionList = $("#edit-space .ele-session-box");
                for (var i = 0; i < sessionList.length; i++) {
                    var obj = {};
                    obj.ID = sessionList.eq(i).attr('id');
                    obj.height = sessionList.get(i).offsetHeight;
                    parameter.sessionHeight.push(obj);
                    if (obj.ID === parameter.currentSession.ID) {
                        parameter.currentSession.index = i;
                        parameter.currentSession.height = obj.height;
                    }
                }
            },
            moveCheck: function (offsetY) {
                if(moduleType==="phone"){
                    return;
                }
                var unActiveSession = [];
                var sessionHeight = 0;
                
                var i=0;
                
                if (offsetY < -parameter.eleCenterY) {
                    unActiveSession = [];
                    sessionHeight = 0;
                    for (i = parameter.currentSession.index - 1; i >= 0; i--) {
                        sessionHeight += parameter.sessionHeight[i].height;
                        if (Math.abs(offsetY) < sessionHeight + parameter.eleCenterY) {
                            //重置
                            $(".ele-session-box .over-shadow").css("display", "none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState = true;
                            parameter.targetSession = parameter.sessionHeight[i].ID;
                            unActiveSession = $(".ele-session-box[id!=" + parameter.sessionHeight[i].ID + "] .over-shadow");
                            unActiveSession.css("display", "block");
                            break;
                        }
                    }
                }
                if (offsetY > parameter.currentSession.height - parameter.eleCenterY) {
                    //向下
                    unActiveSession = [];
                    sessionHeight = 0;
                    for (i = parameter.currentSession.index; i < parameter.sessionHeight.length; i++) {
                        if (parameter.sessionHeight[i + 1] === undefined) { return; }
                        sessionHeight += parameter.sessionHeight[i].height;
                        if (Math.abs(offsetY) > sessionHeight - parameter.eleCenterY) {
                            $(".ele-session-box .over-shadow").css("display", "none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState = true;
                            parameter.targetSession = parameter.sessionHeight[i + 1].ID;
                            unActiveSession = $(".ele-session-box[id!=" + parameter.targetSession + "] .over-shadow");
                            unActiveSession.css("display", "block");
                        }
                    }
                }
                if (offsetY >= -parameter.eleCenterY && offsetY <= parameter.currentSession.height - parameter.eleCenterY) {
                    $(".ele-session-box .over-shadow").css("display", "none");
                    parameter.changeSessionState = false;
                }
            },
            overCheck: function (ele) {
                $(".ele-session-box .over-shadow").css("display", "none");
                var i=0;
                if (parameter.changeSessionState) {
                    //切换session操作
                    for (i = 0; i < ele.length; i++) {
                        websiteData.changeSession(parameter.currentSession.ID, parameter.targetSession, builderTool.getEle(ele[i].ID, ele[i].type));
                    }
                    return parameter.targetSession;
                } else {
                    for (i = 0; i < ele.length; i++) {
                        var eleData={};
                        if(moduleType==="phone"){
                            eleData = phoneBuilderTool.getEle(ele[i].ID, ele[i].type);
                            websiteData.updatePhoneEle(activePageService.getActivePage().value, eleData);
                        }
                        if(moduleType==="web"){
                            eleData = builderTool.getEle(ele[i].ID, ele[i].type);
                            websiteData.updateEle(activePageService.getActivePage().value, eleData);                            
                        }
                    }
                    return false;
                }
            }
        };
        return handle;
    });