(function() {
	'use strict';

	angular.module('WeComponents').directive('weAlarmOverlay', weAlarmOverlay);

	function weAlarmOverlay(Message, AlarmMapUtils, HistoryService, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/components/alarm-overlay/alarmOverlay.html',
			scope: {
				overlayBridge: '=',
				cancelModel: '=?',
				params: '='
			},
			link: function(scope) {
				scope.elementID = "alarmOverlay" + new Date().getTime();
				scope.isOpen = false;
				scope.change = false; //此变量用于刷新swiper，组件bug
				scope.hasFile = true;
				scope.fileUrls = [];
				var hiSliderDom = null,
					fetchId = '';
				
				var fetch = function(params) {
					scope.change = false; 
					scope.isOpen = true;
//					if (fetchId === params.alarmId) {
//						return false;
//					}
					fetchId = params.alarmId;
					HistoryService.queryCarHistoryAlarmDetail(fetchId, params.alarmTime).then(function(data) {
						scope.change = true;
//						data = [
//							{ videoUrl: './assets/libs/video/replay1.jpg' },
//							{ videoUrl: './assets/libs/video/view.mp4' },
//							{ videoUrl: './assets/libs/video/replay1.jpg' },
//							{ videoUrl: './assets/libs/video/replay1.jpg' },
//							{ videoUrl: './assets/libs/video/replay1.jpg' }
//						];
						if (data && data.length > 0) {
							scope.fileUrls = [];
							angular.forEach(data, function(item) {
								if (item.videoUrl !== '' && item.videoUrl !== null) {
									var isImg;
									if(!/\.png$|\.jpg$|\.jpeg$|\.gif$/i.test(item.videoUrl)) {
										isImg = false;
									} else {
										isImg = true;
									}
									scope.fileUrls.push({ 
										videoUrl: item.videoUrl, 
										isImg: isImg,
										id: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()
									});
								}
							});
							scope.hasFile = true;
						} else {
							scope.hasFile = false;
						}
						scope.isOpen = true;
//						scope.$digest();
						AlarmMapUtils.showTipsLocation1($('#' + scope.elementID), $('#' + params.markerId), $('#alarmMapContainer'), true);
					}).catch(function(err){
						$('#' + scope.elementID).css({visibility: 'visible'});
						scope.isOpen = true;
                        if(err.resultCode != 509) {
                            Message.error(err.message);
                        }
					});
				};
				
				scope.$watch('params', function(n, o) {
					if (n) {
						fetch(n);
					}
				});
			},
			controller: function($scope) {
				$scope.overlayBridge.resetPostion = function(markerId) {
					if($scope.isOpen) {
						AlarmMapUtils.showTipsLocation1($('#' + $scope.elementID), $('#' + markerId), $('#alarmMapContainer'));
					}
				};
				$scope.overlayBridge.close = function() {
					$scope.close();
				};
				$scope.close = function() {
					$scope.isOpen = false;
					$scope.params = null;
					$('#' + $scope.elementID).css({
						visibility: 'hidden'
					});
				};
			}
		}
	}
})();