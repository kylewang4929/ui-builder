"use strict";
angular.module('shortcuts', ["browserInfo"])
    .factory('shortcuts', function (browserInfo) {
        //配置快捷键
        var keyboardWindows = {
            UNDO: {
                ctrlKey: "ctrlKey",
                keyCode: 90
            },
            REDO: {
                ctrlKey: "ctrlKey",
                keyCode: 90,
                shiftKey: "shiftKey",
            },
            CUT: {
                ctrlKey: "ctrlKey",
                keyCode: 88
            },
            COPY: {
                ctrlKey: "ctrlKey",
                keyCode: 67
            },
            PASTE: {
                ctrlKey: "ctrlKey",
                keyCode: 86
            },
            MOVE_TOP:{
                keyCode:38
            },
            MOVE_DOWN:{
                keyCode:40
            },
            MOVE_LEFT:{
                keyCode:37
            },
            MOVE_RIGHT:{
                keyCode:39
            },
            DELETE:{
                keyCode:46
            }
        }
        var keyboardMac = {
            UNDO: {
                ctrlKey: "metaKey",
                keyCode: 90
            },
            REDO: {
                ctrlKey: "metaKey",
                keyCode: 90,
                shiftKey: "shiftKey",
            },
            CUT: {
                ctrlKey: "metaKey",
                keyCode: 88
            },
            COPY: {
                ctrlKey: "metaKey",
                keyCode: 67
            },
            PASTE: {
                ctrlKey: "metaKey",
                keyCode: 86
            },
            MOVE_TOP:{
                keyCode:38
            },
            MOVE_DOWN:{
                keyCode:40
            },
            MOVE_LEFT:{
                keyCode:37
            },
            MOVE_RIGHT:{
                keyCode:39
            },
            DELETE:{
                keyCode:8
            }
        }



        //获取当前平台
        var os = browserInfo.getOs();

        var platform = "";
        var activeKeyboard={};
        if (os.windows === true) {
            platform = "windows";
            activeKeyboard=keyboardWindows;
        } else if (os.name.indexOf("mac")) {
            platform = "mac";
            activeKeyboard=keyboardMac;
        }



        var handle = {
            get: function () {
                return activeKeyboard;
            }
        };
        return handle;
    });