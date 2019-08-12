(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('MainSafeController', MainSafeController);

    function MainSafeController($scope, $state, $rootScope, SafeService, Message) {

        var vm = this,
            nowTime = moment().add(-1, 'days').format('YYYY-MM-DD'),
            monthFirst = moment().startOf('month').format('YYYY-MM-DD');

        vm.datePickerOptions = {
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
        vm.list = [
//			{
//				id: 1,
//				carNumber: 'laowai',
//				carCode: 'laowai',
//				driverName: 'laowai',
//				driverCode: 'adas',
//				terminalId: 10090330165,
//				totalCount: 'laowai',
//				adasCount: 'laowai',
//				behaviorCount: 'laowai',
//			}
        ];

        vm.flip = function(p) {
            vm.page.page_number = p;
            vm.getList();
        };

        vm.getList = function() {
            SafeService.getList(vm.query, vm.page).then(function(data) {
                if(data) {
                    angular.forEach(data.list, function(item) {
                        var drivers = []
                        //100280001:小王,100280002:小李,100280003:张师傅
                        if (item.driverName !== null && item.driverName !== '') {
                            drivers = item.driverName.split(',');
                            item.driverName = _.map(drivers, function(item) {
                                return {
                                    name: item.split(':')[1],
                                    code: item.split(':')[0]
                                }
                            });
                        }
                    });
                    vm.list = data.list;
                    vm.page.total = data.total
                }
            }).catch(function(err) {
                Message.error(err.message);
            });
        };

        vm.reset = function() {
            vm.query = {
                carNumber: '',
                driverName: '',
                startDate: monthFirst,
                endDate: nowTime
            };
        };

        vm.go = function(item) {
            $state.go('main.safeDetail', { tid: item.terminalId, flag: '0', date: vm.query.startDate + '|' + vm.query.endDate });
        };

        vm.init = function() {
            vm.reset();
            vm.getList();
        };

        vm.init();
    }
})();
