(function() {
    'use strict';
    angular
        .module('angularMapbarMap')
        .factory('MapbarMapService', function($rootScope) {
            var mapIds = [], mapFun;
            function mapCount(count) {
                if ($rootScope.mapCount == mapIds.length) run();
            }

            function run() {
                mapFun && mapFun();
                delete $rootScope.mapCount;
                mapFun = null;
                mapIds = [];
            }

            function ready(ids, fun) {
                ids && ids.length && (mapIds = ids);
                fun && (mapFun = fun);
            }
            
            function decrement(ids, fun) {
                ids = ids || [];
                var d = false;
                angular.forEach(ids, function (v) {
                    var map = $rootScope[v];
                    map && (d = true);
                    map && map.decrement();
                });
                d && fun && fun();
            }
            return {
                mapCount: mapCount,
                ready: ready,
                decrement: decrement
            };
        });
})();