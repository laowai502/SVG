/**
 * @author laowai
 * @description AlarmBaseDataConstants里面的base数据，根据索引，0： ADAS，1：DMS，2：驾驶行为
 */
(function() {
	'use strict';
	
	angular
		.module('WeViews')
		.controller('MainSafeDetailController', MainSafeDetailController);
		
	function MainSafeDetailController($scope, $state, $stateParams, $window, $timeout,
		MapService, SafeService, DashboardService, CarService, EchartsOptionsUtils, Message,
		AlarmBaseDataConstants, AlarmMapUtils, alarmMapMockData) {
		
		var vm = this,
			nowTime = moment().add(-1, 'days').format('YYYY-MM-DD'),
			tabOneBeenQuery = false,
			hasMapLoad = false;
		
		//model
		vm.tid = '';
		vm.carInfo = {};
		vm.detail = {};
		vm.sDate = '';
		vm.eDate = '';
		vm.nowTime = '';
		vm.selectedTab = 0; //此变量用于在切换tab时，echarts图宽度问题导致无法渲染
		
		vm.getDetail = function() {
			SafeService.getDetail(vm.tid, vm.sDate, vm.eDate).then(function(data) {
				if (data) {
					if (data.changeNo) data.changeNo = parseInt(data.changeNo);
					vm.detail = data;
				}
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		
		vm.getCarDriverInfo = function(tid) {
			CarService.queryCarAndDriverInfo(tid).then(function(data) {
				if (data) vm.carInfo = data;
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		
//------------------------------------------------------char图相关 start---------------------------------------------------------------//
		//先这样做
		$scope.month = 'month';
		$scope.format = 'yyyy-mm';
		
		//model
		vm.queryDayType = vm.nowTime = moment().format('YYYY-MM-DD');
		vm.queryMonthType = vm.nowMonth = moment().format('YYYY-MM');
		
		vm.firstCharLoading = false;
		vm.firstChar = null;
		
		vm.type = 0;
		vm.secondCharLoading = false;
		vm.charOne = null;
		vm.charTwo = null;
		vm.charThree = null;
		
		/*
		 * 精简看板-单日企业安全趋势（全车次数）
		 */
		vm.querySingleDayCompanyRiskInfo = function() {
			vm.firstCharLoading = false;
			DashboardService.querySingleDayCompanyRiskInfo(vm.queryDayType, vm.tid).then(function(data) {
				if(data) {
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
			DashboardService.queryMonthCompanyRiskInfo(vm.queryMonthType, vm.tid).then(function(data) {
				if(data) {
					var charData = {
						x: [],
						roadStatus: { //道路事件走势
							legend: ['FCW前车碰撞', 'HMW车距过近', 'LDW车道偏离', 'UFCW城市前车碰撞'],
							seriesData: [ //拼y轴用索引，一一对应了
								{
									name: 'FCW前车碰撞',
									data: []
								},
								{
									name: 'HMW车距过近',
									data: []
								},
								{
									name: 'LDW车道偏离',
									data: []
								},
								{
									name: 'UFCW城市前车碰撞',
									data: []
								}
							]
						},
						driveStatus: { //驾驶状态走势
//							legend: ['闭眼', '左顾右盼', '低头', '打电话', '抽烟', '打哈欠', '脱离监控', '更换司机'],
							legend: ['闭眼', '左顾右盼', '打电话', '抽烟', '打哈欠', '脱离监控', '更换司机'],
							seriesData: [{
									name: '闭眼',
									data: []
								},
								{
									name: '左顾右盼',
									data: []
								},
//								{
//									name: '低头',
//									data: []
//								},
								{
									name: '打电话',
									data: []
								},
								{
									name: '抽烟',
									data: []
								},
								{
									name: '打哈欠',
									data: []
								},
								{
									name: '脱离监控',
									data: []
								},
								{
									name: '更换司机',
									data: []
								}
							]
						},
						keepSpace: { //保持车距习惯
							legend: ['车距过近持续时长(秒)', '最近车距时长(秒)'],
							seriesData: [{
									name: '车距过近持续时长(秒)',
									data: []
								},
								{
									name: '最近车距时长(秒)',
									data: []
								}
							]
						}
					};
					angular.forEach(data, function(item) { //根据接口格式拼数据喽
						//道路事件走势
						charData.x.push(moment(item.riskDate, 'YYYYMMDD').format('MMMDo'));
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
//------------------------------------------------------char图相关 end-----------------------------------------------------------------//

		
//------------------------------------------------------告警地图相关 start-----------------------------------------------------------------//
		
		var traceEndMarker = null, //终点
			traceStartMarker = null, //起点
			traceOverlay = null; //不区分速度，故单条线
		//轨迹查询入参相关
		vm.trace = {
			sDate: '',
			eDate: '',
			nowTime: moment().format('YYYY-MM-DD HH:mm:ss')
		};
		//告警地图设置常亮数据
		vm.alarmCheckList = AlarmBaseDataConstants;
		//存放地图marker
		vm.alarmMarkerArray = [];
		
		//当前点击告警详情存放数据
		vm.nowAlarmData = null;
		//当前点击告警详情的markerId
		vm.menuClickCarMarker = null;
		
		vm.overlayBridge = {
            resetPostion: function () {},
            close: function () {}
        };
		
		//ng-change复写on-change，on-change一直一来都是dom动作改变value，数据驱动不会触发on-change事件，注意
		vm.checkAll = function(checked, index) {
			angular.forEach(vm.alarmCheckList[index]['child'], function(item) {
				item.checked = checked;
			});
			vm.showMarkerByCheckBoxFather(checked, index);
		};
		vm.check = function(index, outerIndex, item) {
			var allSelected = true;
			angular.forEach(vm.alarmCheckList[outerIndex]['child'], function(item) {
				if (!item.checked) allSelected = false;
			});
			vm.alarmCheckList[outerIndex]['checked'] = allSelected;
			vm.showMarkerByCheckBoxChild(item);
		};
		/**
		 * 通过查询接口控制marker显隐
		 * @param {Sting} code 报警code区分码
		 * @return {boolean} 是否显示
		 */
		vm.showMarkerByApi = function(code) {
			var show = false,
				outerIndex = null;
			if (parseInt(code) < 7) { //adas事件
				outerIndex = 0;
			} else if ((parseInt(code) >= 7 && parseInt(code) < 13) || parseInt(code) == 17) { //dms事件
				outerIndex = 1;
			} else { //驾驶行为事件
				outerIndex = 2;
			}
			angular.forEach(vm.alarmCheckList[outerIndex]['child'], function(item) {
				if (item.alarmTypeCode == code) show = item.checked;
			});
			return show;
		};
		/**
		 * 通过选择checkbox控制marker显隐，父级全选，区分开写，便于维护
		 * @param {Boolean} checked 是否选中
		 * @param {Number} index 索引
		 */
		vm.showMarkerByCheckBoxFather = function(checked, index) {
			if (vm.alarmMarkerArray.length > 0) {
				angular.forEach(vm.alarmMarkerArray, function(item) {
					if (index === 0) { //adas
						if (parseInt(item.code) < 7) {
							item.show = checked;
							if (checked) {
								$scope.traceMap.addOverlay(item.marker);
							} else {
								$scope.traceMap.removeOverlay(item.marker);
							}
						}
					} else if (index === 1) { //dms
						if ((parseInt(item.code) >= 7 && parseInt(item.code) < 13) || parseInt(item.code) == 17) {
							item.show = checked;
							if (checked) {
								$scope.traceMap.addOverlay(item.marker);
							} else {
								$scope.traceMap.removeOverlay(item.marker);
							}
						}
					} else { //驾驶行为
						if (parseInt(item.code) >= 13 && parseInt(item.code) < 17) {
							item.show = checked;
							if (checked) {
								$scope.traceMap.addOverlay(item.marker);
							} else {
								$scope.traceMap.removeOverlay(item.marker);
							}
						}
					}
				});
			}
		};
		/**
		 * 通过选择checkbox控制marker显隐，子级单项选择
		 * @param {Object} code
		 * @param {Boolean} checked
		 */
		vm.showMarkerByCheckBoxChild = function(obj) { 
			if (vm.alarmMarkerArray.length > 0) {
				angular.forEach(vm.alarmMarkerArray, function(item) {
					if (item.code === obj.alarmTypeCode) {
						item.show = obj.checked;
						if (obj.checked) {
							$scope.traceMap.addOverlay(item.marker);
						} else {
							$scope.traceMap.removeOverlay(item.marker);
						}
					}
				});
			}
		};
		/**
		 * 根据查询出的数据，设置地图标记
		 * @param {Object} item
		 */
		vm.setAlarmMarkers = function(obj) {
			obj.alarmTime = moment(obj.alarmTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
			var marker = new MMarker(
                new MPoint(obj.lon, obj.lat),
                new MIcon(AlarmMapUtils.getAlarmIcon(obj.alarmTypeCode), 28, 28, 15, 25)
            );
            if (parseInt(obj.alarmTypeCode) < 13 || parseInt(obj.alarmTypeCode) > 16) {
	            (function(obj){
		            MEvent.addListener(marker, "click", function (e) {
		            	$scope.$apply(function() {
		            		vm.nowAlarmData = obj;
		            		vm.nowAlarmData.markerId = e.id;
		            		vm.menuClickCarMarker = e;		            		
		            	});
		            });
		        })(obj);
            }
            (function(obj){
            	var onMouseOver = function() {
            		marker.setLabel(new MLabel(obj.alarmTypeName, { xoffset: 5, yoffset: 0}));
            	};
            	var onMouseOut = function() {
            		marker.setLabel(null);
            	};
            	MEvent.addListener(marker, "mouseover", onMouseOver);
            	MEvent.addListener(marker, "mouseout", onMouseOut);
            })(obj);
            return marker;
		};
		//查询报警设置
		vm.queryAlarmMap = function() {
			if (vm.alarmMarkerArray.length > 0) { //重新查询清除数据
				angular.forEach(vm.alarmMarkerArray, function(item) {
					if (item.show) $scope.traceMap.removeOverlay(item.marker);
				});
				vm.alarmMarkerArray = [];
			}
        	if(vm.menuClickCarMarker) {
        		vm.nowAlarmData = null;
				vm.menuClickCarMarker = null;
        		vm.overlayBridge.close();
//      		$scope.map.centerAndZoom(new MPoint('北京市'), 7);
        	}
			SafeService.queryAlarmMap(vm.tid, vm.trace.sDate, vm.trace.eDate).then(function(data) {
//				data = alarmMapMockData;
				if (data && data.length) { //只能查询一天，所以告警数据量不会海量，先生成marker放到内存数组中
					angular.forEach(data, function(item, index) {
						var obj = {
							id: index + 1,
							code: item.alarmTypeCode,
							show: false,
							marker: vm.setAlarmMarkers(item)
						}
						obj.show = vm.showMarkerByApi(item.alarmTypeCode);
						//重新查询接口，以前数据都清空，所以不需removeOverlay
						if (obj.show) $scope.traceMap.addOverlay(obj.marker);
						vm.alarmMarkerArray.push(obj);
					});
				}
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		
		vm.initTraceOverlay = function() {	//关闭轨迹相关overlay
            if (traceEndMarker) {
                $scope.traceMap.removeOverlay(traceEndMarker);
                traceEndMarker = null;
            }
            if (traceStartMarker) {
                $scope.traceMap.removeOverlay(traceStartMarker);
                traceStartMarker = null;
            }
            if (traceOverlay) {
                $scope.traceMap.removeOverlay(traceOverlay);
                traceOverlay = null;
            }
		};
		
		vm.drawTraceOverlay = function(data) {
			var points = [],
				brush = new MBrush();
			brush.arrow = false;
			brush.color = 'rgb(3, 222, 137)';
			brush.fill = false;
			brush.transparency = 100;
			brush.bgtransparency = 100;
			brush.stroke = 6;

			angular.forEach(data, function(item) {
				points.push(new MPoint(item.lng, item.lat));
			});
			
			traceOverlay = new MPolyline(points, brush);
			traceStartMarker = new MMarker(
                points[0],
                new MIcon('./assets/images/icon_199.png', 40, 51, 19, 45)
            );
            traceEndMarker = new MMarker(
            	points[points.length - 1],
                new MIcon('./assets/images/icon_201.png', 40, 51, 19, 45)
            );
            $scope.traceMap.addOverlay(traceStartMarker);
			$scope.traceMap.addOverlay(traceEndMarker);
			$scope.traceMap.addOverlay(traceOverlay);
		};
		//查询轨迹
		vm.queryTrace = function() {
			CarService.getCarTrack(vm.carInfo.carId, vm.trace.sDate, vm.trace.eDate, 7).then(function(data) {
				if (data) {
					if (data.length > 0) {
						vm.initTraceOverlay();
						vm.drawTraceOverlay(data);
						//自适应地图级别，和整条轨迹的中间的中心点
						var centerObj = MapService.autoZoom($scope.traceMap, data);
						$scope.traceMap.centerAndZoom(new MPoint(centerObj.cenLng, centerObj.cenLat), centerObj.zoom || 7);
					} else {
						Message.info('暂无轨迹数据');
					}
				}
			}).catch(function(err) {
				Message.error(err.message);
			});
		};

		vm.clickQueryTraceBtn = function() {
//			vm.trace.sDate = '2019-03-06 00:00:00';
//			vm.trace.eDate = '2019-03-06 23:59:59';
			if(vm.trace.sDate === '') {
				Message.info('请选择开始时间');
				return;
			}
			if(vm.trace.eDate === '') {
				Message.info('请选择结束时间');
				return;
			}
			if (vm.trace.sDate !== vm.trace.eDate) {				
				if(!moment(vm.trace.sDate).isBefore(vm.trace.eDate)) { //开始时间晚于结束时间
					Message.info('开始时间晚于结束时间，请重新选择');
					return;
				}
			}
			if(Math.abs(moment(vm.trace.sDate).diff(vm.trace.eDate, 'hour')) > 24) {
				Message.info('最大选择范围为24小时，请重新选择');
				return;
			}
			vm.queryTrace();
			vm.queryAlarmMap();
		};

//------------------------------------------------------告警地图相关 end-------------------------------------------------------------------//
		
		vm.queryTabOne = function() {
			vm.selectedTab = 0;
			if (!tabOneBeenQuery) {				
				vm.getDetail();
			
				vm.firstChar = EchartsOptionsUtils.charCommon();
			
				vm.charOne = EchartsOptionsUtils.charCommon();
				vm.charTwo = EchartsOptionsUtils.charCommon();
				vm.charThree = EchartsOptionsUtils.charCommon();
			
				vm.querySingleDayCompanyRiskInfo();
				vm.queryMonthCompanyRiskInfo();
			}
			tabOneBeenQuery = true;
		};
		
		vm.queryTabTwo = function() {
			vm.selectedTab = 1;
			$scope.traceMap.resize($window.innerWidth - 240, $window.innerHeight - 260);
		};
		
		vm.init = function() {
			vm.tid = $stateParams.tid;

			vm.sDate = $stateParams.date ? $stateParams.date.split('|')[0] : nowTime;
			vm.eDate = $stateParams.date ? $stateParams.date.split('|')[1] : nowTime;
			
			vm.getCarDriverInfo(vm.tid);
			vm.flag = $stateParams.flag;
			
			if (vm.flag === '0') {
				vm.queryTabOne();
			} else {
				vm.selectedTab = 1;
			}
		};
		
		vm.init();
		
		var listener = $scope.$watch(function() {
			return vm.queryDayType;
		}, function(n, o) {
			if(n && n != o) {
				vm.querySingleDayCompanyRiskInfo();
			}
		});
		var listener_1 = $scope.$watch(function() {
			return vm.queryMonthType;
		}, function(n, o) {
			if(n && n != o) {
				vm.queryMonthCompanyRiskInfo();
			}
		});
		//判断地图加载是否完毕
		var unbindLoader = $scope.$watch('traceMap', function(value) {
            if(value) {
                unbindLoader();
                hasMapLoad = true;           
                //垃圾图吧
                var myPanListener = MEvent.bind($scope.traceMap, "pan", vm, function() {
                	if(this.menuClickCarMarker) {
                		vm.overlayBridge.resetPostion(this.menuClickCarMarker.id);
                	}
                });
                var myZoomListener = MEvent.bind($scope.traceMap, "zoom", vm, function() {
                	if(this.menuClickCarMarker) {
                		vm.overlayBridge.resetPostion(this.menuClickCarMarker.id);
                	}
                });
            }
        });
        $timeout(function() {	//地图加载通病	
            if (!hasMapLoad) {
                Message.error('地图初 始化超时，请刷新页面重试');
            }
        }, 5000);

		$scope.$on('$destroy', function() {
			listener(), listener_1()
        });
	}
	
})();