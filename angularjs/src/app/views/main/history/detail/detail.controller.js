(function() {
	'use strict';
	
	angular
		.module('WeViews')
		.controller('MainAlarmHistoryDetailController', MainAlarmHistoryDetailController);
		
	function MainAlarmHistoryDetailController($scope, $stateParams, $timeout, $window, HistoryService, AlarmMapUtils, Message) {
		
		var vm = this,
			hasMapLoad = false,
			nowTime = moment().format('YYYY-MM-DD HH:mm:ss'),
			markerId = '';
		
		vm.alarmId = $stateParams.id;
		vm.params = JSON.parse($window.sessionStorage['historyParams']);
		vm.showOverlay = false;
		vm.hasFile = false;
		vm.fileUrls = [];

        vm.showCarMarker = function(obj) {
            var marker = new MMarker(
                new MPoint(obj.lon, obj.lat),
                new MIcon(AlarmMapUtils.getAlarmIcon(obj.alarmTypeCode), 28, 28, 19, 45)
            );
            MEvent.addListener(marker, "click", function (e) {
            	$scope.$apply(function() {
            		vm.showOverlay = true;
            	});
            	AlarmMapUtils.showTipsLocation($('#AlarmOverlay'), $('#'+e.id), $('#historyDetail'), true);
            	markerId = e.id;
            });
            //垃圾图吧
            MEvent.bind($scope.alarmMap, "pan", vm, function() {
		        AlarmMapUtils.showTipsLocation($('#AlarmOverlay'), $('#'+markerId), $('#historyDetail'));
		    });
            MEvent.bind($scope.alarmMap, "zoom", vm, function() {  
		        AlarmMapUtils.showTipsLocation($('#AlarmOverlay'), $('#'+markerId), $('#historyDetail'));
		    });
		    $scope.alarmMap.addOverlay(marker);
		    $scope.alarmMap.centerAndZoom(new MPoint(obj.lon, obj.lat), 15);
        };
		
		vm.getDetail = function() {
			HistoryService.queryCarHistoryAlarmDetail(vm.alarmId, vm.params.alarmTime).then(function(data) {
//				data = [
//					{ videoUrl: './assets/libs/video/replay1.jpg' },
//					{ videoUrl: './assets/libs/video/view.mp4' },
//					{ videoUrl: './assets/libs/video/replay1.jpg' }
//				];
				if(data && data.length > 0) {
					vm.fileUrls = [];
					angular.forEach(data, function(item) {
						if(item.videoUrl !== '' && item.videoUrl !== null) {
							var isImg;
							if(!/\.png$|\.jpg$|\.jpeg$|\.gif$/i.test(item.videoUrl)) {
								isImg = false;
							} else {
								isImg = true;
							}
							vm.fileUrls.push({
								videoUrl: item.videoUrl,
								isImg: isImg,
								id: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()
							});
						}
					});
					vm.hasFile = true;
				} else {
					vm.hasFile = false;
				}
				vm.showCarMarker(vm.params);
			}).catch(function(err) {
				Message.error(err.message);
			});
		};
		
		vm.cancel = function() {
			//没办法这样写dom操作吧
			$timeout(function() {				
				$('#AlarmOverlay').css({
					visibility: 'hidden'
				});
				vm.showOverlay = false;
			});
		};
		
		vm.init = function() {
			vm.getDetail();
		};
		
		//判断地图加载是否完毕
		var unbindLoader = $scope.$watch('alarmMap', function(value) {
			if(value) {
				unbindLoader();
				hasMapLoad = true;
				vm.init();
			}
		});
		$timeout(function() { //地图加载通病	
			if(!hasMapLoad) {
				Message.error('地图初 始化超时，请刷新页面重试');
			}
		}, 5000);
	
	}
	
})();
