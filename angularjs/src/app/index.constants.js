(function() {
	'use strict';

	angular
		.module('CommericalConcreteWeb')

		.constant('GetTemplateUrl', function (stateName) { //根据stateName获取模板地址
			var states = stateName.split('.');
			states = states.map(function (state) {
				return state.replace(/([A-Z])/g, '-$1').toLowerCase();
			});
			return 'app/views/' + states.join('/') + '/' + states[states.length - 1] + '.html';
		}).constant('GetControllerName', function (stateName) { //根据stateName获取controller名称
			var states = stateName.split('.');
			states = states.map(function (state) {
				return state[0].toUpperCase() + state.slice(1);
			});
			return states.join('') + 'Controller';
		}).constant('Urls', {
//			ssoUrl: CONF.serviceUrl,
			authUrl: CONF.authUrl,
			serviceUrl: CONF.serviceUrl,
			rpresetUrl: CONF.rpresetUrl
//			webSocketUrl: CONF.webSocketUrl,
//			uploadUrl: CONF.uploadUrl,
//			trafficMapUrl: CONF.trafficMapUrl,
//			usercenter: CONF.usercenter
		})
		/**
		 * 仿underscore.js _._throttle源码
		 * options.leading == false 禁用首次执行
		 * options.trailing == false 禁用末次执行
		 */
		.constant('_throttle', function(fn, wait, options) {
			var context, args;
			var timeout = null,
				previous = 0;

			if(!options) options = {};
			if(!wait) wait = 400;

			var later = function() {
				previous = options.leading === false ? 0: +new Date();
				timeout = null;
				fn.apply(context, args);
				context = args = null;
			};
			return function() {
				var now = +new Date();
				if(!previous && options.leading === false) previous = now;

				var remaining = wait - (now - previous);
				context = this;
				args = arguments;
				if(remaining <= 0 || remaining > wait) {
					if(timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					previous = now;

					fn.apply(context, args);
					context = args = null;
				}else if(!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}
			};
		}).constant('RoutersConfig',  [
			//登录页
			{ path: '/home', name: 'home', as: 'home' },
			//第三方跳转页
			{ path: '/Scheduling/:username/:password', name: 'client', as: 'client', deep: true, stack: 'home.client' },

			//大数据展示
			{ path: '/default', name: 'default', as: 'default', title: '大数据展示', id:'2' },
			//大数据展示-安全看板
        	{ path: '/default/databox', name: 'default.databox', as: 'databox', title: '安全看板', id: '21', pId: '2'},

       		 //内容主页
			{ path: '/main', name: 'main', as: 'main', title: '', id:'1' },

			//精简看板--企业
			{ path: '/dashboard', name: 'main.dashboard', as: 'dashboard', title: '精简看板', id: '0' },
			//精简看板--政府
			{ path: '/govdashboard', name: 'main.govdashboard', as: 'govdashboard', title: '精简看板', id: '3' },

			//位置监控
			{ path: '/car', name: 'main.car', as: 'monitorcar', title:'位置监控', id:"11"},

			//主动安全-变更驾驶员
			{ path: '/snap', name: 'main.snap', as: 'snap', title: '变更驾驶员', id: '12', pId: '1' ,first_title:'主动安全'},

			//基本信息-车辆安全列表
			{ path: '/safe', name: 'main.safe', as: 'safe', title: '车辆安全列表', id: '13', pId: '1' ,first_title:'基本信息'},
			/**
			 * 基本信息-车辆安全列表-车辆详情看板
			 * tid: 终端ID， flag：0-进入车辆详情看板，1-告警地图，date：查询日期
			 */
			{ path: '/safeDetail/:tid/:flag/:date', name: 'main.safeDetail', as: 'safeDetail', deep: true, stack: 'main.safe.detail', title: '车辆详情看板', id: '14', pId: '1' ,father_title: '车辆安全列表',first_title:'基本信息'},
			//基本信息-驾驶员
			{ path: '/driver', name: 'main.driver', as: 'driver', title: '驾驶员信息', id: '16', pId: '1' ,first_title:'基本信息'},
			//基本信息-驾驶员-驾驶员详情
			{ path: '/driverDetail/:id', name:'main.driverDetail', as: 'driverDetail', deep: true, stack: 'main.driver.detail', title: '详情页', id: '17', pId: '1', father_title: '驾驶员信息', first_title: '基本信息' },
			//基本信息-驾驶员-驾驶员行为看板
			{ path: '/driverBehavior/:id', name:'main.driverBehavior', as: 'driverBehavior', deep: true, stack: 'main.driver.behavior', title: '行为看板', id: '33', pId: '1', father_title: '驾驶员信息', first_title: '基本信息' },

			//报表管理-车辆安全排名
			{ path: '/safeRank', name: 'main.srank', as: 'safeRank', title: '车辆安全排名', id: '18', pId: '1' ,first_title:'报表管理'},
			//报表管理-车辆安全排名-车辆安全评分详情页
			{ path: '/safeRankDetail/:carId/:carVin/:carNum/:driver/:type/:queryDate', name: 'main.safeRankDetail', as: 'safeRankDetail', deep: true, stack: 'main.srank.detail', title: '详情', id: '19', pId: '1' , father_title: '车辆安全排名',first_title:'报表管理'},
			//车辆报警历史记录
			{ path: '/alarmHistory', name: 'main.history', as: 'alarmHistory', title: '车辆报警历史记录', id: '110', pId: '1' ,first_title:'报表管理'},
			//车辆报警历史记录-报警详情
			{ path: '/alarmHistoryDetail/:id', name: 'main.alarmHistoryDetail', as: 'alarmHistoryDetail', deep: true, stack: 'main.history.detail', title: '详情', id: '111', pId: '1' , father_title: '车辆报警历史记录',first_title:'报表管理'},

			//报警中心-ADAS事件设置
			{ path: '/adas', name: 'main.adas', as: 'adas', title: 'ADAS事件设置', id: '112', pId: '1', first_title:'报警设置' },
			//报警中心-DMS事件设置
			{ path: '/dms', name: 'main.dms', as: 'dms', title: 'DMS事件设置', id: '113', pId: '1', first_title:'报警设置'},
			//报警中心-驾驶行为事件设置
			{ path: '/behavior', name: 'main.behavior', as: 'behavior', title: '驾驶行为事件设置', id: '114', pId: '1', first_title:'报警设置' },

			//系统管理-角色管理
			{ path: '/role', name: 'main.role', as: 'role', title: '角色管理', id: '115', pId: '1', first_title:'系统管理' },
			//系统管理-角色管理
			{ path: '/user', name: 'main.user', as: 'user', title: '账号管理', id: '116', pId: '1', first_title:'系统管理' },

			/**
			 * 载重监控模块
			 */
			//载重实时监控
			{ path: '/realOverload', name: 'main.realOverload', as: 'realOverload', deep: true, stack: 'main.overload.real-overload', id: '117', pId: '1', title: '载重监控', first_title: '载重实时监控' },
			//历史载重分析
			{ path: '/historyOverload', name: 'main.historyOverload', as: 'historyOverload', deep: true, stack: 'main.overload.history-overload', id: '118', pId: '1', title: '载重监控', first_title: '历史载重分析' },

			// 测试页
			{ path: '/infor', name: 'main.infor', as: 'infor', title: '测试页', id: '199', pId: '1' }
		]);

})();
