(function() {
	'use strict';
	angular
		.module('WeComponents')
		.config(['$uibTooltipProvider', function(uibTooltipProvider) {
			uibTooltipProvider.options({
				placement: 'bottom',
				popupCloseDelay: 0,
				popupDelay: 0,
				trigger: "outsideClick"
			});
			uibTooltipProvider.setTriggers({
				'openTrigger': 'closeTrigger'
			});
		}])
		.controller('HeaderController', function($scope, Message, $rootScope, $uibModal, GetTemplateUrl, GetControllerName) {
			//构造方法
			var vm = this;

			$scope.toLogout = function() {
				Message.confirm('确认该操作吗？', '提示').then(function() {
					$rootScope.logout();
				}).catch(function() {});
			};

			$scope.setUserName = function() {
				$uibModal.open({
					templateUrl: GetTemplateUrl('home.setname'),
					controller: GetControllerName('home.setname'),
					controllerAs: 'vm',
					backdrop: false,
					windowClass: 'to-forget'
				}).result.then(function(result) {}).catch(function(err) {});
			};

			$scope.settel = function() {
				$uibModal.open({
					templateUrl: GetTemplateUrl('home.settel'),
					controller: GetControllerName('home.settel'),
					controllerAs: 'vm',
					backdrop: false,
					windowClass: 'to-forget'
				}).result.then(function(result) {}).catch(function(err) {});
			};
		});
})();