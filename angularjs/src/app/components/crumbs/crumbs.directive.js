(function () {
    'use strict';

    angular.module('WeComponents')

        .directive('weCrumbs', function ($timeout, $window, $rootScope, CommonService, Message, RequestService, CarService) {
        	
        return {
            templateUrl: 'app/components/crumbs/crumbs.html',
            controller: function ($scope, $state, RoutersConfig) {
                var crumbs = [];
                var sideMenuData = RoutersConfig;
                var getCrumbs = function (menu) {
                    if (menu) {
                        crumbs.push(menu);

                        getCrumbs(_.first(_.where(sideMenuData, { id: menu.pId })));
                    }
                };
                var showState = function (url) {
                    crumbs = [];
                    var urls='';
                        url.substring(1).split("/").splice(1).forEach(function (u) {
                            urls=urls+'/'+u;
                    });
                    url=urls;
                    getCrumbs(_.first(_.where(sideMenuData, { path: url })));
                    if(!_.isEmpty(crumbs)){
                        $rootScope.crumbs = crumbs.reverse();
                        if($window.sessionStorage['fitNav']){
                            $window.sessionStorage.removeItem('fitNav');
                        }
                    }else{
                        if($window.sessionStorage['fitNav']){
                            $rootScope.crumbs = JSON.parse($window.sessionStorage['fitNav']);
                            $window.sessionStorage.removeItem('fitNav');
                        }
                    }
                }
                $scope['$on']('$stateChangeSuccess', function (evt, toState, toParams) {
                    showState('/main' + toState.url);
                });
                showState('/main' + $state.current.url);
                /*当前车队 树形*/
                $scope.motorcade='';
                $scope.isOpen=false;
                var treeFilter = function (treeDatas) {
                    /*第一个直接展开*/
                    treeDatas[0].open= true;
                    return _.map(treeDatas, function (item) {
                        // 车辆
                        if (!item.isParent) {
                            item.icon = CarService.getStatusIcon(item.carStauts);
                        }
                        return item;
                    });
                };
                var onClickNode = function (event, treeId, treeNode) {
                    $scope.$apply(function () {
                        $scope.ngModel=treeNode.teamId;
                        $scope.motorcade=treeNode.teamName;
                        if($scope.treeValue != undefined){
                            $scope.treeValue=treeNode.teamName;
                        }
                    });
                    /*设置当前车队*/
                    CommonService.installWebCurrentTeam(treeNode.teamId).then(function () {
                        $rootScope.team_id=treeNode.teamId;
                        $rootScope.team_name=treeNode.teamName;
                        $window.sessionStorage.setItem("team_id", $rootScope.team_id);
                        $window.sessionStorage.setItem("team_name", $rootScope.team_name);
                        Message.success('设置默认车队成功');
                        $rootScope.refreshRoute();
                    }).catch(function (err) {
                        $rootScope.catchError(err);
                    });
                    jQuery(event.currentTarget).closest(".dropdown").toggleClass("open").find(".dropdown-toggle").click();
                };
                jQuery(".current-tree-select .dropdown-menu *").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                var setAsyncTree = function () {
                    $scope.tree = {
                        setting: {
                            view: {
                                expandSpeed: "",
                                showLine :false
                            },
                            async: {
                                autoParam: ["id"],
                                enable: true,// 启用异步加载
                                type: "get",
                                dataType : 'json',
                                otherParam: {"token" : $window.sessionStorage.token} ,
                                contentType: "application/json",
                                url: RequestService.makeUrl(CommonService.getWebTeamList), //异步请求地址fetchUr
                                dataFilter: function (treeId, parentNode, res) {
                                    if (res.resultCode == 200) {
                                        if(res.data.list.length==0){
                                              if($state.current.url != '/motor' && $state.current.url !='/organ'){
                                                Message.error("请先设置车队后再进行操作");
                                            }
                                            $scope.$apply(function () {
                                                $scope.ngModel=$rootScope.team_id='';
                                                $rootScope.teamArray=[];
                                                $scope.motorcade='';
                                            });
                                            $window.sessionStorage.setItem("team_id", $rootScope.team_id);
                                        }else{
                                            var current=_.find(res.data.list, function(obj){ return obj.isCurrent == 1; });
                                            if(angular.isUndefined(current)){
                                                 if($state.current.url != '/motor' && $state.current.url !='/organ'){
                                                    Message.error("请先设置车队后再进行操作");
                                                }
                                                $scope.$apply(function () {
                                                    $scope.ngModel=$rootScope.team_id='';
                                                    $scope.motorcade='';
                                                });
                                            }else{
                                                $scope.$apply(function () {
                                                    $scope.ngModel=$rootScope.team_id=current.teamId;
                                                    $scope.motorcade=$rootScope.team_name=current.teamName;
                                                });
                                            }
                                            $rootScope.teamArray=res.data.list;
                                            $window.sessionStorage.setItem("team_id", $rootScope.team_id);
                                            return treeFilter(res.data.list);
                                        }


                                    } else {
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
                                onAsyncError: function (event, treeId, treeNode, XMLHttpRequest, textStatus,                                    errorThrown) {
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
                };
                setAsyncTree();
            },
            link: function(scope, element, attrr){
                angular.element($window).on('beforeunload', function(){
                    if(!_.isEmpty($rootScope.crumbs)){
                        $window.sessionStorage.setItem('fitNav', JSON.stringify($rootScope.crumbs));
                    }
                });
                scope.$on('$destroy', function(){	//取消全局绑定
                    angular.element($window).off('beforeunload');
                });
            }
        }
            
        });

})();
