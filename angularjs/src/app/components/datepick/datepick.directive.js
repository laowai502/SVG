(function () {
	'use strict';

	angular.module('WeComponents')
	/**
	 * http://www.bootcss.com/p/bootstrap-datetimepicker/
	 * http://www.malot.fr/bootstrap-datetimepicker/#options
	 * demo
	 * <wd-date-picker
	 format="yyyy-mm-dd hh:ii:ss" 格式   默认 yyyy-mm-dd
	 view="day" 最小视图minView 可选year:年，month：月，day:天，hour：小时    默认day
	 is-empty-show="true" 是否显示清空 默认false
	 ng-change="sim.onFilter()" 同ngChange
	 ng-model="sim.query.endDate" 同ngModel
	 startDate="xxx" 允许选择的开始时间
	 endDate="xxx" 允许选择的结束时间
	 wd-read-only=true   不可编辑
	 no-contrl=true   无操作logo
	 ></wd-date-picker>
	 */
		.directive('wdDatePicker', function ($timeout) {
			return {
				scope: {
					minView: '=?',
					startDate: '=',
					endDate: '=',
					ngModel: '=',
					format: '=',
					isEmptyShow: '=',
                    minViewMode:'=?',
                    startView:'=?',
                    maxViewMode: '=?',
					wdReadOnly:'=',
					hideClearBtn: '@hideClearBtn'
				},
				require: 'ngModel',
				// template : function () {
				// 	return [
				// 		'<div class="mp-date-time-pick">'+
				// 			'<input class="form-control mp-date-input" ng-model="ngModel" ' +
				// 				//'size="{{size || 16}}" ' +
				// 				'type="text" ' +
				// 				'readonly ng-change="change()">'+
				// 			'<span ng-if="!(ngModel && isEmptyShow)" ng-click="triggerClick()" class="glyphicon glyphicon-calendar mp-date-btn"></span>'+
				// 			'<span ng-if="ngModel && isEmptyShow" ng-click="empty()" title="清空" class="glyphicon glyphicon-remove mp-date-btn"></span>'+
				// 		'</div>'
				// 	].join('');
				// },
				template : function () {
					return [
						'<div class="mp-date-time-pick">'+
						'<input class="form-control mp-date-input" ng-model="ngModel" ' +
						//'size="{{size || 16}}" ' +
						'type="text" ' +
						'readonly ng-change="change()">'+
						'<span ng-if="!(ngModel)&&!wdReadOnly&&!noContrl" ng-click="triggerClick()" class="glyphicon glyphicon-calendar mp-date-btn"></span>'+
						'<span ng-if="!wdReadOnly&&!noContrl&&hideClearBtn" ng-click="triggerClick()" class="glyphicon glyphicon-calendar mp-date-btn"></span>'+
						'<span ng-if="ngModel&&!wdReadOnly&&!noContrl&&!hideClearBtn" ng-click="empty()" title="清空" class="glyphicon glyphicon-remove mp-date-btn"></span>'+
						'</div>'
					].join('');
				},
				replace : true,
				link: function ($scope, $element, $attrs, ctrl) {
                    var minView = 0,minViewMode = 0,startView = 0,maxViewMode = 0, dom = $element.find('input').eq(0);
                    function setDate(){
                        switch ($scope.minView) {
                            case 'year':
                                minView = 4,minViewMode = 4,startView = 4,maxViewMode = 4;
                                break;
                            case 'month':
                                minView = 3,minViewMode = 3,startView = 3,maxViewMode = 3;
                                break;
                            case 'day':
                                minView = 2,minViewMode = 2,startView = 2,maxViewMode = 2;
                                break;
                            case 'hour':
                                minView = 1,minViewMode = 1,startView = 1,maxViewMode = 1;
                                break;
                        }
                        dom.datetimepicker({
                            language: 'zh-CN',
                            format: $scope.format || 'yyyy-mm-dd',
                            autoclose: 1,
                            todayHighlight: 1,
                            minViewMode: minViewMode,
                            startView: startView,
                            maxViewMode: maxViewMode,
                            minView: minView,
                            pickerPosition: $attrs.pickerPosition || "bottom-right",
                            startDate: $scope.startDate,
                            endDate: $scope.endDate
                        });
					}

					function dateStart(){
                        $scope.minView = $scope.minView || 'day';
                        $scope.minViewMode = $scope.minViewMode || 'day';
                        $scope.startView = $scope.startView || 'day';
                        $scope.maxViewMode = $scope.maxViewMode || 'day';
                        setDate()
						$scope.$watchCollection('startDate', function (startDate) {
							dom.datetimepicker('setStartDate', startDate);
						});
						$scope.$watchCollection('endDate', function (endDate) {
							dom.datetimepicker('setEndDate', endDate);
						});
						$scope.$watchCollection('todayHighlight', function (todayHighlight) {
							dom.datetimepicker('todayHighlight', todayHighlight);
						});
                        $scope.$watch('minView', function (minView) {
                        	dom.datetimepicker('remove');
                            setDate()
                        });
					}
					if(!$scope.wdReadOnly){
						$timeout(function () {
							if (!$attrs.readonly) {
								dateStart()
							} else {
								dom.datetimepicker('remove');
							}
						},100);
					}else{
						var destroy=$scope.$watchCollection('wdReadOnly',function (newValue) {
							if(newValue){
								dom.datetimepicker('remove');
							}else{
								dateStart()
							}
						},false);
						$scope.$on('$destroy',function () {
							destroy();
						});
					}


					$scope.change = function () {
						$timeout(function(){
							ctrl.$viewChangeListeners.forEach(function (item) {
								typeof item === 'function' && item();
							});
						});
					};
					$scope.empty = function () {
						if(!$scope.wdReadOnly&&!$attrs.readonly){
							$scope.ngModel = '';
							$scope.change();
						}else{
							return false;
						}
					};
					$scope.triggerClick = function () {
						if(!$scope.wdReadOnly&&!$attrs.readonly){
							dom.datetimepicker('show');
						}else{
							return false;
						}
					};
					$scope.$on('$destroy', function() {
			          	return angular.element(".datetimepicker").remove();
			        });
				}
			}
		});
})();


