(function() {
	'use strict';
	
	angular
		.module('WeViews')
		.constant('AlarmBaseDataConstants', [
			{
				name: 'ADAS 事件',
				checked: true,
				child: [
					{ name: '车距过近', alarmTypeCode: '1', checked: true, color: { "color" : "#3f51ff" } },
					{ name: '前车碰撞', alarmTypeCode: '2', checked: true, color: { "color" : "#008779" } },
					{ name: '左车道偏离', alarmTypeCode: '5', checked: true, color: { "color" : "#fec01a" } },
					{ name: '右车道偏离', alarmTypeCode: '4', checked: true, color: { "color" : "#fe5622" } },
					{ name: '城市前车碰撞', alarmTypeCode: '3', checked: true, color: { "color" : "#2498f4" } },
					{ name: '行人碰撞', alarmTypeCode: '6', checked: true, color: { "color" : "#9e2ab0" } }
				]
			},
			{
				name: 'DMS 事件',
				checked: true,
				child: [
					{ name: '闭眼', alarmTypeCode: '7', checked: true, color: { "color" : "#3f51ff" } },
					{ name: '注意力分散', alarmTypeCode: '8', checked: true, color: { "color" : "#008779" } },
					{ name: '打电话', alarmTypeCode: '9', checked: true, color: { "color" : "#2498f4" } },
					{ name: '抽烟', alarmTypeCode: '10', checked: true, color: { "color" : "#fec01a" } },
					{ name: '打哈欠', alarmTypeCode: '11', checked: true, color: { "color" : "#fe5622" } },
					{ name: '脱离监控', alarmTypeCode: '12', checked: true, color: { "color" : "#9e2ab0" } },
					{ name: '换司机', alarmTypeCode: '17', checked: true, color: { "color" : "#c0350c" } }
				]
			},
			{
				name: '驾驶行为事件',
				checked: true,
				child: 	[
					{ name: '急刹车', alarmTypeCode: '13', checked: true, color: { "color" : "#3f51ff" } },
					{ name: '急加速', alarmTypeCode: '14', checked: true, color: { "color" : "#2498f4" } },
					{ name: '超速', alarmTypeCode: '15', checked: true, color: { "color" : "#fec01a" } },
					{ name: '空档滑行', alarmTypeCode: '16', checked: true, color: { "color" : "#c0350c" } }
				]
			}
		])
		.constant('alarmMapMockData', [
//		{
//			"alarmTime": "20190301162344",
//			"lat": "30.208747999999998",
//			"lon": "117.257651",
//			"alarmId": "50",
//			"alarmTypeCode": "1",
//			"alarmTypeName": "车距过近",
//			"terminalId": null,
//			"carSpeed": "52.01",
//			"driverName": "李四"
//		}, {
//			"alarmTime": "20190301162434",
//			"lat": "30.808699999999998",
//			"lon": "117.257723",
//			"alarmId": "500",
//			"alarmTypeCode": "2",
//			"alarmTypeName": "前车碰撞",
//			"terminalId": 14776751280,
//			"carSpeed": "52.01",
//			"driverName": "李四"
//		}, {
//			"alarmTime": "20190301162434",
//			"lat": "31.808699999999998",
//			"lon": "117.257728",
//			"alarmId": "500",
//			"alarmTypeCode": "3",
//			"alarmTypeName": "城市前车碰撞",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301162534",
//			"lat": "32.808699999999998",
//			"lon": "117.257733",
//			"alarmId": "500",
//			"alarmTypeCode": "4",
//			"alarmTypeName": "右车道偏离",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301162534",
//			"lat": "31.208699999999998",
//			"lon": "117.257737",
//			"alarmId": "500",
//			"alarmTypeCode": "5",
//			"alarmTypeName": "左车道偏离",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301162834",
//			"lat": "31.308699999999998",
//			"lon": "117.257739",
//			"alarmId": "500",
//			"alarmTypeCode": "6",
//			"alarmTypeName": "行人碰撞",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301162934",
//			"lat": "31.408699999999998",
//			"lon": "117.257741",
//			"alarmId": "500",
//			"alarmTypeCode": "7",
//			"alarmTypeName": "闭眼",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301162934",
//			"lat": "31.508699999999998",
//			"lon": "117.257741",
//			"alarmId": "500",
//			"alarmTypeCode": "8",
//			"alarmTypeName": "注意力分散",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163334",
//			"lat": "31.608699999999998",
//			"lon": "117.257743",
//			"alarmId": "500",
//			"alarmTypeCode": "9",
//			"alarmTypeName": "打电话",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163534",
//			"lat": "31.708699999999998",
//			"lon": "117.257847",
//			"alarmId": "500",
//			"alarmTypeCode": "10",
//			"alarmTypeName": "抽烟",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163734",
//			"lat": "32.408699999999998",
//			"lon": "117.257859",
//			"alarmId": "500",
//			"alarmTypeCode": "11",
//			"alarmTypeName": "打哈欠",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163734",
//			"lat": "32.908699999999998",
//			"lon": "117.257960",
//			"alarmId": "500",
//			"alarmTypeCode": "12",
//			"alarmTypeName": "脱离监控",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163834",
//			"lat": "33.708699999999998",
//			"lon": "117.257969",
//			"alarmId": "500",
//			"alarmTypeCode": "13",
//			"alarmTypeName": "急刹车",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163734",
//			"lat": "33.308699999999998",
//			"lon": "117.257980",
//			"alarmId": "500",
//			"alarmTypeCode": "14",
//			"alarmTypeName": "急加速",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163734",
//			"lat": "34.108699999999998",
//			"lon": "117.257993",
//			"alarmId": "500",
//			"alarmTypeCode": "15",
//			"alarmTypeName": "超速",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163834",
//			"lat": "34.308699999999998",
//			"lon": "117.258095",
//			"alarmId": "500",
//			"alarmTypeCode": "16",
//			"alarmTypeName": "空档滑行",
//			"terminalId": 14776751280
//		}, {
//			"alarmTime": "20190301163834",
//			"lat": "34.708699999999998",
//			"lon": "117.258095",
//			"alarmId": "500",
//			"alarmTypeCode": "17",
//			"alarmTypeName": "换司机",
//			"terminalId": 14776751280
//		}
	])
	.service('AlarmMapUtils', AlarmMapUtils);
		
	function AlarmMapUtils() {
		return {
			/**
			 * 根据报警code返回icon
			 * @param {String} code
			 */
			getAlarmIcon: function(code) {
				var icon = '';
				if (code) {
					switch (code) {
						case '1':
							icon = './assets/images/adas/ADAS-1.png';
							break;
						case '2':
							icon = './assets/images/adas/ADAS-2.png';
							break;
						case '3':
							icon = './assets/images/adas/ADAS-3.png';
							break;
						case '4':
							icon = './assets/images/adas/ADAS-4.png';
							break;
						case '5':
							icon = './assets/images/adas/ADAS-5.png';
							break;
						case '6':
							icon = './assets/images/adas/ADAS-6.png';
							break;
						case '7':
							icon = './assets/images/adas/DMS-1.png';
							break;
						case '8':
							icon = './assets/images/adas/DMS-2.png';
							break;
						case '9':
							icon = './assets/images/adas/DMS-3.png';
							break;
						case '10':
							icon = './assets/images/adas/DMS-4.png';
							break;
						case '11':
							icon = './assets/images/adas/DMS-5.png';
							break;
						case '12':
							icon = './assets/images/adas/DMS-6.png';
							break;
						case '13':
							icon = './assets/images/adas/drive-1.png';
							break;
						case '14':
							icon = './assets/images/adas/drive-2.png';
							break;
						case '15':
							icon = './assets/images/adas/drive-3.png';
							break;
						case '16':
							icon = './assets/images/adas/drive-4.png';
							break;
						case '17':
							icon = './assets/images/adas/DMS-7.png';
							break;
						default:
							break;
					}
				}
				return icon;
			},
			/**
			 * 动态定位
			 * @param {Object.dom} tip	悬浮框dom对象
			 * @param {Object.dom} marker 选中打点标记dom对象
			 * @param {Object.dom} mapWrap 地图容器dom
			 */
			showTipsLocation: function(tip, marker, mapWrap, isFirst) {
				/**
				 * 周边车辆宽度不够，所以不许考虑
				 * marker宽高（28*28）没取，或许维护可以改进
				 * tip的dom结构位置在#right下，所以相对其定位，每次设top，left都需减 mOffT，mOffL
				 * 5, 10相当于margin，设边距
				 */
				try {
					var tH = tip.height(),
						tW = tip.width(),
						mOffT = mapWrap.offset().top,
						mOffL = mapWrap.offset().left,
						kOffT = marker ? marker.offset().top : mOffT,
						kOffL = marker ? marker.offset().left : mOffL,
						DH = $(document).height(),
						DW = $(document).width(),
						left = 0,
						top = 0;
					
					if (isFirst) {
						if (tH < 300) {
							top = (kOffT + 28 + 5) + 'px';
							left = (kOffL - 0.5 * tW + 14) + 'px';
						} else {							
							top = (kOffT - mOffT + 14) + 'px';
							left = (kOffL - mOffL - 0.5 * tW + 16) + 'px';
						}
					} else {
						if (kOffT - mOffT - tH - 5 < 0) { //靠近上边距
							if(kOffL - mOffL - 0.5 * tW - 5 < 0) { //靠近左边距 右下
								top = (kOffT) + 'px';
								left = (kOffL + 28 + 5) + 'px';
							} else {
								if(DW - kOffL - 0.5 * tW - 5 < 0) { //靠近右边距  左下
									top = (kOffT) + 'px';
									left = (kOffL - tW - 5) + 'px';
								} else { //下中
									top = (kOffT + 28 + 5) + 'px';
									left = (kOffL - 0.5 * tW + 14) + 'px';
								}
							}
						} else if (DH - kOffT - tH - 125 < 0) { //靠近下边距
							top = (kOffT - tH  - 10) + 'px';
							if(kOffL - mOffL - 0.5 * tW - 10 < 0) { //右上
								left = (kOffL) + 'px';
							} else {
								if(DW - kOffL - 0.5 * tW - 10 < 0) { //左上
									left = (kOffL - tW + 28) + 'px';
								} else { //上中
									left = (kOffL - 0.5 * tW + 14) + 'px';
								}
							}
						} else {
							if(tH < 300) {
								top = (kOffT + 28 + 5) + 'px';
								left = (kOffL - 0.5 * tW + 14) + 'px';
							} else {
								top = (kOffT - mOffT + 14) + 'px';
								left = (kOffL - mOffL - 0.5 * tW + 16) + 'px';
							}
						}
					}
					
					tip.css({
						left: left,
						top: top,
						visibility: 'visible'
					});
				} catch(e) { //暴力，异常判断移出地图可视范围
					tip.css({
						visibility: 'hidden'
					});
				}
			},
			/**
			 * 动态定位
			 * @param {Object.dom} tip	悬浮框dom对象
			 * @param {Object.dom} marker 选中打点标记dom对象
			 * @param {Object.dom} mapWrap 地图容器dom
			 */
			showTipsLocation1: function(tip, marker, mapWrap, isFirst) {
				/**
				 * 周边车辆宽度不够，所以不许考虑
				 * marker宽高（28*28）没取，或许维护可以改进
				 * tip的dom结构位置在#right下，所以相对其定位，每次设top，left都需减 mOffT，mOffL
				 * 5, 10相当于margin，设边距
				 */
				try {
					var tH = tip.height(),
						tW = tip.width(),
						mOffT = mapWrap.offset().top,
						mOffL = mapWrap.offset().left,
						kOffT = marker ? marker.offset().top : mOffT,
						kOffL = marker ? marker.offset().left : mOffL,
						DH = $(document).height(),
						DW = $(document).width(),
						left = 0,
						top = 0;
					
					if (isFirst) {
						if(tH < 300) {
							top = (kOffT + 28 + 5) + 'px';
							left = (kOffL - 0.5 * tW + 14) + 'px';
						} else {
							top = (kOffT - mOffT + 14) + 'px';
							left = (kOffL - mOffL - 0.5 * tW + 45) + 'px';
						}
					} else {
						if (kOffT - mOffT - tH - 5 < 0) { //靠近上边距
							if(kOffL - mOffL - 0.5 * tW - 5 < 0) { //靠近左边距 右下
								top = (kOffT) + 'px';
								left = (kOffL + 28 + 5) + 'px';
							} else {
								if(DW - kOffL - 0.5 * tW - 5 < 0) { //靠近右边距  左下
									top = (kOffT) + 'px';
									left = (kOffL - tW - 5) + 'px';
								} else { //下中
									top = (kOffT + 28 + 5) + 'px';
									left = (kOffL - 0.5 * tW + 14) + 'px';
								}
							}
						} else if (DH - kOffT - tH - 125 < 0) { //靠近下边距
							top = (kOffT - tH  - 10) + 'px';
							if(kOffL - mOffL - 0.5 * tW - 10 < 0) { //右上
								left = (kOffL) + 'px';
							} else {
								if(DW - kOffL - 0.5 * tW - 10 < 0) { //左上
									left = (kOffL - tW + 28) + 'px';
								} else { //上中
									left = (kOffL - 0.5 * tW + 14) + 'px';
								}
							}
						} else { //normal,由于tip框高度400多，所以按通用分辨率，这里暂时进不去
							if (tH < 300) {
								top = (kOffT + 28 + 5) + 'px';
								left = (kOffL - 0.5 * tW + 14) + 'px';
							} else {
								top = (kOffT - mOffT + 0.5 * tH + 28) + 'px';
								left = (kOffL - mOffL - 0.5 * tW + 45) + 'px';
							}
						}
					}
					
					tip.css({
						left: left,
						top: top,
						visibility: 'visible'
					});
				} catch(e) { //暴力，异常判断移出地图可视范围
					tip.css({
						visibility: 'hidden'
					});
				}
			}
		};
	}
		
})();
