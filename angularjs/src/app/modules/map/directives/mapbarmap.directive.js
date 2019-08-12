(function () {
    'use strict';

    angular
        .module('angularMapbarMap')
        .directive('mapbarMap', mapbarMap);

    /** @ngInject */
    //<div mapbar-map center="北京市" level=10 map-id="mapId"></div>
    var defaultAttr = {
        center: '北京市',
        level: 10,
        mapId: 'map'
    };
    var key = 'mapbar-plugins-load';


    function mapbarMap($window, $rootScope, MapbarMapService, mapbarMapConfig, $timeout) {
        var mcfg = mapbarMapConfig;

        function initMap(element, center, level, mcfg) {
            center = center || defaultAttr.center;
            level = angular.isUndefined(level) ? defaultAttr.level : +level;
            var maplet = new Maplet(element.children()[0]);
            maplet.setZoomLevelRange(4, 18);
            maplet.centerAndZoom(new MPoint(center), level);
            maplet.showOverview(true, mcfg.overview);
            maplet.showScale(mcfg.scale);
            mcfg.standardControl && maplet.addControl(new MStandardControl());
            maplet.clickToCenter = mcfg.clickToCenter;
            return maplet;
        }

        function setMap(scope, element, attr) {
            try {
                angular.isUndefined(scope.mapCount) && (scope.mapCount = 0);
                scope.mapCount++;
                var mapId = attr.mapId || defaultAttr.mapId + '_' + new Date().valueOf;
                element.css({
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                });
                element.append($('<div>'));
                var maplet = scope[mapId] = initMap(element, attr.center, attr.level, mcfg);

                var parent = element.parent();
                var width = parent.width(),
                    height = parent.height();

                if (width < 0) {
                    width = 0;
                }

                if (height < 0) {
                    height = 0;
                }


                maplet.resize(width, height);
                angular.element($window).on('resize', function () {
                    $timeout(function () {
                        try {
                            element && maplet.resize(parent.width(), parent.height());
                        } catch (e) {
                            // just catch exception and do log，no reason
                            console.log(e);
                        }
                    }, 50);
                });
                angular.element($window).trigger('resize');

           maplet.decrement = function () {
               var maplet = scope[mapId];
               maplet && delete maplet.decrement;
               maplet && maplet.finalize();
               delete scope[mapId];
               element.empty();
               element = undefined;
               maplet = undefined;
               decrement();
           };

           var decrement = $rootScope.$on('$stateChangeSuccess', function () {
               maplet && maplet.decrement();
           });


                MapbarMapService.mapCount();
            scope.$on('$destroy',function () {
                MapbarMapService.decrement(['mapId'])
            });
            } catch (e) {
                // mapbar's map had also crash and we don't know reasons
                console.log();
            }
        }

        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if ($rootScope[key]) {
                    setMap($rootScope, element, attr);
                } else scope['$on'](key, function () {
                    setMap($rootScope, element, attr);
                });
            }
        }
    }
})();