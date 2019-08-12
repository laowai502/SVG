(function () {
    'use strict';

    angular.module('WeComponents')

        .directive('weLocation', function (MapService) {
            return {
                template: '',
                replace: false,
                scope: {
                    lat: '=',
                    lng: '='
                },
                link: function (scope, elements, attrs) {
                    elements.text('正在解析');
                    scope.elements = elements;

                    var parse = function () {
                        if (scope.lat && scope.lng) {
                        	
                        	if(scope.lat == '0.0' || scope.lng == '0.0'){
                        		scope.elements.text('');
                        		return false;
                        	}
                        	
                            scope.elements.text('正在解析');

                            MapService.reverseCodeAddress(scope.lat, scope.lng)
                                .then(function (result) {
                                    //var address = result.data.province+' '+' '+ result.data.city+' '+;
                                    if (result.data.province && result.data.province.value == '直辖市') {
                                        result.data.province.value = '';
                                    }

                                    var address = (result.data.province && result.data.province.value || '') +
                                        (result.data.city && result.data.city.value || '') +
                                        (result.data.area && result.data.area.value || '') +
                                        (result.data.dist && result.data.dist.value || '') +
                                        (result.data.town && result.data.town.value || '') +
                                        (result.data.village && result.data.village.value || '');

                                    if (address == '' || address == null) {
                                        scope.elements.text('该坐标点无位置信息');
                                    } else {
                                        scope.elements.text(address);
                                    }
                                }, function (error) {
                                    scope.elements.text(error);
                                });

                        } else if ((scope.lat == '' || scope.lng == '') || (scope.lat == null || scope.lng == null)) {
                            scope.elements.text('');
                        } else {
                            scope.elements.text('经纬度无效');
                        }
                    };
                    
                    scope.$watchGroup(['lat', 'lng'], function () {
                        parse();
                    });

                    if (scope.lat && scope.lng) {
                        parse();
                    } else
                        scope.elements.text('经纬度无效');
                }
            }
        });
})();