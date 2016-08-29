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
            ID: "image", name: "默认图片", template: "views/eleResource/image.html", eleList: [
                {
                    "ID": "eleeee23",
                    "type": "image",
                    "url": "images/imageDesign/2.png",
                    "backgroundSize": "contain",
                    "imageSize": {
                        "width": "260px",
                        "height": "196px"
                    },
                    "phoneStyle": {
                        "position": {
                            "left": "0px",
                            "top": "110px"
                        },
                        "border": {
                            "width": "260px",
                            "min-height": "196px"
                        },
                        "style": {
                            "width": "260px",
                            "height": "196px",
                            "clip": "rect(0px 260px 196px 0px)"
                        },
                        "scale": 0.7
                    },
                    "style": {
                        "width": "260px",
                        "height": "196px",
                        "clip": "rect(0px 260px 196px 0px)"
                    },
                    "position": {
                        "left": "580px",
                        "top": "81px"
                    },
                    "border": {
                        "width": "260px",
                        "min-height": "196px"
                    },
                    "eleTemplateType": "ele-image-default"
                }
            ]
        };
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