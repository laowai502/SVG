(function() {
	'use strict';

	angular.module('WeViews')
		.controller('HomeController', HomeController);
	
	function HomeController($scope, $rootScope, $location, $window, Message, $uibModal, GetTemplateUrl, GetControllerName, $cookies, Urls) {
//	function HomeController($scope, $rootScope, $window, Message, $uibModal, GetTemplateUrl, GetControllerName, $cookies, Urls, Md5) {
		
		var person = $cookies.getObject('userInfor'),
			vm = this;
			
		$('.modal').hide();
		$('.modal-backdrop').hide();
		vm.loginPwd = '';
		vm.verify = '';

		vm.showEye = false;
		vm.isPsw = false;
		vm.verifyShow = false; //隐藏验证码

		//		vm.loginName = 'lusimeng';
		//		vm.loginPwd = 'Aa123456';

		//登陆
		vm.doLogin = function(event) {
			event.preventDefault();
			if(vm.loginName == undefined || vm.loginName == '') {
				Message.error("请输入账号");
				vm.showEye = false;
			} else if(vm.loginPwd == undefined || vm.loginPwd == '') {
				Message.error("请输入密码");
			} else if(vm.verifyImg && !vm.verify) {
				Message.error("请输入验证码");
				vm.showEye = false;
			} else {
//				vm.loginMd5Pwd = Md5.hex_md5(vm.loginPwd);
//				$rootScope.toLogin(vm.loginName, vm.loginMd5Pwd, vm.verify, vm.remeberCheck);
				$rootScope.toLogin(vm.loginName, vm.loginPwd, vm.verify, vm.remeberCheck);
				//$rootScope.toLogin();
			}
		};
		//显示密码
		vm.pswType = function() {
			//罪恶的dom操作现在controller里面写了
			angular.element('#password').focus();
			vm.isPsw = !vm.isPsw;
			if(vm.isPsw) {
				angular.element('#password').attr('type', 'text');
			} else {
				angular.element('#password').attr('type', 'password');
			}
		};

		//重新获取验证码
		vm.changeVerify = function() {
			vm.verifyImg = Urls.usercenter + 'getCaptcha?identifier=' + vm.verifyNum + '&type=login&product=' + $rootScope.product + '&__rid=' + Math.random();
		};
		$rootScope.changeVerify = function() {
			vm.changeVerify();
		}
		vm.changeImage = function() {
			vm.verifyImg = Urls.ssoUrl + '/kaptcha?accountName=' + vm.loginName + '&__rid=' + Math.random();
		};

		/*修改用户名*/
		vm.changeUser = function() {
			vm.verifyImg = null;
			vm.verifyNum = vm.loginName;
			vm.verify = '';
		};
		//登入错误详细操作
		var destroyLoginError = $rootScope.$on('login:error', function(event, data) {
			vm.showEye = false;
			if(data.resultCode == 508) { //输入验证码
				Message.error(data.message);
				vm.verifyNum = vm.loginName;
				vm.changeVerify();
				vm.changePic = function() {
					vm.changeVerify();
				}
			} else if(data.resultCode == 1018) { //验证码错误
				Message.error(data.message);
				vm.changeImage();
				vm.changePic = function() {
					vm.changeImage();
				}
			} else if(data.resultCode == 1011) { //验证码错误
				Message.error(data.message);
				vm.changeVerify();
			} else if(data.resultCode == 1012) { //验证码错误
				Message.error(data.message);
				vm.changeImage();
			} else { //密码错误
				Message.error(data.message);
			}
		});

		$scope.$on('$destroy', function() { //controller回收资源时执行
			destroyLoginError(); //回收广播
		});

		Message.disable(false);
		vm.toForget = function() {
			$uibModal.open({
				templateUrl: GetTemplateUrl('home.forget'),
				controller: GetControllerName('home.forget'),
				controllerAs: 'vm',
				backdrop: false,
				windowClass: 'to-forget'
			}).result.then(function(result) {
				$rootScope.toReset('密码找回', result);
			}).catch(function(err) {});
		};
		vm.toRegister = function() {
			$uibModal.open({
				templateUrl: GetTemplateUrl('home.register'),
				controller: GetControllerName('home.register'),
				controllerAs: 'vm',
				backdrop: false,
				windowClass: 'to-forget'
			}).result.then(function(result) {
				$rootScope.toVerifyCode("用户注册", result);
			}).catch(function(err) {});
		};
		//记住密码
		function getCookie() {
			if(person) {
				vm.loginName = person.userName;
				vm.loginPwd = person.userPsd;
				vm.remeberCheck = true;
			} else {
				//vm.loginName=person.userName;
				vm.remeberCheck = false;
			}
		}
		getCookie();

		//记住密码样式
		vm.piaochecked = {
			'background': 'url(./assets/images/login-oncheck-box.png) no-repeat 0 0'
		}
		vm.nochecked = {
			'background': 'url(./assets/images/login-check-box.png) no-repeat 0 0'
		}

		//生成当前页的登入唯一标识,存储需要验证码的用户名
		vm.init = function() {
			if($window.sessionStorage['verifyId'] == undefined || $window.sessionStorage['verifyId'] == null) {
				$window.sessionStorage.setItem("verifyId", randomStr(16));
			}
		};
		vm.init();

		function randomStr(range) {
			var str = "",
				pos = "",
				arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
			arr.concat(['i', 'j', 'k', 'l', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
			for(var i = 0; i < range; i++) {
				pos = Math.round(Math.random() * (arr.length - 1));
				str += arr[pos];
			}
			return str;
		}
	}
})();