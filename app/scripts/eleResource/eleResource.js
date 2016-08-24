"use strict";
angular.module('myBuilderApp')
    .controller('textResourceCtrl', function ($scope) {
        $scope.activeEleList = {
            ID: "text", name: "文本", template: "views/eleResource/text.html", eleList: [
                {
                    "ID": "1",
                    "type": "text",
                    "textValue": "<div><span class=\"author-galadriel\"><span style=\"font-size: 24px;\"><span style=\"color: rgb(0, 0, 0);\">Site Title</span></span></span></div>",
                    "style": {
                    },
                    "position": {
                        "left": "45px",
                        "top": "130px"
                    },
                    "border": {
                        "width": "240px",
                        "min-height": "50px"
                    },
                    "phoneStyle": {
                        "position": {
                            "left": "17px",
                            "top": "28px"
                        },
                        "border": {
                            "width": "240px",
                            "min-height": "50px"
                        },
                        "style": {},
                        "scale": 0.7
                    },
                    "eleTemplateType": "ele-text-default"
                },
                {
                    "ID": "2",
                    "type": "text",
                    "textValue": "<div><span class=\"author-galadriel\"><span style=\"font-size: 34px;\"><span style=\"color: rgb(0, 0, 0);\">Site Title</span></span></span></div>",
                    "style": {
                    },
                    "position": {
                        "left": "45px",
                        "top": "130px"
                    },
                    "border": {
                        "width": "240px",
                        "min-height": "50px"
                    },
                    "phoneStyle": {
                        "position": {
                            "left": "17px",
                            "top": "28px"
                        },
                        "border": {
                            "width": "240px",
                            "min-height": "50px"
                        },
                        "style": {},
                        "scale": 0.7
                    },
                    "eleTemplateType": "ele-text-default"
                },
                {
                    "ID": "3",
                    "type": "text",
                    "textValue": "<div><span class=\"author-galadriel\"><span style=\"font-size: 44px;\"><span style=\"color: rgb(0, 0, 0);\">Site Title</span></span></span></div>",
                    "style": {
                    },
                    "position": {
                        "left": "45px",
                        "top": "130px"
                    },
                    "border": {
                        "width": "240px",
                        "min-height": "50px"
                    },
                    "phoneStyle": {
                        "position": {
                            "left": "17px",
                            "top": "28px"
                        },
                        "border": {
                            "width": "240px",
                            "min-height": "50px"
                        },
                        "style": {},
                        "scale": 0.7
                    },
                    "eleTemplateType": "ele-text-default"
                }
            ]
        };
    })
    .controller('imageResourceCtrl', function ($scope) {
        $scope.activeEleList = {
            ID: "image", name: "图片", template: "views/eleResource/image.html", eleList: [
                {
                    "ID": "eleeee23",
                    "type": "image",
                    "url": "images/website/pc.png",
                    "backgroundSize": "contain",
                    "imageSize": {
                        "width": "399px",
                        "height": "324px"
                    },
                    "phoneStyle": {
                        "position": {
                            "left": "0px",
                            "top": "110px"
                        },
                        "border": {
                            "width": "279.3px",
                            "min-height": "226.8px"
                        },
                        "style": {
                            "width": "279.3px",
                            "height": "226.8px",
                            "clip": "rect(0px 279.3px 226.8px 0px)"
                        },
                        "scale": 0.7
                    },
                    "style": {
                        "width": "399px",
                        "height": "324px",
                        "clip": "rect(0px 399px 324px 0px)"
                    },
                    "position": {
                        "left": "580px",
                        "top": "81px"
                    },
                    "border": {
                        "width": "399px",
                        "min-height": "324px"
                    },
                    "eleTemplateType": "ele-image-default"
                }
            ]
        };
        $scope.bgList = {
            ID: 'background', name: '抽象', eleList: [
                { 
                    "ID": "eleeee23", 
                    "type": "image", 
                    "position": { 
                        "left": "580px", 
                        "top": "81px" 
                    }, 
                    "border": { 
                        "width": "1198px", 
                        "min-height": "520px" 
                    }, 
                    "style": { 
                        "width": "1198px", 
                        "height": "520px", 
                        "clip": "rect(0px 1198px 520px 0px)" 
                    }, 
                    "url": "images/website/bg1.jpg", 
                    "eleTemplateType": "ele-image-default", 
                    "backgroundSize": "contain", 
                    "phoneStyle": { 
                        "position": { 
                            "left": "0px", 
                            "top": "110px" 
                        }, 
                        "border": { 
                            "width": "838.5999999999999px", 
                            "min-height": "364px" 
                        }, 
                        "style": { 
                            "width": "838.5999999999999px", 
                            "height": "364px", 
                            "clip": "rect(0px 838.5999999999999px 364px 0px)" 
                        }, 
                        "scale": 0.7 
                    }, 
                    "imageSize": { 
                        "width": "1198px", 
                        "height": "520px" 
                    } 
                }
            ]
        }
    })
    .factory('eleResourceTemplate', function () {
        var data = [
            {
                ID: "text", name: "文本", template: "views/eleResource/text.html",
            },
            {
                ID: "image", name: "图片", template: "views/eleResource/image.html",
            }
        ];

        var handle = {
            getEleList: function () {
                return data;
            }
        };

        return handle;

    });