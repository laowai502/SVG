(function() {
	'use strict'

	angular.module('WeServices').service('SwitchService', SwitchService);

    function SwitchService(RequestService) {
        return {
            /**
             * 获取开关详情
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            queryAlarmSetList: function(query) {
                return RequestService.get(
                    '/safeplatform/queryAlarmSetList',
                    angular.merge({}, query)
                );
            },
            /**
             * 获取开关详情
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            queryAlarmSetInfo: function(query) {
                return RequestService.get(
                    '/safeplatform/queryAlarmSetInfo',
                    angular.merge({}, query)
                );
            },
            /**
             * 更新开关状态
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            setAlarm: function(query) {
                return RequestService.get(
                    '/safeplatform/setAlarm',
                    angular.merge({}, query)
                );
            }
        }
    }

})();