(function () {
    'use strict';

    angular
        .module('WeComponents')
        .directive('treeSelect', weNavbar);

    var defaults = {
        activeClass: 'active',
        routeAttr: 'data-match-route',
        strict: false
    };

    /** @ngInject */
    function weNavbar($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                ngModel: '=',
                myDisabled:'=',
                treeValue:'=',
                isCheckbox:'@isCheckbox',
                placeHolder:'=',  //input的提示文字 by yangjie
                isSearch:'@isSearch',  //是否支持搜索 by yangjie
                route:'=',  //搜索接口路径
                params:'=',  //搜索接口参数
                treeEmpty:'@treeEmpty',
                myUrl:'='  //请求所有车队
            },
            templateUrl: 'app/components/my-ztree/my-ztree.html',
            link: function (scope, element, attr) {

            },
            controller:function ($scope,$timeout, CarService, MapService,CommonService, RequestService,$window,$q,Message) {
                $scope.motorcade=$scope.treeValue||'';
                $scope.teamIds={
                    id:[],
                    name:[]
                };
                $scope.treeEmpty=$scope.treeEmpty||false;
                //by yangjie
                /*提示文字*/
                $scope.placeholder=$scope.placeHolder?$scope.placeHolder:'请选择车队';
                /*关键字搜索*/
                $scope.queryChange=function () {
                    var query={};
                    query[$scope.params]=$scope.keyWord;
                    CommonService.getDataCommonService($scope.route,query,'get').then(function (data) {
                        $scope.tree.nodes=data;
                    }).catch(function (err) {
                        $rootScope.catchError(err);
                    });
                };
                //by yangjie end

                /*车队树*/
                var getNodeLocationCity = function (lat, lng) {
                    var deferred = $q.defer();
                    if (!lat || !lng) {
                        deferred.resolve('无经纬度');
                    }

                    MapService.reverseCodeAddress(lat, lng)
                        .then(function (result) {
                            var address = '';
                            if (result && result.data) {
                                address = ((result.data.city && result.data.city.value) || (result.data.province && result.data.province.value) || '未知');
                            } else {
                                address = "未知位置";
                            }

                            deferred.resolve(address);
                        }, function () {
                            deferred.resolve('异常位置');
                        });

                    return deferred.promise;
                };
                var onNodeCreated = function (treeNode) {
                    /*if (!treeNode.isParent)
                    {
                        $timeout(function () {
                            getNodeLocationCity(treeNode.lat, treeNode.lng)
                                .then(function (location) {
                                    treeNode.name = treeNode.name + "(" + location + ")";
                                    $scope.treeObject.updateNode(treeNode);
                                });
                        }, 0);

                    }*/
                };

                var treeFilter = function (treeDatas) {
                    if(treeDatas.length===0){
                        return treeDatas;
                    }else{
                        /*第一个直接展开*/
                        treeDatas[0].open= true;
                        return _.map(treeDatas, function (item) {
                            // 车辆
                            if (!item.isParent) {
                                item.icon = CarService.getStatusIcon(item.carStauts);
                            }


                            return item;
                        });
                    }

                };
                var onClickNode = function (event, treeId, treeNode) {
                    if($scope.isCheckbox){
                        return false;
                    }
                    $scope.$apply(function () {
                        $scope.ngModel=treeNode.teamId;
                        $scope.motorcade=treeNode.teamName;
                        if($scope.treeValue != undefined){
                            $scope.treeValue=treeNode.teamName;
                        }
                        $scope.isOpen=false;
                    });
                };
                var onCheckNode = function (event, treeId, treeNode) {
                    if(treeNode.checked){
                        $scope.teamIds.id.push(treeNode.teamId);
                        $scope.teamIds.name.push(treeNode.teamName)
                    }
                    else{
                        $scope.teamIds.id=_.without($scope.teamIds.id,treeNode.teamId);
                        $scope.teamIds.name=_.without($scope.teamIds.name,treeNode.teamName)
                    }
                    $scope.$apply(function () {
                        $scope.motorcade=_.uniq($scope.teamIds.name).join(",");
                        if($scope.treeValue != undefined){
                            $scope.treeValue=_.uniq($scope.cities.name).join(",");
                        }
                        $scope.ngModel=_.uniq($scope.teamIds.id).join(",");
                    });

                };

                var setAsyncTree = function () {
                    $scope.tree = {
                        setting: {
                            check: {
                                enable: $scope.isCheckbox,
                                autoCheckTrigger: true,
                                chkboxType : { "Y" : "s", "N" : "s" }
                            },
                            view: {
                                expandSpeed: "",
                                dblClickExpand:!$scope.isCheckbox,
                                showLine :false
                            },
                            async: {
                                autoParam: ["id"],
                                enable: true,// 启用异步加载
                                type: "get",
                                otherParam: [
                                    "token", $window.sessionStorage.token || '',//token
                                    'teamId',$rootScope.team_id||$window.sessionStorage.team_id ,//车队id
                                    "includeSub","1",//是否包含非直属子车队（子车队的子车队）
                                    'includeSelf','1'//是否包含自身
                                ],
                                contentType: "application/json",
                                url: $scope.myUrl||RequestService.makeUrl(CommonService.getWebTeamList), //异步请求地址fetchUrl
                                dataFilter: function (treeId, parentNode, res) {
                                    if (res.resultCode == 200) {
                                        if(!$scope.treeEmpty){
                                            $scope.ngModel=_.pluck(res.data.list,'teamId').join(",");
                                            $rootScope.team_defer.resolve($scope.ngModel);  //通知开始新请求
                                        }
                                        return treeFilter(res.data.list);
                                    } if (res.resultCode == 509) {
                                        Message.error("您的账号已在其它地方登录，如非本人操作，请修改密码！");
                                        $rootScope.loginOutTime();
                                    }else {
                                        if (parentNode) {
                                            parentNode.zAsync = false;
                                            parentNode.open = false;
                                            parentNode.isAjaxing = false;
                                        }
                                        console.log(res.message || '服务器或网络异常');

                                        return null;
                                    }

                                }
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "teamId",
                                    pIdKey: "pTeamId",
                                    rootPId: 0
                                },
                                key:{
                                    name:'teamName'
                                }
                            },
                            callback: {
                                onClick: function (event, treeId, treeNode) {
                                    return onClickNode(event, treeId, treeNode);
                                },
                                onNodeCreated: function (event, treeId, treeNode) {
                                    return onNodeCreated(treeNode);
                                },
                                onCheck: function (event, treeId, treeNode) {
                                    return onCheckNode(event, treeId, treeNode);
                                },
                                onAsyncError: function (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                                    if (treeNode) {
                                        treeNode.zAsync = false;
                                        Message.error("网络或服务器异常,请稍后再试");
                                    }
                                }
                            }
                        }
                    };

                    $scope.isAsyncTree = true;
                };
                $scope.onCreateTree = function (treeObject) {
                    $scope.treeObject = treeObject;
                    $scope.$broadcast('tree:createSuccess');
                };
                setAsyncTree();
            }
        };




    }
})();
