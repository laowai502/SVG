(function () {
	'use strict';

	angular
		.module('CommericalConcreteWeb')
		.run(runBlock);

	function runBlock($location, $rootScope, $state, $q, $window, $cookies, Message, blockUI, SsoService, Md5 , permissionServices) {

		$rootScope.logined = false;
		//产品
		//$rootScope.product='NI';
		//客户端类型
		//$rootScope.appType='owner_web';

		$rootScope.$state = $state;
		$rootScope.userInfo = null;
		$rootScope.teamId = null; //用于存放用户组织机构
		$rootScope.previousState = null; //保存刷新页面的路由数据
		$rootScope.previousStateParams = null; //保存刷新前页面的参数

		$rootScope.isFromThirdPart = false; //是否通过第三方访问，登录页应用到

		var getMenuRoles = function() { //查询用户权限
			var deferred = $q.defer();
			permissionServices.logged().then(function(permission) {
				$rootScope.permission = permission
				deferred.resolve();
			}).catch(function(err) {
				Message.error(err.message);
				deferred.reject();
			});
			return deferred.promise;
		};
		var getUserComIds = function(userId) { //查询用户所属搅拌站
			var deferred = $q.defer();
			permissionServices.queryUserComIdsInfo(userId).then(function(data) {
				if (data && data.comIDs) {
					$rootScope.teamId = data.comIDs.split(',');
				}
				deferred.resolve();
			}).catch(function(err) {
				Message.error(err.message || '获取用户所属搅拌站失败');
				deferred.reject();
			});
			return deferred.promise;
		};

		function toLogin(data) {
			$rootScope.userInfo = {
				userId: data.userId,
				userName: data.userName,
   				token: data.token
			};
			$window.sessionStorage.setItem("token", $rootScope.userInfo.token);
			$window.sessionStorage.setItem("userId", $rootScope.userInfo.userId);
			$window.sessionStorage.setItem("userName", $rootScope.userInfo.userName);
			$rootScope.blockPage();
			$q.all([getMenuRoles(), getUserComIds(data.userId)]).then(function() { //权限和所属机构查询完毕后才算登入成功
				$rootScope.logined = true;
				var routes = $rootScope.permission.routes
				if(routes.length>1){
                    var roleState = routes.splice(1,routes.length-1)
                    if(roleState[0].indexOf('default') != -1){   //含有default是新开空白页，默认首页顺延
                    	if(roleState.length === 1){
                            $state.go('main');
						}else{
                            if(roleState[1].indexOf('default') != -1){
                                $state.go(roleState[2]);
                            }else{
                                $state.go(roleState[1]);
                            }
						}
                    }else{
                        $state.go(roleState[0]);
                    }
                }else{
                    Message.error('您的账户角色没有分配权限');
				}
			}).catch(function() {
				$rootScope.userInfo = null;
			}).finally(function() {
				$rootScope.blockPage(false);
			});
		};

		$rootScope.toLogin = function (loginName, loginPwd, verify, rember) {
			//去掉MD5验证
			//SsoService.login(loginName, Md5.hex_md5(loginPwd), $window.sessionStorage.getItem("verifyId"), verify).then(function (data) {
			$rootScope.blockPage();
			SsoService.login(loginName, loginPwd, $window.sessionStorage.getItem("verifyId"), verify).then(function (data) {
				if (rember) {
					$cookies.putObject('userInfor', { userName: loginName, userPsd: loginPwd },{
						expires: new Date('2027-12-31')
					});
				} else {
					$cookies.putObject('userInfor', { userName: loginName }, {
						expires: new Date('2027-12-31')
					});
				}
				toLogin(data);
			}).catch(function(error) {
				if (error.resultCode === 201) {
					Message.warning(error.message);
//					$rootScope.binding(loginName, loginPwd)
				} else if (error.resultCode == 507 && error.message == '验证码错误!') {
					Message.warning(error.message);
//					$rootScope.changeVerify();
				} else {
					//登录失败状态广播
					$rootScope.$broadcast("login:error", error);
					$rootScope.logined = false;
				}
			}).finally(function() {
				$rootScope.blockPage(false);
			});
		};

		//登出
		$rootScope.logout = function () {
			$window.sessionStorage.clear();
//			$window.sessionStorage.removeItem("token");
//			$window.sessionStorage.removeItem("userId");
//			$window.sessionStorage.removeItem("userName");
			$rootScope.userInfo = null;
			$rootScope.logined = false;
			$state.go('home');
		};

		//token 过期
		$rootScope['$on']('user:invalid', function (event, data) {
			Message.error(data);
			Message.disable(true);
			$rootScope.$broadcast('message:kill');
			$rootScope.logout();
		});

		$rootScope.catchError = function (err) {
			if (err.resultCode === 509) {
				Message.error("token已经过期，请重新登录");
				$rootScope.logout();
			} else if (err.resultCode === 507) {
				Message.error(err.message);
			} else {
				Message.error(err.message || '网络或服务器错误，请稍后重试');
			}
		};

		// 阻塞整个页面
		$rootScope.blockPage = function (val) {
			if (val === false) {
				blockUI.stop();
			} else {
				blockUI.start();
			}
		};

		var init = function() {
			if($window.sessionStorage.getItem("token") != null || $window.sessionStorage.getItem("token") != undefined) {
				$rootScope.blockPage();
				$q.all([getMenuRoles(), getUserComIds($window.sessionStorage.getItem("userId"))]).then(function() { //权限和所属机构查询完毕后才算登入成功
					$rootScope.logined = true;
					$rootScope.userInfo = {
						userId: $window.sessionStorage.getItem("userId"),
						userName: $window.sessionStorage.getItem("userName"),
						token: $window.sessionStorage.getItem("token")
					};
					if (!_.isEmpty($rootScope.previousState)) {
						$state.go($rootScope.previousState.name, $rootScope.previousStateParams);
						$rootScope.previousState = null;
					}
				}).catch(function(err) {
					$rootScope.userInfo = null;
					$rootScope.logined = false;
					$state.go('home');
				}).finally(function() {
					$rootScope.blockPage(false);
				});
			} else {
				$rootScope.blockPage(false);
				$rootScope.logined = false;
				if ($location.$$url.indexOf('/Scheduling') !== -1) { //第三方调试，先这样后期优化
					var param = $location.$$url.split('/');
					var username = param[2],
						password = param[3];
					$state.go('client', { username: param[2], password: param[3] });
				} else {
				$state.go('home');
			}
			}
		};

		init();

		//路由改变出来登入状态和权限
		var stateChangeStart = function (evt, toState, toParams) {
			if ($rootScope.logined === true) {
				if (toState.name != 'home'){
					return;
				} else {
					evt.preventDefault();
				}
			}
			if ($rootScope.logined === false) {
				if (toState.name != 'home') {
					// 非登录页面
					$rootScope.previousState = toState;
					$rootScope.previousStateParams = toParams;
					evt.preventDefault();
				}
				return false;
			}
		};
		$rootScope['$on']('$stateChangeStart', stateChangeStart);

		var stateChangeSuccess = function (evt, toState) {
			$rootScope.state = toState.name;
			$rootScope.motorSelect=toState.url.indexOf(':')==-1;
		};
		$rootScope['$on']('$stateChangeSuccess', stateChangeSuccess);
	}

})();
