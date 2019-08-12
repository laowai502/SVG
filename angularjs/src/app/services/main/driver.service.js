(function() {
	'use strict'

	angular.module('WeServices').service('DriverService', DriverService);

    function DriverService(RequestService) {
        return {
            /**
             * 获取司机列表
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            getDriverList: function(query, page) {
                return RequestService.get(
                    '/safeplatform/queryDriverList',
                    angular.merge({}, page, query)
                );
            },
            /**
             * 获取司机详情
             * @param {Object} query 入参
             * @param {Object} page 分页
             */
            queryDriverInfo: function(query, page) {
                return RequestService.get(
                    '/safeplatform/queryDriverInfo',
                    angular.merge({}, page, query)
                );
            }

        }
    }

})();