(function() {
	'use strict';
	
	angular
		.module('WeViews')
		.controller('MainSnapController', function MainSnapController(SnapService, Message, $uibModal, GetTemplateUrl, GetControllerName) {
		
		var vm = this,
			nowTime = moment().format('YYYY-MM-DD');
		
		vm.nowTime = moment().format('YYYY-MM-DD');
		
		vm.datePickerRightOptions = {
            timePicker: false,
            autoUpdateInput: false,
            opens: 'left',
            locale: {
                format: 'YYYY-MM-DD'
            },
            dateLimit: {
        		days: 29
        	},
        	maxDate: nowTime
       };
        
		vm.query = null;
		vm.page = {
            page_size: 10,
            page_number: 1,
            total: 0
        };
        vm.list = [];
		
		vm.flip= function(p) {
            vm.page.page_number = p;
            vm.getList();
        };

        vm.getList = function() {        	
            SnapService.getList(vm.query, vm.page).then(function(data) {
                if (data) {
                    vm.list = data.list;
                    vm.page.total = data.total
                }
//              vm.list = [{
//              	carCode: 'T-01',
//              	carNumber: '京A11111',
//              	driverName: '郭涛',
//              	lon: 117235012,
//              	lat: 31797109,
//              	photoDate: '2019-02-03',
//              	certNo: '211203199005162516',
//              	speed: '100',
//              	fileUrl: ''
//              }];
            }).catch(function(err) {
                Message.error(err.message);
            });
        };
        
        vm.showDetail = function(paramObj) {
        	$uibModal.open({
        		templateUrl: GetTemplateUrl('main.snap.modal'),
        		controller: GetControllerName('main.snap.modal'),
        		controllerAs: 'vm',
        		backdrop: false,
        		windowClass: 'snap-detail',
        		resolve: {
        			paramObj: function() {
        				return paramObj;
        			}
        		}
        	}).result.then(function (){}).catch(function (){});
        };
		
		vm.reset = function() {
			vm.query = {
				carNumber: '',
				driverName: '',
				startDate: nowTime,
				endDate: nowTime
			};
		};
		
		vm.init = function() {
			vm.reset();
			vm.getList();
		};
		
		vm.init();
			
	});
})();
