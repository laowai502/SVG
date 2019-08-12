(function() {
	'use strict';

	angular
		.module('WeViews')
		.service('EchartsOptionsUtils', EchartsOptionsUtils);

	/**
	 * 数据分析详情全屏相关charts图
	 */
	function EchartsOptionsUtils() {
		return {
			/**
			 * char 通用配置
			 * @param {String} xTitle x轴名称
			 * @param {String} yTitle y轴名称
			 * @param {Boolean} isHorizontal 是否是横向的
			 */
			charCommon: function(xTitle, yTitle, isHorizontal) {
				var charBody = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: []
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						data: [],
						name: xTitle || '',
						axisTick: {
							alignWithLabel: true
						},
						axisLine: {
							lineStyle: {
								color: '#999'
							}
						},
						axisLabel: {
							fontSize: 12,
							color: '#999'
						},
						nameGap: 15
					},
					yAxis: {
						name: xTitle || '',
						type: 'value',
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#999'
							}
						},
						axisLabel: {
							fontSize: 12,
							color: '#999'
						}
					}
				};
				
				if (isHorizontal !== undefined) {
					if (isHorizontal) {
						charBody.yAxis.type = 'category';
//						charBody.yAxis.boundaryGap = true;
						charBody.xAxis.type = 'value';
					} else {
						charBody.xAxis.type = 'category';
//						charBody.xAxis.boundaryGap = true;
						charBody.yAxis.type = 'value';
					}
				}
				
				return charBody;
			},
			/**
			 * echarts 图 设置系列，根据业务只用于柱状图和折线图
			 * @param {Object} data 系列数据
			 * @param {Object} charType 
			 * @param {String} labelPostion label位置
			 */
			setSeriers: function(data, charType, labelPostion) {
				var series = []
				angular.forEach(data, function(item, index) {
					var obj = {
						name: item.name,
						data: item.data,
						type: charType
					}
					if (charType === 'bar') {
						obj.barMaxWidth = labelPostion ? 20 : 35;
					} else {
						obj.smooth = true;
					}
					obj.label = {
						normal: {
							show: true,
							position: labelPostion || 'top',
							formatter: function(p) {
								return p.data === '0' ? '' : p.data;
							}
						}
					};
					series.push(obj);
				});
				return series;
			}
		}
	}
})();