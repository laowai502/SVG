(function() {
	'use strict'

	angular.module('WeServices').service('SafeService', SafeService);

	function SafeService(RequestService) {
		return {
			/**
			 * 查询抓拍记录列表
			 * @param {Object} query 入参
			 * @param {Object} page 分页
			 */
			getList: function(query, page) {
				return RequestService.get(
					'/safeplatform/queryCarSafeList',
					angular.merge({}, page, query)
				);
			},
			/**
			 * 车辆详情看板
			 * @param {String} tid 终端ID
			 * @param {String} sDate YYYY-MM-DD
			 * @param {String} eDate YYYY-MM-DD
			 */
			getDetail: function(tid, sDate, eDate) {
				return RequestService.get(
					'/safeplatform/QuerySectionDauRiskInfo',
					{
						tid: tid,
						startDate: sDate,
						endDate: eDate
					}
				);
			},
			/**
			 * 告警地图-告警事件查询
			 * @param {Object} tid 终端ID
			 * @param {Object} sDate YYYY-MM-DD HH:mm:ss
			 * @param {Object} eDate YYYY-MM-DD HH:mm:ss
			 */
			queryAlarmMap: function(tid, sDate, eDate) {
				return RequestService.get(
					'/safeplatform/queryAlarmMap', {
//						terminalId: 15640030412,
//						queryDateStart: '2019-03-03 00:00:34',
//						queryDateEnd: '2019-03-03 23:55:34'
						terminalId: tid,
						queryDateStart: sDate,
						queryDateEnd: eDate
					}
				);
			}
		}
	}

})();