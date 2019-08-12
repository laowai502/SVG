(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainController', function MainController() {

		var vm = this;
		vm.first = false;
		vm.second = false;
		vm.third = false;
		vm.fourth = false;
		vm.fifth = false;
		vm.sixth = false;
		vm.seventh = false;

		moment.locale('zh-cn', {})

	});
})();
