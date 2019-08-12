(function () {
    'use strict';

    angular
        .module('WeViews')
        .controller('MainCarController', MainCarController);

    function MainCarController ($scope, $state, $rootScope, $window, $interval, $timeout, RequestService, CarService, MarkerService, Message, _throttle) {

        var vm = this,
        	statisTimer1 = null,	//车队轮询
        	hasMapLoad = false,
        	cId = null;

        /**
         * 展示单一车辆图标
         * @param {Object} car	车辆数据
         * @param {Number} flag	0: 用于聚合， 1: 用于列表点击
         */
        var showCarMarker = function(car, flag) {
            var marker = MarkerService.showCarMarker($scope.map, car, {	//显示车
                labelCloseTimeout: true,
                labelCloseTimeoutValue: 0
            });
            if(flag === 1) {
            	$scope.map.centerAndZoom(new MPoint(car.lng, car.lat), 18);
            }
            (function(car, flag){
	            MEvent.addListener(marker, "click", function (e) {
	                vm.treeOverlayBridge.open(car.id, e.id);
	                //用menuClickCarMarker为空判断是点击聚合的还是列表选中的,主要涉及选中marker切换
	                if(vm.menuClickCarMarker && e.id !== vm.menuClickCarMarker.id) {
	                	$scope.map.removeOverlay(vm.menuClickCarMarker);
	                }
	            	vm.menuClickCarMarker = e;
	            	vm.menuClickCarId = car.id;
	            });
	        })(car, flag);
            //垃圾图吧
            var myPanListener = MEvent.bind($scope.map, "pan", vm, function() {
		        if(!this.menuClickCarMarker) {
		        	MEvent.removeListener(myPanListener);
		        }else {
		        	vm.treeOverlayBridge.resetPostion(this.menuClickCarMarker.id);
		        }
		    });
            var myZoomListener = MEvent.bind($scope.map, "zoom", vm, function() {
		        if(!this.menuClickCarMarker) {
		        	MEvent.removeListener(myZoomListener);
		        }else {
		        	vm.treeOverlayBridge.resetPostion(this.menuClickCarMarker.id);
		        }
		    });
            return marker;
        };
        //车辆列表数据过滤
        var treeFilter = function(treeDatas) {	//红岩单车队，几口返回车辆list，手动拼一个车队节点
            //绘制节点图标
            return _.map(treeDatas, function (item, index) {
            	if (item.isParent) {
            		item.open = item.pId === '-1';
            	} else {
            		item.id = item.did;
            		item.pId = item.pId;
            		item.name = item.name;
            		item.icon = CarService.getStatusIcon(parseInt(item.carStauts));
            		item.iconSkin = 'car';
            	}
            	return item;
            });
        };

        //点击树节点
        var onClickNode = function(event, treeId, treeNode) {
            if(typeof MMarker !== 'undefined') {
                if (!treeNode.isParent) {
                	if(vm.menuClickCarMarker) {
                		$scope.map.removeOverlay(vm.menuClickCarMarker);
                		vm.menuClickCarMarker = null;
                		vm.menuClickCarId = null;
                	}
                	if(treeNode.lng && treeNode.lat) {
	                    vm.menuClickCarMarker = showCarMarker(treeNode, 1);
	                    vm.menuClickCarId = treeNode.id;
	                    vm.treeOverlayBridge.open(treeNode.id, vm.menuClickCarMarker.id);
                	}else {
                		vm.treeOverlayBridge.open(treeNode.id);
                		$scope.map.centerAndZoom(new MPoint('北京市'), 7);
                		Message.info('该车辆无坐标点');
                	}
                }
            }else{
                Message.info('地图初始化中...');
            }
        };

		vm.queryModel = {};
        vm.menuClickCarMarker = null,	//通过此来判断地图事件添加移除判断
       	vm.menuClickCarId = null,	//选择车辆打点
        vm.popover = {
            title: '车辆状态说明',
            html:'<div class="car-status-popover">'+
            	 '	<p>行驶中：车辆正在正常行驶中，您可以查看车辆的速度、位置。</p><hr/>'+
            	 '	<p>静止：车辆静止不动，可以查看车辆的停车位置。</p><hr/>'+
            	 '	<p>离线：定位设备与服务器的联系中断，无法获知车辆状态，可能是因为设备未通电，车辆当前位置没有手机信号引起的，我们给您展示的是车辆最后定位到的位置。</p>'+
            	 '<div>'
        };
        //下边栏车辆信息
        vm.carCount = {
            totalCar : 0,
            driveCount : 0,
            stillCount : 0,
            offCount : 0
        };
        vm.treeOverlayBridge = {
            resetPostion: function () {},
            open: function () {},
            close: function () {}
        };
		//查询车辆列表
        vm.getTeamCarList = function() {
			if(vm.menuClickCarMarker) {
				$scope.map.removeOverlay(vm.menuClickCarMarker);
				vm.menuClickCarMarker = null;
				vm.menuClickCarId = null;
				vm.treeOverlayBridge.close();
				$scope.map.centerAndZoom(new MPoint('北京市'), 7);
			}
			 CarService.fetch(vm.queryModel.searchText).then(function(data) {
				if(vm.queryModel.searchText && data.length ==0){
                    Message.info('没有查询到对应车辆')
				}
				vm.tree.nodes = data ? treeFilter(data) : [];
			 }).catch(function(err) {
				 Message.error(err.message);
			 });
        };

        vm.init = function() {
        	cId = 0;
//      	vm.getTeamCarList();
//      	statisTimer1 = $interval(vm.getTeamCarList, 30000);
        };

        vm.init();

        var unbindLoader = $scope.$watch('map', function(value) {	//判断地图加载是否完毕
            if(value) {
                unbindLoader();
                hasMapLoad = true;
            }
        });
        $timeout(function() {	//地图加载通病
            if (!hasMapLoad) {
                Message.error('地图初 始化超时，请刷新页面重试');
            }
        }, 5000);
        //销毁轮询
        $scope.$on('$destroy', function() {
            $interval.cancel(statisTimer1);
        });

        var setAsyncTree = function() {
        	vm.tree = {
        		setting: {
        			view: {
        				expandSpeed: ""
        			},
        			async: {
        				autoParam: ["id"],
        				enable: true, // 启用异步加载
        				type: "post",
        				contentType: "application/json",
        				headers: {
        					"token": $window.sessionStorage.getItem("token")
        				},
        				url: RequestService.makeUrl(CarService.fetchUrl), // 异步请求地址
        				dataFilter: function(treeId, parentNode, res) {
        					if(res.resultCode == 200) {
        						return treeFilter(res.data);
        					} else {
        						if(parentNode) {
        							parentNode.zAsync = false;
        							parentNode.open = false;
        							parentNode.isAjaxing = false;
        						}
        						Message.error(res.message || '服务器或网络异常');
        						return null;
        					}
        				}
        			},
	                data: {
	                    simpleData: {
	                        enable: true,
	                        idKey: 'id',
	                        pIdKey: 'pId',
	                        rootPid: -1
	                    }
	                },
	                callback: {
        				onClick: function(event, treeId, treeNode) {
        					return onClickNode(event, treeId, treeNode);
        				},
        				onAsyncError: function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
        					if(treeNode) {
        						treeNode.zAsync = false;
        					}
        					var responseJson = null;
        					var errorMessage = '网络或服务器异常,请稍后再试';
        					try {
        						responseJson = JSON.parse(XMLHttpRequest.responseText);
        						errorMessage = responseJson.message || errorMessage;
        					} catch(e) {
        						console.log(e);
        					}
        					Message.error(errorMessage);
        				}
        			}
	            }
        	};
//      	$scope.isAsyncTree = true;
        }
        setAsyncTree();
    }
})();
