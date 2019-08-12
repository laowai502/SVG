(function() {
	'use strict';

	angular
		.module('CommericalConcreteWeb')
		/*
		自定义filter
		*/
		.filter('getLng', function() {
			return function(str) {
				if(typeof str == "string") {
					return parseFloat(str.split(';')[0]) / 1000000
				}
			}
		})
		.filter('getLat', function() {
			return function(str) {
				if(typeof str == "string") {
					return parseFloat(str.split(';')[1]) / 1000000
				}
			}
		})
		//根据经纬度获得瓦片zxy
		.filter('direction', function() {
			return function(arg) {
				var carDirection = arg;

				if(carDirection == 0) {
					return '北';
				} else if(0 < carDirection && carDirection < 90) {
					return '东北';
				} else if(carDirection == 90) {
					return '东';
				} else if(90 < carDirection && carDirection < 180) {
					return '东南';
				} else if(carDirection == 180) {
					return '南';
				} else if(180 < carDirection && carDirection < 270) {
					return '西南';
				} else if(carDirection == 270) {
					return '西';
				} else if(270 < carDirection && carDirection < 359) {
					return '西北';
				}

				return '无';
			}
		})
		//重置
		.filter('reset', function() {
			return function(value, str) {
				if(!value) {
					value = str;
				}
				return value;
			}
		})
		.filter('_carOnLine', function() {
			return function(value) {
				switch(parseInt(value)) {
					case 0:
						value = '离线';
						break;
					case 1:
						value = '静止';
						break;
					case 2:
						value = '在线';
						break;
					default:
						value = '';
						break;
				}
				return value;
			}
		})
})();