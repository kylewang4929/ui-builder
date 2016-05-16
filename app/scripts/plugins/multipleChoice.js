"use strict";
angular.module('multipleChoice', [])
    .directive('dragSelectEle', function (websiteData, builderTool, multipleChoiceService,changeSessionToolForMultiple) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                var wId = "w";
                var index = 0;
                var startX = 0, startY = 0;
                var flag = false;
                var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";
                var eleList = multipleChoiceService.getEleList();
                var dragFlag = false;

                var par={};
                par.shadowFlag=false;

                function listenMousedown(e) {

                    if($(e.target).attr("ele-type") == 'resize'){
                        return;
                    }

                    par.shadowFlag=false;
                    if(e.buttons!==1){
                        if($(e.target).attr("ele-type") == 'session'){
                            multipleChoiceService.removeEle();
                        }
                        return;
                    }

                    var evt = e;
                    startX = evt.clientX;
                    startY = evt.clientY;
                    if ($(e.target).attr("ele-type") !== 'session') {
                        //计算当前页面所有元素的中心位置
                        dragFlag = true;
                        multipleChoiceService.removeMenuButton();
                        eleList.value = multipleChoiceService.updateEleInfo();
                        changeSessionToolForMultiple.init($(e.target).parents('.ele-session-box').attr('id'),multipleChoiceService.getActiveEleCenterY(eleList.value));

                    } else {
                        //获取当前激活的session
                        par.activeSession=$(e.target).attr("id");
                        //计算当前页面所有元素的中心位置
                        multipleChoiceService.removeEle();
                        eleList.value = multipleChoiceService.getEleInfo($(e.target).attr("id"));

                        flag = true;
                        index++;
                        var div = $("<div></div>");
                        div.addClass("drag-select-box");
                        div.attr("id", wId + index);
                        div.css({"margin-left": startX + "px", "margin-top": startY + "px"});
                        $("body").append(div);
                    }
                }

                function listenMouseup() {
                    if (dragFlag) {
                        dragFlag = false;
                        //更新元素
                        eleList.value = multipleChoiceService.updateEleInfo();
                        var activeEleList = [];
                        for (var i = 0; i < eleList.value.length; i++) {
                            if (eleList.value[i].state == true) {
                                activeEleList.push(eleList.value[i]);
                            }
                        }
                        multipleChoiceService.updateEleList(eleList.value);
                        changeSessionToolForMultiple.overCheck(activeEleList);
                    }
                    if (flag) {
                        $("#" + wId + index).remove();
                        $(".ele-session-box .over-shadow").css("display",'none');
                        flag = false;
                    }
                }

                function listenMousemove(e) {
                    if (flag) {
                        var evt = e;
                        retcLeft = (startX - evt.clientX > 0 ? evt.clientX : startX) + "px";
                        retcTop = (startY - evt.clientY > 0 ? evt.clientY : startY) + "px";
                        retcHeight = Math.abs(startY - evt.clientY) + "px";
                        retcWidth = Math.abs(startX - evt.clientX) + "px";
                        $("#" + wId + index).css({
                            "margin-left": retcLeft,
                            "margin-top": retcTop,
                            "width": retcWidth,
                            "height": retcHeight
                        });

                        if((parseInt(retcHeight)>20 || parseInt(retcWidth)>20) && par.shadowFlag==false){
                            //越过阈值，开启遮罩
                            par.shadowFlag=true;
                            var unActiveSession=$(".ele-session-box[id!="+par.activeSession+"] .over-shadow");
                            unActiveSession.css("display",'block');
                        }

                        //计算哪些元素被选中
                        for (var i = 0; i < eleList.value.length; i++) {
                            var eleValue = eleList.value[i].center;
                            if (eleValue.x > parseInt(retcLeft) && eleValue.x < parseInt(retcLeft) + parseInt(retcWidth) && eleValue.y > parseInt(retcTop) && eleValue.y < parseInt(retcTop) + parseInt(retcHeight)) {
                                eleList.value[i].state = true;
                                //设置成激活
                                var eleDom = $("#" + eleList.value[i].ID + ".position-box");
                                eleDom.addClass('multiple-choice-border');
                                eleDom.attr('multiple-choice', true);
                            } else {
                                var eleDom = $("#" + eleList.value[i].ID + ".position-box");
                                eleDom.removeClass('multiple-choice-border');
                                eleDom.attr('multiple-choice', false);
                                eleList.value[i].state = false;
                            }
                        }
                    }
                    if (dragFlag) {
                        //拖动操作
                        var evt = e;
                        var x = evt.clientX - startX;
                        var y = evt.clientY - startY;
                        var eleDom = null;
                        for (var i = 0; i < eleList.value.length; i++) {
                            if (eleList.value[i].state == true) {
                                //移动
                                eleDom = $("#" + eleList.value[i].ID + ".position-box");
                                eleDom.css({left: eleList.value[i].position.left + x, top: eleList.value[i].position.top + y});
                            }
                        }

                        changeSessionToolForMultiple.moveCheck(y);

                    }
                }

                $(element).on("mousedown", listenMousedown);
                $(document).on("mouseup", listenMouseup);
                $(document).on("mousemove", listenMousemove);

                scope.$on("$destroy", function () {
                    $(element).off("mousedown", listenMousedown);
                    $(document).off("mouseup", listenMouseup);
                    $(document).off("mousemove", listenMousemove);
                });

            }
        };
    })
    .factory('multipleChoiceService', function ($compile,LxNotificationService,rotateEleCalculate) {

        var eleList = {ID: "eleList", value: []};
        var menuDom = null;

        var currentSession = null;


        var handle = {
            updateEleList: function (data) {
                eleList.value = data;
            },
            setEleList: function (data) {
                this.removeEle();
                eleList.value = data;
                //设置激活
                for (var i = 0; i < eleList.value.length; i++) {
                    if (eleList.value[i].state) {
                        //设置成激活
                        var eleDom = $("#" + eleList.value[i].ID + ".position-box");
                        eleDom.addClass('multiple-choice-border');
                        eleDom.attr('multiple-choice', true);
                    }
                }
            },
            getEleList: function () {
                return eleList;
            },
            clearActive: function () {
                //清除激活状态
                for (var i = 0; i < eleList.value.length; i++) {
                    eleList.value[i].state = false;
                    var eleDom = $("#" + eleList.value[i].ID + ".position-box");
                    eleDom.removeClass("multiple-choice-border");
                    eleDom.attr('multiple-choice', false);
                }
                $(".ele-session-box .over-shadow").css("display",'none');
                currentSession=null;
            },
            removeEle: function () {
                this.clearActive();
                this.removeMenuButton();
                eleList.value = [];
            },
            createMenuButton: function (scope) {

                var minTop = 0;
                var minLeft = 0;
                var maxTop = 0;
                var maxLeft = 0;

                var firstFlag = true;
                var activeEleIndex = 0;
                var maxLeftEleIndex=0;
                for (var i = 0; i < eleList.value.length; i++) {
                    if (eleList.value[i].state) {
                        activeEleIndex++;
                        if (firstFlag) {
                            minTop = eleList.value[i].position.top;
                            minLeft = eleList.value[i].position.left;
                            maxTop = eleList.value[i].position.top + eleList.value[i].size.height;
                            maxLeft = eleList.value[i].position.left + eleList.value[i].size.width;
                            firstFlag = false;
                            continue;
                        }
                        if (eleList.value[i].position.top < minTop) {
                            minTop = eleList.value[i].position.top;
                        }
                        if (eleList.value[i].position.top + eleList.value[i].size.height > maxTop) {
                            maxTop = eleList.value[i].position.top + eleList.value[i].size.height;
                        }
                        if (eleList.value[i].position.left < minLeft) {
                            minLeft = eleList.value[i].position.left;
                        }
                        if (eleList.value[i].position.left + eleList.value[i].size.width > maxLeft) {
                            maxLeftEleIndex=i;
                            maxLeft = eleList.value[i].position.left + eleList.value[i].size.width;
                        }
                    }
                }

                if (!firstFlag && activeEleIndex > 1) {
                    var center = {};
                    center.y = (minTop + maxTop) / 2;
                    center.x = (minLeft + maxLeft) / 2;

                    //创建元素
                    var domText = "<div class='multiple-choice-menu z-depth-2' ng-click='group($event)' ng-mousedown='$event.stopPropagation()' id='multiple-choice-menu' lx-ripple='white'><i class='mdi mdi-group'></i></div>";
                    menuDom = $($compile(domText)(scope));
                    $("#"+eleList.value[maxLeftEleIndex].ID).append(menuDom);

                    center.x = center.x - menuDom.width() / 2;
                    center.y = center.y - menuDom.height() / 2;

                    menuDom.css("right", "-60px");
                    menuDom.css("top", "0px");
                }

            },
            removeMenuButton: function () {
                if (menuDom == null) {
                    return;
                }
                menuDom.remove();
            },
            getEleInfo: function (sessionID) {
                var eleObj = [];
                var eleList = $("#"+sessionID+".ele-session-box .ele-session > .position-box");
                for (var i = 0; i < eleList.length; i++) {
                    var ele = eleList.eq(i);
                    var eleData=this.getEleData(ele);
                    eleObj.push(eleData);
                }
                eleList.value=eleObj;
                return eleObj;
            },
            updateEleInfo: function () {
                for (var i = 0; i < eleList.value.length; i++) {
                    if (eleList.value[i].state) {
                        var ele = $("#" + eleList.value[i].ID + ".position-box");
                        var center = {};
                        center.x = ele.offset().left + parseInt(ele.get(0).offsetWidth) / 2;
                        center.y = ele.offset().top + parseInt(ele.get(0).offsetHeight) / 2;
                        var position = {};
                        position.left = parseInt(ele.css("left"));
                        position.top = parseInt(ele.css("top"));
                        var size = {};
                        size.width = ele.outerWidth();
                        size.height = ele.outerHeight();

                        //计算真实尺寸
                        var eleObj=rotateEleCalculate.getSizeAndPosition(position.left,position.top,size.width,size.height,rotateEleCalculate.getRotate(ele));
                        position.left = eleObj.left;
                        position.top = eleObj.top;
                        size.width = eleObj.width;
                        size.height = eleObj.height;

                        eleList.value[i].center = center;
                        eleList.value[i].position = position;
                        eleList.value[i].size = size;
                    }
                }
                return eleList.value;
            },
            getEleData:function(ele){
                var center = {};
                center.x = ele.offset().left + parseInt(ele.get(0).offsetWidth) / 2;
                center.y = ele.offset().top + parseInt(ele.get(0).offsetHeight) / 2;
                var position = {};
                position.left = parseInt(ele.css("left"));
                position.top = parseInt(ele.css("top"));
                var size = {};
                size.width = ele.outerWidth();
                size.height = ele.outerHeight();

                var eleObj=rotateEleCalculate.getSizeAndPosition(position.left,position.top,size.width,size.height,rotateEleCalculate.getRotate(ele));
                position.left = eleObj.left;
                position.top = eleObj.top;
                size.width = eleObj.width;
                size.height = eleObj.height;

                return {ID:ele.attr("id"),center: center, position: position, type: ele.attr("ele-type"), size: size};
            },
            addEle:function(id){
                if($("#"+id).parents('.ele-session-box').attr('id')!=currentSession && currentSession!=null){
                    //提示不是同一个session
                    LxNotificationService.info('不可选择不是同一个模块的元素');
                    return;
                }

                var flag=false;
                var activeEleIndex=0;
                for(var i=0;i<eleList.value.length;i++){
                    if(eleList.value[i].state){
                        activeEleIndex++;
                    }
                    if(eleList.value[i].ID==id){
                        if(eleList.value[i].state!=true){
                            flag=true;
                            //加入激活元素
                            eleList.value[i].state=true;
                            //更改UI
                            var eleDom=$("#"+eleList.value[i].ID+".position-box");
                            eleDom.addClass('multiple-choice-border');
                            eleDom.attr('multiple-choice', true);

                        }else{
                            return;
                        }
                    }
                }

                if(flag==false){
                    //加入激活元素 设置当前session 加阴影
                    var eleDom=$("#"+id+".position-box");
                    currentSession=eleDom.parents('.ele-session-box').attr('id');
                    var eleData=this.getEleData(eleDom);
                    eleData.state=true;
                    eleList.value.push(eleData);
                    eleDom.addClass('multiple-choice-border');
                    eleDom.attr('multiple-choice', true);
                }

            },
            getActiveEleCenterY:function(eleList){

                if(eleList.length==0){
                    return
                }

                var centerY=0;
                var minTop=eleList[0].position.top;
                var maxTop=eleList[0].position.top+eleList[0].size.height;
                for(var i=0;i<eleList.length;i++){
                    if(eleList[i].state==true){
                        if(eleList[i].position.top<minTop){
                            minTop=eleList[i].position.top;
                        }
                        if(eleList[i].position.top+eleList[i].size.height>maxTop){
                            maxTop=eleList[i].position.top+eleList[i].size.height;
                        }
                    }
                }

                centerY=(minTop+maxTop)/2;

                return centerY;

            }
        };
        return handle;
    })