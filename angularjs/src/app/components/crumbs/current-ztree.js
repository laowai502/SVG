(function () {
	'use strict';

	angular.module('WeComponents')
		.directive('currentBaseZtree', function ($timeout, $rootScope) {

		var initZtree = function (iElement, option, data, expandAll) {
			var ztreeObj = $.fn.zTree.getZTreeObj($(iElement).attr('id'));
			if (ztreeObj) {
				ztreeObj.destroy();
			}

			iElement.attr("id", "weZtree_" + new Date().getTime());
				ztreeObj = $.fn.zTree.init(iElement, option, data);
				if (expandAll === true) {
					ztreeObj.expandAll(true);
				}
				return ztreeObj;



		};

		//展开节点
		function expand(ztreeObj, node) {
			console.log(ztreeObj, node)
			if (node === null) {
				return;
			}
			var ps = [];
			ps.push(node);
			var p = node.getParentNode();
			while (p !== null) {
				ps.push(p);
				p = p.getParentNode();
			}
			for (var i = ps.length - 1; i >= 0; i--) {
				ztreeObj.expandNode(ps[i], true);
			}
		}

		return {
			restrict: 'EA',
			scope: {
				option: '=?',
				data: '=?',
				checkedNodes: '=?',
				onCreateSuccess: '&'
			},
			template: '<ul class="ztree"></ul>',
			replace: true,
			link: function (scope, iElement, iAttrs) {
				scope.ztreeObj = null;
				scope.response = true;
				function oncheck() {
					scope.$apply(function () {
						scope.response = false; //避免自己接收到了，这里加一个标示
						scope.checkedNodes = scope.ztreeObj.getCheckedNodes(true);
					});
				}
				function doInitZtree() {
					var _oncheck = function () { },
						_addDiyDom = function () { };
					if (scope.option.callback) {
						if (scope.option.callback.onCheck) {
							_oncheck = scope.option.callback.onCheck;
						}
					} else {
						scope.option.callback = {};
					}
					scope.option.callback.onCheck = function (event, treeId, treeNode) {
						_oncheck(event, treeId, treeNode);
						oncheck(event, treeId, treeNode);
					};
					if (!scope.option.view) {
						scope.option.view = {};
					}
					scope.option.view.addDiyDom = function (treeId, treeNode) {
						if (!treeNode.isParent && treeNode.type) $("#" + treeNode.tId + "_a");
					};
					if (scope.option.action && scope.option.action.expandAll) {
						scope.ztreeObj = initZtree(iElement, scope.option, scope.data, true);
					} else {
						scope.ztreeObj = initZtree(iElement, scope.option, scope.data, false);
					}

					if (scope.onCreateSuccess) {
						scope.onCreateSuccess({tree:scope.ztreeObj});
					}
				}
				$timeout(function () {
					doInitZtree();
				});

				scope['$on']('$stateChangeStart', function (evt, toState, toParams) {
					if(toState.name != 'home'){
						scope.option.async.otherParam = {
							//"adminId": $rootScope.userInfo.autoIncreaseId,
							"token": $rootScope.userInfo.token
						};
						doInitZtree();
					}
				});
				scope.$watch('data', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						doInitZtree();
					}
				}, true);
			}
		};

	});

})();
