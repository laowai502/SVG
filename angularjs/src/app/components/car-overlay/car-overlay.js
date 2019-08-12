(function() {
	'use strict';

	angular.module('WeComponents').directive('weCarOverlay', weCarOverlay);

	function weCarOverlay($timeout) {
		/**
		 * 动态定位
		 * @param {Object.dom} tip	悬浮框dom对象
		 * @param {Object.dom} marker 选中打点标记dom对象
		 */
		var showTipsLocation = function(tip, marker) {
			/**
			 * 周边车辆宽度不够，所以不许考虑
			 * marker宽高（32*32）没取，或许维护可以改进
			 * tip的dom结构位置在#right下，所以相对其定位，每次设top，left都需减 mOffT，mOffL
			 * 5, 10相当于margin，设边距
			 */
			try{
				var map = $('#right'),
					tH = tip.height(),
					tW = tip.width(),
					mOffT = map.offset().top,
					mOffL = map.offset().left,
					kOffT = marker ? marker.offset().top : mOffT,
					kOffL = marker ? marker.offset().left : mOffL,
					DH = $(document).height(),
					DW = $(document).width(),
					left = 0,
					top = 0;
				if(kOffT - mOffT - tH - 5 < 0) {	//靠近上边距
					if(kOffL - mOffL - 0.5*tW - 5 < 0) {	//靠近左边距 右下
						top = (kOffT - mOffT) + 'px';
						left = (kOffL - mOffL + 32 + 5) + 'px';
					}else {
						if(DW - kOffL - 0.5*tW - 5 < 0) {	//靠近右边距  左下
							top = (kOffT - mOffT) + 'px';
							left = (kOffL - mOffL - tW - 5) + 'px';
						}else { //下中
							top = (kOffT - mOffT + 32 + 5) + 'px';
							left = (kOffL - mOffL - 0.5*tW + 16) + 'px';
						}
					}
				}else if(DH - kOffT - tH - 85 < 0) {	//靠近下边距
					top = (kOffT - tH - mOffT - 10) + 'px';
					if(kOffL - mOffL - 0.5*tW - 10 < 0) {//右上
						left = (kOffL - mOffL) + 'px';
					}else {
						if(DW - kOffL - 0.5*tW - 10 < 0) {//左上
							left = (kOffL - mOffL - tW + 32) + 'px';
						}else {//上中
							left = (kOffL - mOffL - 0.5*tW + 16) + 'px';
						}
					}
				}else {	//normal
					if(kOffL - mOffL - 0.5*tW - 10 < 0) {
						top = (kOffT - mOffT  - 0.5*tH + 16) + 'px';
						left = (kOffL - mOffL + 32 + 5) + 'px';
					}else if(DW - kOffL - 0.5*tW - 5 < 0) {	//右
						left = (kOffL - mOffL - tW - 5) + 'px';
						top = (kOffT - mOffT  - 0.5*tH + 16) + 'px';
					}else {
						if(tH < 240) tH = 248;
						left = (kOffL - mOffL - 0.5*tW + 16) + 'px';
						top = (kOffT - tH - mOffT - 10) + 'px';
					}
				}
				tip.css({
					left: left,
					top: top,
					visibility: 'visible'
				});
			}catch(e){	//暴力，异常判断移出地图可视范围
				tip.css({
					visibility: 'hidden'
				});
			}
		}
		
		return {
			templateUrl: 'app/components/car-overlay/overlay.html',
			restrict: 'E',
			replace: false,
			scope: {
				overlayBridge: '=',
				operateFlag: '=?',
				cancelModel: '=?',
				fromRtmap: '=?',
				noTrack: '@'
			},
			link: function(scope, elements) {
				scope.elementID = "carOverlay" + new Date().getTime();
			},
			controller: function($scope, $timeout, Message, CarService, blockUI) {
				var blocker = blockUI.instances.get('carOverlay'),
					fetchingCarID = null,
					isOpen = false;
				var calculateSetPosition = function(mId) {
					var marker = mId ? $('#'+mId) : null;	//用于判断
					showTipsLocation($('#' + $scope.elementID), marker);
					isOpen = true;
				};
				var fetch = function(carID) {
					blocker.start();
					CarService.getCatTrip(carID).then(function(data) {
						$scope.car = data;
					}).catch(function(err){
						$scope.opening = false;
						$('#' + $scope.elementID).css({visibility: 'visible'});
						isOpen = true;
                        if(err.resultCode != 509) {
                            Message.error(err.message);
                        }
					}).finally(function(){
						blocker.stop();
					});
				};
				$scope.overlayBridge.open = function(carID, markerId) {
					calculateSetPosition(markerId);
					fetch(carID);
				};
				$scope.overlayBridge.resetPostion = function(markerId) {
					if(isOpen) {					
						calculateSetPosition(markerId);
					}
				};
				$scope.overlayBridge.resetData = function(carID) {
					fetch(carID);
				};
				$scope.overlayBridge.close = function() {
					$scope.close();
				};
				$scope.close = function() {
					isOpen = false;
					$scope.car = null;
					if($scope.cancelModel) $scope.cancelModel = false;
					$('#' + $scope.elementID).css({
						visibility: 'hidden'
					});
				};
			}
		}
	}
})();