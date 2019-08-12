(function() {
	'use strict'

	angular.module('WeServices').service('DashboardService', DashboardService);

	function DashboardService(RequestService) {
		return {
			/*
			 * 精简看板-顶部第四个card+车辆实时报警
			 */
			queryCurrentDayRiskInfo: function() {
				return RequestService.get('/safeplatform/queryCurrentDayRiskInfo');
			},
			/*
			 * 精简看板-顶部前三个card
			 */
			queryCurrentDayRiskInfoRealTime: function() {
				return RequestService.get('/safeplatform/queryCurrentDayRiskInfoRealTime');
			},
			/**
			 * 精简看板-单日企业安全趋势（全车次数）
			 * @param {String} date YYYY-MM-DD
			 */
			querySingleDayCompanyRiskInfo: function(date, tid) {
				var obj = {
					queryDate: date
				};
				if (tid) obj.tid = tid;
				return RequestService.get('/safeplatform/querySingleDayCompanyRiskInfo', obj);
			},
			/**
			 * 精简看板-月度统计
			 * @param {String} date YYYY-MM
			 */
			queryMonthCompanyRiskInfo: function(date, tid) {
				var obj = {
					queryDate: date
				};
				if(tid) obj.tid = tid;
				return RequestService.get('/safeplatform/queryMonthCompanyRiskInfo', obj);
			}
		}
	}

})();