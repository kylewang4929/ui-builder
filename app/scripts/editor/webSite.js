"use strict";
angular.module('webSiteEditor',[])
    .factory('builderTool', function (creatorServices, $compile, $timeout,$rootScope) {

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
            addSession: function (obj) {
                var dom = creatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);
                var sessionList = $(".edit-space .ele-session-box");
                if (sessionList.length > obj.deleteIndex) {
                    sessionList.eq(obj.deleteIndex).before(dom);
                } else {
                    sessionList.eq(sessionList.length - 1).after(dom);
                }
            },
            deleteSession: function (ID) {
                $("#" + ID + ".ele-session-box").remove();
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
                    dom.find('>.ele-box >.group-over').trigger("mousedown");
                    $(document).trigger("mouseup");
                });
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
            getEleText: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "text";
                eleData.textValue = dom.find('.ele .ql-editor').get(0).innerHTML;

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                eleData.eleTemplateType = dom.attr("template-type");
                return eleData;
            },
            getEleImage: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");
                eleData.ID = ID;
                eleData.type = "image";

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                eleData.url = styleDom.css("background-image");
                eleData.url = eleData.url.substring(5, eleData.url.length - 2);
                eleData.eleTemplateType = dom.attr("template-type");
                
                //计算图片的原始大小 以及图片的缩放比例
                var img=document.createElement('img');
                img.src=eleData.url;
                eleData.imageSize={
                    width:img.width,
                    height:img.height
                };
                
                //计算图片尺寸
                var imageBackgroundSize=eleData.style['background-size'].split(" ");
                //元素尺寸 比 图片尺寸
                eleData.cropInfo={
                    width:parseFloat(eleData.border.width)/parseFloat(imageBackgroundSize[0]),
                    height:parseFloat(eleData.border['min-height'])/parseFloat(imageBackgroundSize[1])
                };
                return eleData;
            },
            getEleMenu: function (ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "menu";

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                //读取item
                eleData.item = [];
                styleDom = styleDom.find(".menu-item");
                for (var i = 0; i < styleDom.length; i++) {
                    eleData.item.push({ ID: styleDom.eq(i).attr("id"), name: styleDom.get(i).textContent })
                }
                eleData.eleTemplateType = dom.attr("template-type");
                return eleData;
            },
            getEleGroup: function (ID) {
                //按照结构来获取数据
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "group";
                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);

                var eleList = dom.find(">.ele-box >.ele >.position-box");
                var eleListData = [];

                for (var i = 0; i < eleList.length; i++) {
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'), eleList.eq(i).attr('ele-type')));
                }
                eleData.eleList = eleListData;
                eleData.eleTemplateType = dom.attr("template-type");
                return eleData;
            },
            updateEleText: function (eleData) {
                //更新样式
                var dom = $("#" + eleData.ID + ".position-box");
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
                //更新文字内容
                if (eleData.textValue !== dom.find(".ql-editor").html()) {
                    dom.find(".ql-editor").html(eleData.textValue);
                }
            },
            updateEleImage: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
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
                var marginTop = dom.css("margin-top");
                dom.get(0).style = "";
                dom.css("margin-top", marginTop);
                $.each(eleData.style, function (index, value) {
                    dom.css(index, value);
                });
                dom.css("background-image", "url(\'" + eleData.url + "\')");
                dom.src = eleData.url;
            },
            updateEleMenu: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
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
                var marginTop = dom.css("margin-top");
                dom.get(0).style = "";
                dom.css("margin-top", marginTop);
                $.each(eleData.style, function (index, value) {
                    dom.css(index, value);
                });

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
                dom.get(0).style = "";
                $.each(eleData.position, function (index, value) {
                    dom.css(index, value);
                });
                var domBorder = dom.find("> .ele-box");
                domBorder.get(0).style = "";
                var borderWidth = 0;
                var borderHeight = 0;
                $.each(eleData.border, function (index, value) {
                    if (index == 'min-height') {
                        borderHeight = parseInt(value);
                    }
                    if (index == 'width') {
                        borderWidth = parseInt(value);
                    }
                    domBorder.css(index, value);
                });
                var eleDom = domBorder.find("> .ele");
                eleDom.get(0).style = "";

                //                eleDom.css('height', borderHeight);
                //                eleDom.css('margin-top', -parseInt(borderHeight)/2+"px");
                //                eleDom.css('width', borderWidth);
                //                eleDom.css('margin-left', -parseInt(borderWidth)/2+"px");

                $.each(eleData.style, function (index, value) {
                    eleDom.css(index, value);
                });
                for (var i = 0; i < eleData.eleList.length; i++) {
                    this.updateEle(eleData.eleList[i]);
                }
            },
            updateSessionBackground: function () { }
        };

        return handle;
    });