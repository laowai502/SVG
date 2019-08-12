(function() {
	'use strict';

	angular
		.module('CommericalConcreteWeb')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider, GetTemplateUrl, GetControllerName, RoutersConfig) {
		var registRouterNames = [];

		function component(routerConfig) {
			var config = {},
				templateUrl = templateUrl || GetTemplateUrl(routerConfig.deep ? routerConfig.stack : routerConfig.name),
				controller = routerConfig.controller || GetControllerName(routerConfig.name),
				viewTag = routerConfig.viewTag || undefined;
			//子模板
			if(viewTag) {
				config = {
					url: routerConfig.path
				};
				config.views = {};
				config.views[viewTag] = {
					role: routerConfig.role,
					templateUrl: templateUrl,
					controller: controller,
					controllerAs: routerConfig.as || undefined
				};
			} else {
				config = {
					role: routerConfig.role,
					url: routerConfig.path,
					templateUrl: templateUrl,
					controller: controller,
					controllerAs: routerConfig.as || undefined,
					cache: routerConfig.cache || false
				}
			}

			$stateProvider.state(routerConfig.name, config);

			registRouterNames.push(routerConfig.name);
		}

		function routerConfig(items) {
			items.forEach(component)
		}
		
		//模仿angular2 router
		routerConfig(RoutersConfig);
		//$urlRouterProvider.otherwise('/main/');
	}
})();