"use strict";
angular.module('phoneSiteEditor', [])
    .factory('phoneBuilderTool', function (phoneCreatorServices, $compile, $timeout, imageCropService) {

        var data = [];
        var createScope = null;

        var handle = {
            init: function (data) {
                createScope = data;
            },
            addEle: function (sessionID, obj) {
                var dom = phoneCreatorServices.createEle(obj);
                dom = $compile(dom.get(0))(createScope);
                if (obj.showState === false) {
                    dom.css("display", 'none');
                }
                $("#" + sessionID + ".ele-session-box").append(dom);
            },
            hideEle: function (ID, type) {
                if (type === 'session') {
                    $("#" + ID + ".ele-session-box").hide();
                }
                if (type === 'ele') {
                    $("#" + ID + ".position-box").hide();
                }
            },
            showEle: function (ID, type) {
                if (type === 'session') {
                    $("#" + ID + ".ele-session-box").show();
                }
                if (type === 'ele') {
                    $("#" + ID + ".position-box").show();
                }
            },
            moveEle: function (ID, direction, value) {
                var dom = $("#" + ID + ".position-box");
                if (direction === 'top') {
                    var cTop = dom.css('top');
                    dom.css('top', parseInt(cTop) + value);
                }
                if (direction === 'left') {
                    var cLeft = dom.css('left');
                    dom.css('left', parseInt(cLeft) + value);
                }
            },
            changeSessionHeight: function (sessionID, height) {
                $("#" + sessionID + ".ele-session-box").css('min-height', height);
            },
            addSession: function (obj) {
                var dom = phoneCreatorServices.createSession(obj);
                dom = $compile(dom.get(0))(createScope);
                var sessionList = $(".ele-session-box");
                if (sessionList.length > obj.deleteIndex) {
                    $(".ele-session-box").eq(obj.deleteIndex).before(dom);
                } else {
                    $(".ele-session-box").eq(sessionList.length - 1).after(dom);
                }
            },
            deleteSession: function (ID) {
                $("#" + ID + ".ele-session-box").remove();
                $(".tooltip.tooltip--is-active").remove();
            },
            createID: function () {
                return _.uniqueId("ele" + _.now());
            },
            refreshPage: function (data, scope) {
                var page = $("#phone-edit-space");
                page.empty();
                page.append(phoneCreatorServices.createPage(data.sessionList, scope));
            },
            updateEle: function (eleData) {

                $("#" + eleData.ID).parent().get(0).eleConfig = eleData;

                switch (eleData.type) {
                    case "text": this.updateEleText(eleData); break;
                    case "image": this.updateEleImage(eleData); break;
                    case "menu": this.updateEleMenu(eleData); break;
                    case "group": this.updateEleGroup(eleData); break;
                }
            },
            deleteEle: function (id) {
                $("#" + id + ".position-box").remove();
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
                var style = {};

                angular.forEach(dom.style, function (obj, index) {
                    style[obj] = $(dom).css(obj);
                });

                return style;
            },
            getEleText: function (ID) {
                var eleData = {};
                var styleDom = {};
                eleData.phoneStyle = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "text";
                eleData.textValue = dom.find('.ele').get(0).innerHTML;

                eleData.phoneStyle.position = this.resolveStyle(dom[0]);
                styleDom = dom.find(".ele-box");
                eleData.phoneStyle.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.phoneStyle.style = this.resolveStyle(styleDom[0]);

                //获取缩放比例
                eleData.phoneStyle.scale = dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                //eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
                //eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            getEleImage: function (ID) {
                var eleData = {};
                var styleDom = {};
                eleData.phoneStyle = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "image";

                eleData.phoneStyle.position = this.resolveStyle(dom[0]);
                styleDom = dom.find(".ele-box");
                eleData.phoneStyle.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.phoneStyle.style = this.resolveStyle(styleDom[0]);
                eleData.url = styleDom.attr("src");
                eleData.backgroundSize = dom.attr('background-size');

                //获取缩放比例
                eleData.phoneStyle.scale = dom.attr('scale');

                return eleData;
            },
            getEleMenu: function (ID) {
                var eleData = {};
                var styleDom = {};
                eleData.phoneStyle = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "menu";

                eleData.phoneStyle.position = this.resolveStyle(dom[0]);
                styleDom = dom.find(".ele-box");
                eleData.phoneStyle.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.phoneStyle.style = this.resolveStyle(styleDom[0]);
                //读取item
                eleData.item = [];
                styleDom = styleDom.find(".menu-item");
                for (var i = 0; i < styleDom.length; i++) {
                    eleData.item.push({ ID: styleDom.eq(i).attr("id"), name: styleDom.get(i).textContent });
                }

                //获取缩放比例
                eleData.phoneStyle.scale = dom.attr('scale');

                return eleData;
            },
            getEleGroup: function (ID) {
                var eleData = {};
                var styleDom = {};
                eleData.phoneStyle = {};
                var dom = $("#" + ID + ".position-box");

                eleData.ID = ID;
                eleData.type = "group";
                eleData.phoneStyle.position = this.resolveStyle(dom[0]);
                styleDom = dom.find(".ele-box");
                eleData.phoneStyle.border = this.resolveStyle(styleDom[0]);
                styleDom = dom.find(".ele");
                eleData.phoneStyle.style = this.resolveStyle(styleDom[0]);


                var eleList = dom.find(">.ele-box >.ele >.position-box-parent >.position-box");
                var eleListData = [];
                for (var i = 0; i < eleList.length; i++) {
                    eleListData.push(this.getEle(eleList.eq(i).attr('id'), eleList.eq(i).attr('ele-type')));
                }

                eleData.eleList = eleListData;

                //获取缩放比例
                eleData.phoneStyle.scale = dom.attr('scale');

                //还原数据的大小  因为有一个缩放的操作
                //eleData.border.widht=parseInt(eleData.border.width)/eleData.scale;
                //eleData.border['min-height']=parseInt(eleData.border['min-height'])/eleData.scale;

                return eleData;
            },
            updateEleText: function (eleData) {
                //更新样式
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function (index, value) {
                    dom.css(index, value);
                });
            },
            updateEleImage: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function (index, value) {
                    dom.css(index, value);
                });

            },
            updateEleMenu: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele-box");
                $.each(eleData.phoneStyle.border, function (index, value) {
                    dom.css(index, value);
                });

                dom = dom.find(".ele");
                $.each(eleData.phoneStyle.style, function (index, value) {
                    dom.css(index, value);
                });

            },
            updateEleGroup: function (eleData) {
                var dom = $("#" + eleData.ID + ".position-box");
                $.each(eleData.phoneStyle.position, function (index, value) {
                    dom.css(index, value);
                });

                var domBorder = dom.find("> .ele-box");
                $.each(eleData.phoneStyle.border, function (index, value) {
                    dom.css(index, value);
                });
                var eleDom = domBorder.find("> .ele");
                $.each(eleData.phoneStyle.style, function (index, value) {
                    dom.css(index, value);
                });
                for (var i = 0; i < eleData.eleList.length; i++) {
                    this.updateEle(eleData.eleList[i]);
                }
            },
            /**
             * 用于调整组的大小的时候把内部的组件也进行缩放
            */
            zoomEle: function (eleData, scale) {
                //调整缩放页面元素，一般只在调整组的时候用得上
                switch (eleData.type) {
                    case 'text': handle.zoomEleText(eleData, scale); break;
                    case 'image': handle.zoomEleImage(eleData, scale); break;
                    case 'menu': handle.zoomEleMenu(eleData, scale); break;
                    case 'group': handle.zoomEleGroup(eleData, scale); break;
                }
            },
            zoomEleText: function (eleData, scale) {
                var eleWidth = 0;
                var eleHeight = 0;
                var eleTop = 0;
                var eleLeft = 0;

                eleTop = parseInt(eleData.phoneStyle.position.top) * scale;
                eleLeft = parseInt(eleData.phoneStyle.position.left) * scale;

                eleWidth = parseInt(eleData.phoneStyle.border.width) * scale;

                var eleDom = $('#' + eleData.ID);
                eleDom.css({ 'left': eleLeft, 'top': eleTop });
                eleDom.find('>.ele-box').css({ 'width': eleWidth });
                var borderWidth = eleWidth * eleData.phoneStyle.scale;
                var borderHeight = parseFloat(eleDom.find('>.ele-box').get(0).offsetHeight) * eleData.phoneStyle.scale;
                eleDom.css({ 'width': borderWidth, 'height': borderHeight });                
            },
            zoomEleImage: function (eleData, scale) {
                var eleWidth = 0;
                var eleHeight = 0;
                var eleTop = 0;
                var eleLeft = 0;

                eleTop = parseInt(eleData.phoneStyle.position.top) * scale;
                eleLeft = parseInt(eleData.phoneStyle.position.left) * scale;
                eleWidth = parseInt(eleData.phoneStyle.border.width) * scale;
                eleHeight = parseInt(eleData.phoneStyle.border['min-height']) * scale;

                var eleDom = $('#' + eleData.ID);
                eleDom.css({ 'left': eleLeft, 'top': eleTop });
                eleDom.find('>.ele-box').css({ 'width': eleWidth, 'min-height': eleHeight });
                //eleDom.find('>.ele-box >.ele').css({'width':eleImageWidth,'height':eleImageHeight});

                //reset  image
                imageCropService.resetImage(eleDom, eleData, parseInt(eleData.phoneStyle.border.width), parseInt(eleData.phoneStyle.border['min-height']), parseInt(eleData.phoneStyle.style.width), parseInt(eleData.phoneStyle.style.height), eleData.phoneStyle.style.clip);
            },
            zoomEleMenu: function (eleData, scale) {
                var eleWidth = 0;
                var eleHeight = 0;
                var eleTop = 0;
                var eleLeft = 0;

                eleTop = parseInt(eleData.phoneStyle.position.top) * scale;
                eleLeft = parseInt(eleData.phoneStyle.position.left) * scale;

                eleWidth = parseInt(eleData.phoneStyle.border.width) * scale;

                var eleDom = $('#' + eleData.ID);
                eleDom.css({ 'left': eleLeft, 'top': eleTop });
                eleDom.find('>.ele-box').css({ 'width': eleWidth });
            },
            zoomEleGroup: function (eleData, scale) {
                //从最底端的元素开始缩放，然后上层的组 在下面的元素调整完成后  组需要自检   重新调整大小
                var eleWidth = 0;
                var eleHeight = 0;
                var oldWidth = parseInt(eleData.phoneStyle.border.width);
                var oldHeight = parseInt(eleData.phoneStyle.border['min-height']);

                eleWidth = oldWidth * scale;
                eleHeight = oldHeight * scale;

                var eleDom = $('#' + eleData.ID);
                eleDom.find('>.ele-box').css({ 'width': eleWidth, 'min-height': eleHeight });
                //遍历子元素 调整大小
                angular.forEach(eleData.eleList, function (obj, index) {
                    handle.zoomEle(obj, scale);
                });


                //子元素完成调整    自检 是否需要增大
                var eleList = eleDom.find('>.ele-box >.ele >.position-box-parent >.position-box');
                var maxHeight = eleHeight;
                for (var i = 0; i < eleList.length; i++) {
                    var height = eleList.eq(i).height() + parseInt(eleList.eq(i).css('top'));
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                }
                eleDom.find('>.ele-box').css({ 'min-height': maxHeight+6 });

            }
        };

        return handle;
    });