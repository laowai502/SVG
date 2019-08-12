(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('MainTrackController', MainTrackController);

    function MainTrackController($scope,$state, $rootScope, $timeout, $window, $stateParams, blockUI, Message, CarService, MarkerService, RequestService, MapbarMapService, _throttle) {
    	//红岩单车队
    	var vm = this,
    		carId = $stateParams.id ? $stateParams.id : '',
        	cId = $rootScope.team_id,
        	hasMapLoad = false;
        	
        var trackingMaker = null;
        var traceHandler = null;
        var traceOverlais = [];
        var traceBrushArray = [];
        var moveX = null;
        var moveY = null;
        $scope.stopchange = false;
		
        vm.nowTime = moment().format('YYYY-MM-DD');	//当前时间
        vm.tracePoints = [];	//存放轨迹数据
        vm.speedRange = [30, 60, 80, 100];	//速度颜色
        vm.speedColors = ['rgb(255, 201, 78)', 'rgb(255, 133, 0)', 'rgb(68, 228, 166)', 'rgb(0, 122, 246)','rgb(132, 55, 255)'];
        
        $scope.traceObject = null;
        
        // 当前轨迹回放的时间点
        $scope.traceIndex = 0;
        $scope.trackPointsRange = null;
        var traceStartIndex = null;
        var traceEndIndex = null;
        var traceBlocker = blockUI.instances.get('traceBlocker');
        var canSetTrackPoint = false;
        var traceEndMarker = null;
        var traceStartMarker = null;
        var previewCar = null;
		
		vm.defaultClick = carId;	//此标识符用于反向设置树点击状态
		vm.isClickOrKeyup = true;	//根据业务需求需判断输入框是选择的还是输入的
		vm.operateFlag = null;		//车辆操作权限
       	vm.traceQuery = {//轨迹入参
            carId: carId,
            carNumbar: $stateParams.carNumber,
            beginDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
        };
        vm.summaryData = {	//总里程时长
        	mileageTotal: null,
        	timeTotal: null
        };
        $scope.intervalSpeedSlider = {	//速度
            value: 1,
            ticks: [1, 10]
        };
        $scope.trackSlider = {	//progress
            value: 1,
            max: 100,
            min: 1
        };
        vm.filterByCarNum = function(list, name) {
        	var a = _.filter(list, function(e, i) {
        		return name === e.name;
        	});
        	if(a.length === 1) {
        		vm.traceQuery.carId = vm.defaultClick = a[0].id;
        		vm.operateFlag = a[0].opFlag;
        		return true;
        	}else {
        		vm.traceQuery.carId = vm.defaultClick = '';
        		return false;
        	}
        };
        vm.tree = {//树
            setting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'pId',
                        rootPid: -1
                    }
                },
                callback: {
                    beforeClick: function () {
						if($scope.stopchange) return false;	//播放中禁止触发onClick事件
                    },
                    onClick: function (event, treeId, treeNode) {
                    	vm.operateFlag = treeNode.opFlag;
                        $scope.traceIndex = 0;	//选中车辆节点后，清空播放数据
                        vm.summaryData.mileageTotal = null;
                        vm.summaryData.timeTotal = null;
                        vm.tracePoints = [];//先赋值为空数据，以便清空地图轨迹
                        drawTraceOverlay(vm.tracePoints);	//不明白，情况为什么还要花
                        vm.initTraceOverlay();
                        $scope.trackSlider.value = 1;
                        $scope.trackSlider.max = 100;
                        $scope.trackSlider.min = 1;
                        vm.traceQuery.beginDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        vm.traceQuery.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        if (!treeNode.isParent) {
                        	vm.traceQuery.carNumbar = treeNode.name;
                        	vm.traceQuery.carId = treeNode.id;
                        	vm.isClickOrKeyup = true;
                        	$scope.$apply(function() {       
                        		vm.defaultClick = treeNode.id;	//点击树节点后，默认样式节点去除
                        	});
				        }
                    }
                }
            },
            nodes: []
        };
        vm.treeFilter = function(treeDatas) {	//红岩单车队，几口返回车辆list，手动拼一个车队节点
        	var team = {
        		id: cId,
        		pId: -1,
        		name: $rootScope.team_name,
        		iconOpen: './assets/images/foldOpen.png',
        		iconClose: './assets/images/foldClose.png',
        		iconSkin: 'car',
        		open: true
        	};
        	if(treeDatas && treeDatas.length) treeDatas.unshift(team);
            //绘制节点图标
            return _.map(treeDatas, function (item, index) {
            	if(index !== 0) {  
            		item.id = item.carId;
            		item.pId = cId;
            		item.name = item.carNum === null || item.carNum === '' ? '暂无车牌' : item.carNum;
            		item.icon = CarService.getStatusIcon(parseInt(item.onLine));
            		item.iconSkin = 'car';
            	}
            	return item;
            });
        };
        //获取当前时间，格式YYYY-MM-DD
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        //获取车队列表
        vm.queryCarTeamList = function(id) {
            CarService.getTeamCarList(id).then(function(data) {
                vm.tree.nodes = data ? vm.treeFilter(data) : [];
            }).catch(function(err) {
                if (err.resultCode == 509) {
                    Message.error("您的账号已在其它地方登录，如非本人操作，请修改密码！");
                    $rootScope.userInfo = null;
                    $rootScope.logined = false;
                    toHome();
                }else {
                    Message.error(err.message);
                }
            });
        };

        function toHome() {
            $state.go('home');
        }
        //获取总里程总时间
        vm.shareSummary = function(carId, teamId, beginDate, endDate){
            CarService.shareSummary(carId, teamId, beginDate, endDate).then(function(data) {
            	if(data) {            		
            		vm.summaryData.mileageTotal = data.mileageTotal;
            		vm.summaryData.timeTotal = data.timeTotal;
            	}
            }).catch(function(err) {
                if (err.resultCode == 509) {
                    Message.error("您的账号已在其它地方登录，如非本人操作，请修改密码！");
                    $rootScope.userInfo = null;
                    $rootScope.logined = false;
                    toHome();
                }else {
                    Message.error(err.message);
                }
            });
        };
        // 获取轨迹回放数据
        vm.fetchTrace = function(evt) {
        	evt.preventDefault();
            if(vm.traceQuery.beginDate == "") {
                Message.info('开始时间不能为空');
                return;
            }
            if(vm.traceQuery.endDate == "") {
                Message.info('结束时间不能为空');
                return;
            }
            if(!vm.isClickOrKeyup) {      
            	vm.defaultClick = '';	//键盘输入情况下先去掉树选择样式
            	if(!vm.filterByCarNum(vm.tree.nodes, vm.traceQuery.carNumbar)) {
            	    Message.warning("请输入正确的车牌号或者重新选择车辆！");
            	    return;
            	}
            }
            if(vm.operateFlag === 0) {
        		Message.info('该车辆无操作权限，请选择其他车辆');
        		return;
        	}
            if(vm.traceQuery.carId == "") {
                Message.warning("请选择车辆后再查询！");
                return;
            }
            if(moment(vm.traceQuery.endDate) < moment(vm.traceQuery.beginDate)) {
                Message.warning("开始时间不能大于结束时间！");
                return;
            }
            console.log(vm.traceQuery.beginDate)
            if((moment(getNowFormatDate()) - moment(vm.traceQuery.beginDate))/(1000*60*60*24) > 365) {
                Message.warning("仅允许查看当前时间1年内的历史轨迹！");
                return;
            }
            if((moment(vm.traceQuery.endDate) - moment(vm.traceQuery.beginDate))/(1000*60*60*24) > 90) {
                Message.warning("时间间隔不能大于90天！");
                return;
            }
            vm.tracePoints = [];
            $scope.traceIndex = 0;
            traceBlocker.start();
            vm.shareSummary(vm.traceQuery.carId, cId, moment(vm.traceQuery.beginDate).format('YYYYMMDD'), moment(vm.traceQuery.endDate).format('YYYYMMDD'));
            CarService.getCarTrack(vm.traceQuery.carId, vm.traceQuery.beginDate+" 00:00:00", vm.traceQuery.endDate+" 23:59:59", $scope.traceMap.getZoomLevel()).then(function (response) {
                if(!response) {
                    Message.info('暂无轨迹数据');
                    drawTraceOverlay(vm.tracePoints);	//不明白
                    return;
                }
                vm.tracePoints = CarService.traceDecrypt(response); //解PB
                if (!_.isArray( vm.tracePoints) || _.isEmpty( vm.tracePoints)) {
                    Message.info('暂无轨迹数据');
                    return;
                } else {
                	vm.initTraceOverlay();
                    $scope.$applyAsync(function () {
                        $scope.trackPointsRange = vm.tracePoints.slice(traceStartIndex, traceEndIndex);
                        $scope.trackSlider.max = vm.tracePoints.length;
                        $scope.trackSlider.min = 0;
                        $scope.trackSlider.value = 0;
                        $scope.traceIndex = 0;
                    });
                    onSetTraceStartIndex(0);
                    onSetTraceEndIndex(vm.tracePoints.length - 1);
                    drawTraceOverlay(vm.tracePoints);
                    $scope.traceMap.setCenter(new MPoint(vm.tracePoints[0].lon, vm.tracePoints[0].lat));
                }
            }).catch(function(err){

            }).finally(function () {
                traceBlocker.stop();
            });
        };
		vm.initTraceOverlay = function() {	//关闭轨迹相关overlay
            if(traceEndMarker) {
                $scope.traceMap.removeOverlay(traceEndMarker);
                traceEndMarker = null;
            }
            if(traceStartMarker) {
                $scope.traceMap.removeOverlay(traceStartMarker);
                traceStartMarker = null;
            }
            if(trackingMaker) {
                $scope.traceMap.removeOverlay(trackingMaker);
                trackingMaker = null;
            }
		};
