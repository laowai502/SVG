/**
 * @author laowai
 * @description 载重预警相关接口
 */
(function () {
    'use strict';

    angular
        .module('WeServices')
        .service('OverloadService', OverloadService);
        
    function OverloadService(Urls, RequestService) {     
        return {
        	/**
        	 * 载重轨迹接口
        	 * @param {Object} obj 入参
        	 */
            getWloadTrackList: function (obj) {
                return RequestService.fetchWhiteList(Urls.rpresetUrl + 'drivingbehaviorest/getWloadList', obj, 'POST');
            },
            /**
             * 历史载重列表接口-单车数据
             * @param {Object} query 入参
             * @param {Object} page 分页参数
             */
            getWloadTripList: function(query, page) {
            	return RequestService.fetchWhiteList(
            		Urls.rpresetUrl + 'drivingbehaviorest/getWloadTripList',
            		angular.merge({}, page, query),
            		'POST'
            	);
            },
            /**
             * 实时载重列表接口-单车数据
             * @param {Object} query 入参
             * @param {Object} page 分页参数
             */
            getWloadRealList: function(query, page) {
            	return RequestService.fetchWhiteList(
            		Urls.rpresetUrl + 'drivingbehaviorest/getRtwloadList',
            		angular.merge({}, page, query),
            		'POST'
            	);
            },
            /**
             * 根据tids查车牌号
             * @param {Array} tids 终端ID
             */
            getCarCprByTids: function(tids) {
            	return RequestService.fetchWhiteList(
            		Urls.rpresetUrl + 'drivingbehaviorest/getCarInfoList',
            		{ tids: tids },
            		'POST'
            	);
            }
        };
    }
})();