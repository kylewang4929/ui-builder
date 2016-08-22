"use strict";
angular.module('kyle.imageLibrary', [])
    .directive('imageLibrary', function (imageLibraryService) {
        return {
            restrict: 'A',
            templateUrl: 'views/imageLibrary/main.html',
            link: function (scope, element, attrs) {

                scope.maxSelectSize= imageLibraryService.getMaxSelectSize();

                scope.cancel = function () {
                    imageLibraryService.hideDowm();
                };
                scope.confirm = function () {
                    imageLibraryService.hideDowm();
                };

                scope.categoryList = [
                    { id: '1', name: '所有图片' },
                    { id: '2', name: '背景图' },
                ];
                scope.imageList = [
                    { url: 'images/website/bg1.jpg' },
                    { url: 'images/website/pc.png' },
                ];

                //当前选中的
                scope.selectedList=[];
                
                scope.activeCategory = scope.categoryList[0];
                scope.selectCategory = function (obj) {
                    scope.activeCategory = obj;
                }

                $(element).on("click", function (e) {
                    if (element[0] === e.target) {
                        imageLibraryService.hideDowm();
                    }
                });

            }
        };
    })
    .directive('imageList', function () {
        return {
            restrict: 'AE',
            template:
            '<div class="image-library-image-list">' +
            '<div ng-repeat="rowData in listData" class="image-library-image-item">' +
            '<div class="inner" ng-class="{true:\'active\'}[rowData.isSelect==true]" ng-click="selectImage(rowData)" ng-style="{\'background-image\':\'url(\'+rowData.url+\')\'}">' +
            '<div class="select-flag"><i class="mdi mdi-check"></i></div>' +
            '</div>' +
            '</div>' +
            '</div>',
            scope: {
                listData: '=',
                selectedList: '=',
                maxSelectSize:'='
            },
            link: function (scope, element, attrs) {

                if (scope.selectedList == undefined) {
                    scope.selectedList = [];
                }

                //选中图片的方法
                scope.selectImage = function (imageObj) {
                    if (imageObj.isSelect) {
                        //已经被选中的话这里的操作就是取消选中
                        imageObj.isSelect = false;
                        var deleteIndex = -1;
                        //遍历图片
                        angular.forEach(scope.selectedList, function (obj, index) {
                            if (obj == imageObj) {
                                deleteIndex = index;
                            }
                        });
                        //删除
                        if (deleteIndex != -1) {
                            scope.selectedList.splice(deleteIndex, 1);
                        }
                        
                    } else {
                        //选中元素
                        imageObj.isSelect = true;
                        scope.selectedList.push(imageObj);
                        if(scope.selectedList.length > scope.maxSelectSize){
                            //超过了约定的大小把第一个删除
                            scope.selectedList[0].isSelect=false;
                            var removeImage = scope.selectedList.splice(0,1);
                        }
                    }
                }

            }
        };
    })
    .factory('imageLibraryService', function ($rootScope, $compile, $timeout) {
        var data = {};

        var imageLibraryDom = "";

        var maxSelectSize = 1;

        var handle = {
            createDom: function () {
                var dom = $compile("<div class='my-modal-box' image-library></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);

                return dom;
            },
            showDom: function (maxSelect) {

                if(!!maxSelect){
                    maxSelectSize = maxSelect;                    
                }

                if (imageLibraryDom === "") {
                    imageLibraryDom = this.createDom();
                } else {

                }
                //返回承诺
                $timeout(function () {
                    imageLibraryDom.addClass("open");
                }, 100);
            },
            hideDowm: function (data) {
                imageLibraryDom.removeClass("open");
                //把data抛回去
            },
            removePlugin: function () {
                if (imageLibraryDom !== "") {
                    imageLibraryDom.remove();
                }
            },
            getMaxSelectSize:function(){
                return maxSelectSize;
            },
            //获取图片的分类
            getImageCategory:function(type){},
            //获取图片列表
            getImageList:function(category){}
        };

        return handle;
    });