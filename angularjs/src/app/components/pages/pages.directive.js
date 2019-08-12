(function() {
	'use strict';

	angular
		.module('WeComponents')
		.provider('WdPageNumber',wdPageNumberProvider)
		.directive('wdPageNumber', wdPageNumber);

	function wdPageNumberProvider() {
		var defaultPageSize = 10,
			defaultShowButtons = 5,
			style = {
				NORMAL: 'normal',
				SIMPLE : 'simple'
			},
			defaultStyle = style.NORMAL;

		return {
			setDefaultPageSize : function (PageSize) {
				defaultPageSize = PageSize || 10;
			},
			setDefaultShowButtons : function (ShowButtons) {
				defaultShowButtons = ShowButtons || 5;
			},
			style : style,
			setDefaultStyle : function (style) {
				defaultStyle = style;
			},
			$get : function () {
				return {
					getDefaultPageSize : function () {
						return defaultPageSize;
					},
					getDefaultShowButtons : function () {
						return defaultShowButtons;
					},
					getDefaultStyle : function () {
						return defaultStyle;
					}
				};
			}
		};
	}


	/**
	 *  分页指令
	 *
	 *  必选参数
	 *      当前页码(双向绑定）：pageIndex
	 *      每页结果数量(双向绑定）：pageSize
	 *      总页数和总条数至少要传入一个： total or totalPage
	 *  可选参数
	 *      每页条数（默认10条，已废弃） ： asPageSize
	 *      共显示多少个分页按钮（默认显示5个）：asShowButtons
	 *      点击页码后查询方法（不传则需要controller自己监听页数变动）：asQuery(arg[0]:当前页码)
	 *
	 *  示例<div as-page-number="" as-total="total" as-page-index="pageIndex" as-query="query"></div>
	 */
	function wdPageNumber($timeout, WdPageNumber) {
		return {
			scope : {
				totalPage : '=',
				total : '=',
				pageIndex : '=',
				pageSize : '=',
				showNumbers : '@showButtons',
				query : '='
			},
			replace: true,
			controller : function ($scope, $element, $attrs) {

				if(!$attrs['pageSize']){
					console.error('指令`wdPageNumber`中`pageSize(双向绑定)`参数必填');
				}
				if(!$attrs['pageIndex']){
					console.error('指令`wdPageNumber`中`pageIndex(双向绑定)`参数必填');
				}
				if(!$attrs['totalPage'] && !$attrs['total']){
					console.error('指令`wdPageNumber`中`totalPage(双向绑定)`与`total(双向绑定)`至少要传入一个');
				}

				$scope.pageIndex = $scope.pageIndex || 1;
				$scope.pageSize = $scope.pageSize || WdPageNumber.getDefaultPageSize();
				$scope.pageNumber = 1;
				$scope.pageButtons = [];
				$scope.pageSizes = [10,25,50,100];
				$scope.style = $attrs['pageStyle'] || WdPageNumber.getDefaultStyle();

				var showNumbers = $scope.showNumbers || WdPageNumber.getDefaultShowButtons();

				var $query = function () {
					$timeout(function () {
						$scope.query && $scope.query($scope.pageIndex);
					});
				};

				$scope.query = typeof $scope.query === 'function' ? $scope.query : function(){};

				$scope.PageSizeChange = function () {
					$scope.pageIndex = 1;
					mathPages();
					$query();
				};

				$scope.toPage = function (pageNum) {
					$scope.pageIndex = pageNum;
					$query();
				};
				$scope.toNext = function () {
					if($scope.pageIndex === $scope.pageNumber)return;
					$scope.pageIndex += 1;
					$query();
				};
				$scope.toPre = function () {
					if($scope.pageIndex === 1)return;
					$scope.pageIndex -= 1
					$query();
				};
				$scope.toFirst = function () {
					if($scope.pageIndex === 1)return;
					$scope.pageIndex = 1;
					$query();
				};
				$scope.toEnd = function () {
					if($scope.pageIndex === $scope.pageNumber)return;
					$scope.pageIndex = $scope.pageNumber;
					$query();
				};

				//计算当前分页页码
				function mathPages () {
					$scope.pageNumber = $attrs['total'] ? Math.ceil($scope.total / $scope.pageSize) : $scope.totalPage;
					var _totalPage = $scope.pageNumber,
						_t = [],
						_t2 = [],
						_numbers = showNumbers * 2 - 1;

					for(var i = 0; i < _numbers; i++){
						_t.push($scope.pageIndex - showNumbers + 1 + i);
					}

					for(var i = _t.indexOf($scope.pageIndex); i < _numbers; i++){
						if(_t2.length < showNumbers && _t[i] >= 1 && _t[i] <= _totalPage){ _t2.push(_t[i]); }
						if(i !== ((_numbers - 1)/2) && _t2.length < showNumbers && _t[_numbers - 1 - i] >= 1 && _t[_numbers - 1 - i] <= _totalPage){ _t2.push(_t[_numbers - 1 - i]); }
					}
					$scope.pageButtons = _t2.sort(function(a,b){return a - b;});

				};
				$scope.$watch('totalPage', mathPages);
				$scope.$watch('total', mathPages);
				$scope.$watch('pageIndex', mathPages);
			},
			templateUrl : 'app/components/pages/pages.html'
		};
	};


})();
