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
            $scope.activeEleList=ele;
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
    .controller('previewBoxCtrl', function ($scope,websiteData) {
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
