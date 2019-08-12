(function () {
	'use strict';

	angular
		.module('WeServices')
		.provider('SsoService', function () {
			var serviceUrl = '';

			function makeUrl(path) {
				return serviceUrl + path;
			}

			this.setServiceUrl = function (url) {
				if (url) {
					serviceUrl = url;
				}
			};

			this.$get = function (RequestService, $rootScope, Urls) {

				return {
					/**
					 * 退出登录
					 */
					logout: function (token) {
						return RequestService.post(
							makeUrl('logout'), {
								token: token,
								product:$rootScope.product,
								appType:$rootScope.appType
							}
						);
					},
					/**
					 * 获取用户信息
					 */
					getUserInfo: function () {
						return RequestService.post(
							makeUrl('getUserInfo')
							/*{
								appType:$rootScope.appType
							}*/
						);
					},
					queryUserRoles: function () {
						return RequestService
							.get(makeUrl('/authority/menu'));
					},
					/**
					 * 查询系统所有权限
					 */
					projectPermissions: function () {
						return RequestService.get(
							makeUrl('/operate/user/queryProjectPermissions')
						);
					},
					/**
					 * 查询用户权限列表
					 */
					userPermissions: function () {
						return RequestService.get(
							makeUrl('/operate/user/queryUserPermissions')
						);
					},
					/*
					 * 用户登入
					 * 
					 * @params
					 * loginName 用户名
					 * loginPwd  密码
					 * verifyCodeId 登入唯一标示
					 * verifyCode 验证码
					 */
					login: function (loginName, loginPwd, verifyCodeId, verifyCode) {
						var obj = {
							loginName: loginName,
							loginPwd: loginPwd,
							verifyCodeId: verifyCodeId
						};
						if (verifyCode && verifyCode != "") obj.verifyCode = verifyCode;
						return RequestService.post(
							Urls.authUrl + '/auth/login',
							obj
						);
					},
/*********************************登陆****************************************/
					/*
					 * 司机或车队APP——登录
					 */
					 
					toLogin: function (loginName, loginPwd, verify) {
						return RequestService.post(
							makeUrl('/login'),
							{
								loginName:loginName,
								password:loginPwd,
								product: $rootScope.product,
								useDetail:1,
								autoLogin:1,
								captcha:verify,
								deviceId:$rootScope.deviceId,//设备id
								deviceType:$rootScope.deviceType,//设备类型
								appType:$rootScope.appType//客户端类型
								 
							}
						);
					},
					/*
					 * 司机或车队APP——注册
					 */
					 
					register: function (filter) {
						return RequestService.post(
							makeUrl('register'),
							angular.merge({
								deviceId:$rootScope.deviceId,
								deviceType:$rootScope.deviceType,
								//type:$rootScope.appType,
								appType:$rootScope.appType
							},filter)
						);
					},
					/*
					 * 修改用户信息
					 */
					modifyUserInfo: function (name) {
						return RequestService.get(
							makeUrl('modifyUserInfo'),
							{
								name:name
							}
						);
					},
					/*
					 * 获取短信验证码接口
					 */
					sendSms: function (mobile,type,captcha) {
						return RequestService.post(
							(Urls.usercenter+'sendSms'),
							{
								type:type,
								mobile:mobile,
								product:$rootScope.product,
								captcha:captcha
							}
						);
					},
					/*
					 * 找回密码 发送短信
					 */
					findPasswordBySms: function (query) {
						return RequestService.post(
							(Urls.usercenter+'findPasswordBySms'),
							angular.merge({
								// type:'qingqi_owner_mobile',
								type:'resent_findPassword',
								product:$rootScope.product
							},query)
						);
					},
					/*
					 * 验证手机验证码
					 */
					 validateFindPasswordSms: function (query) {
						return RequestService.post(
							(Urls.usercenter+'validateFindPasswordSms'),
							{
								mobile:query.mobile,
								smsCode:query.smsCode,
								product:$rootScope.product
							}
						);
					},
					/*
					 * 解绑手机获取短信验证码
					 */
					applyBindMobile: function (mobile,type) {
						return RequestService.post(
							(Urls.usercenter+'applyBindMobile'),
							{
								mobile:mobile,
								type:type,
								product:$rootScope.product,
								userId:$rootScope.userInfo.userId
							}
						);
					},
					/*
					 * 解绑手机验证短信验证码
					 */
					checkChangeBindMobile: function (mobile,smsCode) {
						return RequestService.post(
							(Urls.usercenter+'checkChangeBindMobile'),
							{
								mobile:mobile,
								smsCode:smsCode,
								product:$rootScope.product,
								userId:$rootScope.userInfo.userId
							}
						);
					},
					/*
					 * 解绑手机设置新手机验证手机号是否存在
					 */
					checkMobile: function (mobile) {
						return RequestService.get(
							(Urls.usercenter+'checkMobile'),
							{
								mobile:mobile
							}
						);
					},
					/*
					 * 绑定新手机
					 */
					bindMobile: function (mobile,smsCode,oldMobile,oldSmsCode) {
						return RequestService.post(
							makeUrl('bindMobile'),
							{
								mobile:mobile,
								smsCode:smsCode,
								oldMobile:oldMobile,
								oldSmsCode:oldSmsCode,
								product:$rootScope.product,
								type:'changeBind',
								userId:$rootScope.userInfo.userId
							}
						);
					},
					/*
					 * 用户名绑定手机号
					 */
					loginBindPhone: function (phone,accountName,password,smsCode) {
						return RequestService.get(
							makeUrl('loginBindPhone'),
							{
								phone:phone,
								accountName:accountName,
								password:password,
								smsCode:smsCode,
								deviceId:$rootScope.deviceId,
								deviceType:$rootScope.deviceType,
								appType:$rootScope.appType
							}
						);
					},
					/*
					 * 验证图形验证码接口
					 */
					checkCaptcha: function (type,identifier,verifyCode) {
						return RequestService.post(
							(Urls.usercenter+'checkCaptcha'),
							{
								type:type,
								identifier:identifier,
								product:$rootScope.product,
								verifyCode:verifyCode
							}
						);
					}
				};
			};
		});
})();