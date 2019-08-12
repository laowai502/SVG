(function () {
	'use strict';
	angular.module('WeServices')
		.factory('DefaultInterceptor', function ($rootScope, $log, Urls) {
			var whitelist = [];
			var onResponse = function (response) {
				
				if (response.config.url.indexOf(Urls.serviceUrl) >= 0) {
					(!response.data) && (response.data = {
						code: 500,
						resultCode: 500,
						msg: '网络或服务器错误，请稍后重试',
						message: '网络或服务器错误，请稍后重试'
					});


					if (response.data.resultCode === 509) {
						$log.info('登陆超时');
						//重置data值，解决
						$rootScope.$broadcast('user:invalid', response.data.message);
						response.data = {
							resultCode: 200,
							data: null
						};
					} else if (response.data.resultCode === 406) {
						$rootScope.$broadcast('user:norole');
					} else if (response.data.resultCode == 500) {
						response.data = {
							code: 500,
							resultCode: 500,
							msg: '网络或服务器错误，请稍后重试',
							message: '网络或服务器错误，请稍后重试'
						};
						// $log.error('系统错误');
					} else if (response.data.resultCode == 506) {
						// $log.error('系统错误');
					}
				}

				return response;
			}

			function addWhitelist(domain) {
				whitelist.push(domain);
			}

			return {
				request: function (config) {
					return config;
				},
				requestError: function (config) {
					return config;
				},
				response: onResponse,
				responseError: onResponse
			}
		}).config(function ($httpProvider) {
			$httpProvider.interceptors.push('DefaultInterceptor');
		})
})();
