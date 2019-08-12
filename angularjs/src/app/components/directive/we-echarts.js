(function() {

	'use strict';

	angular.module('WeComponents')
		.directive('weEcharts', weEcharts);

		/**
		 * 通用echarts挂载
		 */
		function weEcharts($window, $timeout, $rootScope) {
			
			var setCharSize = function(dom) {
				var pW = $(dom).parent().width(),
					pH = $(dom).parents().height();
				$(dom).css({
					"width": pW + "px",
					"height": pH + "px"
				});
			}
		
			return {
				restrict: 'EA',
				template: '<div></div>',
				replace: true,
				scope: {
					option: '=',
					cLoading: '=?',
				},
				link: function(scope, element) {
					var echart = echarts.init(element[0]);
					echart.showLoading();
					if (scope.option) {
						echart.setOption(scope.option);
					}
					$timeout(function() {
						setCharSize(element[0]);
						echart.resize();
					}, 400)
//					var rootWatch = $rootScope.$on('IS-COLLAPSED', function() {
//						$timeout(function() {
//							setCharSize(element[0]);
//							echart.resize();
//						}, 300)
//					});
//					var fullScreenWatch = $rootScope.$on('IS-FULL-SCREEN', function() {
//						$timeout(function() {
//							setCharSize(element[0]);
//							echart.resize();
//						}, 100)
//					});
					var load = scope.$watch('cLoading', function(newVal) {
						if (newVal) {
							echart.hideLoading();
						} else {
							echart.showLoading();
						}
					});
					var set = scope.$watch('option', function(newVal, oldVal) {
						if(newVal !== oldVal) {
							echart.setOption(newVal);
						}
					}, true);
					scope.$on('$destroy', function() {
						set(), load()
//						rootWatch(), fullScreenWatch();
					});
				}
			};
		}
})();