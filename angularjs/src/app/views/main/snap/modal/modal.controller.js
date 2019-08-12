(function() {
	"use strict";
	
	angular
		.module("WeViews")
		.controller("MainSnapModalController", MainSnapModalController);
		
	function MainSnapModalController($uibModalInstance, Message, SnapService,HistoryService, paramObj) {
		
		var vm = this;

		vm.hasFile = true;
		vm.fileUrls = "";



		vm.info = paramObj || {};
		
		vm.cancel = function() {
			$uibModalInstance.dismiss();
		};
		
		vm.getCerNoUrl = function(cerNo) {
			SnapService.getCertNoUrl(cerNo).then(function(data) {
				if (data === '' || data === null) {
					vm.info.cerNoImg = './assets/images/nopic.png';
				} else {					
					if(data.photo === '' || data.photo === null) {
						vm.info.cerNoImg = './assets/images/nopic.png';
					} else {					
						vm.info.cerNoImg = 'http://111.39.245.154:3390/ccos/' + data.photo;
					}
				}
			}).catch(function(err) {
				vm.info.cerNoImg = './assets/images/nopic.png';
//				Message.info(err.message || err.msg);
			});
		};
		
		vm.init = function() {
			if (vm.info.fileUrl === '' || vm.info.fileUrl === null) {
				vm.info.fileUrl = './assets/images/nopic.png';
			}
			vm.getCerNoUrl(vm.info.certNo);
		};

        vm.getDetail = function() {
			//vm.alarmId, vm.params.alarmTime
            HistoryService.queryCarHistoryAlarmDetail(vm.info.alarmId, vm.info.photoDate).then(function(data) {
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
            }).catch(function(err) {
                Message.error(err.message);
            });
        };



		
		vm.init();
        vm.getDetail();
	}
	
})();