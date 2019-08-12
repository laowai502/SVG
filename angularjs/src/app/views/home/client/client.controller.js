(function() {
	'use strict';

	angular.module('WeViews')
		.controller('ClientController', ClientController);
	
	function ClientController($stateParams, $rootScope, Message) {
		
		var vm = this,
			username = $stateParams.username,
			password = $stateParams.password;

		Message.disable(false);

		//生成当前页的登入唯一标识,存储需要验证码的用户名
		vm.init = function() {
			if (password.indexOf('?') !== -1) {
				password = password.split('?')[0];
			}
			$rootScope.isFromThirdPart = true;
			$rootScope.toLogin(username, password, '', false);
		};
		
		vm.init();
	}
})();