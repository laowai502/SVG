(function () {
	'use strict';

	angular.module('WeComponents')
		.directive('weZtreeTest', function ($timeout, $rootScope) {

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
				checkedNodes: '=?'
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
					if(scope.option){//bella add 2018/1/28
						// console.log("是这里报错吗？？？");
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
					}
				}
				$timeout(function () {
					doInitZtree();
				});
				var watchData = scope.$watch('data', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						doInitZtree();
					}
				}, true);
				var watchCheckNodes = scope.$watch('checkedNodes', function (newVal, oldVal) {
					if (!scope.response) {
						scope.response = true;
						return;
					}
					if (scope.ztreeObj !== null) {
						var z = scope.checkedNodes;
						if (z && z !== null && angular.isArray(z) && z.length > 0) {
							//将非ztree节点转为，ztree的节点（按是否有“tId”属性来看，有则算是ztree的节点）
							for (var i = 0; i < z.length; i++) {
								if (!z[i].tId) {
									var n = scope.ztreeObj.getNodeByParam('id', z[i].id);
									z[i] = n;
								}
							}
							//展开、选中节点
							for (var i = 0; i < z.length; i++) {
								var n = z[i];
								if (n !== null) {
									expand(scope.ztreeObj, n);
									scope.ztreeObj.checkNode(n, true);
								}
							}
						}
					}
				}, false);
				
				scope.$on('$destroy', function(){
	            	watchData(), watchCheckNodes();
	            });
			}
		};

	});

})();