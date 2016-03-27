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
                if(myColor.length>=9){
                    LxNotificationService.info('最多只能添加九个颜色');
                    return;
                }else{
                    myColor.unshift(color);
                }
            }
        };
        return handle;
    })
    .factory('siteConfig', function () {
        var data = {
            themeColor: [
                {type: "darkPrimaryColor", value: "#0288D1"},
                {type: "primaryColor", value: "#03A9F4"},
                {type: "lightPrimaryColor", value: "#B3E5FC"},
                {type: "text", value: "#ffffff"},
                {type: "accentColor", value: "#00BCD4"},
                {type: "primaryText", value: "#212121"},
                {type: "secondaryText", value: "#727272"},
                {type: "divider", value: "#B6B6B6"}
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
    .factory('websiteData', function (historyLog,phoneHistoryLog,phoneBuilderTool,builderTool,$http,$q,$timeout) {

        var activePage="";

        //页面列表的数据
        var data = [];
        var fullData={};

        var handle = {
            hideSession:function(ID,historyType){
                if(historyType==undefined){
                    historyType='default';
                }
                var handle=this.searchSessionHandle(activePage);
                for(var i=0;i<handle.length;i++){
                    if(handle[i].ID==ID){
                        handle[i].showState=false;

                        var obj={sessionID:ID}
                        phoneHistoryLog.pushHistoryLog(obj,historyType,'hideSession');

                        //删除元素
                        phoneBuilderTool.hideEle(ID,'session');
                    }
                }
            },
            hideEleSearchGroup:function(ele,ID){
                for(var i=0;i<ele.eleList.length;i++){
                    if(ele.eleList[i].ID==ID){
                        return ele.eleList.splice(i,1)[0];
                    }
                    if(ele.eleList[i].type=='group'){
                        return this.hideEleSearchGroup(ele.eleList[i],ID);
                    }
                }
            },
            hideEle:function(ID,historyType){
                if(historyType==undefined){
                    historyType='default';
                }

                var sessionID=$("#"+ID+".position-box").parents('.ele-session-box').attr("id");

                var handle=this.searchEleHandle(activePage,sessionID);
                for(var i=0;i<handle.length;i++){
                    if(ID==handle[i].ID){
                        //找到元素
                        handle[i].showState=false;

                        var obj={sessionID:sessionID,ID:ID}
                        phoneHistoryLog.pushHistoryLog(obj,historyType,'hideEle');

                        //删除元素
                        phoneBuilderTool.hideEle(ID,'ele');
                        break;
                    }
                    if(handle[i].type=='group'){
                        var groupSearch=this.hideEleSearchGroup(handle[i],ID);
                        if(!!groupSearch){

                            groupSearch.showState=false;

                            handle.push(groupSearch);

                            var obj={sessionID:sessionID,ID:ID}
                            phoneHistoryLog.pushHistoryLog(obj,historyType,'hideEle');

                            //删除元素
                            phoneBuilderTool.deleteEle(ID);

                            //同时插入一个隐藏的新元素
                            phoneBuilderTool.addEle(sessionID,groupSearch);

                            break;
                        }
                    }
                }
            },
            showSession:function(ID,historyType){
                if(historyType==undefined){
                    historyType='default';
                }
                var handle=this.searchSessionHandle(activePage);
                for(var i=0;i<handle.length;i++){
                    if(handle[i].ID==ID){
                        handle[i].showState=true;

                        var obj={sessionID:ID}
                        phoneHistoryLog.pushHistoryLog(obj,historyType,'showSession');

                        //删除元素
                        phoneBuilderTool.showEle(ID,'session');
                    }
                }
            },
            showEle:function(ID,historyType){
                if(historyType==undefined){
                    historyType='default';
                }

                var sessionID=$("#"+ID+".position-box").parents('.ele-session-box').attr("id");
                var handle=this.searchEleHandle(activePage,sessionID);
                for(var i=0;i<handle.length;i++){
                    if(ID==handle[i].ID){
                        //找到元素
                        handle[i].showState=true;

                        var obj={sessionID:sessionID,ID:ID}
                        phoneHistoryLog.pushHistoryLog(obj,historyType,'showEle');
                        //删除元素
                        phoneBuilderTool.showEle(ID,'ele');
                    }
                }
            },
            changeSessionHeight:function(sessionID,height,historyType){
                if(historyType==undefined){
                    historyType='default';
                }
                var handle=this.searchSessionHandle(activePage);
                for(var i=0;i<handle.length;i++){
                    if(sessionID==handle[i].ID){
                        //加入历史纪录
                        var obj={sessionID:sessionID,height:handle[i].style['min-height']};

                        if(historyType == 'retreat' || historyType == 'forward'){
                            builderTool.changeSessionHeight(sessionID,height);
                        }
                        historyLog.pushHistoryLog(obj,historyType,'changeSessionHeight');

                        handle[i].style['min-height']=height;
                        break;
                    }
                }
            },
            changePhoneSessionHeight:function(sessionID,height,historyType){
                if(historyType==undefined){
                    historyType='default';
                }
                var handle=this.searchSessionHandle(activePage);
                for(var i=0;i<handle.length;i++){
                    if(sessionID==handle[i].ID){
                        //加入历史纪录
                        var obj={sessionID:sessionID,height:handle[i].phoneStyle['min-height']};
                        if(historyType == 'retreat' || historyType == 'forward'){
                            builderTool.changeSessionHeight(sessionID,height);
                        }
                        phoneHistoryLog.pushHistoryLog(obj,historyType,'changeSessionHeight');

                        handle[i].phoneStyle['min-height']=height;
                        break;
                    }
                }
            },
            getSessionMinHeight:function(sessionID){
                var handle=this.searchSessionHandle(activePage);
                var minHeight=0;
                for(var i=0;i<handle.length;i++){
                    if(sessionID==handle[i].ID){
                        for(var j=0;j<handle[i].eleList.length;j++){
                            if(j==0){
                                minHeight=parseInt(handle[i].eleList[j].border['min-height'])+parseInt(handle[i].eleList[j].position['top']);
                                continue;
                            }

                            if(minHeight<parseInt(handle[i].eleList[j].border['min-height'])+parseInt(handle[i].eleList[j].position['top'])){
                                minHeight=parseInt(handle[i].eleList[j].border['min-height'])+parseInt(handle[i].eleList[j].position['top']);
                            }
                        }
                        return minHeight;
                    }
                }
            },
            addSession:function(obj,historyType){
                var handle=this.searchSessionHandle(activePage,obj.ID);
                obj.ID=builderTool.createID();

                if(handle.length>obj.deleteIndex){
                    //之前
                    handle.splice(obj.deleteIndex,0,obj);
                }else{
                    //之后
                    handle.push(obj);
                }

                builderTool.addSession(obj);
                historyLog.pushHistoryLog(obj,historyType,'addSession');

            },
            deleteSession:function(ID,historyType){
                if(historyType==undefined){
                    historyType='default';
                }
                var handle=this.searchSessionHandle(activePage,ID);
                for(var i=0;i<handle.length;i++){
                    if(handle[i].ID==ID){
                        var session=handle.splice(i,1)[0];
                        session.deleteIndex=i;
                        builderTool.deleteSession(ID);
                        //加入历史纪录
                        historyLog.pushHistoryLog(session,historyType,'deleteSession');

                        return;
                    }
                }
            },
            searchSessionHandle:function(pageID){
                for(var i=0;i<data.length;i++){
                    if(data[i].ID==pageID){
                        return data[i].sessionList;
                    }
                }
            },
            searchEleHandle:function(pageID,sessionID){
                for(var i=0;i<data.length;i++){
                    if(data[i].ID==pageID){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(sessionID==data[i].sessionList[j].ID){
                                return data[i].sessionList[j].eleList;
                            }
                        }
                    }
                }
            },
            changeSession:function(startSession,endSession,newObj,historyType){
                //获取元素
                var oldEle={};
                for(var i=0;i<data.length;i++){
                    if(data[i].ID==activePage){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(data[i].sessionList[j].ID==startSession){
                                for(var k=0;k<data[i].sessionList[j].eleList.length;k++){
                                    if(data[i].sessionList[j].eleList[k].ID==newObj.ID){
                                        //原数组删除元素
                                        oldEle=data[i].sessionList[j].eleList.splice(k,1)[0];
                                        //加入历史数据
                                        if(historyType == 'retreat' || historyType == 'forward'){
                                            builderTool.updateEle(newObj);
                                            builderTool.justChangeSession(startSession,endSession,newObj);
                                        }else{
                                            builderTool.changeSession(startSession,endSession,newObj);
                                        }
                                        oldEle.changeSession={"startSession":startSession,"endSession":endSession};
                                        historyLog.pushHistoryLog(oldEle,historyType,'changeSession');


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
                for(var i=0;i<data.length;i++){
                    if(data[i].ID==activePage){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(data[i].sessionList[j].ID==endSession){
                                var eleData=builderTool.getEle(newObj.ID,newObj.type);

                                //此处应该调用计算phoneStyle的方法

                                eleData.phoneStyle=oldEle.phoneStyle;
                                eleData.phoneStyle.position.top=eleData.position.top;
                                eleData.phoneStyle.position.left=eleData.position.left;
                                if(oldEle.type=='group'){
                                    for(var k=0;k<oldEle.eleList.length;k++){
                                        eleData.eleList[k].phoneStyle=oldEle.eleList[k].phoneStyle;
                                        eleData.eleList[k].phoneStyle.position.top=eleData.eleList[k].position.top;
                                        eleData.eleList[k].phoneStyle.position.left=eleData.eleList[k].position.left;
                                    }
                                }

                                this.calculateForPhone(eleData);

                                data[i].sessionList[j].eleList.push(eleData);
                                //更改UI
                                builderTool.changeSession(startSession,endSession,newObj);
                                return;
                            }
                        }
                    }
                }
            },
            calculateForUnGroup:function(eleList,scale){
                //手机宽度是280px
                var phoneWidth=280;
                for(var i=0;i<eleList.length;i++){
                    eleList[i].phoneStyle.scale=scale;
                    eleList[i].phoneStyle.position.top=scale;
                }
            },
            calculateForGroup:function(obj){
                //手机宽度是280px
                var phoneWidth=280;
                function calculateEleGroup(obj){
                    var currentHeight=0;
                    var maxWidth=0;
                    var mainScale=obj.phoneStyle.scale;
                    for(var i=0;i<obj.eleList.length;i++){
                        //先清除缩放
                        obj.eleList[i].phoneStyle.scale=1;
                        //先检查元素是否需要缩放
                        width=parseInt(obj.eleList[i].phoneStyle.border.width);
                        if(width>phoneWidth){
                            //需要缩放
                            obj.eleList[i].phoneStyle.scale=(phoneWidth-20)/width;
                        }
                        if(i==0){
                            maxWidth=width*obj.eleList[i].phoneStyle.scale;
                        }
                        if(width*obj.eleList[i].phoneStyle.scale>maxWidth){
                            maxWidth=width*obj.eleList[i].phoneStyle.scale;
                        }
                        //调整top
                        obj.eleList[i].phoneStyle.position.top=currentHeight;
                        obj.eleList[i].phoneStyle.position.left=0;
                        if(obj.eleList[i].type=='group'){
                            currentHeight+=parseInt(obj.eleList[i].phoneStyle.border['min-height']);
                        }else{
                            currentHeight+=parseInt(obj.eleList[i].phoneStyle.border['min-height'])*obj.eleList[i].phoneStyle.scale;
                        }
                    }
                    // currentHeight maxWidth就是组的高和宽
                    obj.phoneStyle.border.width=maxWidth;
                    obj.phoneStyle.border['min-height']=currentHeight;

                    //居中
                    obj.phoneStyle.position.left=(phoneWidth-maxWidth)/2;

                }

                for(var i=0;i<obj.eleList.length;i++){
                    obj.eleList[i].phoneStyle.border.width=obj.eleList[i].border.width;
                    obj.eleList[i].phoneStyle.border['min-height']=obj.eleList[i].border['min-height'];
                }

                var left=parseInt(obj.phoneStyle.position.left);
                var width=parseInt(obj.phoneStyle.border.width);
                if(width*obj.phoneStyle.scale<280){
                    this.calculateForPhone(obj);
                }else{
                    calculateEleGroup(obj);
                }

            },
            calculateForPhone:function(obj){
                //手机宽度是280px
                var phoneWidth=280;

                function calculateEle(obj){
                    var left=parseInt(obj.phoneStyle.position.left);
                    var width=parseInt(obj.phoneStyle.border.width);
                    if(width<phoneWidth){
                        //需要调整位置 居中
                        obj.phoneStyle.position.left=(phoneWidth-width*obj.phoneStyle.scale)/2;
                    }else{
                        //缩放并居中 缩到260px
                        obj.phoneStyle.position.left=10;
                        obj.phoneStyle.scale=(phoneWidth-20)/width;
                        if(obj.type=='image'){
                            obj.phoneStyle.border['width']*=obj.phoneStyle.scale;
                            obj.phoneStyle.border['min-height']*=obj.phoneStyle.scale;
                        }
                    }
                }

                calculateEle(obj);
            },
            groupEle: function (eleList,historyType,originalID) {

                if(historyType==undefined){
                    historyType="default";
                }

                var groupEle=[];
                var par={};
                par.minTop=0;
                par.maxTop=0;
                par.maxLeft=0;
                par.maxLeft=0;

                //计算sessionID
                var sessionID=$("#"+eleList[0].ID+".position-box").parents('.ele-session-box').attr('id');

                for(var i=0;i<data.length;i++){
                    if(data[i].ID==activePage){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(data[i].sessionList[j].ID==sessionID){
                                for(var q=0;q<eleList.length;q++){
                                    if(q==0){
                                        par.minTop=eleList[q].position.top;
                                        par.maxTop=eleList[q].position.top+eleList[q].size.height;
                                        par.minLeft=eleList[q].position.left;
                                        par.maxLeft=eleList[q].position.left+eleList[q].size.width;
                                    }

                                    //计算最大和最小值
                                    if(eleList[q].position.top<par.minTop){
                                        par.minTop=eleList[q].position.top;
                                    }
                                    if(eleList[q].position.top+eleList[q].size.height>par.maxTop){
                                        par.maxTop=eleList[q].position.top+eleList[q].size.height;
                                    }
                                    if(eleList[q].position.left<par.minLeft){
                                        par.minLeft=eleList[q].position.left;
                                    }
                                    if(eleList[q].position.left+eleList[q].size.width>par.maxLeft){
                                        par.maxLeft=eleList[q].position.left+eleList[q].size.width;
                                    }


                                    for(var k=0;k<data[i].sessionList[j].eleList.length;k++){
                                        if(eleList[q].ID==data[i].sessionList[j].eleList[k].ID){
                                            //找到匹配的元素
                                            groupEle.push(data[i].sessionList[j].eleList.splice(k,1)[0]);
                                            break;
                                        }
                                    }

                                    if(q+1>=eleList.length){
                                        //重新计算元素的位置 以及外框的大小 组成新元素

                                        for(var eleListIndex=0;eleListIndex<groupEle.length;eleListIndex++){
                                            groupEle[eleListIndex].position.left= parseInt(groupEle[eleListIndex].position.left)-par.minLeft+"px";
                                            groupEle[eleListIndex].position.top= parseInt(groupEle[eleListIndex].position.top)-par.minTop+"px";

                                            //更新手机的json
                                            groupEle[eleListIndex].phoneStyle.position.left= groupEle[eleListIndex].position.left;
                                            groupEle[eleListIndex].phoneStyle.position.top=groupEle[eleListIndex].position.top;
                                        }
                                        //如果指定了ID 则用指定的ID
                                        var newEle={
                                            "ID":originalID!=undefined ? originalID:builderTool.createID(),
                                            "type": "group",
                                            "style": {},
                                            "position": {
                                                "left": par.minLeft+"px",
                                                "top": par.minTop+"px"
                                            },
                                            "border": {
                                                "width": (par.maxLeft-par.minLeft)+"px",
                                                "min-height": (par.maxTop-par.minTop)+"px"
                                            },
                                            "eleList":groupEle,
                                            "eleTemplateType":"ele-group-default",
                                            "phoneStyle":{
                                                "style": {},
                                                "position": {
                                                    "left": par.minLeft+"px",
                                                    "top": par.minTop+"px"
                                                },
                                                "border": {
                                                    "width": (par.maxLeft-par.minLeft)+"px",
                                                    "min-height": (par.maxTop-par.minTop)+"px"
                                                },
                                                scale:0.7
                                            }
                                        };

                                        //先计算元素是否超过手机的大小，然后缩放元素
                                        this.calculateForGroup(newEle);
                                        data[i].sessionList[j].eleList.push(newEle);
                                        builderTool.groupEle(newEle,sessionID);
                                        //加入历史纪录
                                        historyLog.pushHistoryLog(newEle,historyType,'group');

                                    }
                                }

                                return;
                            }
                        }
                    }
                }
            },
            unGroupEle: function (group,historyType) {
                if(historyType==undefined){
                    historyType="default";
                }
                var sessionID=$("#"+group.ID+".position-box").parents('.ele-session-box').attr('id');
                for(var i=0;i<data.length;i++){
                    if(data[i].ID==activePage){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(data[i].sessionList[j].ID==sessionID){
                                for(var k=0;k<data[i].sessionList[j].eleList.length;k++){
                                    if(group.ID==data[i].sessionList[j].eleList[k].ID){
                                        //找到元素
                                        var eleList=jQuery.extend(true, [], data[i].sessionList[j].eleList[k].eleList);
                                        var groupScale=data[i].sessionList[j].eleList[k].phoneStyle.scale;
                                        //清除组
                                        data[i].sessionList[j].eleList.splice(k,1);
                                        //从页面删除元素
                                        $timeout(function(){
                                            builderTool.deleteEle(group.ID);
                                        });

                                        //把元素重新计算和加入原始数组
                                        this.calculateForUnGroup(eleList,groupScale);
                                        var left=parseInt(group.position.left);
                                        var top=parseInt(group.position.top);
                                        var historyLogEleList=[];

                                        for(var q=0;q<eleList.length;q++){
                                            eleList[q].position.top=parseInt(eleList[q].position.top)+top;
                                            eleList[q].position.left=parseInt(eleList[q].position.left)+left;

                                            data[i].sessionList[j].eleList.push(eleList[q]);
                                            //插入元素
                                            builderTool.addEle(sessionID,eleList[q]);

                                            var historyData={ID:eleList[q].ID,position:{left:parseInt(eleList[q].position.left),top:parseInt(eleList[q].position.top)},size:{width:parseInt(eleList[q].border.width),height:parseInt(eleList[q].border['min-height'])}}
                                            historyLogEleList.push(historyData);
                                        }

                                        //加入历史纪录 利用session这个属性（其实设计很不合理 但是懒得改了）保存原group的ID
                                        var obj={eleList:historyLogEleList,oldID:group.ID}
                                        historyLog.pushHistoryLog(obj,historyType,'unGroup');

                                    }
                                }
                            }
                        }
                    }
                }
            },
            setActivePage:function(id){
                activePage=id;
            },
            getActivePage:function(){
                return activePage;
            },
            getFullDataForCache:function(){
                return fullData;
            },
            getWebsiteData: function () {
                var deferred = $q.defer();

                $http.get("data/data.json").success(function(webData){
                    //这里应该要处理一下json
                    var pageList=webData.pageList;
                    for(var i=0;i<pageList.length;i++){
                        for(var j=0;j<pageList[i].sessionList.length;j++){
                            if(pageList[i].sessionList[j].isPointer=='true'){
                                var target=jQuery.extend(true, [], pageList[i].sessionList[j].target);
                                var targetContent=webData;
                                for(var k=0;k<target.length;k++){
                                    targetContent=targetContent[target[i]];
                                }
                                pageList[i].sessionList[j]=targetContent;
                                break;
                            }
                        }
                    }
                    fullData=webData;
                    data=fullData.pageList;

                    deferred.resolve(data);
                });
                //deferred.notify('即将问候 ' + name + '.');
                //deferred.reject('拒绝问候 ' + name + ' .');

                return deferred.promise;
            },
            addEle:function(pageID,sessionID,obj,scope,type){
                if(type==undefined){
                    type="default";
                }
                for(var i=0;i<data.length;i++){
                    if(data[i].ID===pageID){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            if(data[i].sessionList[j].ID===sessionID){

                                data[i].sessionList[j].eleList.push(obj);
                                //插入在dom上面
                                builderTool.addEle(sessionID,obj,scope);
                                historyLog.pushHistoryLog(obj,type,'add');

                                return;
                            }
                        }
                    }
                }
            },
            getEleForGroup: function (obj,id) {
                if(obj.ID==id){
                    return obj;
                }
                for(var i=0;i<obj.eleList.length;i++){
                    if(obj.eleList[i].ID==id){
                        return obj.eleList[i];
                    }
                    if(obj.eleList[i].type=='group'){
                        var groupSearch=this.getEleForGroup(obj.eleList[i],id);
                        if(groupSearch!=null){
                            return groupSearch;
                        }
                    }
                }
                if(obj.eleList==undefined) {
                    return null;
                }
            },
            getEle: function (pageID,id) {
                for(var i=0;i<data.length;i++){
                    if(data[i].ID===pageID){
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                if (data[i].sessionList[j].eleList[k].ID === id) {
                                    return data[i].sessionList[j].eleList[k];
                                }
                                if(data[i].sessionList[j].eleList[k].type=='group'){
                                    var groupEleData=this.getEleForGroup(data[i].sessionList[j].eleList[k],id);
                                    if(groupEleData!=undefined || groupEleData!=null){
                                        return groupEleData;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            deleteEle:function(pageID,id,type){
                for(var i=0;i<data.length;i++){
                    if(data[i].ID===pageID){
                        for (var j = 0; j < data[i].sessionList.length; j++) {
                            for (var k = 0; k < data[i].sessionList[j].eleList.length; k++) {
                                if (data[i].sessionList[j].eleList[k].ID === id) {
                                    //加入历史纪录
//                                    var obj=data[i].sessionList[j].eleList.splice(k,1);
                                    var copyObj=jQuery.extend(true, {}, data[i].sessionList[j].eleList[k]);
                                    copyObj.sessionId=data[i].sessionList[j].ID;
                                    historyLog.pushHistoryLog(copyObj,type,'delete');

                                    var obj=data[i].sessionList[j].eleList.splice(k,1);
                                    builderTool.deleteEle(id);

                                    return obj;
                                }
                            }
                        }
                    }
                }
            },
            updateEle:function(pageID,eleData,type){
                if(type===undefined){
                    type='default';
                }
                for(var i=0;i<data.length;i++){
                    if(pageID===data[i].ID){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            for(var k=0;k<data[i].sessionList[j].eleList.length;k++){

                                if(data[i].sessionList[j].eleList[k].ID===eleData.ID){
                                    //找到元素 判断元素是否相同
                                    if (_.isEqual(eleData,data[i].sessionList[j].eleList[k]) != true) {
                                        //加入历史记录 判断是否是从历史记录控制器发过来的更新命令
                                        historyLog.pushHistoryLog(jQuery.extend(true, {}, data[i].sessionList[j].eleList[k]),type,'updateEle');
                                        eleData=this.retainPhoneStyle(data[i].sessionList[j].eleList[k],eleData);
                                        eleData.eleTemplateType=data[i].sessionList[j].eleList[k].eleTemplateType;
                                        data[i].sessionList[j].eleList[k]=eleData;
                                    }
                                    return;
                                }

                            }
                        }
                    }
                }
            },
            updatePhoneEle:function(pageID,eleData,type){
                if(type===undefined){
                    type='default';
                }
                for(var i=0;i<data.length;i++){
                    if(pageID===data[i].ID){
                        for(var j=0;j<data[i].sessionList.length;j++){
                            for(var k=0;k<data[i].sessionList[j].eleList.length;k++){
                                if(data[i].sessionList[j].eleList[k].ID===eleData.ID){
                                    //找到元素 判断元素是否相同
                                    if (_.isEqual(eleData,data[i].sessionList[j].eleList[k]) != true) {

                                        //加入历史记录 判断是否是从历史记录控制器发过来的更新命令
                                        phoneHistoryLog.pushHistoryLog(jQuery.extend(true, {}, data[i].sessionList[j].eleList[k]),type,'updatePhoneEle');
                                        this.savePhoneStyle(data[i].sessionList[j].eleList[k],eleData);
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
            },
            savePhoneStyle:function(oldData,newData){
                var phoneStyle=oldData.phoneStyle;
                phoneStyle.position.left=newData.position.left;
                phoneStyle.position.top=newData.position.top;
                phoneStyle.border['width']=newData.border['width'];
                phoneStyle.border['min-height']=newData.border['min-height'];
                phoneStyle.scale=newData.scale;
                if(newData.position['transform']!=undefined){
                    phoneStyle.position['transform']=newData.position['transform'];
                }

                if(newData.type=='group'){
                    oldData.phoneStyle=phoneStyle;
                    for(var i=0;i<newData.eleList.length;i++){
                        this.savePhoneStyle(oldData.eleList[i],newData.eleList[i]);
                    }
                }else{
                    oldData.phoneStyle=phoneStyle;
                }
            },
            retainPhoneStyle:function(oldData,newData){
                if(newData.type=='group'){
                    newData.phoneStyle=oldData.phoneStyle;
                    for(var i=0;i<newData.eleList.length;i++){
                        newData.eleList[i]=this.retainPhoneStyle(oldData.eleList[i],newData.eleList[i]);
                    }
                }else{
                    newData.phoneStyle=oldData.phoneStyle;
                }
                return newData;
            },
            updateSessionBackground:function(){

            },
            getPage:function(ID){
                for(var i=0;i<data.length;i++){
                    if(data[i].ID===ID){
                        return data[i];
                    }
                }
            }
        };
        return handle;
    })
    .factory('historyLog',function(){

        var forward = [];
        var retreat = [];
        var handle = {
            forwardPush: function (obj, type,sessionId) {
                if (type == undefined) {
                    type = "default";
                }
                if (sessionId == undefined) {
                    sessionId = "default";
                }
                //如果数量超过多少则删除一条记录
                var dataObj = {value: obj, type: type ,sessionId:sessionId};
                forward.push(dataObj);
                if (forward.length >= 50) {
                    forward.splice(0, 1);
                }
            },
            pushHistoryLog:function(obj,historyType,operation){
                /*
                用于插入历史纪录
                参数:
                * */
                if (historyType != 'retreat' && historyType != 'forward') {
                    this.retreatPush(obj, operation);
                    this.clearForward();
                }
                if (historyType == 'retreat') {
                    //当前状态入前进栈
                    this.forwardPush(obj, operation);
                }
                if (historyType == 'forward') {
                    //当前状态入后退
                    this.retreatPush(obj, operation);
                }
             },
            forwardPop: function () {
                var pop = forward.pop();
                return pop;
            },
            retreatPush: function (obj, type,sessionId) {
                if (type == undefined) {
                    type = "default";
                }
                if(sessionId==undefined){
                    sessionId = "default";
                }

                var dataObj = { value: obj, type: type, sessionId:sessionId}
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
    .factory('phoneHistoryLog',function(){

        var forward = [];
        var retreat = [];
        var handle = {
            forwardPush: function (obj, type,sessionId) {
                if (type == undefined) {
                    type = "default";
                }
                if (sessionId == undefined) {
                    sessionId = "default";
                }
                //如果数量超过多少则删除一条记录
                var dataObj = {value: obj, type: type ,sessionId:sessionId};
                forward.push(dataObj);
                if (forward.length >= 50) {
                    forward.splice(0, 1);
                }
            },
            pushHistoryLog:function(obj,historyType,operation){
                /*
                 用于插入历史纪录
                 参数:
                 * */
                if (historyType != 'retreat' && historyType != 'forward') {
                    this.retreatPush(obj, operation);
                    this.clearForward();
                }
                if (historyType == 'retreat') {
                    //当前状态入前进栈
                    this.forwardPush(obj, operation);
                }
                if (historyType == 'forward') {
                    //当前状态入后退
                    this.retreatPush(obj, operation);
                }
            },
            forwardPop: function () {
                var pop = forward.pop();
                return pop;
            },
            retreatPush: function (obj, type,sessionId) {
                if (type == undefined) {
                    type = "default";
                }
                if(sessionId==undefined){
                    sessionId = "default";
                }

                var dataObj = { value: obj, type: type, sessionId:sessionId}
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
    .factory('shearPlate',function(){
        var data = {
            type: "",
            pageID: "",
            value: null
        };
        var handle = {
            setData: function (type, pageID, value) {
                data.type = type;
                data.pageID = pageID;
                data.value = value;
            },
            getData: function () {
                var returnData = jQuery.extend(true, {}, data);
                if (data.type == 'cut') {
                    data.type = "";
                    data.value = null;
                    data.ID = "";
                } else {
                }
                return returnData;
            },
            getHandle:function(){
                return data;
            }
        };
        return handle;
    })
    .factory('builderTool',function(creatorServices,$compile,$timeout){

        var data=[];
        var createScope=null;

        var cursorList=["nw-resize","n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize"];

        var handle={
            init:function(data){
                createScope=data;
            },
            reviseRotateCss:function(angle,ID){
                var excursion=parseInt(angle/45);
                var ele=$("#"+ID+".position-box");
                ele.find(" >.left-top").css("cursor",cursorList[(0+excursion)%8]);
                ele.find(" >.only-top").css("cursor",cursorList[(1+excursion)%8]);
                ele.find(" >.right-top").css("cursor",cursorList[(2+excursion)%8]);
                ele.find(" >.only-right").css("cursor",cursorList[(3+excursion)%8]);
                ele.find(" >.right-bottom").css("cursor",cursorList[(4+excursion)%8]);
                ele.find(" >.only-bottom").css("cursor",cursorList[(5+excursion)%8]);
                ele.find(" >.left-bottom").css("cursor",cursorList[(6+excursion)%8]);
                ele.find(" >.only-left").css("cursor",cursorList[(7+excursion)%8]);
            },
            changeSessionHeight:function(sessionID,height){
                $("#"+sessionID+".ele-session-box").css('min-height',height);
            },
            addSession:function(obj){
                var dom=creatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);
                var sessionList=$(".edit-space .ele-session-box");
                if(sessionList.length>obj.deleteIndex){
                    sessionList.eq(obj.deleteIndex).before(dom);
                }else{
                    sessionList.eq(sessionList.length-1).after(dom);
                }
            },
            deleteSession:function(ID){
                $("#"+ID+".ele-session-box").remove();
                $(".tooltip.tooltip--is-active").remove();
            },
            createID:function(){
                return _.uniqueId("ele"+_.now());
            },
            groupEle:function(ele,sessionID){
                //删除原先的元素 重新创建一个group元素

                for(var i=0;i<ele.eleList.length;i++){
                    $("#"+ele.eleList[i].ID+".position-box").remove();
                }

                var dom=creatorServices.createEle(ele);
                dom = $compile(dom.get(0))(createScope);
                $("#"+sessionID+".ele-session-box .ele-session").append(dom);
                $timeout(function(){
                    dom.find('>.ele-box >.group-over').trigger("mousedown");
                    $(document).trigger("mouseup");
                });
            },
            changeSession:function(startSession,endSession,obj){
                var ele=$("#"+startSession+" #"+obj.ID).detach();
                $("#"+endSession+" .ele-session").append(ele);
                var top=0;
                var currentTop=parseInt(obj.position.top);

                var startSessionDom=$("#"+startSession+".ele-session-box");
                var endSessionDom=$("#"+endSession+".ele-session-box");

                if(currentTop<0){
                    top=startSessionDom.offset().top-endSessionDom.offset().top;
                    top=top+currentTop;
                }else{
                    top=currentTop-(endSessionDom.offset().top-startSessionDom.offset().top);
                }
                ele.css("top",top+"px");
            },
            justChangeSession:function(startSession,endSession,obj){
                var ele=$("#"+startSession+" #"+obj.ID).detach();
                $("#"+endSession+" .ele-session").append(ele);
            },
            refreshPage:function(data,scope){
                var page=$("#edit-space");
                page.empty();
                page.append(creatorServices.createPage(data.sessionList,scope));
            },
            updateEle:function(eleData){
                switch (eleData.type){
                    case "text":this.updateEleText(eleData);break;
                    case "image":this.updateEleImage(eleData);break;
                    case "menu":this.updateEleMenu(eleData);break;
                    case "group":this.updateEleGroup(eleData);break;
                }
            },
            deleteEle:function(id){
                $("#"+id+".position-box").remove();
            },
            addEle:function(sessionID,obj){
                var dom=creatorServices.createEle(obj);
                dom = $compile(dom.get(0))(createScope);
                $("#"+sessionID+".ele-session-box .ele-session").append(dom);
            },
            getEle:function(ID,type){

                var eleData={};

                switch (type){
                    case "text":eleData=this.getEleText(ID);break;
                    case "image":eleData=this.getEleImage(ID);break;
                    case "menu":eleData=this.getEleMenu(ID);break;
                    case "group":eleData=this.getEleGroup(ID);break;
                }

                return eleData;
            },
            resolveStyle:function(string){
                if(string==undefined){
                    return {};
                }else{
                    var style=string.replace(/\s/g, "").split(";");
                    var styleObj={};
                    for(var i=0;i<style.length;i++){
                        var itemStyle=style[i].split(":");
                        styleObj[itemStyle[0]]=itemStyle[1];
                    }
                    return styleObj;
                }
            },
            getEleText:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="text";
                eleData.textValue=dom.find('.ele .ql-editor').get(0).innerHTML;

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));

                return eleData;
            },
            getEleImage:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");
                eleData.ID=ID;
                eleData.type="image";

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));
                eleData.url=styleDom.css("background-image");
                eleData.url=eleData.url.substring(5,eleData.url.length-2);
                return eleData;
            },
            getEleMenu:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="menu";

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));
                //读取item
                eleData.item=[];
                styleDom=styleDom.find(".menu-item");
                for(var i=0;i<styleDom.length;i++){
                    eleData.item.push({ID:styleDom.eq(i).attr("id"),name:styleDom.get(i).textContent})
                }
                return eleData;
            },
            getEleGroup:function(ID){
                //按照结构来获取数据
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="group";
                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));

                var eleList=dom.find(">.ele-box >.ele >.position-box");
                var eleListData=[];
                for(var i=0;i<eleList.length;i++){
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'),eleList.eq(i).attr('ele-type')));
                }

                eleData.eleList=eleListData;

                return eleData;
            },
            updateEleText:function(eleData){
                //更新样式
                var dom=$("#"+eleData.ID+".position-box");
                dom.get(0).style="";
                $.each(eleData.position,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele-box");
                dom.get(0).style="";
                $.each(eleData.border,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele");
                //保留margintop 属性
                var marginTop=dom.css("margin-top");
                dom.get(0).style="";
                dom.css("margin-top",marginTop);
                $.each(eleData.style,function(index,value){
                    dom.css(index,value);
                });
                //更新文字内容
                if(eleData.textValue!==dom.find(".ql-editor").html()){
                    dom.find(".ql-editor").html(eleData.textValue);
                }
            },
            updateEleImage:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                dom.get(0).style="";
                $.each(eleData.position,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele-box");
                dom.get(0).style="";
                $.each(eleData.border,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele");
                var marginTop=dom.css("margin-top");
                dom.get(0).style="";
                dom.css("margin-top",marginTop);
                $.each(eleData.style,function(index,value){
                    dom.css(index,value);
                });
                dom.css("background-image","url(\'"+eleData.url+"\')");
                dom.src=eleData.url;
            },
            updateEleMenu:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                dom.get(0).style="";
                $.each(eleData.position,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele-box");
                dom.get(0).style="";
                $.each(eleData.border,function(index,value){
                    dom.css(index,value);
                });
                dom=dom.find(".ele");
                var marginTop=dom.css("margin-top");
                dom.get(0).style="";
                dom.css("margin-top",marginTop);
                $.each(eleData.style,function(index,value){
                    dom.css(index,value);
                });

                //更新item
                dom.empty();
                for(var i=0;i<eleData.item.length;i++){
                    var domItem=$("<div class='menu-item' id="+eleData.item[i].ID+">"+eleData.item[i].name+"</div>");
                    domItem.css({"width":(100/eleData.item.length).toFixed(2)+"%","float":"left"});
                    dom.append(domItem);
                }
            },
            updateEleGroup:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                dom.get(0).style="";
                $.each(eleData.position,function(index,value){
                    dom.css(index,value);
                });
                var domBorder=dom.find("> .ele-box");
                domBorder.get(0).style="";
                var borderWidth=0;
                var borderHeight=0;
                $.each(eleData.border,function(index,value){
                    if(index=='min-height'){
                        borderHeight=parseInt(value);
                    }
                    if(index=='width'){
                        borderWidth=parseInt(value);
                    }
                    domBorder.css(index,value);
                });
                var eleDom=domBorder.find("> .ele");
                eleDom.get(0).style="";

//                eleDom.css('height', borderHeight);
//                eleDom.css('margin-top', -parseInt(borderHeight)/2+"px");
//                eleDom.css('width', borderWidth);
//                eleDom.css('margin-left', -parseInt(borderWidth)/2+"px");

                $.each(eleData.style,function(index,value){
                    eleDom.css(index,value);
                });
                for(var i=0;i<eleData.eleList.length;i++){
                    this.updateEle(eleData.eleList[i]);
                }
            },
            updateSessionBackground:function(){}
        };

        return handle;
    })
    .factory('phoneBuilderTool',function(phoneCreatorServices,$compile,$timeout){

        var data=[];
        var createScope=null;

        var handle={
            init:function(data){
                createScope=data;
            },
            addEle:function(sessionID,obj){
                var dom=phoneCreatorServices.createEle(obj);
                dom = $compile(dom.get(0))(createScope);
                if(obj.showState==false){
                    dom.css("display",'none');
                }
                $("#"+sessionID+".ele-session-box").append(dom);
            },
            hideEle:function(ID,type){
                if(type=='session'){
                    $("#"+ID+".ele-session-box").hide();
                }
                if(type=='ele'){
                    $("#"+ID+".position-box").hide();
                }
            },
            showEle:function(ID,type){
                if(type=='session'){
                    $("#"+ID+".ele-session-box").show();
                }
                if(type=='ele'){
                    $("#"+ID+".position-box").show();
                }
            },
            moveEle: function (ID,direction,value) {
                var dom=$("#"+ID+".position-box");
                if(direction=='top'){
                    var cTop=dom.css('top');
                    dom.css('top',parseInt(cTop)+value);
                }
                if(direction=='left'){
                    var cLeft=dom.css('left');
                    dom.css('left',parseInt(cLeft)+value);
                }
            },
            changeSessionHeight:function(sessionID,height){
                $("#"+sessionID+".ele-session-box").css('min-height',height);
            },
            addSession:function(obj){
                var dom=phoneCreatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);
                var sessionList=$(".ele-session-box");
                if(sessionList.length>obj.deleteIndex){
                    $(".ele-session-box").eq(obj.deleteIndex).before(dom);
                }else{
                    $(".ele-session-box").eq(sessionList.length-1).after(dom);
                }
            },
            deleteSession:function(ID){
                $("#"+ID+".ele-session-box").remove();
                $(".tooltip.tooltip--is-active").remove();
            },
            createID:function(){
                return _.uniqueId("ele"+_.now());
            },
            refreshPage:function(data,scope){
                var page=$("#phone-edit-space");
                page.empty();
                page.append(phoneCreatorServices.createPage(data.sessionList,scope));
            },
            updateEle:function(eleData){
                switch (eleData.type){
                    case "text":this.updateEleText(eleData);break;
                    case "image":this.updateEleImage(eleData);break;
                    case "menu":this.updateEleMenu(eleData);break;
                    case "group":this.updateEleGroup(eleData);break;
                }
            },
            deleteEle:function(id){
                $("#"+id+".position-box").remove();
            },
            getEle:function(ID,type){
                var eleData={};
                switch (type){
                    case "text":eleData=this.getEleText(ID);break;
                    case "image":eleData=this.getEleImage(ID);break;
                    case "menu":eleData=this.getEleMenu(ID);break;
                    case "group":eleData=this.getEleGroup(ID);break;
                }

                return eleData;
            },
            resolveStyle:function(string){
                if(string==undefined){
                    return {};
                }else{
                    var style=string.replace(/\s/g, "").split(";");
                    var styleObj={};
                    for(var i=0;i<style.length;i++){
                        var itemStyle=style[i].split(":");
                        styleObj[itemStyle[0]]=itemStyle[1];
                    }
                    return styleObj;
                }
            },
            getEleText:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="text";
                eleData.textValue=dom.find('.ele').get(0).innerHTML;

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                var styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));

                //获取缩放比例
                eleData.scale=dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
//                eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
//                eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            getEleImage:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="image";

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                var styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));
                eleData.url=styleDom.css("background-image");
                eleData.url=eleData.url.substring(5,eleData.url.length-2);

                //获取缩放比例
                eleData.scale=dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                eleData.border.width=parseInt(eleData.border.width)/eleData.scale;
                eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;
//
//                console.log(eleData.border);

                return eleData;
            },
            getEleMenu:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="menu";

                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                var styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));
                //读取item
                eleData.item=[];
                styleDom=styleDom.find(".menu-item");
                for(var i=0;i<styleDom.length;i++){
                    eleData.item.push({ID:styleDom.eq(i).attr("id"),name:styleDom.get(i).textContent})
                }

                //获取缩放比例
                eleData.scale=dom.attr('scale');

                return eleData;
            },
            getEleGroup:function(ID){
                var eleData={};
                var dom=$("#"+ID+".position-box");

                eleData.ID=ID;
                eleData.type="group";
                eleData.position=this.resolveStyle(dom.attr("style"));
                var styleDom=dom.find(".ele-box");
                eleData.border=this.resolveStyle(styleDom.attr("style"));
                var styleDom=dom.find(".ele");
                eleData.style=this.resolveStyle(styleDom.attr("style"));


                var eleList=dom.find(">.ele-box >.ele >.position-box");
                var eleListData=[];
                for(var i=0;i<eleList.length;i++){
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'),eleList.eq(i).attr('ele-type')));
                }

                eleData.eleList=eleListData;

                //获取缩放比例
                eleData.scale=dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
//                eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
//                eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            updateEleText:function(eleData){
                //更新样式
                var dom=$("#"+eleData.ID+".position-box");
                $.each(eleData.phoneStyle.position,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele-box");
                $.each(eleData.phoneStyle.border,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele");
                $.each(eleData.phoneStyle.style,function(index,value){
                    dom.css(index,value);
                });
            },
            updateEleImage:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                $.each(eleData.phoneStyle.position,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele-box");
                $.each(eleData.phoneStyle.border,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele");
                $.each(eleData.phoneStyle.style,function(index,value){
                    dom.css(index,value);
                });
            },
            updateEleMenu:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                $.each(eleData.phoneStyle.position,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele-box");
                $.each(eleData.phoneStyle.border,function(index,value){
                    dom.css(index,value);
                });

                dom=dom.find(".ele");
                $.each(eleData.phoneStyle.style,function(index,value){
                    dom.css(index,value);
                });

            },
            updateEleGroup:function(eleData){
                var dom=$("#"+eleData.ID+".position-box");
                $.each(eleData.phoneStyle.position,function(index,value){
                    dom.css(index,value);
                });

                var domBorder=dom.find("> .ele-box");
                $.each(eleData.phoneStyle.border,function(index,value){
                    dom.css(index,value);
                });
                var eleDom=domBorder.find("> .ele");
                $.each(eleData.phoneStyle.style,function(index,value){
                    dom.css(index,value);
                });

                for(var i=0;i<eleData.eleList.length;i++){
                    this.updateEle(eleData.eleList[i]);
                }
            }
        };

        return handle;
    })
    .factory('creatorServices', function ($compile) {
        var handle = {
            createPage:function(data,scope){
                var dom=$('<div></div>');
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
                var dom = "<div "+data.eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom=$(dom);
                return dom;
            },
            createEle:function(data){
                var dom=null;
                switch (data.type){
                    case "text":dom=this.createText(data);break;
                    case "image":dom=this.createImage(data);break;
                    case "menu":dom=this.createMenu(data);break;
                    case "group":dom=this.createGroup(data);break;
                }
                return dom;
            },
            createText: function (data) {
                var dom = "<div "+data.eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom = $(dom);
                return dom;
            },
            createGroup: function (data) {
                var dom = "<div "+data.eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom = $(dom);
                return dom;
            },
            createImage: function (data) {
                var dom = "<div "+data.eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom = $(dom);
                return dom;
            },
            createMenu:function(data){
                var dom = "<div "+data.eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom = $(dom);
                return dom;
            }
        };
        return handle;
    })
    .factory('phoneCreatorServices', function ($compile) {
        var handle = {
            createPage:function(data,scope){
                var dom=$('<div></div>');
                var sessionDom = "";
                var sessionList = data.sessionList;
                for (var i = 0; i < sessionList.length; i++) {
                    sessionDom = this.createSession(sessionList[i]);
                    sessionDom = $compile(sessionDom.get(0))(scope);
                    dom.append(sessionDom);
                    if(sessionList[i].showState==false){
                        sessionDom.css('display','none');
                    }
                }
                return dom;
            },
            createSession: function (data) {
                var dom = "<div "+data.eleTemplateType+"-phone"+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom=$(dom);
                return dom;
            },
            createEle:function(data){
                var dom=null;
                switch (data.type){
                    case "text":dom=this.createText(data);break;
                    case "image":dom=this.createImage(data);break;
                    case "menu":dom=this.createMenu(data);break;
                    case "group":dom=this.createGroup(data);break;
                }
                return dom;
            },
            createText: function (data) {
                var eleTemplateType=data.eleTemplateType+"-phone";

                var dom = "<div "+eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom=$(dom);
                return dom;
            },
            scaleText:function(string,scale){
                if(scale==undefined || scale==null){
                    scale=1;
                }
                var scaleString="";
                while(string.indexOf("font-size:")!=-1){
                    scaleString+=string.substring(0,string.indexOf("font-size:")+10);
                    string=string.substring(string.indexOf("font-size:")+10,string.length);
                    var textSize=string.substring(0,string.indexOf(";"));
                    scaleString+=parseInt(textSize)*scale+"px";
                    string=string.substring(string.indexOf(";"),string.length);
                }
                scaleString+=string;
                return scaleString;
            },
            createGroup: function (data) {
                var eleTemplateType=data.eleTemplateType+"-phone";

                var dom = "<div "+eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";

                dom = $(dom);
                return dom;
            },
            createImage: function (data) {
                var eleTemplateType=data.eleTemplateType+"-phone";

                var dom = "<div "+eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";

                dom = $(dom);
                return dom;
            },
            createMenu:function(data){
                var eleTemplateType=data.eleTemplateType+"-phone";

                var dom = "<div "+eleTemplateType+" ele-config=\'"+JSON.stringify(data)+"\'></div>";
                dom = $(dom);
                return dom;
            }
        };
        return handle;
    })
    .factory('fontList', function () {
        var data={
            en:["Candara","Helvetica"],
            cn:["微软雅黑","华文细黑"]
        };

        var handle={
            getList:function(type){
                return data[type];
            }
        };
        return handle;
    })
    .factory('changeSessionTool', function (builderTool,websiteData) {
        var parameter={};
        parameter.currentSession={};
        parameter.sessionHeight=[];
        parameter.eleCenterY=0;

        var handle={
            init:function(sessionID,centerY){
                parameter.eleCenterY=centerY;
                parameter.sessionHeight=[];
                //获取当前session和session的高度
                parameter.currentSession.ID=sessionID;
                var sessionList=$("#edit-space .ele-session-box");
                for(var i=0;i<sessionList.length;i++){
                    var obj={};
                    obj.ID=sessionList.eq(i).attr('id');
                    obj.height=sessionList.get(i).offsetHeight;
                    parameter.sessionHeight.push(obj);
                    if(obj.ID==parameter.currentSession.ID){
                        parameter.currentSession.index=i;
                        parameter.currentSession.height=obj.height;
                    }
                }
            },
            moveCheck:function(offsetY){

                if(offsetY<-parameter.eleCenterY){
                    var unActiveSession=[];
                    var sessionHeight=0;
                    for(var i=parameter.currentSession.index-1;i>=0;i--){
                        sessionHeight+=parameter.sessionHeight[i].height;
                        if(Math.abs(offsetY)<sessionHeight+parameter.eleCenterY){
                            //重置
                            $(".ele-session-box .over-shadow").css("display","none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState=true;
                            parameter.targetSession=parameter.sessionHeight[i].ID;
                            unActiveSession=$(".ele-session-box[id!="+parameter.sessionHeight[i].ID+"] .over-shadow");
                            unActiveSession.css("display","block");
                            break;
                        }
                    }
                }
                if(offsetY>parameter.currentSession.height-parameter.eleCenterY){
                    //向下
                    var unActiveSession=[];
                    var sessionHeight=0;
                    for(var i=parameter.currentSession.index;i<parameter.sessionHeight.length;i++){
                        if(parameter.sessionHeight[i+1]==undefined){return;}
                        sessionHeight+=parameter.sessionHeight[i].height;
                        if(Math.abs(offsetY)>sessionHeight-parameter.eleCenterY){
                            $(".ele-session-box .over-shadow").css("display","none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState=true;
                            parameter.targetSession=parameter.sessionHeight[i+1].ID;
                            unActiveSession=$(".ele-session-box[id!="+parameter.targetSession+"] .over-shadow");
                            unActiveSession.css("display","block");
                        }
                    }
                }
                if(offsetY>=-parameter.eleCenterY && offsetY<=parameter.currentSession.height-parameter.eleCenterY){
                    $(".ele-session-box .over-shadow").css("display","none");
                    parameter.changeSessionState=false;
                }
            },
            overCheck:function(ele){
                $(".ele-session-box .over-shadow").css("display","none");
                if(parameter.changeSessionState){
                    //切换session操作
                    for(var i=0;i<ele.length;i++){
                        websiteData.changeSession(parameter.currentSession.ID,parameter.targetSession,builderTool.getEle(ele[i].ID,ele[i].type));
                    }

                    return parameter.targetSession;
                }else{
                    for(var i=0;i<ele.length;i++){
                        var eleData=builderTool.getEle(ele[i].ID,ele[i].type);
                        websiteData.updateEle(websiteData.getActivePage(),eleData);
                    }
                    return false;
                }
            }
        };
        return handle;
    })
    .factory('changeSessionToolForMultiple', function (builderTool,websiteData) {
        var parameter={};
        parameter.currentSession={};
        parameter.sessionHeight=[];
        parameter.eleCenterY=0;

        var handle={
            init:function(sessionID,centerY){
                parameter.eleCenterY=centerY;
                parameter.sessionHeight=[];
                //获取当前session和session的高度
                parameter.currentSession.ID=sessionID;
                var sessionList=$("#edit-space .ele-session-box");
                for(var i=0;i<sessionList.length;i++){
                    var obj={};
                    obj.ID=sessionList.eq(i).attr('id');
                    obj.height=sessionList.get(i).offsetHeight;
                    parameter.sessionHeight.push(obj);
                    if(obj.ID==parameter.currentSession.ID){
                        parameter.currentSession.index=i;
                        parameter.currentSession.height=obj.height;
                    }
                }
            },
            moveCheck:function(offsetY){
                if(offsetY<-parameter.eleCenterY){
                    var unActiveSession=[];
                    var sessionHeight=0;
                    for(var i=parameter.currentSession.index-1;i>=0;i--){
                        sessionHeight+=parameter.sessionHeight[i].height;
                        if(Math.abs(offsetY)<sessionHeight+parameter.eleCenterY){
                            //重置
                            $(".ele-session-box .over-shadow").css("display","none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState=true;
                            parameter.targetSession=parameter.sessionHeight[i].ID;
                            unActiveSession=$(".ele-session-box[id!="+parameter.sessionHeight[i].ID+"] .over-shadow");
                            unActiveSession.css("display","block");
                            break;
                        }
                    }
                }
                if(offsetY>parameter.currentSession.height-parameter.eleCenterY){
                    //向下
                    var unActiveSession=[];
                    var sessionHeight=0;
                    for(var i=parameter.currentSession.index;i<parameter.sessionHeight.length;i++){
                        if(parameter.sessionHeight[i+1]==undefined){return;}
                        sessionHeight+=parameter.sessionHeight[i].height;
                        if(Math.abs(offsetY)>sessionHeight-parameter.eleCenterY){
                            $(".ele-session-box .over-shadow").css("display","none");
                            //越过上边界 i 为新的session 此时把周围的session都变灰色
                            parameter.changeSessionState=true;
                            parameter.targetSession=parameter.sessionHeight[i+1].ID;
                            unActiveSession=$(".ele-session-box[id!="+parameter.targetSession+"] .over-shadow");
                            unActiveSession.css("display","block");
                        }
                    }
                }
                if(offsetY>=-parameter.eleCenterY && offsetY<=parameter.currentSession.height-parameter.eleCenterY){
                    $(".ele-session-box .over-shadow").css("display","none");
                    parameter.changeSessionState=false;
                }
            },
            overCheck:function(ele){
                $(".ele-session-box .over-shadow").css("display","none");
                if(parameter.changeSessionState){
                    //切换session操作
                    for(var i=0;i<ele.length;i++){
                        websiteData.changeSession(parameter.currentSession.ID,parameter.targetSession,builderTool.getEle(ele[i].ID,ele[i].type));
                    }

                    return parameter.targetSession;
                }else{
                    for(var i=0;i<ele.length;i++){
                        var eleData=builderTool.getEle(ele[i].ID,ele[i].type);
                        websiteData.updateEle(websiteData.getActivePage(),eleData);
                    }
                    return false;
                }
            }
        };
        return handle;
    })
    .factory('activeEleService', function () {
        var data={ID:"ele",value:{}};
        var handle={
            getEle:function(){
                return data;
            },
            setEle:function(data){
                data.value=data;
            },
            clear:function(){
                data.value={};
            }
        };
        return handle;
    })
    .factory('activeSessionService', function () {
        var data={ID:"session",value:{}};
        var handle={
            getSession:function(){
                return data;
            },
            setSession:function(session){
                data.value=session;
            },
            check:function(session){
                if(session!=data.value){
                    return data.value;
                }else{
                    return false;
                }
            }
        };
        return handle;
    })
    .factory('rotateEleCalculate', function () {
        var handle={
            getSizeAndPosition:function(left,top,width,height,rotate){
                /*
                * 获取真实的高度和位置
                * */
                var obj={left:0,top:0,width:0,height:0};

                obj.width=Math.abs(Math.cos(rotate*Math.PI/180))*width+Math.abs(Math.sin(rotate*Math.PI/180))*height;
                obj.height=Math.abs(Math.sin(rotate*Math.PI/180))*width+Math.abs(Math.cos(rotate*Math.PI/180))*height;

                obj.left=left+(width-obj.width)/2;
                obj.top=top+(height-obj.height)/2;

                obj.originalLeft=left;
                obj.originalTop=top;

                return obj;
            },
            getRotate:function(element){
                var rotateText=$(element).css("transform");
                var rotate=0;
                if(rotateText=="none"){
                    rotate=0;
                }else{
                    rotateText=rotateText.substring(7,rotateText.length-1);
                    rotate=Math.acos(parseFloat(rotateText.split(",")[0]))*180/Math.PI;
                    if(parseFloat(rotateText.split(",")[1])<0){
                        rotate=360-rotate;
                    }
                }

                return rotate;

            }
        };
        return handle;
    })
;
