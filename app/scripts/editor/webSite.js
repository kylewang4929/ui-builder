"use strict";
angular.module('webSiteEditor',['creator','kyle.imageCrop'])
    .factory('builderTool', function (creatorServices, $compile, $timeout,$rootScope,imageCropService) {
        var data = [];
        var createScope = null;

        var cursorList = ["nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize"];
        var handle = {
            init: function (data) {
                createScope = data;
            },
            reviseRotateCss: function (angle, ID) {
                var excursion = parseInt(angle / 45);
                var ele = $("#" + ID + ".position-box");
                ele.find(" >.left-top").css("cursor", cursorList[(0 + excursion) % 8]);
                ele.find(" >.only-top").css("cursor", cursorList[(1 + excursion) % 8]);
                ele.find(" >.right-top").css("cursor", cursorList[(2 + excursion) % 8]);
                ele.find(" >.only-right").css("cursor", cursorList[(3 + excursion) % 8]);
                ele.find(" >.right-bottom").css("cursor", cursorList[(4 + excursion) % 8]);
                ele.find(" >.only-bottom").css("cursor", cursorList[(5 + excursion) % 8]);
                ele.find(" >.left-bottom").css("cursor", cursorList[(6 + excursion) % 8]);
                ele.find(" >.only-left").css("cursor", cursorList[(7 + excursion) % 8]);
            },
            changeSessionHeight: function (sessionID, height) {
                $("#" + sessionID + ".ele-session-box").css('min-height', height);
            },
            addSession: function (obj,index,option) {

                if(option===undefined){
                    option = {isShow : true};
                }

                var dom = creatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);

                if(!option.isShow){
                    dom.height(0);
                }

                var sessionList = $(".edit-space .ele-session-box-container");
                if (sessionList.length > index) {
                    sessionList.eq(index).before(dom);
                } else {
                    sessionList.eq(sessionList.length - 1).after(dom);
                }
                return dom;
            },
            deleteSession: function (ID) {
                $("#" + ID + ".ele-session-box").parent('.ele-session-box-container').remove();
                $(".tooltip.tooltip--is-active").remove();
            },
            createID: function () {
                return _.uniqueId("ele" + _.now());
            },
            groupEle: function (ele, sessionID) {
                //删除原先的元素 重新创建一个group元素

                for (var i = 0; i < ele.eleList.length; i++) {
                    $("#" + ele.eleList[i].ID + ".position-box").remove();
                }

                var dom = creatorServices.createEle(ele);
                dom = $compile(dom.get(0))(createScope);
                $("#" + sessionID + ".ele-session-box .ele-session").append(dom);
                $timeout(function () {
                    dom.find('>.position-box >.ele-box >.group-over').trigger("mousedown");
                    $(document).trigger("mouseup");
                });
            },
            changeEleId:function(ele){
                ele.ID = handle.createID();
                if(ele.type == 'group'){
                    angular.forEach(ele.eleList,function(obj,index){
                        handle.changeEleId(ele.eleList[index]);
                    });
                }
                return ele;
            },
            changeSession: function (startSession, endSession, obj) {
                var ele = $("#" + startSession + " #" + obj.ID).detach();
                $("#" + endSession + " .ele-session").append(ele);
                var top = 0;
                var currentTop = parseInt(obj.position.top);

                var startSessionDom = $("#" + startSession + ".ele-session-box");
                var endSessionDom = $("#" + endSession + ".ele-session-box");

                if (currentTop < 0) {
                    top = startSessionDom.offset().top - endSessionDom.offset().top;
                    top = top + currentTop;
                } else {
                    top = currentTop - (endSessionDom.offset().top - startSessionDom.offset().top);
                }
                ele.css("top", top + "px");
            },
            justChangeSession: function (startSession, endSession, obj) {
                var ele = $("#" + startSession + " #" + obj.ID).detach();
                $("#" + endSession + " .ele-session").append(ele);
            },
            refreshPage: function (data, scope) {
                var page = $("#edit-space");
                page.empty();
                page.append(creatorServices.createPage(data.sessionList, scope));
            },
            updateEle: function (eleData) {
                
                $("#"+eleData.ID).parent().get(0).eleConfig=eleData;
                
                switch (eleData.type) {
                    case "text": this.updateEleText(eleData); break;
                    case "image": this.updateEleImage(eleData); break;
                    case "menu": this.updateEleMenu(eleData); break;
                    case "group": this.updateEleGroup(eleData); break;
                }
                $rootScope.$emit("updateEle");
                
            },
            deleteEle: function (id) {
                $("#" + id + ".position-box").remove();
                $rootScope.$emit("deleteEle");                
            },
            addEle: function (sessionID, obj) {
                var dom = creatorServices.createEle(obj);
                dom = $compile(dom.get(0))(createScope);
                $("#" + sessionID + ".ele-session-box .ele-session").append(dom);
                return dom;
            },
            getEle: function (ID, type) {

                var eleData = {};

                switch (type) {
                    case "text": eleData = this.getEleText(ID); break;
                    case "image": eleData = this.getEleImage(ID); break;
                    case "menu": eleData = this.getEleMenu(ID); break;
                    case "group": eleData = this.getEleGroup(ID); break;
                }
                return eleData;
            },
            resolveStyle: function (dom) {
                var style={};
                
                angular.forEach(dom.style,function(obj,index){
                    style[obj]=$(dom).css(obj);
                });
                
                return style;
            },
            /**
             * 获取默认的样式信息
             * position、border、style和eleTemplateType
             */
            getEleDefaultStyle : function(dom,eleData){
                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                eleData.eleTemplateType = dom.parent().attr("template-type");
                return eleData;
            },
            getEleText: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "text";
                eleData.textValue = dom.find('.ele .ql-editor').get(0).innerHTML;

                //获取默认样式
                this.getEleDefaultStyle(dom,eleData);

                return eleData;
            },
            getEleImage: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");
                var styleDom = dom.find(".ele");                
                eleData.backgroundSize=dom.attr('background-size');
                
                eleData.ID = ID;
                eleData.type = "image";

                //获取默认样式
                var defaultStyle = this.getEleDefaultStyle(dom,eleData);
                
                styleDom = dom.find(".ele");
                eleData.url = styleDom.attr("src");
                
                //计算图片的原始大小 以及图片的缩放比例
                var img=document.createElement('img');
                img.src=eleData.url;
                return eleData;
            },
            getEleMenu: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "menu";

                //获取默认样式
                var defaultStyle = this.getEleDefaultStyle(dom,eleData);

                //读取item
                eleData.item = [];
                var itemList = dom.find(".menu-item");
                for (var i = 0; i < itemList.length; i++) {
                    eleData.item.push({ ID: itemList.eq(i).attr("id"), name: itemList.get(i).textContent });
                }
                return eleData;
            },
            getEleGroup: function (ID) {
                //按照结构来获取数据
                var eleData = {};
                var dom = $("#" + ID + ".position-box");
                eleData.ID = ID;
                eleData.type = "group";
                
                //获取默认样式
                var defaultStyle = this.getEleDefaultStyle(dom,eleData);

                var eleList = dom.find(">.ele-box >.ele >.position-box-parent >.position-box");
                var eleListData = [];

                for (var i = 0; i < eleList.length; i++) {
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'), eleList.eq(i).attr('ele-type')));
                }
                eleData.eleList = eleListData;
                return eleData;
            },
            updateEleDefaultStyle :function(dom,eleData){
                dom.get(0).style = "";
                $.each(eleData.position, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                dom.get(0).style = "";
                $.each(eleData.border, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                //保留margintop 属性
                var marginTop = dom.css("margin-top");
                dom.get(0).style = "";
                dom.css("margin-top", marginTop);
                $.each(eleData.style, function (index, value) {
                    dom.css(index, value);
                });
            },
            updateEleText: function (eleData) {
                //更新样式
                var dom = $("#" + eleData.ID + ".position-box");
                this.updateEleDefaultStyle(dom,eleData);
                //更新文字内容
                if (eleData.textValue !== dom.find(".ql-editor").html()) {
                    dom.find(".ql-editor").html(eleData.textValue);
                }
            },
            updateEleImage: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                
                this.updateEleDefaultStyle(dom,eleData);
                
                dom.find('.ele').attr('src',eleData.url);
            },
            updateEleMenu: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                
                this.updateEleDefaultStyle(dom,eleData);

                //更新item
                dom.empty();
                for (var i = 0; i < eleData.item.length; i++) {
                    var domItem = $("<div class='menu-item' id=" + eleData.item[i].ID + ">" + eleData.item[i].name + "</div>");
                    domItem.css({ "width": (100 / eleData.item.length).toFixed(2) + "%", "float": "left" });
                    dom.append(domItem);
                }
            },
            updateEleGroup: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                this.updateEleDefaultStyle(dom,eleData);

                for (var i = 0; i < eleData.eleList.length; i++) {
                    this.updateEle(eleData.eleList[i]);
                }
            },
            fixVideoPosition:function(sessionDom,videoDom,originalVideoData){
                if(originalVideoData === undefined){
                    originalVideoData = {
                        'width':videoDom.width(),
                        'height':videoDom.height()
                    };
                }
                //先计算session哪边比较大
                var sessionData={
                    'width':sessionDom.width(),
                    'height':sessionDom.height()
                };
                var videoData = {
                    'width':videoDom.width(),
                    'height':videoDom.height()
                };
                if(sessionData.width > sessionData.height){
                    //宽铺满
                    if(originalVideoData.height < sessionData.height){
                        //高填充
                        videoDom.css({'height':sessionData.height+1,'left':'50%','width':'auto','margin-top':'0px','top':'0px','margin-left':-videoDom.width()/2});
                    }else{
                        videoDom.css({'width':sessionData.width+1,'top':'50%','height':'auto','margin-left':'0px','left':'0px','margin-top':-videoDom.height()/2});
                    }
                                     
                }else{
                    //高铺满  
                    if(originalVideoData.width < sessionData.width){
                        videoDom.css({'width':sessionData.width+1,'top':'50%','height':'auto','margin-left':'0px','left':'0px','margin-top':-videoDom.height()/2});
                    }else{
                        videoDom.css({'height':sessionData.height+1,'left':'50%','width':'auto','margin-top':'0px','top':'0px','margin-left':-videoDom.width()/2});
                    }
                }
            },
            createSessionVideo:function(dom,background){
                //清空颜色 和 背景
                dom.css('background-color','');
                dom.css('background-image','');

                var videoDom = dom.find('.video-background');
                //因为这里是编辑器 所以不需要自动播放  后期再做兼容video 以及后期需要增加各种可配置的变量
                var videoTemplate = '<div class="video-background">'+
                '<div class="over-layer" style="background-image:url(\'images/videoPattern/v-overlay-pat-2-icon.png\')"></div>'+
                '<video class="video" poster="'+background.previewImage+'" volume="0" src="'+background.url+'"></video>'+
                '</div>';
                
                if(videoDom.length === 0){
                    //新建dom
                    videoDom = $(videoTemplate);
                    dom.append(videoDom);
                }else{
                    //更新url
                    videoDom.find('video').attr('src',background.url);
                    videoDom.find('video').attr('poster',background.previewImage);
                }
                videoDom.find('video').on('loadeddata',function(){
                    //调整video的位置
                    handle.fixVideoPosition(dom,videoDom.find('video'));
                });
                return videoDom;
            },
            updateSession: function (data) {
                var dom = $('#'+data.ID);

                //渲染背景样式
                $.each(data.style, function (index, value) {
                    dom.css(index, value);
                });

                if (data.class !== undefined) {
                    for (var i = 0; i < data.class.length; i++) {
                        dom.addClass(data.class[i]);
                    }
                }
                
                function image(dom,background){
                    if(!!background.color){
                        //清空颜色
                        dom.css('background-color','');
                    }
                    //清除视频
                    dom.find('.video-background').remove();
                    dom.css('background-image','url('+background.url+')');
                }

                function video(dom,background){
                    var videoDom = handle.createSessionVideo(dom,background);
                }

                function color(dom,background){

                }

                switch(data.background.type){
                    case 'image':image(dom,data.background);break;
                    case 'video':video(dom,data.background);break;
                    case 'color':color(dom,data.background);break;
                }

            },
            /**
             * 用于调整组的大小的时候把内部的组件也进行缩放
            */
            zoomEle:function(eleData,scale){
                //调整缩放页面元素，一般只在调整组的时候用得上
                switch(eleData.type){
                    case 'text':handle.zoomEleText(eleData,scale);break;
                    case 'image':handle.zoomEleImage(eleData,scale);break;
                    case 'menu':handle.zoomEleMenu(eleData,scale);break;
                    case 'group':handle.zoomEleGroup(eleData,scale);break;
                }
            },
            zoomEleText:function(eleData,scale){
                var eleWidth=0;
                var eleHeight=0;
                var eleTop=0;
                var eleLeft=0;

                eleTop=parseInt(eleData.position.top)*scale;
                eleLeft=parseInt(eleData.position.left)*scale;

                eleWidth=parseInt(eleData.border.width)*scale;                

                var eleDom=$('#'+eleData.ID);
                eleDom.css({'left':eleLeft,'top':eleTop});                
                eleDom.find('>.ele-box').css({'width':eleWidth});
            },
            zoomEleImage:function(eleData,scale){
                var eleWidth=0;
                var eleHeight=0;
                var eleTop=0;
                var eleLeft=0;

                eleTop=parseInt(eleData.position.top)*scale;
                eleLeft=parseInt(eleData.position.left)*scale;
                eleWidth=parseInt(eleData.border.width)*scale;
                eleHeight=parseInt(eleData.border['min-height'])*scale;

                var eleDom=$('#'+eleData.ID);
                eleDom.css({'left':eleLeft,'top':eleTop});
                eleDom.find('>.ele-box').css({'width':eleWidth,'min-height':eleHeight});
                //eleDom.find('>.ele-box >.ele').css({'width':eleImageWidth,'height':eleImageHeight});

                //reset  image
                imageCropService.resetImage(eleDom,eleData, parseInt(eleData.border.width), parseInt(eleData.border['min-height']), parseInt(eleData.style.width), parseInt(eleData.style.height), eleData.style.clip);
            },
            zoomEleMenu:function(eleData,scale){
                var eleWidth=0;
                var eleHeight=0;
                var eleTop=0;
                var eleLeft=0;

                eleTop=parseInt(eleData.position.top)*scale;
                eleLeft=parseInt(eleData.position.left)*scale;

                eleWidth=parseInt(eleData.border.width)*scale;                

                var eleDom=$('#'+eleData.ID);
                eleDom.css({'left':eleLeft,'top':eleTop});                
                eleDom.find('>.ele-box').css({'width':eleWidth});
            },
            zoomEleGroup:function(eleData,scale){
                //从最底端的元素开始缩放，然后上层的组 在下面的元素调整完成后  组需要自检   重新调整大小
                var eleWidth=0;
                var eleHeight=0;
                var oldWidth=parseInt(eleData.border.width);
                var oldHeight=parseInt(eleData.border['min-height']);

                eleWidth=oldWidth*scale;
                eleHeight=oldHeight*scale;
                
                var eleDom=$('#'+eleData.ID);
                eleDom.find('>.ele-box').css({'width':eleWidth,'min-height':eleHeight});
                //遍历子元素 调整大小
                angular.forEach(eleData.eleList,function(obj,index){
                    handle.zoomEle(obj,scale);
                });


                //子元素完成调整    自检 是否需要增大
                var eleList=eleDom.find('>.ele-box >.ele >.position-box-parent >.position-box');
                var maxHeight=eleHeight;
                for(var i=0;i<eleList.length;i++){
                    var height=eleList.eq(i).height()+parseInt(eleList.eq(i).css('top'));
                    if(height > maxHeight){
                        maxHeight = height;
                    }
                }
                eleDom.find('>.ele-box').css({'min-height':maxHeight+6});

            }
        };

        return handle;
    });