(function() {
	'use strict'

	angular.module('WeServices').service('DataBoxService', DataBoxService);

	function DataBoxService(RequestService) {
		return {
			/*
			 * 大数据分析-顶部card数据
			 */
			queryThreeDayCarRiskCompare: function() {
				return RequestService.get('/safeplatform/queryThreeDayCarRiskCompare');
			},
			/**
			 * 大数据分析-车辆风险次数单车统计
			 * @param {String} date YYYY-MM-DD
			 */
			querySecureBoardDayRisk: function(date) {
				return RequestService.get(
					'/safeplatform/querySecureBoardDayRisk',
					{
						queryDate: date
					}
				);
			},
			/**
			 * 大数据分析-车辆安全排名以及上月对比
			 */
			queryMonthTenCarRiskCompare: function() {
				return RequestService.get('/safeplatform/queryMonthTenCarRiskCompare');
			},
			/**
			/**
			 * 大数据分析-7天安全数据对比
			 */
			querySevenDayRiskCompare: function() {
				return RequestService.get('/safeplatform/querySevenDayRiskCompare');
			}
		}
	}

})();