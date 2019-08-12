(function() {
    'use strict'

    angular.module('WeServices').service('HistoryService', HistoryService);

    function HistoryService(RequestService) {
        return {
            /**
             * 车辆报警历史记录列表查询接口
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            getList: function(query, page) {
                return RequestService.get(
                    '/safeplatform/queryCarHistoryAlarmList',
                    angular.merge({}, page, query)
                );
            },
            /**
             * 车辆报警历史记录详情查询接口
             * @param {String} alarmId
             * @param {Object} queryDate
             */
			queryCarHistoryAlarmDetail: function(alarmId, queryDate) {
				return RequestService.get(
					'/safeplatform/queryCarHistoryAlarmDetail',
					{
						alarmId: alarmId,
						queryDate: queryDate
					}
				)
			}
        }
    }

})();
