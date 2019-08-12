(function () {
	'use strict';
	angular
		.module('WeServices')
		.factory('SocketService', function ($rootScope, $websocket, $log, $window, Urls) {

			var socket = null, data = null;

			var methods = {
				connect: function () {
					socket = $websocket(Urls.webSocketUrl + '?token=' + $window.sessionStorage.getItem("token"));
				},
				init: function () {
					socket.onOpen(function (mes) {
						//todo 连接成功
						$log.log('连接成功');
					});
					socket.onMessage(function (mes) {
						var res = JSON.parse(mes.data);
						switch (res.type) {
							// 指令下发状态
							case 1:
								$rootScope.$broadcast('terminal:sentResponse', res.data);

								break;

							//用户被踢出
							case 3:
								$rootScope.$broadcast('user:kickedOut', res.message);
								break;
						}
					});
					socket.onClose(function (mes) {
						//todo 
						$log.log('连接关闭');
					});
				},
				send: function (data) {

					socket.send(data);
				},
				close: function (mes) {
					//todo 
					if (socket) {
						socket.close();
					}

				}
			};

			return methods;


		});
})();