(function () {
	'use strict';

	angular.module('WeComponents').directive('weDatePicker', function ($timeout) {
			return {
				scope: {
					start: '=',
					end: '=',
					ngModel: '=',
					format: '@',
					isEmptyShow: '=',
					pickerPosition: '@'
				},
				require: 'ngModel',
				replace : true,
				link: function ($scope, $element, $attrs, ctrl) {
					var minView = 0, dom = $element, minViewtext = '';
					minViewtext = $attrs.minView || 'day';
					switch (minViewtext) {
						case 'year':
							minView = 4;
							break;
						case 'month':
							minView = 3;
							break;
						case 'day':
							minView = 2;
							break;
						case 'hour':
							minView = 1;
							break;
						case 'minute':
							minView = 0;
							break;
					}

					$timeout(function () {
						if ($attrs.readonly) {
							dom.datetimepicker({
								language: 'zh-CN',
								format: $scope.format || 'yyyy-mm-dd',
								autoclose: 1,
								todayHighlight: 1,
								minView: minView,
								pickerPosition: $scope.pickerPosition || 'bottom-right',
								startDate: $scope.start,
								endDate: $scope.end,
								startView: minView == 4 ? 3 : 2
							});
							$scope.$watch('startDate', function (startDate) {
								if (startDate) dom.datetimepicker('setStartDate', startDate);
							});
							$scope.$watch('endDate', function (endDate) {
								if (endDate) dom.datetimepicker('setEndDate', endDate);								
							});
						} else {
							dom.datetimepicker('remove');
						}
					}, 100);

					$scope.change = function () {
						$timeout(function(){
							ctrl.$viewChangeListeners.forEach(function (item) {
								typeof item === 'function' && item();
							});
						});
					};
					$scope.empty = function () {
						$scope.ngModel = '';
						$scope.change();
					};
					$scope.triggerClick = function () {
						dom.datetimepicker('show');
					};

					return $scope.$on('$destroy', function() {
			          	return angular.element(".datetimepicker").remove();
			        });
				}
			}
		});
})();
