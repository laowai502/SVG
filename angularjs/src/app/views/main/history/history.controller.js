(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainHistoryController', function MainHistoryController($scope,$state,$window,HistoryService,Message) {
            $scope.nowTime = moment().format('YYYY-MM-DD');
            $scope.datePickerRightOptions = {
                timePicker: false,
                autoUpdateInput: false,
                opens: 'left',
                locale: {
                    format: 'YYYY-MM-DD'
                },
                dateLimit: {
                    days: 29
                },
                maxDate: $scope.nowTime
            };
            $scope.alarmSelect= [{
                value:'1',
				name : 'ADAS事件',
			},{
                value : '2',
				name: 'DMS事件',
			},{
                value: '3',
				name: '驾驶行为'
			}]
            $scope.query = null;
            $scope.page = {
                page_size: 10,
                page_number: 1,
                total: 0
            };
            $scope.list = [];

            $scope.flip= function(p) {
                $scope.page.page_number = p;
                $scope.getList();
            };

            $scope.getList = function() {
                if(!$scope.query.alarmType){
                    $scope.query.alarmType = $scope.alarmSelect[0].value
                }

                HistoryService.getList($scope.query, $scope.page).then(function(data) {
                    if (data) {
                        $scope.list = data.list;
                        $scope.page.total = data.total
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                });
            };

            $scope.reset = function() {
                $scope.query = {
                    alarmType: '1',
                    carCode: '',
                    queryDateStart: $scope.nowTime,
                    queryDateEnd: $scope.nowTime
                };
            };

            $scope.toDetail = function(obj) {
            	$window.sessionStorage.setItem('historyParams', JSON.stringify(obj));
            	$state.go('main.alarmHistoryDetail', {
            		id: obj.alarmId
            	});
            };

            $scope.init = function() {
                $scope.reset();
                $scope.getList();
            };

            $scope.init();

        });
})();
