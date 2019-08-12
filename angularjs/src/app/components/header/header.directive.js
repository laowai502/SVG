/**
 * Created by Administrator on 2018/8/8.
 */
(function () {
    'use strict';

    angular
        .module('WeComponents')
        .directive('weHeader', weHeader);

    /** @ngInject */
    function weHeader($rootScope) {
        return {
            restrict: 'AE',
            templateUrl: 'app/components/header/header.html',
            link: function (scope,atrr,element) {

                
               

            }
        };
    }
})();
