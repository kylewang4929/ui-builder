"use strict";
angular.module('phoneSiteEditor',[])
    .factory('phoneBuilderTool', function(phoneCreatorServices, $compile, $timeout) {

        var data = [];
        var createScope = null;

        var handle = {
            init: function(data) {
                createScope = data;
            },
            addEle: function(sessionID, obj) {
                var dom = phoneCreatorServices.createEle(obj);
                dom = $compile(dom.get(0))(createScope);
                if (obj.showState == false) {
                    dom.css("display", 'none');
                }
                $("#" + sessionID + ".ele-session-box").append(dom);
            },
            hideEle: function(ID, type) {
                if (type == 'session') {
                    $("#" + ID + ".ele-session-box").hide();
                }
                if (type == 'ele') {
                    $("#" + ID + ".position-box").hide();
                }
            },
            showEle: function(ID, type) {
                if (type == 'session') {
                    $("#" + ID + ".ele-session-box").show();
                }
                if (type == 'ele') {
                    $("#" + ID + ".position-box").show();
                }
            },
            moveEle: function(ID, direction, value) {
                var dom = $("#" + ID + ".position-box");
                if (direction == 'top') {
                    var cTop = dom.css('top');
                    dom.css('top', parseInt(cTop) + value);
                }
                if (direction == 'left') {
                    var cLeft = dom.css('left');
                    dom.css('left', parseInt(cLeft) + value);
                }
            },
            changeSessionHeight: function(sessionID, height) {
                $("#" + sessionID + ".ele-session-box").css('min-height', height);
            },
            addSession: function(obj) {
                var dom = phoneCreatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);
                var sessionList = $(".ele-session-box");
                if (sessionList.length > obj.deleteIndex) {
                    $(".ele-session-box").eq(obj.deleteIndex).before(dom);
                } else {
                    $(".ele-session-box").eq(sessionList.length - 1).after(dom);
                }
            },
            deleteSession: function(ID) {
                $("#" + ID + ".ele-session-box").remove();
                $(".tooltip.tooltip--is-active").remove();
            },
            createID: function() {
                return _.uniqueId("ele" + _.now());
            },
            refreshPage: function(data, scope) {
                var page = $("#phone-edit-space");
                page.empty();
                page.append(phoneCreatorServices.createPage(data.sessionList, scope));
            },
            updateEle: function(eleData) {
                switch (eleData.type) {
                    case "text": this.updateEleText(eleData); break;
                    case "image": this.updateEleImage(eleData); break;
                    case "menu": this.updateEleMenu(eleData); break;
                    case "group": this.updateEleGroup(eleData); break;
                }
            },
            deleteEle: function(id) {
                $("#" + id + ".position-box").remove();
            },
            getEle: function(ID, type) {
                var eleData = {};
                switch (type) {
                    case "text": eleData = this.getEleText(ID); break;
                    case "image": eleData = this.getEleImage(ID); break;
                    case "menu": eleData = this.getEleMenu(ID); break;
                    case "group": eleData = this.getEleGroup(ID); break;
                }

                return eleData;
            },
            resolveStyle: function(dom) {
                var style={};
                
                angular.forEach(dom.style,function(obj,index){
                    style[obj]=$(dom).css(obj);
                });
                
                return style;
            },
            getEleText: function(ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "text";
                eleData.textValue = dom.find('.ele').get(0).innerHTML;

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                var styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);

                //获取缩放比例
                eleData.scale = dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                //                eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
                //                eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            getEleImage: function(ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "image";

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                var styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                eleData.url = styleDom.css("background-image");
                eleData.url = eleData.url.substring(5, eleData.url.length - 2);

                //获取缩放比例
                eleData.scale = dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                eleData.border.width = parseInt(eleData.border.width) / eleData.scale;
                eleData.border['min-height'] = parseInt(eleData.border['min-height']) / eleData.scale;
                
                return eleData;
            },
            getEleMenu: function(ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "menu";

                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                var styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);
                //读取item
                eleData.item = [];
                styleDom = styleDom.find(".menu-item");
                for (var i = 0; i < styleDom.length; i++) {
                    eleData.item.push({ ID: styleDom.eq(i).attr("id"), name: styleDom.get(i).textContent })
                }

                //获取缩放比例
                eleData.scale = dom.attr('scale');

                return eleData;
            },
            getEleGroup: function(ID) {
                var eleData = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "group";
                eleData.position = this.resolveStyle(dom[0]);
                var styleDom = dom.find(".ele-box");
                eleData.border = this.resolveStyle(styleDom[0]);
                var styleDom = dom.find(".ele");
                eleData.style = this.resolveStyle(styleDom[0]);


                var eleList = dom.find(">.ele-box >.ele >.position-box");
                var eleListData = [];
                for (var i = 0; i < eleList.length; i++) {
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'), eleList.eq(i).attr('ele-type')));
                }

                eleData.eleList = eleListData;

                //获取缩放比例
                eleData.scale = dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                //                eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
                //                eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            updateEleText: function(eleData) {
                //更新样式
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function(index, value) {
                    dom.css(index, value);
                });
            },
            updateEleImage: function(eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function(index, value) {
                    dom.css(index, value);
                });
            },
            updateEleMenu: function(eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function(index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function(index, value) {
                    dom.css(index, value);
                });

            },
            updateEleGroup: function(eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function(index, value) {
                    dom.css(index, value);
                });

                var domBorder = dom.find("> .ele-box");
                $.each(eleData.phoneStyle.border, function(index, value) {
                    dom.css(index, value);
                });
                var eleDom = domBorder.find("> .ele");
                $.each(eleData.phoneStyle.style, function(index, value) {
                    dom.css(index, value);
                });
                for (var i = 0; i < eleData.eleList.length; i++) {
                    this.updateEle(eleData.eleList[i]);
                }
            }
        };

        return handle;
    });