//==============================================================================原轨迹逻辑start（无力修改）==================================================================//
        var showTrackingMarker = function (traceObject) {
            if (trackingMaker) {
                $scope.traceMap.removeOverlay(trackingMaker);
            }
            trackingMaker = MarkerService.showOnlyIconMarker('./assets/images/vihicle.png', traceObject.lat, traceObject.lon, 40, 51, 19, 45);
            $scope.traceMap.addOverlay(trackingMaker);
            MarkerService.centerOrZoom($scope.traceMap, $scope.traceObject.lon, $scope.traceObject.lat); //...
        };
        // 显示当前轨迹点并累加轨迹点索引
        var showNextTrace = function () {
            if ($scope.isTrackPlaying) {
                if ($scope.traceIndex >= 0 && $scope.traceIndex <= traceEndIndex) {
                    $scope.traceObject = vm.tracePoints[$scope.traceIndex];
                    $scope.trackSlider.value = $scope.traceIndex;
                    $scope.traceIndex++;
                    if($scope.traceMap){//防止正在播放时，由于切换路由注销了地图而报错
	                    showTrackingMarker($scope.traceObject);
	                    $timeout(showNextTrace, $scope.intervalSpeed);
                    }
                } else {
                    $scope.isTrackPlaying = false;
                    $scope.stopchange = false;
                }
            }
        };
        $scope.onChangeTrackSlider = function (event, val) {
            if (val >= 0) {
                $scope.traceIndex = val;
            }
            if (vm.tracePoints && $scope.traceIndex <= traceEndIndex) {
                $scope.traceObject = vm.tracePoints[$scope.traceIndex];
                showTrackingMarker($scope.traceObject);
            }
        };
        $scope.$watch('intervalSpeedSlider.value', function (val) {
            if (val > 0) {
                $scope.intervalSpeed = 2000 / val;
            }
        });
        $scope.UpSpeed=function () {
            if($scope.intervalSpeedSlider.value===10){
                return $scope.intervalSpeedSlider.value==10;
            }
            $scope.intervalSpeedSlider.value=$scope.intervalSpeedSlider.value+1;
            $scope.intervalSpeed = 2000 / $scope.intervalSpeedSlider.value;
        };
        $scope.DownSpeed=function () {
            if($scope.intervalSpeedSlider.value===1){
                return $scope.intervalSpeedSlider.value==1;
            }
            $scope.intervalSpeedSlider.value=$scope.intervalSpeedSlider.value-1;
            $scope.intervalSpeed = 2000 / $scope.intervalSpeedSlider.value;
        };
        var onMouseOverTraceOverlay = function () {
            canSetTrackPoint = true;
        };
        var onMouseOutTraceOverlay = function () {
            canSetTrackPoint = false;
        };
        var showstartPlayTrackMarker = function () {
            var point = vm.tracePoints[traceStartIndex];
            if (traceStartMarker) {
                $scope.traceMap.removeOverlay(traceStartMarker);
            }
            traceStartMarker = new MMarker(
                new MPoint(point.lon, point.lat),
                new MIcon('./assets/images/icon_199.png', 40, 51, 19, 45)
            );
            $scope.traceMap.addOverlay(traceStartMarker);
        };
        var showEndTraceMarker = function () {
            var point = vm.tracePoints[traceEndIndex];
            if (traceEndMarker) {
                $scope.traceMap.removeOverlay(traceEndMarker);
            }
            traceEndMarker = new MMarker(
                new MPoint(point.lon, point.lat),
                new MIcon('./assets/images/icon_201.png', 40, 51, 19, 45)
            );
            $scope.traceMap.addOverlay(traceEndMarker);
        };
        $window.onSetTraceStartIndex = function (index) {
            traceStartIndex = index;
            showstartPlayTrackMarker();
            if (traceEndMarker) {
                $scope.traceMap.removeOverlay(traceEndMarker);
            }
            traceEndIndex = null;
            $scope.trackSlider.value = traceStartIndex;
            $scope.trackSlider.min = traceStartIndex;
            $scope.traceIndex = traceStartIndex;
            $scope.trackPointsRange = [];
        };
        $window.onSetTraceEndIndex = function (index) {
            traceEndIndex = index;
            showEndTraceMarker();

            $scope.trackSlider.max = traceEndIndex;
            $scope.trackPointsRange = vm.tracePoints.slice(traceStartIndex, traceEndIndex);
        };
        var drawTraceOverlay = function (points) {
            var lastSpeedIndex = null;
            var currentSpeedIndex = null;
            var minSpeedLimit = null;
            var maxSpeedLimit = null;
            var speedRangeIndexLimit = vm.speedRange.length - 1;
            var pointsOfCurrentSpeed = [];
            var traceOverlay = null;
            var showCurrentSpeedOverlay = function (points, brush) {
                traceOverlay = new MPolyline(points, brush);
                MEvent.addListener(traceOverlay, 'mouseover', onMouseOverTraceOverlay);
                MEvent.addListener(traceOverlay, 'mouseout', onMouseOutTraceOverlay);
                traceOverlais.push(traceOverlay);
                $scope.traceMap.addOverlay(traceOverlay);
            };
            // clear overlay drawed at last time
            if (traceOverlais) {
                _.each(traceOverlais, function (overlay) {
                    $scope.traceMap.removeOverlay(overlay);
                });
                traceOverlais = [];
            }
            // start draw画线颜色不同
            _.some(points, function (point) {
                _.some(vm.speedRange, function (speed, speedIndex) {
                    if (speedIndex === 0) {
                        minSpeedLimit = 0;
                        maxSpeedLimit = speed;
                    } else if (speedIndex === speedRangeIndexLimit) {
                        minSpeedLimit = vm.speedRange[speedIndex - 1];
                        maxSpeedLimit = null;
                    } else {
                        minSpeedLimit = vm.speedRange[speedIndex - 1];
                        maxSpeedLimit = speed;
                    }
                    if (parseInt(point.speed) >= minSpeedLimit && (maxSpeedLimit == null ? true : (parseInt(point.speed) < maxSpeedLimit))) {
                        currentSpeedIndex = speedIndex;
                        return true;
                    }
                });
                if (currentSpeedIndex != lastSpeedIndex && lastSpeedIndex != null) {
                    pointsOfCurrentSpeed.push(new MPoint(point.lon, point.lat));
                    showCurrentSpeedOverlay(pointsOfCurrentSpeed, traceBrushArray[lastSpeedIndex]);
                    pointsOfCurrentSpeed = [];
                }
                lastSpeedIndex = currentSpeedIndex;
                pointsOfCurrentSpeed.push(new MPoint(point.lon, point.lat));
            });
            if (lastSpeedIndex >= 0) {
                showCurrentSpeedOverlay(pointsOfCurrentSpeed, traceBrushArray[lastSpeedIndex]);
            }
        };
        $scope.$watch('isTrackPlaying', function (val) {
            if ($scope.traceMap && $scope.traceMap.enableZoom) {
                $scope.traceMap.enableZoom(!val);
            }
        });
        // 开始轨迹回放
        $scope.startPlayTrack = function () {
            if (!$scope.isTrackPlaying) {
                if (vm.tracePoints === null) {
                    Message.info('请查询轨迹后后再进行播放');
                    return;
                }
                if (_.isEmpty(vm.tracePoints)) {
                    Message.info('该车辆暂时没有轨迹数据');
                    return;
                }
                if (traceStartIndex == null) {
                    Message.info('请设置起点后进行播放');
                    return;
                }
                if (traceEndIndex == null) {
                    Message.info('请设置终点后进行播放');
                    return;
                }
                // 重置时间索引
                if ($scope.traceIndex >= traceEndIndex) {
                    $scope.traceIndex = traceStartIndex;

                }
                $scope.stopchange = true;
                $scope.isTrackPlaying = true;
                showNextTrace();
            }
        };
        //　暂停轨迹回放
        $scope.stopPlayingTrack = function () {
            $scope.isTrackPlaying = false;
            $timeout.cancel(traceHandler);
            $scope.stopchange = false;
        };
