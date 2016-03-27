"use strict";
angular.module('myBuilderApp')
    .controller('textResourceCtrl', function ($scope) {
        $scope.activeEleList={
            ID:"text",name:"文本",template:"views/eleResource/text.html",eleList:[
                {
                    "ID": "1",
                    "type": "text",
                    "textValue": "<div><span class=\"author-galadriel\"><span style=\"font-size: 24px;\"><span style=\"color: rgb(0, 0, 0);\">Site Title</span></span></span></div>",
                    "style": {
                        "line-height": "54px"
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
                        "line-height": "54px"
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
                        "line-height": "54px"
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
    .factory('eleResource', function () {
        var data=[
            {
                ID:"text",name:"文本",template:"views/eleResource/text.html"
            }
        ];

        var handle={
            getEleList:function(){
                return data;
            }
        };

        return handle;

    });