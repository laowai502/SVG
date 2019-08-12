$(document).ready(function(){  
	var timer = null;
	var timerIndex = 0;
	var carArr = ['609','608','337','907','196','974','721','1053','1073'];
    // 初始化内容
    var queryData = function() {
    	$.getJSON('./libs/mocks/data.json', function(res) {
    		var data = res.data.card;
    		var opts = {
                barColor: '#fff703',
                radius: 30,	
                barWidth: 4,
                percentage: true
			};
			
//          opts.barColor = '#09ff6b';
//          opts.initValue = data.noLoadPercent;
//  		$('#noLoadCard').radialIndicator(opts);
//			$('#noLoadText').text('空载：' + data.noLoad + '辆');
			
//  		opts.barColor = '#0cb5ec';
//  		opts.initValue = data.halfLoadPercent;
//  		$('#halfLoadCard').radialIndicator(opts);
//			$('#halfLoadText').text('半载：' + data.halfLoad + '辆');
//			
//  		opts.barColor = '#fffa32';
//  		opts.initValue = data.fullLoadPercent;
//  		$('#fullLoadCard').radialIndicator(opts);
//			$('#fullLoadText').text('满载：' + data.fullLoad + '辆');


    		opts.barColor = '#0cb5ec';
    		opts.initValue = data.fullLoadPercent;
    		$('#fullLoadCard').radialIndicator(opts);
			$('#fullLoadText').text('正常：' + data.fullLoad + '辆');
			
    		opts.barColor = '#E42889';
    		opts.initValue = data.overLoadPercent;
    		$('#overLoadCard').radialIndicator(opts);
    		$('#overLoadText').text('超载：' + data.overLoad + '辆');
    	})
    };
    
    var renderChar = function() {
    	var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        var option = {
		    xAxis: {
		    	name: '时间（小时）',
		    	nameLocation: 'middle',
		    	nameGap: 30,
		    	nameTextStyle: {
		    		color: '#FFF'
		    	},
//		    	splitLine: {
//	    			show: false
//	    		},
	    		axisLine: {
	    			show: true
	    		},
//	    		axisTick: {
//	    			show: false
//	    		},
	    		axisLabel: {
	    			show: true,
	    			textStyle: {
	    				color: '#a058ff'
	    			}
	    		},
		        type: 'category',
		        boundaryGap: false,
		        data: [
		        	'00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
		        	'12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
		        ]
		    },
		    tooltip: {
		    	trigger: 'axis'
		    },
		    yAxis: {
		    	name: '超载数量',
		    	nameTextStyle: {
		    		color: '#FFF'
		    	},
		    	splitLine: {
	    			show: true,
	    			lineStyle: {
						type: 'dashed'
					}
	    		},
	    		axisLine: {
	    			show: true
	    		},
	    		axisTick: {
	    			show: false
	    		},
	    		axisLabel: {
	    			show: true,
	    			textStyle: {
	    				color: '#a058ff'
	    			}
	    		},
		        type: 'value'
		    },
		    grid: {
		        left: '5%',
		        top: '15%',
//		        right: '10%',
		        bottom: '8%',
		        borderWidth: 0,
		        containLabel: true
		    },
		    series: [{
		        data: [
		        	720, 880, 910, 950, 981, 1001, 1003, 997, 987, 890, 883, 901,
		        	780, 753, 743, 700, 720, 698, 678, 665, 643, 632, 641, 321
		        ],
		        type: 'line',
		        itemStyle: {
		        	normal: {
		        		color: '#a058ff'
		        	}
		        },
		        areaStyle: {
		        	normal: {}
		        },
		        smooth: true
		    }]
		};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };
    
    var bigData = function(map) {
    	var data = [];
    	
    	$.get('./libs/mocks/china-data.json', function(rs) {
			for(var i = 0; i < rs[0].length; i++) {
				var geoCoord = rs[0][i].geoCoord;
				data.push({
					geometry: {
						type: 'Point',
						coordinates: geoCoord
					},
					count: parseInt(6 * Math.random()),
					time: Math.random() * 10
				});
			}
	
			var dataSet = new mapv.DataSet(data);
			var options = {
				updateCallback: function(time) {
					time = time.toFixed(2);
					$('#time').html('时间' + time);
				},
				size: 2,
				draw: 'category',
				splitList: {
					other: '#00a1ff',
					1: '#00a1ff',
					2: '#00a1ff',
					3: '#00a1ff',
					4: '#00a1ff',
					5: '#FF0000',
//					2: '#000ad7',
//					3: '#FF0000'
//					other: '#9eb3ff',
//					1: '#315dff',
//					2: '#000ad7',
//					3: '#FF0000'
				},
				animation: {
					type: 'time',
					stepsRange: {
						start: 8,
						end: 10
					},
					trails: 1,
					duration: 1000,
				}
			}
			var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
    	});
    };
	
	var sasdaf = function () {
		var max = 10;
		var min = 1;
		var w = max - min;
		return Math.round(Math.random() * w + min)
	}
	var infoShow = function(map){
		var pointArr = [];
		var markerArr = [];
		var infoWindowArr = [];
		
		$.getJSON('./libs/mocks/setInterval.json', function(data) {
			var carList = data;

			carList.forEach(function(item){
				var point = new BMap.Point(item.stationLon, item.stationLat);
				var marker = new BMap.Marker(point);
				marker.setIcon(new BMap.Icon("./app/img/t-3.png",{}));
				marker.setRotation(parseInt(item.fangxiang)*45)
				var sContent =
				`<div class='opacity-div lableTimer' >
				<h4 style='margin:0 0 6px 0; padding: 8px 0; overflow: hidden; font-size: 15px;'>${item.stationName}</h4>
				<p >车牌号：${item.chepai}</p>
				<p >时间：${item.time}</p>
				<p >地点：${item.stationAddress}</p>
				<p >载重状态：${statusList[3]}</p>
				<p >额定载荷：${item.fullLoad}吨</p>
				<p >当前载重：${item.woLoad}吨</p>
				<p >超载：${item.exceedFullLoad}吨</p>
				<button class='btn btn-lg' style='font-size: 15px;'
				onclick="window.open('./polymer.html')">查看详情</button>
				</div>`
            	var infoWindow = new BMap.Label(sContent, {position:point});
				infoWindow.setStyle({border: 'none', padding: 0});
				infoWindow.setOffset(new BMap.Size(0, 5));
				markerArr.push(marker)
				infoWindowArr.push(infoWindow);
			});
// 			markerArr[1].setLabel(infoWindowArr[1]);
//			map.addOverlay(markerArr[1]);
			
			timer = setInterval(function(){
				if(timerIndex === 0){
					map.removeOverlay(markerArr[markerArr.length-1]);  
				}else{
					map.removeOverlay(markerArr[timerIndex-1]); 
				} 
				map.removeOverlay(markerArr[timerIndex-1]); 
				markerArr[timerIndex].setLabel(infoWindowArr[timerIndex]);
				map.addOverlay(markerArr[timerIndex]);

				if(timerIndex === markerArr.length-1){
					timerIndex = 0;
				}else{
					timerIndex++
				} 
			}, 5000);
		});
	}
	
	var listenMouseWheel = function(map) {
		$('#map').on('mousewheel', debounce(function(e) {
			setTimeout(function(){
				if (map.getZoom() > 8) {
					if (dataMapStyle.styleJson[dataMapStyle.styleJson.length - 1]['visibility'] === 'off') {
						dataMapStyle.styleJson[dataMapStyle.styleJson.length - 1]['visibility'] = 'on';
						map.setMapStyle(dataMapStyle);
					}
				} else {
					if (dataMapStyle.styleJson[dataMapStyle.styleJson.length - 1]['visibility'] === 'on') {
						dataMapStyle.styleJson[dataMapStyle.styleJson.length - 1]['visibility'] = 'off';
						map.setMapStyle(dataMapStyle);
					}
				}
			}, 500);
		}, 300));
	}

    var init = function() {
    	// 百度地图API功能
        var map = new BMap.Map("map", {
            enableMapClick: false
        });    
        map.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        map.setMapStyle(dataMapStyle);
    	queryData();
    	renderChar();
		bigData(map);
		infoShow(map);
		listenMouseWheel(map);
    };
    
    init();
}); 