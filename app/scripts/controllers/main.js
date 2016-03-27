'use strict';

/**
 * @ngdoc function
 * @name myBuilderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myBuilderApp
 */
angular.module('myBuilderApp')
  .controller('MainCtrl', function ($scope,websiteData,historyLog,webData) {
        $scope.allData=webData;
        $scope.websiteData=$scope.allData[0];
        websiteData.setActivePage($scope.websiteData.ID);

        $scope.modelState='web';
        $scope.selectModel=function(type){
            $scope.modelState=type;
        }

        $scope.changePage=function(ID){
            //清除历史纪录
            historyLog.clearAll();
            for(var i=0;i<$scope.allData.length;i++){
                if(ID===$scope.allData[i].ID){
                    $scope.allData=websiteData.getWebsiteDataForCache();
                    $scope.websiteData=$scope.allData[i];
                    websiteData.setActivePage($scope.websiteData.ID);
                    break;
                }
            }
            historyLog.clearAll();
            $scope.$broadcast("refreshPage",$scope.websiteData);
        }

        $scope.forward=function(){
            //发送命令
            var e = jQuery.Event("keydown");//模拟一个键盘事件
            e.keyCode = 89;
            e.ctrlKey=true;
            $(document).trigger(e);//模拟按下回车
        }
        $scope.retreat=function(){
            //发送命令
            var e = jQuery.Event("keydown");//模拟一个键盘事件
            e.keyCode = 90;
            e.ctrlKey=true;
            $(document).trigger(e);//模拟按下回车
        }

        $scope.save=function(){
            var seen = [];
            var json=JSON.stringify(websiteData.getFullDataForCache(), function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        //循环引用，插入指针即可
                        var target=jQuery.extend(true, [], val.target);
                        val={"isPointer":"true",target:target}
                    }
                    seen.push(val);
                }
                return val;
            });
            console.log(json);
        }

  });
