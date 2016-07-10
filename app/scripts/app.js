'use strict';

/**
 * @ngdoc overview
 * @name myBuilderApp
 * @description
 * # myBuilderApp
 *
 * Main module of the application.
 */
angular
    .module('myBuilderApp', [
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        "ui.router",
        "lumx",
        'oc.lazyLoad',
        "ui.slimscroll",
        "kyle.editor",
        "kyle.colorPick",
        "kyle.rightClickMenu",
        "perfect_scrollbar",
        "multipleChoice",
        "kyle.eleSetting",
        "webSiteEditor",
        "phoneSiteEditor",
        "sessionEditor",
        "historyLog",
        "dataService",
        "creator",
        "browserInfo",
        "shortcuts",
        "insert.directive",
        "eleMenu",
        "addSession",
        "kyle.imageLibrary",
        "kyle.imageCrop"   
    ])
    .config(function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });


        $urlRouterProvider.otherwise("/index/workSpace");

        $stateProvider

            .state('index', {
                abstract: true,
                url: "/index",
                templateUrl: 'views/common/top_nav.html',
                controller:"MainCtrl",
                resolve:{
                    webData: function (websiteData) {
                        return websiteData.getWebsiteData()
                            .then(function (res) {
                                return res;
                            }, function (err) {
                                return false;
                            });
                    }
                }
            })
            .state('index.workSpace', {
                url: "/workSpace",
                templateUrl:  'views/builder/workSpace.html',
                controller: "workSpaceCtrl"
            })
        ;
    });
