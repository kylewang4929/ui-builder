"use strict";
angular.module('historyLog', [])
    .factory('historyLog', function () {

        var forward = [];
        var retreat = [];
        var handle = {
            forwardPush: function (obj, type, sessionId) {
                if (type === undefined) {
                    type = "default";
                }
                if (sessionId === undefined) {
                    sessionId = "default";
                }
                //如果数量超过多少则删除一条记录
                var dataObj = { value: obj, type: type, sessionId: sessionId };
                forward.push(dataObj);
                if (forward.length >= 50) {
                    forward.splice(0, 1);
                }
            },
            pushHistoryLog: function (obj, historyType, operation) {
                /*
                用于插入历史纪录
                参数:
                * */
                if (historyType !== 'retreat' && historyType !== 'forward') {
                    this.retreatPush(obj, operation);
                    this.clearForward();
                }
                if (historyType === 'retreat') {
                    //当前状态入前进栈
                    this.forwardPush(obj, operation);
                }
                if (historyType === 'forward') {
                    //当前状态入后退
                    this.retreatPush(obj, operation);
                }
            },
            forwardPop: function () {
                var pop = forward.pop();
                return pop;
            },
            retreatPush: function (obj, type, sessionId) {
                if (type === undefined) {
                    type = "default";
                }
                if (sessionId === undefined) {
                    sessionId = "default";
                }

                var dataObj = { value: obj, type: type, sessionId: sessionId };
                retreat.push(dataObj);
                if (retreat.length >= 50) {
                    retreat.splice(0, 1);
                }
            },
            retreatPop: function () {
                var pop = retreat.pop();
                return pop;
            },
            clearForward: function () {
                forward = [];
            },
            clearAll: function () {
                forward = [];
                retreat = [];
            }
        };
        return handle;
    })
    .factory('phoneHistoryLog', function () {

        var forward = [];
        var retreat = [];
        var handle = {
            forwardPush: function (obj, type, sessionId) {
                if (type === undefined) {
                    type = "default";
                }
                if (sessionId === undefined) {
                    sessionId = "default";
                }
                //如果数量超过多少则删除一条记录
                var dataObj = { value: obj, type: type, sessionId: sessionId };
                forward.push(dataObj);
                if (forward.length >= 50) {
                    forward.splice(0, 1);
                }
            },
            pushHistoryLog: function (obj, historyType, operation) {
                /*
                用于插入历史纪录
                参数:
                * */
                if (historyType !== 'retreat' && historyType !== 'forward') {
                    this.retreatPush(obj, operation);
                    this.clearForward();
                }
                if (historyType === 'retreat') {
                    //当前状态入前进栈
                    this.forwardPush(obj, operation);
                }
                if (historyType === 'forward') {
                    //当前状态入后退
                    this.retreatPush(obj, operation);
                }
            },
            forwardPop: function () {
                var pop = forward.pop();
                return pop;
            },
            retreatPush: function (obj, type, sessionId) {
                if (type === undefined) {
                    type = "default";
                }
                if (sessionId === undefined) {
                    sessionId = "default";
                }

                var dataObj = { value: obj, type: type, sessionId: sessionId };
                retreat.push(dataObj);
                if (retreat.length >= 50) {
                    retreat.splice(0, 1);
                }
            },
            retreatPop: function () {
                var pop = retreat.pop();
                return pop;
            },
            clearForward: function () {
                forward = [];
            },
            clearAll: function () {
                forward = [];
                retreat = [];
            }
        };
        return handle;
    });