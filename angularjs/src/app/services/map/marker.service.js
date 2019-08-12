(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('MarkerService', function ($compileProvider) {
            this.$get = function ($log, $timeout, $compile, CarService) {
                return {
                    showPolymer: function (maplet, args) {
                        var label = new MPanel({
                            pin: true,
                            content: '<a class="polymer" onclick="onClickPolymer('+args.latitude+','+args.longitude+')">' + args.count + '</a>',
                            location: {
                                type: 'latlon',
                                pt: new MPoint(args.lng || args.longitude, args.lat || args.latitude),
                            },
                            mousewheel: true
                        });
                        maplet.addPanel(label);
                        return label;
                    },
                    showOnlyIconMarker: function (iconUrl, lat, lng, width, height,anchorX,anchorY) {
                        var marker = new MMarker(
                            new MPoint(lng, lat),
                            new MIcon(iconUrl, width, height, anchorX, anchorY)
                        );

                        return marker;
                    },
                    showCarMarker: function (maplet, car, opt) {
                        var option = _.defaults(opt || {}, {
                            //icon: CarService.getDirectIcon(car.carStauts, car.direction),
                            //icon: './assets/images/vehicle.png',
                            icon: CarService.getDirectIcon(car.carStauts, car.carDirection || 0),
                            iconWidth: 32,
                            iconHeight: 32,
                            label: car.name + ' ' + (car.driverName || ''),
                            labelCloseTimeout: false,
                            labelCloseTimeoutValue: 5000
                        });

                        var defaultIconUri = './assets/images/vehicle.png';
                        var defaultIconWidth = 32;
                        var defaultIconHeight = 32;
                        var lat = parseFloat(parseFloat(car.lat || car.latitude).toFixed(5));
                        var lng = parseFloat(parseFloat(car.lng || car.longitude).toFixed(5));

                        var marker = new MMarker(
                            new MPoint(lng, lat),
                            option.icon ? new MIcon(option.icon, option.iconWidth, option.iconHeight) : new MIcon(defaultIconUri, defaultIconWidth, defaultIconHeight),
                            null,
                            option.label ? new MLabel(option.label, {
                                xoffset: 0,
                                yoffset: 0
                            }) : null
                        );

                        // 超过5秒后自动隐藏 label
                        if (option.labelCloseTimeout) {
                            (function (marker, car) {
                                if (option.labelCloseTimeoutValue == 0) {
                                    marker.setLabel(null);
                                } else {
                                    var handler = $timeout(function () {
                                        marker.setLabel(null);
                                    }, option.labelCloseTimeoutValue || 5000);
                                }

                                var onMouseOver = function () {
                                    if (handler) {
                                        $timeout.cancel(handler);
                                        handler = null;
                                    }

                                    marker.setLabel(option.label ? new MLabel(option.label, {
                                        xoffset: 5,
                                        yoffset: 0
                                    }) : null);
                                };

                                var onMouseOut = function () {
                                    marker.setLabel(null);
                                };

                                MEvent.addListener(marker, "mouseover", onMouseOver);
                                MEvent.addListener(marker, "mouseout", onMouseOut);
                            })(marker, car);
                        }

                        maplet.addOverlay(marker);

                        return marker;
                    },
                    removeMarker: function (maplet, marker) {
                        return maplet.removeOverlay(marker);
                    },
                    setMarkerLocation: function (marker, car) {
                        marker.setPoint(new MPoint(car.lng || car.longitude, car.lat || car.latitude));
                    },
                    centerOrZoom: function (maplet, lng, lat, zoom) {
                        maplet.centerAndZoom((lng && lat && new MPoint(lng, lat || car.latitude)) || maplet.getCenter(), zoom || maplet.getZoomLevel());
                    },
                    setLocalSearchMarker: function (maplet, args) {
                        var marker = new MMarker(new MPoint(args.lng || args.longitude, args.lat || args.latitude),
                            new MIcon("./assets/images/follow.png", 26, 37));
                        var content =
                            '<div>地址 ' + (args.address || '暂无') + '</div>' +
                            '<div>电话 ' + (args.phone || '暂无') + '</div>';

                        maplet.addOverlay(marker);
                        marker.setInfoWindow(new MInfoWindow(args.name, content));

                        return marker;
                    },
                    showRiskMarker: function (maplet, risk, brush) {
                        var overlay = null;
                        var label = null;
                        var content = '<span class="risk-label">' + risk.regionName + '</span>';
                        //1矩形，2多边形，3圆形
                        switch (risk.regionType) {
                            case 1:
                            case 2:
                            case 4:
                                overlay = new MPolyline(_.map(risk.points, function (point) {
                                    return new MPoint(point.lng, point.lat)
                                }), brush);
                                maplet.addOverlay(overlay);

                                label = new MPanel({
                                    pin: true,
                                    content: content,
                                    location: {
                                        type: 'latlon',
                                        pt: overlay.getCenterPt()
                                    },
                                    mousewheel: true
                                });
                                maplet.addPanel(label);
                                break;

                            case 3:
                                var center = new MPoint(risk.points[0].lng, risk.points[0].lat);
                                overlay = new MEllipse(center, risk.radius, 0, brush);
                                label = new MPanel({
                                    pin: true,
                                    content: content,
                                    location: {
                                        type: 'latlon',
                                        pt: center
                                    },
                                    mousewheel: true
                                });
                                maplet.addOverlay(overlay);
                                maplet.addPanel(label);
                                break;
                        }

                        return {
                            overlay: overlay,
                            label: label
                        };
                    },
                    showDealerMarker: function (maplet, dealer) {
                        var lng = dealer.lng ? dealer.lng : dealer.longitude;
                        var lat = dealer.lat ? dealer.lat : dealer.latitude;
                        var marker = new MMarker(
                            new MPoint(lng, lat),
                            new MIcon("./assets/images/serMarker.png", 21, 30)
                        );

                        MEvent.addListener(marker, 'mouseover', function () {
                            marker.setLabel(new MLabel(dealer.name, {
                                xoffset: 0,
                                yoffset: 0,
                            }));
                        });

                        MEvent.addListener(marker, 'mouseout', function () {
                            marker.setLabel(null);
                        });

                        maplet.addOverlay(marker);
                        return marker;
                    },
                    showStationMarker: function (maplet, station) {
                        var lng = station.lng ? station.lng : station.longitude;
                        var lat = station.lat ? station.lat : station.latitude;
                        var marker = new MMarker(
                            new MPoint(lng, lat),
                            new MIcon("./assets/images/serMarker.png", 21, 30)
                        );

                        MEvent.addListener(marker, 'mouseover', function () {
                            marker.setLabel(new MLabel(station.stationName || '', {
                                xoffset: 0,
                                yoffset: 0,
                            }));
                        });

                        MEvent.addListener(marker, 'mouseout', function () {
                            marker.setLabel(null);
                        });

                        maplet.addOverlay(marker);
                        return marker;
                    }
                }
            }
        });
})();

