(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainSrankController', function MainSrankController($scope,SrankService,Message) {
            $scope.nowTime = moment().add(-1, 'days').format('YYYY-MM-DD');
            $scope.list = [];
            $scope.dateType=0;
            $scope.query = {
                time : '',
                type : 1
            }
            $scope.page = {
                page_size: 10,
                page_number: 1,
                total: 0
            };
            $scope.formatSrank = ''
            $scope.minViewSrank = ''
            $scope.queryRange = [{
                type:'日期查询',
                value:'1'
            },{
                type:'月度查询',
                value:'2'
            }]
            $scope.colCycleName = "环比昨日";
            $scope.changePro = function(data){
                if(data.value==1){
                    $scope.dateType = 0;
                    $scope.formatSrank = 'yyyy-mm-dd';
                    $scope.minViewSrank = 'day';
                    $scope.query.time = moment().add(-1, 'days').format('YYYY-MM-DD');
                    $scope.query.type = 1;
                    $scope.colCycleName = "环比昨日";
                }else{
                    $scope.dateType = 1;
                    $scope.formatSrank = 'yyyy-mm';
                    $scope.minViewSrank = 'month';
                    $scope.query.time = moment().format('YYYY-MM');
                    $scope.query.type = 2;
                    $scope.colCycleName = "环比上月";
                }
            }
            $scope.flip = function(index) {
                $scope.page.page_number = index;
                $scope.getList();
            };
            if($scope.query.time === ''){
                $scope.query.time = $scope.nowTime
            }
            $scope.getList = function(){
                SrankService.gerList($scope.query, $scope.page).then(function (data) {
                    if(data){
                        $scope.list = data.list;
                        $scope.page.total = data.total;
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                });
            }
            $scope.reset = function() {
                $scope.query = {
                    carVin: '',
                    driver: '',
                    time : $scope.nowTime,
                    type : 1,
                };
            };

            $scope.getList();
	});
})();
