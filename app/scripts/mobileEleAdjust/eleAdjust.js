"use strict";
angular.module('myBuilderApp')
    .directive('phoneResize', function ($timeout,websiteData,phoneBuilderTool,rotateEleCalculate) {
        return {
            restrict: 'A',
            link: function (scope, element,attrs) {
                var parameter = {
                    flag: false,
                    left: 0,
                    top: 0,
                    cx: 0,
                    cy: 0,
                    eleWidth: 0,
                    eleHeight: 0,
                    target: "",
                    isGroupEle:false,
                    rightRotate:0
                };

                var eleBox = $(element).find("> .ele-box");
                var eleDom = eleBox.find("> .ele");
                var type=attrs.eleType;

                var groupID="";
                var firstParentGroupID="";
                if($(element).parents('.position-box[ele-type=group]').length>0){
                    parameter.isGroupEle=true;
                    var groupEleList=$(element).parents('.position-box[ele-type=group]');
                    groupID=groupEleList.eq(0).attr('id');
                    firstParentGroupID=groupEleList.eq(groupEleList.length-1).attr('id');
                }

                if(attrs.eleType!=='group'){
                    $(element).on("click",function(){
                        var height = eleDom.height() / 2;
                        eleDom.css("margin-top", -height + "px");
                    });
                }

                function fixPosition(){
                    var height = eleDom.height() / 2;
                    eleDom.css("margin-top", -height + "px");

                    $(eleDom).resize(function () {

                        //当元素被隐藏的时候不调整高度
                        if(eleDom.is(":hidden")){
                            return;
                        }

                        if(eleDom.height()>parseInt(eleBox.css("min-height"))){
                            eleBox.css("min-height",eleDom.height()+"px");
                        }
                    })

                    $(element).resize(function () {
                        var height = eleDom.height() / 2;
                        eleDom.css("margin-top", -height + "px");
                    });
                }

                fixPosition();

                $(element).find(" >.resize").on("mousedown", function (e) {

                    e.stopPropagation();

                    if(parameter.isGroupEle){
                        $(element).trigger("groupUpdateInit",groupID);
                    }

                    parameter.flag = true;
                    parameter.left = $(element).get(0).offsetLeft;
                    parameter.top = $(element).get(0).offsetTop;

                    parameter.cx = e.clientX;
                    parameter.cy = e.clientY;

                    parameter.eleWidth = eleBox.get(0).clientWidth;
                    parameter.eleHeight = parseInt(eleBox.css("min-height"));

                    if (e.target.className.indexOf("left-top") !== -1) {
                        parameter.target = 0;
                    }
                    if (e.target.className.indexOf("only-top") !== -1) {
                        parameter.target = 1;
                    }
                    if (e.target.className.indexOf("right-top") !== -1) {
                        parameter.target = 2;
                    }
                    if (e.target.className.indexOf("only-right") !== -1) {
                        parameter.target = 3;
                    }
                    if (e.target.className.indexOf("right-bottom") !== -1) {
                        parameter.target = 4;
                    }
                    if (e.target.className.indexOf("only-bottom") !== -1) {
                        parameter.target = 5;
                    }
                    if (e.target.className.indexOf("left-bottom") !== -1) {
                        parameter.target = 6;
                    }
                    if (e.target.className.indexOf("only-left") !== -1) {
                        parameter.target = 7;
                    }

                    //获取元素的旋转角度
                    parameter.rotate=rotateEleCalculate.getRotate(element);

                    //parameter.coveringWidth=Math.abs(Math.cos(parameter.rotate*Math.PI/180))*parameter.eleWidth+Math.abs(Math.sin(parameter.rotate*Math.PI/180))*parameter.eleHeight;
                    //parameter.coveringHeight=Math.abs(Math.sin(parameter.rotate*Math.PI/180))*parameter.eleWidth+Math.abs(Math.cos(parameter.rotate*Math.PI/180))*parameter.eleHeight;

                    parameter.rightRotate=parseInt(parameter.rotate/45+parameter.target)%8;

                });

                //定义好resize的方法
                function leftTopResize(offsetX,offsetY,rightRotate){
                    //位置是0

                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;

                    switch (rightRotate){
                        case 0:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 1:percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 2:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 3:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 4:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 5:percent = (offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 6:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 7:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                    }


                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);
                    eleBox.css({"min-height": cHeight + "px", width: cWidth + "px"});
                    //偏移

                    var excursionX=0;
                    var excursionY=0;

                    switch (rightRotate){
                        case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                        case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                    }

                    element.css({"top": excursionY, "left": excursionX});
                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        eleBox.css("min-height", eleDom.height());
                    } else {
                    }
                }
                function leftBottomResize(offsetX,offsetY,rightRotate){
                    //位置是6
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;

                    switch (rightRotate){
                        case 0:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 1:percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 2:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 3:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 4:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 5:percent = (offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 6:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 7:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                    }

                    //percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);
                    eleBox.css({"min-height": cHeight + "px", width: cWidth + "px"});
                    //偏移

                    var excursionX=0;
                    var excursionY=0;
                    switch (rightRotate){
                        case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                        case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                    }

                    element.css({"top": excursionY,"left": excursionX});
                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        eleBox.css("min-height", eleDom.height());
                    } else {
                    }
                }
                function rightTopResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;


                    switch (rightRotate){
                        case 0:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 1:percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 2:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 3:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 4:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 5:percent = (offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 6:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 7:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                    }

                    //percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);
                    eleBox.css({"min-height": cHeight + "px", width: cWidth + "px"});
                    //偏移
                    var excursionX=0;
                    var excursionY=0;
                    switch (rightRotate){
                        case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                        case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                    }

                    element.css({"top": excursionY,"left": excursionX});

                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        eleBox.css("min-height", eleDom.height());
                    } else {
                    }
                }
                function rightBottomResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;

                    switch (rightRotate){
                        case 0:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 1:percent = (-offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 2:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 3:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 4:percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 5:percent = (offsetY + parameter.eleHeight) / parameter.eleHeight;break;
                        case 6:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                        case 7:percent = (-offsetX + parameter.eleWidth) / parameter.eleWidth;break;
                    }

                    //percent = (offsetX + parameter.eleWidth) / parameter.eleWidth;
                    cHeight = parseInt(parameter.eleHeight * percent);
                    cWidth = parseInt(parameter.eleWidth * percent);
                    eleBox.css({"min-height": cHeight + "px", width: cWidth + "px"});

                    var excursionX=0;
                    var excursionY=0;
                    switch (rightRotate){
                        case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                        case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                        case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                    }

                    element.css({"top": excursionY,"left": excursionX});


                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        eleBox.css("min-height", eleDom.height());
                    } else {
                    }
                }
                function onlyLeftResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;

                    var offset=0;

                    switch (rightRotate){
                        case 0:offset=-offsetX;break;
                        case 1:offset=-offsetY;break;
                        case 2:offset=offsetX;break;
                        case 3:offset=offsetX;break;
                        case 4:offset=offsetX;break;
                        case 5:offset=offsetY;break;
                        case 6:offset=-offsetX;break;
                        case 7:offset=-offsetX;break;
                    }


                    cWidth = parameter.eleWidth + offset;
                    cHeight = parseInt(eleBox.css("min-height"));
                    eleBox.css({"width": cWidth + "px"});

                    //缩放模块
                    if (eleBox.height() >=eleDom.height()) {

                        var excursionX=0;
                        var excursionY=0;
                        switch (rightRotate){
                            case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                            case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        }


                        element.css({"top": excursionY,"left": excursionX});

                    } else {
                        eleBox.css("min-height", eleDom.height());
                    }
                }
                function onlyRightResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;
                    var offset=0;

                    switch (rightRotate){
                        case 0:offset=-offsetX;break;
                        case 1:offset=-offsetY;break;
                        case 2:offset=offsetX;break;
                        case 3:offset=offsetX;break;
                        case 4:offset=offsetX;break;
                        case 5:offset=offsetY;break;
                        case 6:offset=-offsetX;break;
                        case 7:offset=-offsetX;break;
                    }

                    cWidth = parameter.eleWidth + offset;
                    cHeight = eleBox.css("height");
                    eleBox.css({"width": cWidth + "px"});

                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {

                        var excursionX=0;
                        var excursionY=0;
                        switch (rightRotate){
                            case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                            case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        }


                        element.css({"top": excursionY,"left": excursionX});

                    } else {
                        eleBox.css("min-height",eleDom.height());
                    }
                }
                function onlyTopResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;
                    var offset=0;

                    switch (rightRotate){
                        case 0:offset=-offsetX;break;
                        case 1:offset=-offsetY;break;
                        case 2:offset=offsetX;break;
                        case 3:offset=offsetX;break;
                        case 4:offset=offsetX;break;
                        case 5:offset=offsetY;break;
                        case 6:offset=-offsetX;break;
                        case 7:offset=-offsetX;break;
                    }

                    cHeight = parameter.eleHeight + offset;
                    cWidth = eleBox.css("width");
                    eleBox.css({"min-height": cHeight + "px"});


                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        var excursionX=0;
                        var excursionY=0;
                        switch (rightRotate){
                            case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                            case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        }


                        element.css({"top": excursionY,"left": excursionX});
                    } else {
                        eleBox.css("min-height", eleDom.height());
                    }
                }
                function onlyBottomResize(offsetX,offsetY,rightRotate){
                    var percent=0;
                    var cHeight=0;
                    var cWidth=0;
                    var top=0;
                    var offset=0;

                    switch (rightRotate){
                        case 0:offset=-offsetX;break;
                        case 1:offset=-offsetY;break;
                        case 2:offset=offsetX;break;
                        case 3:offset=offsetX;break;
                        case 4:offset=offsetX;break;
                        case 5:offset=offsetY;break;
                        case 6:offset=-offsetX;break;
                        case 7:offset=-offsetX;break;
                    }

                    cHeight = parameter.eleHeight + offset;
                    cWidth = eleBox.css("width");
                    eleBox.css({"min-height": cHeight + "px"});


                    //缩放模块
                    if (eleBox.height() > eleDom.height()) {
                        var excursionX=0;
                        var excursionY=0;
                        switch (rightRotate){
                            case 0:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 1:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 2:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 3:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left;break;
                            case 4:excursionY = parameter.top;excursionX=parameter.left;break;
                            case 5:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 6:excursionY = parameter.top;excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                            case 7:excursionY = parameter.top + (parameter.eleHeight - cHeight);excursionX=parameter.left + (parameter.eleWidth - cWidth);break;
                        }


                        element.css({"top": excursionY,"left": excursionX});
                    } else {
                        eleBox.css("min-height", eleDom.height());
                    }
                }


                function listenMousemove(e){
                    if (parameter.flag) {
                        //偏移值
                        var offsetX = e.clientX - parameter.cx;
                        var offsetY = e.clientY - parameter.cy;

                        switch (parameter.target){
                            case 0:leftTopResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 1:onlyTopResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 2:rightTopResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 3:onlyRightResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 4:rightBottomResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 5:onlyBottomResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 6:leftBottomResize(offsetX,offsetY,parameter.rightRotate);break;
                            case 7:onlyLeftResize(offsetX,offsetY,parameter.rightRotate);break;
                        }

                        if(parameter.isGroupEle){
                            var groupEleLeft=parseInt($(element).css('left'));
                            var groupEleTop=parseInt($(element).css('top'));
                            var outerWidth=$(element).outerWidth();
                            var outerHeight=$(element).outerHeight();
                            var elePar=rotateEleCalculate.getSizeAndPosition(groupEleLeft,groupEleTop,outerWidth,outerHeight,parameter.rotate);
                            var triggerData={ID:groupID,elePar:elePar};
                            $(element).trigger("groupUpdate",triggerData);
                            if(elePar.left<0){
                                offsetX=(elePar.width-outerWidth)/2
                                $(element).css({left: offsetX});
                            }
                            if(elePar.top<0){
                                offsetY=(elePar.height-outerHeight)/2
                                $(element).css({top: offsetY + "px"});
                            }
                        }

                    }
                }
                function listenMouseup(e){
                    if (parameter.flag) {
                        parameter.flag = false;

                        if(parameter.isGroupEle!=true){
                            var eleData=phoneBuilderTool.getEle(attrs.id,attrs.eleType);
                            websiteData.updatePhoneEle(websiteData.getActivePage(),eleData);
                        }else{
                            //更新组
                            var eleData=phoneBuilderTool.getEle(firstParentGroupID,"group");
                            websiteData.updatePhoneEle(websiteData.getActivePage(),eleData);
                        }

                    }
                }
                $(document).on("mousemove", listenMousemove);
                $(document).on("mouseup", listenMouseup);

                scope.$on("$destroy",function(){
                    $(document).off("mousemove", listenMousemove);
                    $(document).off("mouseup", listenMouseup);
                });

            }
        };
    });