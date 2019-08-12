(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('MainDriverController', function MainDriverController(DriverService, Message) {
            var vm = this;

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
                DriverService.getDriverList(vm.query, vm.page).then(function(data) {
                    if (data) {
                        vm.list = data.list;
                        vm.page.total = data.total;
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                });
            };

            vm.reset = function() {
                vm.query = {
                    driverName: '',
                    IdentityNo: '',
                    carNumber: ''
                };
            };

            vm.init = function() {
                vm.reset();
                vm.getList();
            };

            vm.showDetail = function(id){

            };

            vm.init();
        });
})();
