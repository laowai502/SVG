(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainDriverDetailController', function MainDriverDetailController(DriverService,Message,$stateParams) {
			var vm = this;

			vm.driverInfo = {};
			vm.query = {driverCode:$stateParams.id};

			//alert($stateParams.id);

            vm.queryDriverInfo = function() {
                DriverService.queryDriverInfo(vm.query, vm.page).then(function(data) {
                    if (data) {
                        //vm.driverInfo = data;
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                });
            };

			vm.driverInfo = {
             driverName:"张三",
             certNo:"211203199606142521",
             carNumber:"皖AH1234(T-05)",
             carCompany:"小白物流公司",
             carType:"大型客车",
             cnotackTel:"13112345678",
             driverPhotoUrl:"http://111.39.245.154:3390/ccos/files/faceimg/201902271117_211203199005162516.jpg"
         };

            vm.queryDriverInfo();

	});
})();
