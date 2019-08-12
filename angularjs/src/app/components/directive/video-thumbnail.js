(function() {

	'use strict';

	angular.module('WeComponents')
		.directive('weVideoThumbnail', weVideoThumbnail)

	function weVideoThumbnail($timeout){
		return {
			//通过设置项来定义 
			restrict: 'E',
			scope: {
				videoUrl: '=',
				nextFn: '=',
				downloadFn: '='
			},
			replace: true,
			templateUrl: 'app/components/directive/video-thumbnail.html',
			link: function(scope, element, attrs) {
				var video = document.createElement('video'),
					id = 'weVideoThumbnail_' + new Date().getTime(),
					canvas = element.children('canvas')[0]; //jqLite转成原生dom操作，便于操作canvas
				video.src = scope.videoUrl || '';
				
				var init = function() {
					$timeout(function() {						
						canvas.setAttribute('id', id);
						var ctx = canvas.getContext('2d');
						video.onloadeddata = function() {
							ctx.drawImage(video, 0, 0, 60, 60);
						};
					});
				};
				
				init();
				
				scope.play = function() {
					scope.nextFn && scope.nextFn();
				};
				scope.download = function() {
					scope.downloadFn && scope.downloadFn(scope.videoUrl);
				};
				
				scope.$watch('videoUrl', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                    	init();
                    }
                });
			}
		};
	}
})();
