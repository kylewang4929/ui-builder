"use strict";
angular.module('kyle.imageLibrary', [])
    .directive('imageLibrary', function (imageLibraryService) {
        return {
            restrict: 'A',
            templateUrl: 'views/imageLibrary/main.html',
            link: function (scope, element, attrs) {

                scope.typeList=[
                    {ID:'MyImage',name:'我的图片'},
                    {ID:'CloundImage',name:'云图片'},
                ];

                scope.comfirm = function (){
                    imageLibraryService.comfirm(scope.selectedList);
                }

                scope.imageListLoadingFlag=false;

                scope.categoryList = [];
                scope.activeCategory = scope.categoryList[0];                
                scope.imageList = [];

                scope.selectType = function(obj){
                    if(scope.imageListLoadingFlag==true){
                        return;
                    }
                    scope.activeType=obj;
                    imageLibraryService.getImageCategory(scope.activeType).then(function(data){
                        scope.categoryList=data;
                        scope.activeCategory = data[0];
                        scope.imageListLoadingFlag=true;                        
                        imageLibraryService.getImageList().then(function(data){
                            scope.imageList=data;
                            scope.imageListLoadingFlag=false;
                        },function(){});
                    },function(){

                    });
                }

                scope.activeType = scope.typeList[0];                
                scope.selectType(scope.activeType);
                
                scope.maxSelectSize= imageLibraryService.getMaxSelectSize();

                scope.cancel = function () {
                    imageLibraryService.hideDowm();
                };
                scope.confirm = function () {
                    imageLibraryService.hideDowm();
                };

                //当前选中的
                scope.selectedList=[];
                
                scope.selectCategory = function (obj) {
                    if(scope.imageListLoadingFlag==true){
                        return;
                    }
                    scope.activeCategory = obj;
                    scope.imageListLoadingFlag=true;                    
                    imageLibraryService.getImageList().then(function(data){
                        scope.imageList=data;
                        scope.imageListLoadingFlag=false;                        
                    },function(){});
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
    .factory('imageLibraryService', function ($rootScope, $compile, $timeout,$q) {
        var data = {};
        var imageLibraryDom = "";
        var maxSelectSize = 1;
        var callback = null;

        var handle = {
            createDom: function () {
                var dom = $compile("<div class='my-modal-box' image-library></div>")($rootScope);
                dom = $(dom);
                $("body").append(dom);
                return dom;
            },
            showDom: function (maxSelect,fn) {
                this.callback = fn;
                //如果指定了最大值 默认是1
                if(!!maxSelect){
                    maxSelectSize = maxSelect;                    
                }
                if (imageLibraryDom === "") {
                    imageLibraryDom = this.createDom();
                }
                $timeout(function () {
                    imageLibraryDom.addClass("open");
                }, 100);
            },
            hideDowm: function (data) {
                imageLibraryDom.removeClass("open");
            },
            comfirm:function(data){
                imageLibraryDom.removeClass("open");
                if(this.callback!=null){
                    this.callback(data);
                    this.callback=null;
                }                
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
            getImageCategory:function(type){
                var deferred = $q.defer();
                //deferred.reject(data);
                $timeout(function(){
                    var resultData = [
                        { id: 'AllImage', name: '所有图片' },
                        { id: 'BG', name: '背景图' },
                    ];
                    deferred.resolve(resultData);
                });
                return deferred.promise;
            },
            //获取图片列表
            getImageList:function(){
                var deferred = $q.defer();
                //deferred.reject(data);
                $timeout(function(){
                    var resultData = [
                        { url: 'images/website/bg1.jpg' },
                        { url: 'images/website/icon.png' },
                    ];
                    deferred.resolve(resultData);
                },500);
                return deferred.promise;
            }
        };

        return handle;
    });