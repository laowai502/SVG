(function() {
	'use strict'

	angular.module('WeServices').service('CarService', CarService);

	function CarService(RequestService, Urls) {
		return {
			fetchUrl: '/monitor/car/queryAsyncTree',

			fetch: function (parentID) {
                return RequestService.get('/monitor/car/querySearchTree', {
                    id: parentID
                });
            },
			/**
			 * 通用获取车辆和司机信息
			 * @param {String} tid 终端ID
			 */
			queryCarAndDriverInfo: function(tid) {
				return RequestService.get('/safeplatform/queryCarAndDriverInfo', {
					terminalId: tid
				});
			},
			/**
			 * 车辆监控-获取车辆信息详情
			 * @param {String} carId 车辆ID
			 */
			getCatLoc: function(carId) {
				return RequestService.get('/monitor/car/queryCarLoc', {
					id: carId
				});
			},
			/**
			 * 车辆监控-获取车辆实时位置
			 * @param {String} carId 车辆ID
			 */
			getCatTrip: function(carId) {
				return RequestService.get('/monitor/car/queryCarTip', {
					id: carId
				});
			},
			/**
			 * 获取车辆轨迹(抽析，同App)
			 * @param {String} carId 车辆ID
			 * @param {String} beginDate yyyyMMdd 起始日期
			 * @param {String} endDate yyyyMMdd 结束日期
			 */
			getCarTrack: function(carId, beginDate, endDate, zoom) {
				return RequestService.post(
					'/monitor/car/trackVacuate',
					{
//						carId: 100280015,
//						beginDate: '2019-03-01 16:23:33',
//						endDate: '2019-03-01 16:27:33',
//						level: 7
						carId: carId,
						beginDate: beginDate,
						endDate: endDate,
						level: zoom
					}
				);
			},
			//========================车辆状态图片===========================================================================//
            getStatusIcon: function(carStauts) {
            	switch(carStauts) {
            		// 在线行驶(7)，在线停车(3)，在线不定位(1)，不在线行驶(6),不在线停车(2)，不在线不定位(0) 第一位表示在线状态（0：不在线，1：在线）
            		case 7:
            			return "assets/images/VehicleStatusOnline1.png";
            		case 3:
            			return "assets/images/VehicleStatusOnlineStop1.png";
            		case 1:
            			return "assets/images/VehicleStatusOnlineInvalid1.png";
            		case 6:
            			return "assets/images/VehicleStatusOfflineStop1.png";
            		case 2:
            			return "assets/images/VehicleStatusOfflineStop1.png";
            		case 0:
            			return "assets/images/VehicleStatusOfflineStop1.png";

            		default:
            			return '';
            	}
            },
            getStatusIconOnMap: function (carStauts) {
                switch (carStauts) {
                    // 0：离线；1：静止；2：行驶在线
                    case 0:
                        return "./assets/images/car_offline_onmap.png";
                    case 2:
                        return "./assets/images/car_driving_onmap.png";
                    case 1:
                        return "./assets/images/car_stay_onmap.png";
                    default:
                        return '';
                }
            },
            /**
             * 获取车辆方向
             * @param {Number} carStauts 0，离线 1，静止 2，在线
             * @param {Number} carDirection 0~360 方向图标
             */
            getDirectIcon: function (carStauts, carDirection) {
            	carStauts = parseInt(carStauts);
            	carDirection = parseInt(carDirection);
                var statusIconStuff = '',
                	result = '';
                switch (carStauts) {
                    case 2:
                        statusIconStuff = 'Online1';
                        break;
                    case 1:
                        result = "./assets/images/ic-tz-2.png";
                        break;
                    case 0:
                        statusIconStuff = 'Offline1';
                        break;
                    default:
                        return '';
                }
                if (carStauts == 0 || carStauts == 2) {
                    if (carDirection == 0) {
                        result = "./assets/images/iFriends" + statusIconStuff + ".png";
                    } else if (0 < carDirection && carDirection < 90) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_7.png";
                    } else if (carDirection == 90) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_6.png";
                    } else if (90 < carDirection && carDirection < 180) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_5.png";
                    } else if (carDirection == 180) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_4.png";
                    } else if (180 < carDirection && carDirection < 270) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_3.png";
                    } else if (carDirection == 270) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_2.png";
                    } else if (270 < carDirection && carDirection < 359) {
                        result = "./assets/images/iFriends" + statusIconStuff + "_1.png";
                    } else {
                        result = "./assets/images/iFriends" + statusIconStuff + ".png";
                    }
                }
                return result;
            },
            //===============================================轨迹解密==============================================//
            traceDecrypt: function(data) {
            	var d = angular.copy(data),
            		firstTime = d.firstTime;
            	delete d.firstTime;
            	var _decodeNumberEx = function(line) {
            		var _EP_KEY = 6;
		            var i = 0;
		            var rets = [];
		            var strLen = line.length;
		            if (strLen <= 0) return rets;
		            while (i < strLen) {
		                var b = 0;
		                var shift = 0;
		                var result = 0;
		                var currkey = _EP_KEY;
		                do {
		                    b = (line.charCodeAt(i++)) - 63;
		                    var currValue = (((b >> 1) ^ (currkey++)) & 0x1f);
		                    result |= currValue << shift;
		                    shift += 5;
		                } while ((b & 0x1) == 0);
		                result = ((result & 0x01) == 0x01) ? ~(result >> 1) : (result >> 1);
		                rets.push(result);
		            }
		            return rets;
            	};
            	var _decodeTimes = function(times,  firstTime) {
            		times = _decodeNumberEx(times);
		            times[0] = firstTime;
		            return times;
            	};
            	var _decodeLevels = function(encoded) {
            		var result = [];
		            if (typeof encoded == "string" && encoded && encoded.indexOf(",") != -1) {
		                var levelstr = encoded.split(",");
		                for (var i = 0; i < levelstr.length; i++) {
		                    var items = _decodeNumberEx(levelstr[i]);
		                    var x = 0;
		                    for (var j = 0; j < items.length; j ++) {
		                        x += items[j];
		                        result[x] = i + 1;
		                    }
		                }
		            }
		            return result;
            	};
            	var _decodeData = function(data) {
            		var result = [],
		                lons = data.lons,
		                lats = data.lats,
		                levels = data.levels,
		                times = data.times,
		                speeds = data.speeds,
		                oils = data.instantOils,
		                directions = data.directions,
		                length = lons.length;
		            var lat = 0, lon = 0, level = 0, speed = 0, time = 0, oil = 0, direction = 0, pt, timeDiff = 0;
		            for(var i = 0; i < length; i ++) {
		                level = levels[i] || 0;
		                lat += lats[i] * 0.00001;
		                lon += lons[i] * 0.00001;
		                timeDiff = i ? +times[i] : 0;
		                time += +times[i];
		                speed += speeds[i];
		                direction += directions[i];
		                oil += oils[i];
		                pt = angular.merge( new MPoint([lon, lat]), {
		                    time: time,
		                    timeDiff: timeDiff,
		                    speed: speed,
		                    direction: 360 - direction,
		                    oil: oil / 100,
		                    levelGroup : level
		                });
		                result.push(pt);
		            }
		            return result;
            	};
            	for(var k in d) {
	                var v = data[k];
	                if(k === 'levels') {
	                    d[k] = _decodeLevels(v);
	                    continue;
	                }
	                if(k === 'times') {
	                    d[k] = _decodeTimes(v, firstTime);
	                    continue;
	                }
	                d[k] = _decodeNumberEx(v);
	            }
	            return _decodeData(d);
            }
		}
	}

})();
