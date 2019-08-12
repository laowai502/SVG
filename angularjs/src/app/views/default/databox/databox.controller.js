(function () {
	'use strict';

	angular
		.module('WeViews')
		.controller('DefaultDataboxController', DefaultDataboxController);
		
	function DefaultDataboxController($scope, DataBoxService, EchartsOptionsUtils, Message) {
		
		var vm = this;
		
		vm.queryDate = vm.nowTime = moment().format('YYYY-MM-DD');
		vm.card = {};
		vm.vsDateAfter = moment().subtract('days', 7).format('M/DD') + ' - ' + moment().subtract('days', 1).format('M/DD');
		vm.vsDate = moment().subtract('days', 14).format('M/DD') + ' - ' + moment().subtract('days', 8).format('M/DD');
		
		vm.leftFirstCharloading = false;
		vm.leftSecondCharloading = false;
		vm.rightCharsloading = false;
		vm.leftFirstChar = null;
		vm.leftSecondChar = null;
		
		vm.dmsChar = null;
		vm.adasChar = null;
		vm.behaviorChar = null;
		
		vm.dmsData = {
			x: ['脱离监控', '打哈欠', '抽烟', '打电话', '左顾右盼', '闭眼'],
//			x: ['脱离监控', '打哈欠', '抽烟', '打电话', '低头', '左顾右盼', '闭眼'],
			y: [],
			maxY: [],
			trend: []
		};
		vm.adasData = {
			x: ['车道偏离', '车距过近', '前车碰撞', '城市前车碰撞'],
			y: [],
			maxY: [],
			trend: []
		};
		vm.behaviorData = {
			x: ['急刹车', '急加速', '超速', '空档滑行'],
			y: [],
			maxY: [],
			trend: []
		};
		
		vm.rank = {
			top10: {
				x: [],
				y: [],
				maxY: [],
				trend: []
			},
			end10: {
				x: [],
				y: [],
				maxY: [],
				trend: []
			}
		};
		
		/*
		 * 大数据分析-顶部card数据
		 */
		vm.queryThreeDayCarRiskCompare = function() {
            DataBoxService.queryThreeDayCarRiskCompare().then(function(data) {
            	if (data) {
            		for (var key in data) {
                		if (data[key] !== null) {
                			data[key] = parseFloat(data[key]);
                		}
                	}
            		vm.card = data;
            		vm.card.ads_one = Math.abs(data.kilometresCntTrend);
            		vm.card.ads_two = Math.abs(data.hichRiskTotalTrend);
            		vm.card.ads_three = Math.abs(data.hichRiskRateTrend);
            		//字段太长用y+index来区分了
            		if (vm.card.yesterdayKilometresCnt >= vm.card.yesterday2KilometresCnt) {
            			vm.card.y1 = 100;
            			vm.card.y2 = vm.card.yesterday2KilometresCnt/vm.card.yesterdayKilometresCnt*100;
            		} else {
            			vm.card.y1 = vm.card.yesterdayKilometresCnt/vm.card.yesterday2KilometresCnt*100;
            			vm.card.y2 = 100;
            		}
            		if (vm.card.yesterdayhichRiskTotal >= vm.card.yesterday2hichRiskTotal) {
            			vm.card.y3 = 100;
            			vm.card.y4 = vm.card.yesterday2hichRiskTotal/vm.card.yesterdayhichRiskTotal*100;
            		} else {
            			vm.card.y3 = vm.card.yesterdayhichRiskTotal/vm.card.yesterday2hichRiskTotal*100;
            			vm.card.y4 = 100;
            		}
            		if (vm.card.yesterdayhichRiskRate >= vm.card.yesterday2hichRiskRate) {
            			vm.card.y5 = 100;
            			vm.card.y6 = vm.card.yesterday2hichRiskRate/vm.card.yesterdayhichRiskRate*100;
            		} else {
            			vm.card.y5 = vm.card.yesterdayhichRiskRate/vm.card.yesterday2hichRiskRate*100;
            			vm.card.y6 = 100;
            		}
            		//需求变了，固定了
            		vm.card.y1Color = 'success';
        			vm.card.y2Color = 'info';
        			vm.card.y3Color = 'success';
        			vm.card.y4Color = 'info';
        			vm.card.y5Color = 'success';
        			vm.card.y6Color = 'info';
            	}
            }).catch(function(err) {
                Message.error(err.message);
            });
        };
        /**
		 * 大数据分析-车辆风险次数单车统计
		 */
		vm.querySecureBoardDayRisk = function() {
            DataBoxService.querySecureBoardDayRisk(vm.queryDate).then(function(data) {
				if (data) {
					var obj = {
						x: [],
						y: []
					};
					angular.forEach(data, function(item) {
						obj.x.push(item.carCph + "\n" + item.carNo);
						obj.y.push(item.riskCnt);
					});
					vm.leftFirstChar.xAxis.data = obj.x;
					vm.leftFirstChar.series = EchartsOptionsUtils.setSeriers([{
						name: '单车次数',
						data: obj.y
					}], 'bar');
					if (vm.leftFirstChar.series.length) {
						vm.leftFirstChar.series[0].itemStyle = {
							color: function(params) {
								if (params.dataIndex < 3) {
									return '#c12e34';
								} else {									
									return '#198eff';
								}
							}
						};
					}
				}
            }).catch(function(err) {
                Message.error(err.message);
            }).finally(function() {
            	vm.leftFirstCharloading = true;
            });
        };
        /**
		 * 大数据分析-车辆安全排名以及上月对比
		 */
		vm.queryMonthTenCarRiskCompare = function() {
            DataBoxService.queryMonthTenCarRiskCompare().then(function(data) {
            	if (data) {
            		angular.forEach(data.topScoreList, function(item) {
            			vm.rank.top10.x.push(item.carCph + "\n" + item.carNo);
            			vm.rank.top10.y.push(parseFloat(item.score));
            			vm.rank.top10.trend.push(item.sortLevel);
            		});
            		angular.forEach(data.lastScoreList, function(item) {
            			vm.rank.end10.x.push(item.carCph + "\n" + item.carNo);
            			vm.rank.end10.y.push(parseFloat(item.score));
            			vm.rank.end10.trend.push(item.sortLevel);
            		});
            		var max,
            			tLength = vm.rank.top10.x.length,
            			eLength = vm.rank.end10.x.length;
            		if (tLength > 0) {
            			max = _.max(vm.rank.top10.y);
            			for (var i=0; i<tLength; i++) {
            				vm.rank.top10.maxY.push(max);
            			}
            		}
            		if (eLength > 0) {            			
            			max = _.max(vm.rank.end10.y);
            			for (var i=0; i<eLength; i++) {
            				vm.rank.end10.maxY.push(max);
            			}
            		}
            		vm.changeRank('0');
            	}
            }).catch(function(err) {
                Message.error(err.message);
            }).finally(function() {
            	vm.leftSecondCharloading = true;
            });
        };
        /**
		 * 大数据分析-7天安全数据对比
		 */
		vm.querySevenDayRiskCompare = function() {
            DataBoxService.querySevenDayRiskCompare().then(function(data) {
                if (data) {
                	for (var key in data) {
                		if (data[key]) {
                			data[key] =  Math.round(parseFloat(data[key]));
                		}
                	}
//              	vm.dmsData.y = [data.departureMonitorCnt, data.yawnCnt, data.smokingCnt, data.answerPhoneCnt, data.bowCnt, data.distractionAttentionCnt, data.closeEyesCnt];
                	vm.dmsData.y = [data.departureMonitorCnt, data.yawnCnt, data.smokingCnt, data.answerPhoneCnt, data.distractionAttentionCnt, data.closeEyesCnt];
                	vm.dmsData.trend = [data.departureMonitorProportion, data.yawnProportion, data.smokingProportion, data.answerPhoneProportion, data.distractionAttentionProportion, data.closeEyesProportion];
//              	vm.dmsData.trend = [data.departureMonitorProportion, data.yawnProportion, data.smokingProportion, data.answerPhoneProportion, data.bowProportion, data.distractionAttentionProportion, data.closeEyesProportion];
                	vm.adasData.y = [data.ldwCnt, data.hmwCnt, data.fcwCnt, data.ufcwCnt];
                	vm.adasData.trend = [data.ldwProportion, data.hmwProportion, data.fcwProportion, data.ufcwProportion];
                	vm.behaviorData.y = [data.sharpDecelerationCnt, data.sharpAccelerationCnt, data.vehicleOverSpeedCnt, data.idlingSlideCnt];
                	vm.behaviorData.trend = [data.sharpDecelerationProportion, data.sharpAccelerationProportion, data.vehicleOverSpeedProportion, data.idlingSlideProportion];
                	
                	//设置对比状态
                	var max,
            			dmsLength = vm.dmsData.x.length,
            			adasLength = vm.adasData.x.length,
            			behaviorLength = vm.behaviorData.x.length;          			
        			max = _.max(vm.dmsData.y);
        			vm.dmsChar.xAxis.max = max;
        			for (var i=0; i<dmsLength; i++) {
        				vm.dmsData.maxY.push(max);
        			}
        			max = _.max(vm.adasData.y);
        			vm.adasChar.xAxis.max = max;
        			for (var i=0; i<adasLength; i++) {
        				vm.adasData.maxY.push(max);
        			}
        			max = _.max(vm.behaviorData.y);
        			vm.behaviorChar.xAxis.max = max;
        			for (var i=0; i<behaviorLength; i++) {
        				vm.behaviorData.maxY.push(max);
        			}
                	
                	vm.dmsChar.yAxis.data = vm.dmsData.x;
                	vm.dmsChar.series = EchartsOptionsUtils.setSeriers([{
						name: 'DMS事件',
						data: vm.dmsData.y
					}], 'bar', 'right');
					vm.dmsChar.series.push(setGap(vm.dmsData.maxY, vm.dmsData.trend, 'right', '1'));
                	vm.adasChar.yAxis.data = vm.adasData.x;
                	vm.adasChar.series = EchartsOptionsUtils.setSeriers([{
						name: 'ADAS事件',
						data: vm.adasData.y
					}], 'bar', 'right');
					vm.adasChar.series.push(setGap(vm.adasData.maxY, vm.adasData.trend, 'right', '1'));
                	vm.behaviorChar.yAxis.data = vm.behaviorData.x;
                	vm.behaviorChar.series = EchartsOptionsUtils.setSeriers([{
						name: '驾驶行为分析',
						data: vm.behaviorData.y
					}], 'bar', 'right');
					vm.behaviorChar.series.push(setGap(vm.behaviorData.maxY, vm.behaviorData.trend, 'right', '1'));
					
                }
            }).catch(function(err) {
                Message.error(err.message);
            }).finally(function() {
            	vm.rightCharsloading = true;
            });
        };
		
		vm.changeRank = function(flag) {
			vm.leftSecondCharloading = false;
			if (flag === '0') {
				vm.leftSecondChar.xAxis.data = vm.rank.top10.x;
				vm.leftSecondChar.yAxis.max = vm.rank.top10.maxY[0];
				vm.leftSecondChar.series = EchartsOptionsUtils.setSeriers([
					{ name: '前十名', data: vm.rank.top10.y }
				], 'bar');
				vm.leftSecondChar.series.push(setGap(vm.rank.top10.maxY, vm.rank.top10.trend, 'top', '0'));
			} else {
				vm.leftSecondChar.xAxis.data = vm.rank.end10.x;
				vm.leftSecondChar.yAxis.max = vm.rank.end10.maxY[0];
				vm.leftSecondChar.series = EchartsOptionsUtils.setSeriers([{
					name: '前十名',
					data: vm.rank.end10.y
				}], 'bar');
				vm.leftSecondChar.series.push(setGap(vm.rank.end10.maxY, vm.rank.end10.trend, 'top', '0'));
			}
			vm.leftSecondCharloading = true;
		};
		
		vm.init = function() {
			//construction char
			vm.leftFirstChar = EchartsOptionsUtils.charCommon();
			vm.leftSecondChar = EchartsOptionsUtils.charCommon();
			vm.dmsChar = EchartsOptionsUtils.charCommon('', '', true);
			vm.adasChar = EchartsOptionsUtils.charCommon('', '', true);
			vm.behaviorChar = EchartsOptionsUtils.charCommon('', '', true);
			
			vm.leftFirstChar.tooltip = { show: false };
			vm.leftSecondChar.tooltip = { show: false };
			vm.dmsChar.tooltip = { show: false };
			vm.adasChar.tooltip = { show: false };
			vm.behaviorChar.tooltip = { show: false };
			
			vm.dmsChar.grid.right = '15%';
			vm.adasChar.grid.right = '15%';
			vm.behaviorChar.grid.right = '20%';
			vm.dmsChar.grid.left = '0';
			vm.adasChar.grid.left = '0';
			vm.behaviorChar.grid.left = '0';
			vm.dmsChar.grid.top = '40';
			vm.adasChar.grid.top = '40';
			vm.behaviorChar.grid.top = '40';
			
			vm.dmsChar.title = {
				text: 'DMS事件'
			};
			vm.adasChar.title = {
				text: 'ADAS事件'
			};
			vm.behaviorChar.title = {
				text: '驾驶行为事件'
			};
			
			//api
			vm.queryThreeDayCarRiskCompare();
			vm.querySecureBoardDayRisk();
			vm.queryMonthTenCarRiskCompare();
			vm.querySevenDayRiskCompare();
		};
		
		vm.init();
		
		var listener = $scope.$watch(function() {
			return vm.queryDate;
		}, function(n, o) {
			if (n && n != o) {
				vm.leftFirstCharloading = false;
				vm.querySecureBoardDayRisk();
			}
		});
		
		$scope.$on('$destroy', function() {
            listener();
        });
        
        /**
         * 
         * @param {Array} data 数值
         * @param {Array} trend 对比数值
         * @param {String} posiiton 位置
         * @param {String} flag 区分标识 0-左侧图吧，1-右侧图表
         */
        function setGap(data, trend, posiiton, flag) {
        	return {
				"name": "",
				"data": data,
				"type": "bar",
				"barMaxWidth": 20,
				"label": {
					"normal": {
						align: 'center',
						"show": true,
						"position": posiiton,
						distance: 40,
//						distance: flag === '0' ? 40 : 40,
						formatter: function(params) {
							console.info(trend[params.dataIndex]);
							var str, val = trend[params.dataIndex] || 0;
							if (parseInt(val) > 0) {
								if (flag === '0') {
									str = '{a|' + '+' + val + '}';
								} else {
									str = '{b|' + '+' + val + '%' + '}';
								}
							} else if (parseInt(val) < 0) {
								if (flag === '0') {
									str = '{b|' + val + '}';
								} else {
									str = '{a|' + val + '%' + '}';
								}
							} else {
								str = '{c|' + val + (flag === '0' ? '' : '%') + '}';
							}
							return str;
						},
						rich: {
							a: {
								color: '#2b821d'
							},
							b: {
								color: '#c12e34'
							},
							c: {
								color: '#333333'
							}
						}
					}
				},
				"barGap": "-100%",
				"itemStyle": {
					"color": "rgba(0,0,0,0)"
				}
			}
    	}
	}
	
})();

