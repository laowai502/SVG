(function () {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainRealOverloadController', MainRealOverloadController);

	function MainRealOverloadController($scope, $rootScope, Message, $state, $q, $window, $interval, CommonService, OverloadService, MapService, RegionService) {

		var vm = this,
			todayFirstTime = moment().format('YYYY-MM-DD 00:00:00'),
			nowTime = moment().format('YYYY-MM-DD HH:mm:ss'),
			team_id = $rootScope.teamId,
			myInterval = null;

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
//			start: todayFirstTime,
//			end: nowTime,
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
			//需要来个车牌号
			var param = {
				teamIds: team_id,
                filterEmptyWload: true
//				start: vm.query.start,
//				end: vm.query.end
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
			OverloadService.getWloadRealList(vm.page, param).then(function(data) {
				if(data && data.data) {
					angular.forEach(data.data, function(item) {
						if (item.fullLoad != 0) item.fullLoad = item.fullLoad/10;
						if (item.exceedFullLoad != 0) item.exceedFullLoad = item.exceedFullLoad/10;
						if (item.wload != 0) item.wload = item.wload/10;
						item.loadTypeText = vm.getLoadTypeText(item.wloadType);
						item.formatTime = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
						(function(e) {
							OverloadService.getCarCprByTids([e.tid]).then(function(data) {
								if (data && data.length > 0) {
									e.vin = data[0].vin;
									e.carNumber = data[0].plate;
									e.carId = data[0].carId;
								}
							});
							MapService.reverseCodeAddress(e.lat/1000000, e.lng/1000000).then(function(data) {
								e.location = data.data.address;
							});
						})(item);
					});
					vm.list = data.data;
					vm.total = data.total
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
			myInterval = $interval(function () {
                vm.getList();
            }, 30000);
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

		vm.toPolymer = function(obj) {
			$window.localStorage.setItem("overloadToken", $window.sessionStorage.getItem('token'));
			$window.localStorage.setItem("realData", JSON.stringify(obj));
			$window.open('./assets/overload/polymer.html');
		};

		$scope.$on('$destroy', function(){	//取消全局绑定
			$interval.cancel(myInterval);
        });

	}

})();
