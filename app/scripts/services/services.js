"use strict";
angular.module('myBuilderApp')
    .factory('userProfile', function (LxNotificationService) {
        var myColor = [
            "#F44336",
            "#448AFF",
            "#FF9800",
            "#00BCD4",
            "#FF4081"
        ];
        var handle = {
            getMyColor: function () {
                return myColor;
            },
            addMyColor: function (color) {
                if (myColor.length >= 9) {
                    LxNotificationService.info('最多只能添加九个颜色');
                    return;
                } else {
                    myColor.unshift(color);
                }
            }
        };
        return handle;
    })
    .factory('siteConfig', function () {
        var data = {
            themeColor: [
                { type: "darkPrimaryColor", value: "#0288D1" },
                { type: "primaryColor", value: "#03A9F4" },
                { type: "lightPrimaryColor", value: "#B3E5FC" },
                { type: "text", value: "#ffffff" },
                { type: "accentColor", value: "#00BCD4" },
                { type: "primaryText", value: "#212121" },
                { type: "secondaryText", value: "#727272" },
                { type: "divider", value: "#B6B6B6" }
            ]
        };
        var handle = {
            getThemeColor: function () {
                return data.themeColor;
            },
            setThemeColor: function (colors) {
                data.themeColor = colors;
            }
        };
        return handle;
    })
    .factory('fontList', function () {
        var data = {
            en: ["Candara", "Helvetica"],
            cn: ["微软雅黑", "华文细黑"]
        };

        var handle = {
            getList: function (type) {
                return data[type];
            }
        };
        return handle;
    })
    .factory('shearPlate', function () {
        var data = {
            type: "",
            pageID: "",
            value: null
        };
        var handle = {
            setData: function (type, pageID, value) {
                data.type = type;
                data.pageID = pageID;
                data.value = angular.copy(value);
            },
            getData: function () {
                var returnData = jQuery.extend(true, {}, data);
                if (data.type === 'cut') {
                    data.type = "";
                    data.value = null;
                    data.ID = "";
                } else {
                }
                return returnData;
            },
            getHandle: function () {
                return data;
            }
        };
        return handle;
    })
    .factory('activeEleService', function (eleMenuServices,websiteData,activePageService) {
        var data = { ID: "ele", value: {} };
        var handle = {
            getEle: function () {
                //重新获取元素的内容 刷新一次
                data.value=websiteData.getEle(activePageService.getActivePage().value,data.value.ID);
                return data;
            },
            setEle: function (ele) {
                data.value = ele;
                if(data.value.state === "edit"){
                    //隐藏menu
                    eleMenuServices.hideDom();                    
                }else{
                    //切换显示menu
                    eleMenuServices.showDom(data.value.ID,data.value.type);
                }
            },
            clear: function () {
                data.value = {};
                //隐藏menu 
                eleMenuServices.hideDom(true);                                    
            }
        };
        return handle;
    })
    .factory('activeSessionService', function () {
        var data = { ID: "session", value: {} };
        var handle = {
            getSession: function () {
                return data;
            },
            setSession: function (session) {
                data.value = session;
            },
            check: function (session) {
                if (session !== data.value) {
                    return data.value;
                } else {
                    return false;
                }
            }
        };
        return handle;
    })
    
    /**
     * 计算元素的真实坐标
     */
    .factory('elePosition', function () {
        var handle = {
            getLeft: function (e,targetId) {
                //如果指定了顶层的target 那么采用它
                if(targetId != undefined && $(e).attr('id') == targetId){
                    return 0;
                }
                var offset = e.offsetLeft;

                if (e.offsetParent !== null){
                    offset += this.getLeft(e.offsetParent,targetId);
                }
                return offset;
            },
            getTop: function (e,targetId) {
                //如果指定了顶层的target 那么采用它
                if(targetId != undefined && $(e).attr('id') == targetId){
                    return 0;
                }
                var offset = e.offsetTop;

                if (e.offsetParent !== null){
                    offset += this.getTop(e.offsetParent,targetId);
                }
                return offset;
            }
        };
        return handle;
    })
    /**
     * 平滑滚动
     */
    .factory('levelScroll', function ($timeout,$rootScope) {

        var data={
            delay:8
        };

        var handle = {
            scrollTop: function (dom,targetPosition,delay) {
                if(delay == undefined){
                    delay = data.delay;
                }
                //广播滚动开始的事件
                $rootScope.$emit("levelScrollStart");
                
                var start=dom.scrollTop();
                
                function levelScrollDown(scrollDom,scrollStart,scrollEnd){
                    scrollDom.scrollTop(scrollStart+delay);        
                    if(scrollStart+delay < scrollEnd){
                        $timeout(function(){
                            levelScrollDown(scrollDom,scrollStart+delay,scrollEnd);
                        },1);          
                    }else{
                        //结束
                        $rootScope.$emit("levelScrollEnd");                        
                    }         
                }
                function levelScrollUp(scrollDom,scrollStart,scrollEnd){
                    scrollDom.scrollTop(scrollStart-delay);        
                    if(scrollStart-delay > scrollEnd){
                        $timeout(function(){
                            levelScrollUp(scrollDom,scrollStart-delay,scrollEnd);
                        },1);                        
                    }else{
                        //结束
                        $rootScope.$emit("levelScrollEnd");                        
                    }     
                }
                if(start < targetPosition){
                    levelScrollDown(dom,start,targetPosition);             
                }else{
                    levelScrollUp(dom,start,targetPosition);                             
                }
                

                
            },
            scrollLeft: function (dom,targetPosition) {
                            
            }
        };
        return handle;
    })
    .factory('activePageService', function () {
        var data = { ID: "page", value: {} };
        var handle = {
            getActivePage: function () {
                return data;
            },
            setActivePage: function (activePage) {
                data.value = activePage;
            }
        };
        return handle;
    })
    .factory('rotateEleCalculate', function () {
        var handle = {
            getSizeAndPosition: function (left, top, width, height, rotate) {
                /*
                * 获取真实的高度和位置
                * */
                var obj = { left: 0, top: 0, width: 0, height: 0 };

                obj.width = Math.abs(Math.cos(rotate * Math.PI / 180)) * width + Math.abs(Math.sin(rotate * Math.PI / 180)) * height;
                obj.height = Math.abs(Math.sin(rotate * Math.PI / 180)) * width + Math.abs(Math.cos(rotate * Math.PI / 180)) * height;

                obj.left = left + (width - obj.width) / 2;
                obj.top = top + (height - obj.height) / 2;

                //原始坐标
                obj.originalLeft = left;
                obj.originalTop = top;

                return obj;
            },
            getRotate: function (element) {
                var rotateText = $(element).css("transform");
                var rotate = 0;
                if (rotateText === "none") {
                    rotate = 0;
                } else {
                    rotateText = rotateText.substring(7, rotateText.length - 1);
                    rotate = Math.acos(parseFloat(rotateText.split(",")[0])) * 180 / Math.PI;
                    if (parseFloat(rotateText.split(",")[1]) < 0) {
                        rotate = 360 - rotate;
                    }
                }

                return rotate;

            }
        };
        return handle;
    })
    ;
