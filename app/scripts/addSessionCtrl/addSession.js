"use strict";
angular.module('addSession', [])
    .directive('addSessionBox', function (websiteData, elePosition, levelScroll) {
        return {
            restrict: 'A',
            scope: {
                closeHandle: '&',
                targetSession: '@'
            },
            templateUrl: "views/addSession/sessionList.html",
            link: function (scope, element, attrs) {

                //添加session的dom的高度  本来应该参数传进来的
                var addSessionBoxHeight = 200;

                var mainScrollHandle = $('#main-editor-scroll');

                var mySwiper = $(element).find(".swiper-container").swiper({
                    direction: 'horizontal',
                    slidesPerView: "auto"
                });

                /**
                 * 模拟数据暂时先放着
                 */
                var session6 = {
                    "ID": "session",
                    "type": "session",
                    "name": "导航",
                    "background": {
                        "url": "images/website/headBg.jpg",
                        "type":"image"
                    },
                    "class": [
                    ],
                    "style": {
                        "min-height": "650px",
                        "background-size": "cover",
                        "background-position-x": "center",
                        "background-position-y": "center",
                        "background-repeat": "no-repeat",
                        "background-color": "#fff",
                        "position": "relative"
                    },
                    "phoneStyle": {
                        "min-height": "300px"
                    },
                    "eleList": [
                        {
                            "ID": "ele14721747972601",
                            "type": "text",
                            "textValue": "<div><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-family: Helvetica;\"><span style=\"font-size: 60px;\">Building bulletproof&nbsp;</span></span></span></div><div><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-family: Helvetica;\"><span style=\"font-size: 60px;\">fucghea apps</span></span></span></div>",
                            "position": {
                                "left": "473px",
                                "top": "247px"
                            },
                            "border": {
                                "width": "543px",
                                "min-height": "114px"
                            },
                            "style": {
                                "margin-top": "-57px",
                                "line-height": "42px"
                            },
                            "eleTemplateType": "ele-text-default",
                            "phoneStyle": {
                                "position": {
                                    "left": "22px",
                                    "top": "97px"
                                },
                                "border": {
                                    "width": "301px",
                                    "min-height": "228px"
                                },
                                "style": {},
                                "scale": "0.7"
                            },
                            "state": "select",
                            "$$hashKey": "object:315"
                        },
                        {
                            "ID": "ele14721748671441",
                            "type": "text",
                            "textValue": "<div><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-size: 14px;\">Kickstarter umami Intelligentsia kogi. Try-hard flannel literally, chambray blog crucifix put a bird on it four dollar toast cardigan scenester aesthetic</span></span></div>",
                            "position": {
                                "left": "476px",
                                "top": "371px"
                            },
                            "border": {
                                "width": "514px",
                                "min-height": "36px"
                            },
                            "style": {
                                "margin-top": "-18px",
                                "line-height": "17px"
                            },
                            "eleTemplateType": "ele-text-default",
                            "phoneStyle": {
                                "position": {
                                    "left": "75px",
                                    "top": "81px"
                                },
                                "border": {
                                    "width": "245px",
                                    "min-height": "90px"
                                },
                                "style": {},
                                "scale": "0.7"
                            },
                            "state": "select",
                            "$$hashKey": "object:309",
                            "showState": false
                        }
                    ],
                    "eleTemplateType": "head-default",
                    "$$hashKey": "object:137"
                };
                var session7 = {
                    "ID": "session1",
                    "type": "session",
                    "name": "Banner",
                    "background": {
                        "url": "",
                        "type":"color",
                        "color":"#835fa8"
                    },
                    "style": {
                        "min-height": "500px",
                        "background-size": "cover",
                        "background-position-x": "center",
                        "background-position-y": "center",
                        "background-repeat": "no-repeat",
                        "position": "relative",
                        "background-color": "#835fa8"
                    },
                    "phoneStyle": {
                        "min-height": "430px"
                    },
                    "eleList": [
                        {
                            "ID": "ele14721816087481",
                            "type": "image",
                            "position": {
                                "left": "522px",
                                "top": "-77px"
                            },
                            "border": {
                                "width": "569px",
                                "min-height": "576px"
                            },
                            "style": {
                                "margin-top": "0px",
                                "width": "570px",
                                "height": "756px",
                                "clip": "rect(0px 566.643px 576px 0px)",
                                "top": "0px",
                                "left": "1.1787px"
                            },
                            "url": "images/website/shouji.png",
                            "eleTemplateType": "ele-image-default",
                            "backgroundSize": "contain",
                            "phoneStyle": {
                                "position": {
                                    "left": "29px",
                                    "top": "203px"
                                },
                                "border": {
                                    "width": "224px",
                                    "min-height": "226px"
                                },
                                "style": {
                                    "margin-top": "0px",
                                    "width": "223px",
                                    "height": "297px",
                                    "clip": "rect(0px 222.047px 226px 0px)",
                                    "top": "0px",
                                    "left": "0.976676px"
                                },
                                "scale": "0.7"
                            },
                            "imageSize": {
                                "width": "670px",
                                "height": "889px"
                            },
                            "state": "select"
                        },
                        {
                            "ID": "ele14721830250062",
                            "type": "group",
                            "position": {
                                "left": "-29px",
                                "top": "119px"
                            },
                            "border": {
                                "width": "475px",
                                "min-height": "170px"
                            },
                            "style": {
                                "margin-top": "0px"
                            },
                            "eleList": [
                                {
                                    "ID": "ele14721806839111",
                                    "type": "text",
                                    "textValue": "<div><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-family: Helvetica;\"><b><span style=\"font-size: 35px;\">Super Duper &amp; such</span></b></span></span></div>",
                                    "position": {
                                        "left": "5px",
                                        "top": "0px"
                                    },
                                    "border": {
                                        "width": "356px",
                                        "min-height": "52px"
                                    },
                                    "style": {
                                        "margin-top": "-26px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "0px",
                                            "top": "0px"
                                        },
                                        "border": {
                                            "width": "356px",
                                            "min-height": "52px"
                                        },
                                        "style": {},
                                        "scale": "0.7303370786516854"
                                    }
                                },
                                {
                                    "ID": "ele14721809259131",
                                    "type": "image",
                                    "position": {
                                        "left": "0px",
                                        "top": "135px"
                                    },
                                    "border": {
                                        "width": "129px",
                                        "min-height": "33px"
                                    },
                                    "style": {
                                        "margin-top": "0px",
                                        "width": "126px",
                                        "height": "33px",
                                        "clip": "rect(0px 124.5px 33px 0px)",
                                        "top": "0px",
                                        "left": "2.25px"
                                    },
                                    "url": "images/website/Button.png",
                                    "eleTemplateType": "ele-image-default",
                                    "backgroundSize": "contain",
                                    "imageSize": {
                                        "width": "167px",
                                        "height": "44px"
                                    },
                                    "phoneStyle": {
                                        "position": {
                                            "left": "0px",
                                            "top": "98px"
                                        },
                                        "border": {
                                            "width": "129px",
                                            "min-height": "33px"
                                        },
                                        "style": {
                                            "width": "119px",
                                            "height": "31px",
                                            "clip": "rect(0px 118.571px 31.4286px 0px)",
                                            "left": "2.25px",
                                            "top": "0px"
                                        },
                                        "scale": "1"
                                    },
                                    "state": "select"
                                },
                                {
                                    "ID": "ele14721830023911",
                                    "type": "text",
                                    "textValue": "<div><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-size: 8px;\">Kickstarter umami Intelligentsia kogi. Try-hard flannel literally, chambray blog crucifix put a bird on it four dollar toast cardigan scenester aesthetic</span></span></div>",
                                    "position": {
                                        "left": "6px",
                                        "top": "63px"
                                    },
                                    "border": {
                                        "width": "467px",
                                        "min-height": "48px"
                                    },
                                    "style": {
                                        "margin-top": "-24px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "0px",
                                            "top": "51px"
                                        },
                                        "border": {
                                            "width": "467px",
                                            "min-height": "48px"
                                        },
                                        "style": {},
                                        "scale": "0.556745182012848"
                                    },
                                    "state": "select"
                                }
                            ],
                            "eleTemplateType": "ele-group-default",
                            "phoneStyle": {
                                "style": {},
                                "position": {
                                    "left": "10px",
                                    "top": "17px"
                                },
                                "border": {
                                    "width": "260px",
                                    "min-height": "133px"
                                },
                                "scale": "0.7"
                            },
                            "state": "select"
                        }
                    ],
                    "eleTemplateType": "session-default",
                    "$$hashKey": "object:138"
                };
                var session8 = {
                    "ID": "session2",
                    "type": "session",
                    "name": "Banner",
                    "background": {
                        "url": "",
                        "type":"color",
                        "color":"#f4f8fb"
                    },
                    "style": {
                        "min-height": "500px",
                        "background-size": "cover",
                        "background-position-x": "center",
                        "background-position-y": "center",
                        "background-repeat": "no-repeat",
                        "position": "relative",
                        "background-color": "#f4f8fb"
                    },
                    "phoneStyle": {
                        "min-height": 981
                    },
                    "eleList": [
                        {
                            "ID": "ele14721838151311",
                            "type": "group",
                            "position": {
                                "left": "-77px",
                                "top": "100px"
                            },
                            "border": {
                                "width": "341px",
                                "min-height": "292px"
                            },
                            "style": {
                                "margin-top": "0px"
                            },
                            "eleList": [
                                {
                                    "ID": "ele147218307819311",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Helvetica;\"><span style=\"font-size: 24px;\">Design &amp; Features</span></span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "1px"
                                    },
                                    "border": {
                                        "width": "240px",
                                        "min-height": "36px"
                                    },
                                    "style": {
                                        "margin-top": "-18px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "8px",
                                            "top": "11px"
                                        },
                                        "border": {
                                            "width": "227px",
                                            "min-height": "36px"
                                        },
                                        "style": {},
                                        "scale": "0.7"
                                    },
                                    "state": "select"
                                },
                                {
                                    "ID": "ele147218312611921",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Candara;color:#7d7f84\">Flannel ennui narwhal, craft beer twee Vice plaid authentic synth.</span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "59px"
                                    },
                                    "border": {
                                        "width": "308px",
                                        "min-height": "48px"
                                    },
                                    "style": {
                                        "margin-top": "-24px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "6px",
                                            "top": "45.8118px"
                                        },
                                        "border": {
                                            "width": "239px",
                                            "min-height": "72px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    },
                                    "state": "select"
                                },
                                {
                                    "ID": "ele147218321112531",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-size: 9px;\">Kickstarter umami Intelligentsia Try-hard flannel literally, chambray blog crucifix put a bird on it four dollar toast cardigan  aesthetic sartorial chia messenger bag Pinterest.&nbsp;</span></div>",
                                    "position": {
                                        "left": "6px",
                                        "top": "131px"
                                    },
                                    "border": {
                                        "width": "333px",
                                        "min-height": "96px"
                                    },
                                    "style": {
                                        "margin-top": "-48px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "5px",
                                            "top": "129px"
                                        },
                                        "border": {
                                            "width": "259px",
                                            "min-height": "96px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    },
                                    "state": "select"
                                },
                                {
                                    "ID": "ele147218331687641",
                                    "type": "image",
                                    "position": {
                                        "left": "0px",
                                        "top": "257px"
                                    },
                                    "border": {
                                        "width": "129px",
                                        "min-height": "33px"
                                    },
                                    "style": {
                                        "margin-top": "0px",
                                        "width": "126px",
                                        "height": "33px",
                                        "clip": "rect(0px 124.5px 33px 0px)",
                                        "top": "0px",
                                        "left": "2.25px"
                                    },
                                    "url": "images/website/Button.png",
                                    "eleTemplateType": "ele-image-default",
                                    "backgroundSize": "contain",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "3px",
                                            "top": "239px"
                                        },
                                        "border": {
                                            "width": "100px",
                                            "min-height": "25.6235px"
                                        },
                                        "style": {
                                            "width": "98px",
                                            "height": "26px",
                                            "clip": "rect(0px 98.9677px 26px 0px)",
                                            "left": "0.516129px",
                                            "top": "0px"
                                        },
                                        "scale": "1"
                                    },
                                    "state": "select"
                                }
                            ],
                            "eleTemplateType": "ele-group-default",
                            "phoneStyle": {
                                "style": {},
                                "position": {
                                    "left": "6px",
                                    "top": "42px"
                                },
                                "border": {
                                    "width": "267px",
                                    "min-height": "267px"
                                },
                                "scale": "0.7647058823529411"
                            },
                            "state": "select"
                        },
                        {
                            "ID": "a39037",
                            "type": "group",
                            "position": {
                                "left": "359px",
                                "top": "100px"
                            },
                            "border": {
                                "width": "341px",
                                "min-height": "292px"
                            },
                            "style": {
                                "margin-top": "0px"
                            },
                            "eleList": [
                                {
                                    "ID": "ele147218307819312",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Helvetica;\"><span style=\"font-size: 24px;\">Design &amp; Features</span></span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "1px"
                                    },
                                    "border": {
                                        "width": "240px",
                                        "min-height": "36px"
                                    },
                                    "style": {
                                        "margin-top": "-18px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "6px",
                                            "top": "13px"
                                        },
                                        "border": {
                                            "width": "207px",
                                            "min-height": "36px"
                                        },
                                        "style": {},
                                        "scale": "0.7"
                                    }
                                },
                                {
                                    "ID": "ele147218312611922",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Candara;color:#7d7f84\">Flannel ennui narwhal, craft beer twee Vice plaid authentic synth.</span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "59px"
                                    },
                                    "border": {
                                        "width": "308px",
                                        "min-height": "48px"
                                    },
                                    "style": {
                                        "margin-top": "-24px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "5.32787px",
                                            "top": "44.7541px"
                                        },
                                        "border": {
                                            "width": "235px",
                                            "min-height": "72px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    }
                                },
                                {
                                    "ID": "ele147218321112532",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-size: 9px;\">Kickstarter umami Intelligentsia Try-hard flannel literally, chambray blog crucifix put a bird on it four dollar toast cardigan  aesthetic sartorial chia messenger bag Pinterest.&nbsp;</span></div>",
                                    "position": {
                                        "left": "6px",
                                        "top": "131px"
                                    },
                                    "border": {
                                        "width": "333px",
                                        "min-height": "96px"
                                    },
                                    "style": {
                                        "margin-top": "-48px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "3px",
                                            "top": "124px"
                                        },
                                        "border": {
                                            "width": "255px",
                                            "min-height": "120px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    }
                                },
                                {
                                    "ID": "ele147218331687642",
                                    "type": "image",
                                    "position": {
                                        "left": "0px",
                                        "top": "257px"
                                    },
                                    "border": {
                                        "width": "129px",
                                        "min-height": "33px"
                                    },
                                    "style": {
                                        "margin-top": "0px",
                                        "width": "126px",
                                        "height": "33px",
                                        "clip": "rect(0px 124.5px 33px 0px)",
                                        "top": "0px",
                                        "left": "2.25px"
                                    },
                                    "url": "images/website/Button.png",
                                    "eleTemplateType": "ele-image-default",
                                    "backgroundSize": "contain",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "1px",
                                            "top": "257px"
                                        },
                                        "border": {
                                            "width": "99px",
                                            "min-height": "24.5082px"
                                        },
                                        "style": {
                                            "width": "95px",
                                            "height": "25px",
                                            "clip": "rect(0px 94.7917px 25px 0px)",
                                            "left": "2.10417px",
                                            "top": "0px"
                                        },
                                        "scale": "1"
                                    }
                                }
                            ],
                            "eleTemplateType": "ele-group-default",
                            "phoneStyle": {
                                "style": {},
                                "position": {
                                    "left": "11px",
                                    "top": "337px"
                                },
                                "border": {
                                    "width": "262px",
                                    "min-height": "295px"
                                },
                                "scale": "0.7647058823529411"
                            }
                        },
                        {
                            "ID": "a78726",
                            "type": "group",
                            "position": {
                                "left": "785px",
                                "top": "100px"
                            },
                            "border": {
                                "width": "341px",
                                "min-height": "292px"
                            },
                            "style": {
                                "margin-top": "0px"
                            },
                            "eleList": [
                                {
                                    "ID": "ele147218307819313",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Helvetica;\"><span style=\"font-size: 24px;\">Design &amp; Features</span></span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "1px"
                                    },
                                    "border": {
                                        "width": "240px",
                                        "min-height": "36px"
                                    },
                                    "style": {
                                        "margin-top": "-18px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "11px",
                                            "top": "10px"
                                        },
                                        "border": {
                                            "width": "220px",
                                            "min-height": "36px"
                                        },
                                        "style": {},
                                        "scale": "0.7"
                                    }
                                },
                                {
                                    "ID": "ele147218312611923",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-family: Candara;color:#7d7f84\">Flannel ennui narwhal, craft beer twee Vice plaid authentic synth.</span></div>",
                                    "position": {
                                        "left": "8px",
                                        "top": "59px"
                                    },
                                    "border": {
                                        "width": "308px",
                                        "min-height": "48px"
                                    },
                                    "style": {
                                        "margin-top": "-24px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "10px",
                                            "top": "45.6382px"
                                        },
                                        "border": {
                                            "width": "238px",
                                            "min-height": "72px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    }
                                },
                                {
                                    "ID": "ele147218321112533",
                                    "type": "text",
                                    "textValue": "<div><span style=\"font-size: 9px;\">Kickstarter umami Intelligentsia Try-hard flannel literally, chambray blog crucifix put a bird on it four dollar toast cardigan  aesthetic sartorial chia messenger bag Pinterest.&nbsp;</span></div>",
                                    "position": {
                                        "left": "6px",
                                        "top": "131px"
                                    },
                                    "border": {
                                        "width": "333px",
                                        "min-height": "96px"
                                    },
                                    "style": {
                                        "margin-top": "-48px"
                                    },
                                    "eleTemplateType": "ele-text-default",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "8px",
                                            "top": "130px"
                                        },
                                        "border": {
                                            "width": "256px",
                                            "min-height": "120px"
                                        },
                                        "style": {
                                            "margin-top": "-48px"
                                        }
                                    }
                                },
                                {
                                    "ID": "ele147218331687643",
                                    "type": "image",
                                    "position": {
                                        "left": "0px",
                                        "top": "257px"
                                    },
                                    "border": {
                                        "width": "129px",
                                        "min-height": "33px"
                                    },
                                    "style": {
                                        "margin-top": "0px",
                                        "width": "126px",
                                        "height": "33px",
                                        "clip": "rect(0px 124.5px 33px 0px)",
                                        "top": "0px",
                                        "left": "2.25px"
                                    },
                                    "url": "images/website/Button.png",
                                    "eleTemplateType": "ele-image-default",
                                    "backgroundSize": "contain",
                                    "phoneStyle": {
                                        "position": {
                                            "left": "5px",
                                            "top": "260px"
                                        },
                                        "border": {
                                            "width": "100px",
                                            "min-height": "25.5265px"
                                        },
                                        "style": {
                                            "width": "98px",
                                            "height": "26px",
                                            "clip": "rect(0px 98.9677px 26px 0px)",
                                            "left": "0.516129px",
                                            "top": "0px"
                                        },
                                        "scale": "1"
                                    }
                                }
                            ],
                            "eleTemplateType": "ele-group-default",
                            "phoneStyle": {
                                "style": {},
                                "position": {
                                    "left": "4px",
                                    "top": "654px"
                                },
                                "border": {
                                    "width": "268px",
                                    "min-height": "288px"
                                },
                                "scale": "0.7647058823529411"
                            }
                        }
                    ],
                    "eleTemplateType": "session-default",
                    "$$hashKey": "object:139"
                };
                /**
                 * 模拟数据暂时先放着
                 */

                scope.sessionList = [
                    {
                        preview: 'images/session/session6.png',
                        sessionData: session6
                    },
                    {
                        preview: 'images/session/session7.png',
                        sessionData: session7
                    },
                    {
                        preview: 'images/session/session8.png',
                        sessionData: session8
                    }
                ];
                scope.addSession = function (obj) {
                    var dom = websiteData.addSession(angular.copy(obj.sessionData), scope.targetSession, { isShow: false });
                    dom.addClass('base-session-show-transition');
                    //显示session
                    dom.height(obj.sessionData.style['min-height']);

                    //调整位置 居中
                    var y = elePosition.getTop(dom[0]);
                    var start = mainScrollHandle.scrollTop();
                    var scrollEnd = 0;
                    scrollEnd = y + parseInt(obj.sessionData.style['min-height']) / 2 - addSessionBoxHeight - 50 - $("body").height() / 2;
                    levelScroll.scrollTop(mainScrollHandle, scrollEnd);

                    //监听动画，结束后清除
                    dom.one("transitionend", function () {
                        dom.removeClass('base-session-show-transition');
                        dom.height('auto');
                    });
                    scope.closeHandle().call(this, function () {

                    });
                }

            }
        };
    })
    .directive('addSessionHandle', function ($compile, $timeout, elePosition, levelScroll, $rootScope) {
        return {
            restrict: 'A',
            scope: {},
            template: '<div class="add-session-handle bottom z-depth-2" ng-class="{true:\'open\'}[showFlag]"><i class="mdi mdi-plus"></i></div>',
            replace: true,
            link: function (scope, element, attrs) {

                var sessionID = $(element).parents('.ele-session-box').attr('id');

                //记录高度 由于动画的原因无法正常获取高度                
                var addSessionBoxHeight = 200;
                var dom = "";

                scope.show = function () {
                    scope.showFlag = true;
                    //插入dom到session下面
                    if (dom === "") {
                        dom = $compile(template)(scope);
                        parentSessionDom.after(dom);
                    }

                    $timeout(function () {

                        //计算绝对位置 滚动滚动条到屏幕中间
                        var y = elePosition.getTop(dom[0]);
                        var start = mainScrollHandle.scrollTop();

                        var scrollEnd = 0;
                        scrollEnd = y + addSessionBoxHeight / 2 - $("body").height() / 2;

                        levelScroll.scrollTop(mainScrollHandle, scrollEnd);

                        dom.addClass("in");

                    });
                }

                scope.hide = function (callback) {
                    //隐藏
                    $timeout(function () {
                        scope.showFlag = false;
                    }, 300);
                    //形变开始
                    $rootScope.$emit("addSessionOpenStart");
                    dom.removeClass("in");

                    dom.one("transitionend", function () {
                        //形变结束
                        $rootScope.$emit("addSessionOpenEnd");
                        if (callback != undefined) {
                            callback();
                        }
                    });
                }

                //存储滚动条到handle
                var mainScrollHandle = $('#main-editor-scroll');

                var parentSessionDom = $(element).parent(".ele-session-box");
                scope.showFlag = false;
                var template = "<div class='add-session-box' add-session-box close-handle='hide' target-session='" + sessionID + "'></div>";

                //用来捕捉鼠标点击事件 如果不是在可触范围内 则隐藏按钮
                var mouseDownEvent = function (e) {
                    if (scope.showFlag === true) {
                        var target = e.target;
                        if (target === dom[0] || dom[0] === $(target).parents(".add-session-box")[0] || target === element[0] || $(target).parents(".add-session-box")[0] === element[0]) {
                            //不需要隐藏
                        } else {
                            //隐藏
                            $timeout(function () {
                                //开始形变
                                $rootScope.$emit("addSessionOpenStart");
                                dom.removeClass("in");
                                dom.one("transitionend", function () {
                                    //形变结束
                                    $rootScope.$emit("addSessionOpenEnd");
                                });
                                $timeout(function () {
                                    scope.showFlag = false;

                                }, 300);
                            }, 100);
                        }

                    }
                };

                $("body").on("mousedown", mouseDownEvent);

                $(element).on("click", function (e) {
                    if (!scope.showFlag) {
                        scope.show();
                    } else {
                        scope.hide();
                    }
                });

                scope.$on("$destroy", function () {
                    $("body").off("mousedown", mouseDownEvent);
                    if (dom !== "") {
                        dom.remove();
                    }
                });

            }
        };
    });