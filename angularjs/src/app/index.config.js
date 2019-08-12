(function () {
    'use strict';

    angular
        .module('CommericalConcreteWeb')
        .config(config);

    /** @ngInject */
    function config($logProvider, $locationProvider, $urlRouterProvider, toastrConfig, SsoServiceProvider, blockUIConfig, RequestServiceProvider, CommonServiceProvider, Urls, mapbarMapConfig) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 2000;
        toastrConfig.positionClass = 'toast-top-center';
        toastrConfig.preventDuplicates = false;
        toastrConfig.progressBar = true;

        //$locationProvider.html5Mode(true).hashPrefix('*');
        $locationProvider.hashPrefix('');
        SsoServiceProvider.setServiceUrl(Urls.ssoUrl);
        RequestServiceProvider.setBaseServiceUrl(Urls.serviceUrl);
        RequestServiceProvider.serializeObjectToString(true);
        CommonServiceProvider.setServiceUrl(Urls.serviceUrl);

        mapbarMapConfig.domain = 'http://api.mapbar.com/';

        blockUIConfig.delay = 200;
        blockUIConfig.autoBlock = false;
        blockUIConfig.template =
            '<div class="block-template" style="width: 100%; height: 100%;">\
                <div class="spinner">\
                    <div class="bounce1"></div>\
                    <div class="bounce2"></div>\
                    <div class="bounce3"></div>\
                </div>\
            </div>';
        blockUIConfig.resetOnException = true;


        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $rootScope = $injector.get('$rootScope');
            var $state = $injector.get('$state');
            var Message = $injector.get('Message');
            console.info($state)
            if ($rootScope.logined) {
//              var state = $rootScope.getHomeState($rootScope.userRoleCodes);
//              if (_.isEmpty(state)) {
//                  $state.go('main.car');
//              } else {
//                  $state.go(state.name);
//              }
//              var state = $rootScope.getHomeState($rootScope.userRoleCodes);
//				if(_.isEmpty(state)) {
//					Message.error('没有默认首页，请联系管理员');
//				} else {
//					$state.go(state.name);
//				}
            } else {
                $state.go('home');
            }
        });
    }
})();
