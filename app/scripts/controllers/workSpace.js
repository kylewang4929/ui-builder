'use strict';

/**
 * @ngdoc function
 * @name myBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the myBuilderApp
 */
angular.module('myBuilderApp')
    .controller('workSpaceCtrl', function ($scope,websiteData) {

    })
    .controller('insertEleCtrl', function ($scope,eleResourceTemplate) {
        $scope.eleList=eleResourceTemplate.getEleList();

        $scope.activeEle=$scope.eleList[0];

        $scope.selectEleType=function(ele){
            $scope.activeEle=ele;
        };

    })
    .controller('leftMenuCtrl', function ($scope) {
        $scope.scrollOption={height :"100%",width :"80px"};

        $scope.activeMenu="";


        $scope.openMenu=function(type){
            if(type===$scope.activeMenu){
                $scope.activeMenu="";
            }else{
                $scope.activeMenu=type;
            }
        };

        $scope.closeMenu=function(){
            $scope.activeMenu="";
        };

        $scope.$on("closeLeftMenu",function(){
            $scope.closeMenu();
        });

    })
    .controller('editorCtrl', function ($scope,websiteData,textEditorService,colorPickService,eleSettingService) {

        $scope.$on("$destroy",function(){
            colorPickService.removePlugin();
            textEditorService.removePlugin();
            eleSettingService.removePlugin();
        });

    })
    .controller('previewBoxCtrl', function ($scope,websiteData,elePosition,levelScroll,$timeout) {
        $scope.activeSession=$scope.websiteData.sessionList[0].ID;
        $scope.eleList=$scope.websiteData.sessionList[0].eleList;
        $scope.selectLayers=function(ID){
            $scope.activeSession=ID;
            for(var i=0;i<$scope.websiteData.sessionList.length;i++){
                if(ID===$scope.websiteData.sessionList[i].ID){
                    $scope.eleList=$scope.websiteData.sessionList[i].eleList;
                    return;
                }
            }
        };

        function locateEle(mainScrollHandle,ele,type){
            var eleDom = $('#'+ele.ID);            
            var y = elePosition.getTop(eleDom.get(0));
            var start = mainScrollHandle.scrollTop();
            var scrollEnd = 0;
            scrollEnd = y + eleDom.height() / 2 - 50 - $("body").height() / 2;
            levelScroll.scrollTop(mainScrollHandle, scrollEnd , Math.abs(scrollEnd - start)/30);
            $scope.closeMenu();

            if(type == 'ele'){
                //选中元素
                $timeout(function () {
                    if(ele.type == 'group'){
                        eleDom.find('>.ele-box >.group-over').trigger("mousedown");
                    }else{
                        eleDom.trigger("mousedown");
                    }
                    $(document).trigger("mouseup");
                });
            }
        }
        $scope.locateEleForWeb = function(ele,type){
            var mainScrollHandle = $('#main-editor-scroll');            
            locateEle(mainScrollHandle,ele,type);
            
        }
        $scope.locateEleForPhone = function(ele,type){
            var mainScrollHandle = $('#main-editor-scroll .phone-edit-space-box >.scroller-page');            
            locateEle(mainScrollHandle,ele,type);
            
        }

        //隐藏元素的方法
        $scope.toggleEle=function(ID,state){
            if(state!==false){
                websiteData.hideEle(ID);
            }else{
                websiteData.showEle(ID);
            }
        };

        $scope.toggleSession=function(ID,state){
            if(state!==false){
                websiteData.hideSession(ID);
            }else{
                websiteData.showSession(ID);
            }
        };

    })
;
