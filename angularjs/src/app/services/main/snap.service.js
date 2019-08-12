(function() {
	'use strict'

	angular.module('WeServices').service('SnapService', SnapService);

	function SnapService(RequestService) {
		return {
			/**
			 * 查询抓拍记录列表
			 * @param {Object} query 入参
			 * @param {Object} page 分页
			 */
			getList: function(query, page) {
				return RequestService.get(
					'/safeplatform/queryCarRiskList', 
					angular.merge({}, page, query)
				);
			},
			/**
			 * 第三方接口，查询驾驶员照片
			 * @param {String} certNo 省份证号
			 */
			getCertNoUrl: function(certNo) {
				return RequestService.get(
					'/safeplatform/queryDriverInfoOut', 
					{
						certNo: certNo
					}
				);
			}
		}
	}

})();