//==============================================================================轨迹end==================================================================//
        /**
         * 监听地图
         **/
        var unbindLoader = $scope.$watch('traceMap', function (map) {
            if(map) {
                unbindLoader();
                hasMapLoad = true;
                map.enableKeypad(false);
                vm.queryCarTeamList(cId);
//              MEvent.addListener(map, "zoom", _throttle(function() {	//
//					if(vm.tracePoints.length > 0) vm.fetchTrace();
//				}, 300));
				MEvent.addListener(map, 'mousemove', function() {
                    moveX = map.moveX;
                    moveY = map.moveY;
                    if(canSetTrackPoint) {
                        var minDistance = 9999;
                        var distance = 0;
                        var newNearbyTopic = null;
                        var topicIndex = null;
                        var mousePosition = map.toMapCoordinate(moveX, moveY);
                        var mouseLocation = new MPoint(mousePosition.split(',')[1], mousePosition.split(',')[0]);
                        _.each(vm.tracePoints, function (topic, index) {
                            distance = map.measDistance([mouseLocation, new MPoint(topic.lat, topic.lng)]);
                            if (distance < minDistance) {
                                minDistance = distance;
                                newNearbyTopic = topic;
                                topicIndex = index;
                            }
                        });
                    }
                });
                traceBrushArray = _.map(vm.speedRange, function(speed, index) {
                    var brush = new MBrush();
                    brush.arrow = false;
                    brush.color = vm.speedColors[index];
                    brush.fill = false;
                    brush.transparency = 100;
                    brush.bgtransparency = 100;
                    brush.stroke = 6;
                    return brush;
                });
                
            }
        });
        $timeout(function() {
            if (!hasMapLoad) {
                Message.error('地图初始化超时，请刷新页面重试');
            }
        }, 5000);
    }
})();