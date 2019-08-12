(function () {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainHistoryOverloadController', MainHistoryOverloadController);

	function MainHistoryOverloadController($scope, $rootScope, $window, Message, $state, $q, CommonService, OverloadService, MapService, RegionService) {

		var vm = this,
			monthFirst = moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
			nowTime = moment().format('YYYY-MM-DD HH:mm:ss'),
			team_id = $rootScope.teamId;

		vm.list = [];
		vm.filter = {
			carTypeArr: [
                '其他车', '罐车', '泵车'
//				'牵引|6*2', '牵引|6*4', '牵引|4*2', '8*4', '8*2',
//				'6*4（非牵引）', '6*2（非牵引）', '4*2（悍V、天V）',
//				'4*2（龙V、龙VH）', '4*2（虎V、J6F）', '4*4'
			],
			loadTypeArr: [
//				{ id: 0, name: '空载' },
//				{ id: 1, name: '半载' },
//				{ id: 2, name: '满载' },
				{ id: 0, name: '正常' },
				{ id: 3, name: '超载' }
			],
			cityArr: [],
			provinceArr: []
		};

		vm.datePickerOptions = {
			timePicker: true,
			autoUpdateInput: false,
			opens: 'left',
			locale: {
				format: 'YYYY-MM-DD HH:mm:ss'
			},
//			dateLimit: {
//      		days: 29
//      	},
        	maxDate: nowTime
		};

		vm.query = {
			loadType: '',
			start: monthFirst,
			end: nowTime,
			carType: '',
			city: '',
			province: '',
			plates: '',
			vins: ''
		};
		vm.page = {
			page_size: 10,
			page_number: 1
		};

		vm.flip = function(p) {
			vm.query.page_number = p;
			vm.getList();
		};

		vm.getList = function() {
			var param = {
				start: vm.query.start,
				end: vm.query.end,
				teamIds: team_id
			};
			if(vm.query.plates !== '') param.plates = [vm.query.plates];
			// if(vm.query.vins !== '') param.vins = [vm.query.vins];
			if(vm.query.loadType !== '') {
				if (vm.query.loadType != 3) {
					param.wload_types = [0, 1, 2];
				} else {
					param.wload_types = [vm.query.loadType];
				}
			}
			if(vm.query.carType !== '') param.wload_nos = [vm.query.carType];
			if(vm.query.province !== '') param.lc02s = [vm.query.province];
			if(vm.query.city !== '') param.lc01s = [vm.query.city];
			$rootScope.blockPage();
			OverloadService.getWloadTripList(vm.page, param).then(function(data) {
				if(data && data.data) {
					angular.forEach(data.data, function(item) {
						item.dur = formatSeconds(item.dur/1000);
						item.wloadTypeText = '';
						item.areaText = '';
						item.sFormatTime = moment(item.sTime).format('YYYY-MM-DD HH:mm:ss');
						item.eFormatTime = moment(item.eTime).format('YYYY-MM-DD HH:mm:ss');
						item.maxOverLoad = 0;
						if (item.eWload != 0) item.eWload = item.eWload/10;
						if (item.fullLoad != 0) item.fullLoad = item.fullLoad/10;
						if (item.exceedFullLoad != 0) item.exceedFullLoad = item.exceedFullLoad/10;
						if (item.maxLoad && item.maxLoad != 0) item.maxLoad = item.maxLoad/10;
						if (item.maxLoad > 0 && item.fullLoad > 0) {
							if ((item.maxLoad - item.fullLoad) > 0) {
								item.maxOverLoad = item.maxLoad - item.fullLoad;
								item.maxOverLoad = item.maxOverLoad.toFixed(1);
							}
						}
						if (item.nodes) {
							var areaArr = [],
								wloadArr = [],
								areaAllSame = true, //载重状态是否有变化
								loadAllSame = true; //途径区域城市是否有变化
							angular.forEach(item.nodes, function(e) {
								areaArr.push(RegionService.getCityByCode(e.lc01));
								wloadArr.push(vm.getLoadTypeText(e.wtype));
							});
							if (areaArr.length > 0) {
								for (var i=0; i<areaArr.length; i++) {
									if (areaArr.indexOf(areaArr[i]) != 0) {
										areaAllSame = false;
										break;
									}
								}
								if (!areaAllSame) {
									areaArr = uniqueArr(areaArr);
								}
								item.areaText = areaAllSame ? areaArr[0] : areaArr.join(' - ');
							}
							if (wloadArr.length > 0) {
								for (var i=0; i<wloadArr.length; i++) {
									if (wloadArr.indexOf(wloadArr[i]) != 0) {
										loadAllSame = false;
										break;
									}
								}
//								if (!loadAllSame) {
//									wloadArr = uniqueArr(wloadArr);
//								}
								item.wloadTypeText = loadAllSame ? wloadArr[0] : wloadArr.join(' - ');
							}
						}
						(function(e) {
							OverloadService.getCarCprByTids([e.tid]).then(function(data) {
								if (data && data.length > 0) {
									e.vin = data[0].vin;
									e.carNumber = data[0].plate;
									e.carId = data[0].carId;
								}
							});
							MapService.reverseCodeAddress(e.sLat/1000000, e.sLong/1000000).then(function(data) {
								e.sLocation = data.data.address;
							});
							MapService.reverseCodeAddress(e.eLat/1000000, e.eLong/1000000).then(function(data) {
								e.eLocation = data.data.address;
							});
						})(item);
					});
					vm.list = data.data;
					vm.total = data.total;
				}
			}).catch(function(err) {
				$rootScope.catchError(err)
			}).finally(function() {
				$rootScope.blockPage(false);
			});
		};

		vm.init = function() {
			vm.filter.provinceArr = RegionService.getProvince();
			vm.filter.cityArr = RegionService.getAllCities();
			vm.getList();
		};

		vm.init();

		//城市级联
		vm.changeProvince = function(code) {
			vm.query.city = '';
			vm.filter.cityArr = code === '' ? RegionService.getAllCities() : RegionService.getCities(code);
		};

		vm.getLoadTypeText = function(code) {
			var returnStr = '';
			if (code !== undefined && code !== null) {
				switch (code) {
					case 0:
						returnStr = '正常';
//						returnStr = '空载';
						break;
					case 1:
						returnStr = '正常';
//						returnStr = '半载';
						break;
					case 2:
						returnStr = '正常';
//						returnStr = '满载';
						break;
					default:
						returnStr = '超载';
						break;
				}
			}
			return returnStr;
		};

		vm.toTrack = function(obj) {
			$window.localStorage.setItem("overloadToken", $window.sessionStorage.getItem('token'));
			$window.localStorage.setItem("historyData", JSON.stringify(obj));
			$window.open('./assets/overload/track.html');
		};

		function uniqueArr(arr) {
			var o3 = [];
			var t = 0;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] != arr[i - 1]) {
					o3[t] = arr[i];
					t++;
				}
			}
			arr.length = 0;
			for (var j = 0; j < o3.length; j++) {
				arr[j] = o3[j];
			}
			return o3;
		}

		function formatSeconds(value) {
	        var secondTime = parseInt(value);// 秒
	        var minuteTime = 0;// 分
	        var hourTime = 0;// 小时
	        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
	            //获取分钟，除以60取整数，得到整数分钟
	            minuteTime = parseInt(secondTime / 60);
	            //获取秒数，秒数取佘，得到整数秒数
	            secondTime = parseInt(secondTime % 60);
	            //如果分钟大于60，将分钟转换成小时
	            if(minuteTime > 60) {
	                //获取小时，获取分钟除以60，得到整数小时
	                hourTime = parseInt(minuteTime / 60);
	                //获取小时后取佘的分，获取分钟除以60取佘的分
	                minuteTime = parseInt(minuteTime % 60);
	            }
	        }
	        var result = "" + parseInt(secondTime) + "秒";

	        if(minuteTime > 0) {
	            result = "" + parseInt(minuteTime) + "分" + result;
	        }
	        if(hourTime > 0) {
	            result = "" + parseInt(hourTime) + "小时" + result;
	        }
	        return result;
	    }

	}

})();
