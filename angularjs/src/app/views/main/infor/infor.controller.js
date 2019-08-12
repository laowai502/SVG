(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainInforController', MainInforController);
		
	function MainInforController($timeout, $window) {
		
		var vm = this;
		
		vm.selectedIds = [];
		
		vm.checkList = [
			{
				name: '精简看板',
				checked: false,
				value: '0'
			},
			{
				name: '大数据展示',
				checked: false,
				value: '7'
			},
			{
				name: '主动安全',
				allChecked: false,
				allCheckedIds: ['1'],
				childs: [
					{ key: 'snap', value: '1', name: '变更驾驶员', checked: false }
				]
			},
			{
				name: '载重监控',
				allChecked: false,
				allCheckedIds: ['2', '3', '4'],
				childs: [
					{ key: 'port-screen', value: '2', name: '载重预警大屏', checked: false },
					{ key: 'real-overload', value: '3', name: '载重实时监控', checked: false },
					{ key: 'history-overload', value: '4', name: '历史载重分析', checked: false }
				]
			},
			{
				name: '基本信息',
				allChecked: false,
				allCheckedIds: ['5', '6'],
				childs: [
					{ key: 'safe', value: '5', name: '车辆安全', checked: false },
					{ key: 'driver', value: '6', name: '驾驶员信息', checked: false }
				]
			}
		];
		
		vm.checkAll = function(isChecked, index) { //index可用obj替换
			if (isChecked) {
				vm.selectedIds = _.union(vm.selectedIds, vm.checkList[index]['allCheckedIds']);
				vm.checkList[index]['childs'].forEach(function(item) {
					item.checked = true;
				});
			} else {
				vm.selectedIds = _.difference(vm.selectedIds, vm.checkList[index]['allCheckedIds']);
				vm.checkList[index]['childs'].forEach(function(item) {
					item.checked = false;
				});
			}
		};
		
		vm.checked = function(isChecked, val, haveFather, fatherIndex) { //后面两个参数可以用fatherObj代替
			var index = _.findIndex(vm.selectedIds, function(item) {
				return item === val;
			});
			if (isChecked && index === -1) {
				vm.selectedIds.push(val);
			} else if (!isChecked && index !== -1) {
				vm.selectedIds.splice(index, 1);
			}
			if (haveFather) {
				var allSelected = true,
					arr = vm.checkList[fatherIndex]['childs'];
				for (var i=0; i<arr.length; i++) {
					if (!arr[i].checked) {
						allSelected = false;
						break;
					}
				}
				vm.checkList[fatherIndex]['allChecked'] = allSelected;
			}
		};

		vm.ok = function() {
//			console.info(vm.selectedIds);
			console.info(vm.treeChecked);
			
			var data = vm.treeChecked, init = [];
			
			function getCheckedIds(treeData, init) {
				var allChecked = true;
				angular.forEach(treeData, function(item) {
					if (item.isParent) { //必须含有子节点，排除是父节点但不包含子
						if (item.children) {
							allChecked = getCheckedIds(item.children, init);
							if (allChecked && init.indexOf(item.id) === -1) {
								init.push(item.id);
							}							
						}
					} else {
						if (item.checked && init.indexOf(item.id) === -1) {
							init.push(item.id);
						}
						if (!item.checked) {
							allChecked = false;
						}
					}
				});
				return allChecked;
			}
			getCheckedIds(data, init);
			console.info(init);
			
		};
		
		vm.download = function(url) {
			downLoad(url);
		};
		function downLoad(url) {
			var node = document.createElement('a'); //没有append不需要销毁
			node.download = 'video_' + new Date().getTime();
			node.href = url;
			node.click();
		};
		
		
		vm.treeChecked = [];
		
		vm.tree = {
			setting: {
				check: {
					enable: true
				},
				data: {
					simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'provinceId',
                        rootPid: -1
                    }
				}
			},
			nodes: []
		};
		
		vm.init = function() {
//			var arr = ['123', '321', '456', '789', '0909'];
//			for (var i=0; i<arr.length; i++) {
//				if (arr[i] === '321') {
//					break;
//				}
//				console.info(arr[i]);
//			}
//			$.each(arr, function(n, i) {
//				if (i === '321') {
//					return true;
//				}
//				console.info(i);
//			});
			
			vm.url = './assets/libs/video/view.mp4';
			
			vm.tree.nodes = [];
//          vm.tree.nodes = [
//				{ id: 1, pId: -1, name: "北京", checked: false },
//				{ id: 11, pId: 1, name: "北京一网", checked: false },
//				{ id: 111, pId: 11, name: "北京二网1", checked: true },
//				{ id: 112, pId: 11, name: "北京二网2", checked: false },
//				{ id: 2, pId: -1, name: "河北", checked: false },
//				{ id: 21, pId: 2, name: "河北一网", checked: false },
//				{ id: 211, pId: 21, name: "河北二网1", checked: true },
//				{ id: 212, pId: 21, name: "河北二网2", checked: false },
//				{ id: 3, pId: -1, name: "天津", checked: false },
//				{ id: 31, pId: 3, name: "天津一网1", checked: false },
//				{ id: 32, pId: 3, name: "天津一网2", checked: false },
//				{ id: 321, pId: 32, name: "天津二网1", checked: false },
//				{ id: 322, pId: 32, name: "天津二网2", checked: false },
//				{ id: 323, pId: 32, name: "天津二网3", checked: false },
//			];
			
			$.getJSON('./assets/libs/test.json').then(function(data) {
				var allChecked = true;
				for (var i=1,j=data.length-1; i<j; i++) {
					if (data[i].checked === 0) {
						allChecked = false;
						break;
					}
				}
				data[0].checked = allChecked ? 1 : 0;
				data[0].open = true;
				angular.forEach(data, function(item) {
					item.checked === 1 && vm.treeChecked.push(item.id);
					item.checked = item.checked === 1;
					item.isParent = item.isParent === 1;
				});
				vm.tree.nodes = data;
            });
			
		};
		
		vm.init();
	}
})();