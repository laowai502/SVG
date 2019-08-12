(function() {
	'use strict';
	
	angular
		.module('WeViews')
		.controller('MainDashboardController', MainDashboardController);
		
	function MainDashboardController($scope, $window, $interval, $state, DashboardService, EchartsOptionsUtils, Message) {
		
		var vm = this,
			alarmInterval = null;
		
		//先这样做
		$scope.month = 'month';
		$scope.format = 'yyyy-mm';
		
		//model
		vm.queryDayType = vm.nowTime = moment().format('YYYY-MM-DD');
		vm.queryMonthType = vm.nowMonth = moment().format('YYYY-MM');
		
		vm.card = {};
		vm.f_card = {};
		vm.realAlarm = [];
		
		vm.firstCharLoading = false;
		vm.firstChar = null;
		
		vm.type = 0;
		vm.secondCharLoading = false;
		vm.charOne = null;
		vm.charTwo = null;
		vm.charThree = null;
		
		/*
		 * 精简看板-顶部第四个card+车辆实时报警
		 */
		vm.queryCurrentDayRiskInfo = function() {
			DashboardService.queryCurrentDayRiskInfo().then(function(data) {
				if (data) {
					vm.card.currentRiskNumber = data.currentRiskNumber;
					vm.realAlarm = data.carList;
				}
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		/*
		 * 精简看板-顶部前三个card
		 */
		vm.queryCurrentDayRiskInfoRealTime = function() {
			DashboardService.queryCurrentDayRiskInfoRealTime().then(function(data) {
				if (data) {
					vm.f_card.workCarNumber = data.workCarNumber;
					vm.f_card.restCarNumber = data.restCarNumber;
					vm.f_card.carTotalNumber = data.carTotalNumber;
					vm.f_card.carTotalMilage = data.carTotalMilage;
					vm.f_card.carTotaloil = data.carTotaloil;
				}
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		/*
		 * 精简看板-单日企业安全趋势（全车次数）
		 */
		vm.querySingleDayCompanyRiskInfo = function() {
			vm.firstCharLoading = false;
			DashboardService.querySingleDayCompanyRiskInfo(vm.queryDayType).then(function(data) {
				if (data) {
					var obj = {
						x: [],
						legend: ['ADAS', 'DMS', '驾驶行为'],
						seriesData: [
							{ name: 'ADAS', data: [], x: [] },
							{ name: 'DMS', data: [], x: [] },
							{ name: '驾驶行为', data: [], x: [] }
						]
					};
					angular.forEach(data.carAdasList, function(item) {
						for (var key in item) {
							obj.seriesData[0].x.push(key + '：00');
							obj.seriesData[0].data.push(item[key]);
						}
					});
					angular.forEach(data.carDmsList, function(item) {
						for (var key in item) {							
							obj.seriesData[1].x.push(key + '：00');
							obj.seriesData[1].data.push(item[key]);
						}
					});
					angular.forEach(data.carBehaivorList, function(item) {
						for (var key in item) {							
							obj.seriesData[2].x.push(key + '：00');
							obj.seriesData[2].data.push(item[key]);
						}
					});
					if (data.carAdasList && data.carAdasList.length) { //接口如此，前端就这样拼数据吧
						if (data.carAdasList.length > 0) obj.x = obj.seriesData[0].x;
					} else if (data.carDmsList && data.carDmsList.length) {
						if (data.carDmsList.length > 0) obj.x = obj.seriesData[1].x;
					} else if (data.carBehaivorList && data.carBehaivorList.length) {
						if (data.carBehaivorList.length > 0) obj.x = obj.seriesData[2].x;
					}
					vm.firstChar.xAxis.data = obj.x;
					vm.firstChar.legend.data = obj.legend;
					vm.firstChar.series = EchartsOptionsUtils.setSeriers(obj.seriesData, 'line');
				}
			}).catch(function(err) {
				Message.error(err.message);
			}).finally(function() {
				vm.firstCharLoading = true;
			});
		};
		/**
		 * 精简看板-月度统计
		 */
		vm.queryMonthCompanyRiskInfo = function() {
			vm.secondCharLoading = false;
			DashboardService.queryMonthCompanyRiskInfo(vm.queryMonthType).then(function(data) {
				if (data) {
					var charData = {
						x: [],
						roadStatus: { //道路事件走势
							legend: ['FCW前车碰撞', 'HMW车距过近', 'LDW车道偏离', 'UFCW城市前车碰撞'],
							seriesData: [ //拼y轴用索引，一一对应了
								{ name: 'FCW前车碰撞', data: [] },
								{ name: 'HMW车距过近', data: [] },
								{ name: 'LDW车道偏离', data: [] },
								{ name: 'UFCW城市前车碰撞', data: [] }
							]
						},
						driveStatus: { //驾驶状态走势
							legend: ['闭眼', '左顾右盼', '打电话', '抽烟', '打哈欠', '脱离监控', '更换司机'],
							seriesData: [
								{ name: '闭眼', data: [] },
								{ name: '左顾右盼', data: [] },
//								{ name: '低头', data: [] },
								{ name: '打电话', data: [] },
								{ name: '抽烟', data: [] },
								{ name: '打哈欠', data: [] },
								{ name: '脱离监控', data: [] },
								{ name: '更换司机', data: [] }
							]
						},
						keepSpace: { //保持车距习惯
							legend: ['车距过近持续时长(秒)', '最近车距时长(秒)'],
							seriesData: [
								{ name: '车距过近持续时长(秒)', data: [] },
								{ name: '最近车距时长(秒)', data: [] }
							]
						}
					};
					angular.forEach(data, function(item) { //根据接口格式拼数据喽
						//道路事件走势
						charData.x.push(moment(item.riskDate, 'YYYYMMDD').format('MM/DD'));
						charData.roadStatus.seriesData[0].data.push(item.fcwCnt);
						charData.roadStatus.seriesData[1].data.push(item.hmwCnt);
						charData.roadStatus.seriesData[2].data.push(item.ldwCnt);
						charData.roadStatus.seriesData[3].data.push(item.ufcwCnt);
						//驾驶状态走势
						charData.driveStatus.seriesData[0].data.push(item.closeEyesCnt);
						charData.driveStatus.seriesData[1].data.push(item.distractionAttentionCnt);
//						charData.driveStatus.seriesData[2].data.push(item.bowCnt);
						charData.driveStatus.seriesData[2].data.push(item.answerPhoneCnt);
						charData.driveStatus.seriesData[3].data.push(item.smokingCnt);
						charData.driveStatus.seriesData[4].data.push(item.yawnCnt);
						charData.driveStatus.seriesData[5].data.push(item.departureMonitorCnt);
						charData.driveStatus.seriesData[6].data.push(item.identityRecognitionCnt);
						//保持车距习惯
						charData.keepSpace.seriesData[0].data.push(item.carTooCloseCnt);
						charData.keepSpace.seriesData[1].data.push(item.lastCarTooCloseCnt);
					});
					vm.charOne.xAxis.data = charData.x;
					vm.charOne.legend.data = charData.roadStatus.legend;
					vm.charOne.series = EchartsOptionsUtils.setSeriers(charData.roadStatus.seriesData, 'line');
					vm.charTwo.xAxis.data = charData.x;
					vm.charTwo.legend.data = charData.driveStatus.legend;
					vm.charTwo.series = EchartsOptionsUtils.setSeriers(charData.driveStatus.seriesData, 'line');
					vm.charThree.xAxis.data = charData.x;
					vm.charThree.legend.data = charData.keepSpace.legend;
					vm.charThree.series = EchartsOptionsUtils.setSeriers(charData.keepSpace.seriesData, 'line');
					if (vm.charThree.series.length > 0) {
						vm.charThree.series[0].areaStyle = {
				        	normal: {}
				        };
					}
				}
			}).catch(function(err) {
				Message.error(err.message);
			}).finally(function() {
				vm.secondCharLoading = true;
			});
		};

		vm.toDetail = function(obj) {
			var param = {
				lon: obj.lon/1000000,
				lat: obj.lat/1000000,
				alarmType: obj.riskName,
				alarmTime: moment(obj.alarmDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
				alarmTypeCode: obj.alarmTypeCode,
				driverName: obj.driver,
				carSpeed: obj.speed
			};
			$window.sessionStorage.setItem('historyParams', JSON.stringify(param));
			$state.go('main.alarmHistoryDetail', {
				id: obj.alarmId
			});
		};
		
		vm.init = function() {
			vm.firstChar = EchartsOptionsUtils.charCommon();
			
			vm.charOne = EchartsOptionsUtils.charCommon();
			vm.charTwo = EchartsOptionsUtils.charCommon();
			vm.charThree = EchartsOptionsUtils.charCommon();

			vm.queryCurrentDayRiskInfo();
			vm.querySingleDayCompanyRiskInfo();
			vm.queryMonthCompanyRiskInfo();
			vm.queryCurrentDayRiskInfoRealTime();
			alarmInterval = $interval(vm.queryCurrentDayRiskInfo, 30000);
		};
		
		vm.init();
		
		var listener = $scope.$watch(function() {
			return vm.queryDayType;
		}, function(n, o) {
			if (n && n != o) {
				vm.querySingleDayCompanyRiskInfo();
			}
		});
		var listener_1 = $scope.$watch(function() {
			return vm.queryMonthType;
		}, function(n, o) {
			if (n && n != o) {
				vm.queryMonthCompanyRiskInfo();
			}
		});
		
		$scope.$on('$destroy', function() {
            listener(), listener_1(), $interval.cancel(alarmInterval);
        });
	}
})();
