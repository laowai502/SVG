(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('MapService', function ($compileProvider) {
            var baseUrl = 'http://wedrive.mapbar.com';
            var reverseCodeKey = '3611795f941b47048c2be2c7f0e3261f';
            var localSearchKey = '3611795f941b47048c2be2c7f0e3261f';
            var heatMapUrl = '/monitor/car/queryThermodynamic';


            this.$get = function ($log, $q, $compile, $http, $window, blockUI, Urls, CarService, MarkerService, RequestService) {
                return {
                    searchLocallly: function (keywords, center) {
                        return $http({
                            method: 'get',
                            url: baseUrl + '/opentsp/gis/api/search/around',
                            params: {
                                location: center.lng + ',' + center.lat,
                                city: '全国',
                                ak: localSearchKey,
                                keywords: keywords
                            }
                        });
                    },
                    reverseCodeAddress: function (lat, lng) {
                        var deferred = $q.defer();
                        $http({
                            method: 'get',
                            url: baseUrl + '/opentsp/gis/api/inverse',
                            params: {
                                lon: lng,
                                lat: lat,
                                ak: reverseCodeKey,
                                zoom: 10,
                                detail: 0
                            },
                            ignoreLoadingBar: true
                        })
                            .then(function (result) {
                                result.data = result.data || {};

                                if (result.data.province && result.data.province.value == '直辖市') {
                                    result.data.province.value = '';
                                }

                                var address = (result.data.province && result.data.province.value || '') +
                                    (result.data.city && result.data.city.value || '') +
                                    (result.data.area && result.data.area.value || '') +
                                    (result.data.dist && result.data.dist.value || '') +
                                    (result.data.town && result.data.town.value || '') +
                                    (result.data.village && result.data.village.value || '');

                                result.data.address = address;

                                deferred.resolve(result);
                            }, function (error) {
                                deferred.reject(error);
                            });

                        return deferred.promise;
                    },
                    searchCity: function (cityName) {
                        return $http({
                            method: 'get',
                            url: baseUrl + '/opentsp/gis/api/search/geo',
                            params: {
                                city: cityName,
                                keywords: cityName,
                                ak: localSearchKey
                            }
                        });
                    },
                    /*
                    * 获取热力图区块
                    * centerPoint: 中心点坐标
                    * centerRadius: 中心点距离左上角的距离
                    * time 查询时间范围
                    */
                    queryHeatMap: function (centerPoint, centerRadius, time) {
                        var deferred = $q.defer();
                        RequestService.get(heatMapUrl,
                            {
                                heatMaplatitude: centerPoint.lat,
                                heatMaplongitude: centerPoint.lng,
                                heatMapradius: centerRadius,
                                time: time
                            })
                            .then(function (res) {
                                res.list = _.map(res.list, function (item) {
                                    item.rightBottom = { lat: item.west, lng: item.south };
                                    item.rightTop = { lat: item.west, lng: item.north };
                                    item.leftBottom = { lat: item.east, lng: item.south };
                                    item.leftTop = { lat: item.east, lng: item.north };

                                    return item;
                                });

                                deferred.resolve(res);
                            }, function (error) {
                                deferred.reject(error);
                            });

                        return deferred.promise;
                    },
                    /*
                    * 获取热力图区块
                    * centerPoint: 中心点坐标
                    * centerRadius: 中心点距离左上角的距离
                    * time 查询时间范围
                    */
                    showHeatMap: function (maplet, list, brush) {
                        var result = [];
                        result.overlay = _.map(list, function (item) {
                            var overlay = new MPolyline([
                                new MPoint(item.leftTop.lat, item.leftTop.lng),
                                new MPoint(item.leftBottom.lat, item.leftBottom.lng),
                                new MPoint(item.rightBottom.lat, item.rightBottom.lng),
                                new MPoint(item.rightTop.lat, item.rightTop.lng)
                            ], brush);

                            maplet.addOverlay(overlay);
                            var centerOverlay = overlay.getCenterXY();
                            var label = new MPanel({
                                pin: true,
                                // String类型或者Dom对象,显示内容，支持HTML字符串和Dom对象。  
                                content: '<span class="heat-map-label">' + item.count + '</span>',
                                // Object类型,显示位置 。  
                                location: {
                                    type: "xy",
                                    x: centerOverlay.x,
                                    y: centerOverlay.y
                                },
                                mousewheel: false
                            });
                            maplet.addPanel(label);

                            result.push({
                                overlay: overlay,
                                label: label
                            });

                        });
                        return result;
                    },

                    /*
                    * 展示车次区域按钮
                    */
                    createTrainsControls: function (mapId) {
                        var controls = new MPanel({
                            pin: false,
                            zindex: 99999,
                            content: '<div class="btn-group train-map-pen">\
                                    <button type="button" class="btn btn-primary" onclick="onClickTrainsButton(\''+ mapId + '\',0)">\
                                       拖动\
                                    </button>\
                                    <button type="button" onclick="onClickTrainsButton(\''+ mapId + '\',1)" class="btn btn-primary">\
                                       圆形\
                                    </button>\
                                </div>',
                            location: {
                                type: "xy",
                                x: 90,
                                y: 15
                            }
                        });

                        return controls;
                    },
                    /*
                    * 路况
                    */
                    showTraffic: function (map, toggled) {
                        // 路况
                        var trafficLayer = null;

                        if (!toggled || toggled === false) {
                            // 关闭
                            if (map.trafficLayer) {
                                map.removeLayer(map.trafficLayer);
                            }
                        } else {

                            trafficLayer = new MLayer({
                                serverPath: CONF.trafficMapUrl
                            });

                            trafficLayer.setImgUrlPreprocessor({
                                fun: function (grid) {	//服务地址预处理函数
                                    var _imgUrlPath = [];
                                    _imgUrlPath.push(CONF.trafficMapUrl);
                                    // _imgUrlPath.push('city=' + 'shanghai');
                                    _imgUrlPath.push('&' + grid.filename);
                                    _imgUrlPath.push('&_=' + new Date().valueOf());
                                    return _imgUrlPath.join('');
                                }
                            });


                            map.addLayer(trafficLayer);
                            map.trafficLayer = trafficLayer;
                        }
                    },
                    // 卫星图
                    showSatellite: function (map, toggled) {
                        if (toggled && toggled === false) {
                            // 关闭
                            maplet.setBasemapImg();
                        } else {
                            // 打开
                            map.setBasemapImg({
                                imgUrlProcessor: function (bx, by, zoom) {
                                    return Urls.satelliteMapPath + zoom + '/' + bx + '/' + by + '/';
                                }
                            });
                        }
                    },
                    showTrainsControls: function (map, controls) {
                        map.addPanel(controls);
                    },
                    closeTrainsControls: function (map, controls) {
                        map.removePanel(controls);
                    },
                    getDistance: function (map, p1, p2) {
                        return map.measDistance([new MPoint(p1.lng, p1.lat), new MPoint(p2.lng, p2.lat)]);
                    },
                    /**
                     * 根据标注点坐标范围计算显示缩放级别zoom自适应显示地图
                     * @param {Object} maplet
                     * @param {Array} points
                     */
					autoZoom: function(maplet, points) {
						var returnObj = {},
							maxLng = points[0].lng || points[0].lon,
							minLng = points[0].lng || points[0].lon,
							maxLat = points[0].lat,
							minLat = points[0].lat,
							res;
						for(var i = points.length - 1; i >= 0; i--) {
							res = points[i];
							if (res.lng > maxLng) maxLng = res.lng;
							if (res.lng < minLng) minLng = res.lng;
							if (res.lat > maxLat) maxLat = res.lat;
							if (res.lat < minLat) minLat = res.lat;
						};
						var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2,
							cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2,
							zoom = [ //级别18到3。
								"50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000",
								"50000", "100000", "200000", "500000", "1000000", "2000000"
							],
							distance = maplet.measDistance([new MPoint(maxLng, maxLat), new MPoint(minLng, minLat)]).toFixed(1); //获取两点距离,保留小数点后两位
						
						for(var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
							if(zoom[i] - distance > 0) {
								returnObj.zoom = 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上，所以级别会增加3
								break;
							}
						};
						returnObj.cenLng = cenLng;
						returnObj.cenLat = cenLat;
						return returnObj;
					}
                }
            }
        });
})();

