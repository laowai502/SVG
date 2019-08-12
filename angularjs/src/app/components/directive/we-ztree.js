(function () {
	'use strict';

	angular.module('WeComponents')
		.directive('weZtree', function ($timeout, $rootScope) {

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
		//DOM节点结构, 通过curSelectedNode设置点击状态样式
//		<li id="weZtree_1535704160679_3" class="level1" tabindex="0" hidefocus="true" treenode="">
//			<span id="weZtree_1535704160679_3_switch" title="" class="button level1 switch center_docu" treenode_switch=""></span>
//			<a id="weZtree_1535704160679_3_a" class="level1 curSelectedNode" treenode_a="" onclick="" target="_blank" style="">
//				<span id="weZtree_1535704160679_3_ico" title="" treenode_ico="" class="button car_ico_docu"></span>
//				<span id="weZtree_1535704160679_3_span"></span>
//			</a>
//		</li>
		var setClickStyle = function(obj, id) {	//相当于每次点击树节点都重新设置样式
			var node = obj.getNodesByParamFuzzy('id', id);
			if(node.length && node.length === 1) {	
				var son = $('#'+node[0].tId).children('a.level1'),
					brothers = $('#'+node[0].tId).siblings().children('a.level1');
				brothers.removeClass('curSelectedNode');
				son.addClass('curSelectedNode');
			}
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
				checkedNodes: '=?',
				onCreateSuccess: '&',
				defaultClick: '=?'	//模拟点击过的节点
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
						scope.$emit('weTree:doInitZtree', {
							tree: scope.ztreeObj
						});
						if (scope.onCreateSuccess) {
							scope.onCreateSuccess({tree:scope.ztreeObj});
						}
						if(scope.defaultClick) {
							setClickStyle(scope.ztreeObj, scope.defaultClick);
						}
					}
				}
				$timeout(function () {
					doInitZtree();
				});
				scope.$watch('data', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						doInitZtree();
					}
				}, true);
				scope.$watch('checkedNodes', function (newVal, oldVal) {
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
				var watchDefaultClick = scope.$watch('defaultClick', function (newVal, oldVal) {
					if(newVal !== oldVal) {
						if(scope.ztreeObj) setClickStyle(scope.ztreeObj, newVal);
					}
				});
				
				scope.$on('$destroy', function(){
	            	watchDefaultClick();
	            });
			}
		};

	});

})();