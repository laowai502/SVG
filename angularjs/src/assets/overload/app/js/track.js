var token = '',
//var token = 'doTe+vr85HB5mHEtwL5lmz4PqFw=',
	pMap = null,
	geoc = new BMap.Geocoder(),
	isInit = true;
	
var jiashuju = localStorage.getItem('historyData') ?
    JSON.parse(localStorage.getItem('historyData'))
    :  {
        tid: 18855181171, 
        sTime: 1552287323000, 
        sLat: 30584419, 
        sLong: 104062333, 
        sHeight: 535, 
        sSpeed: 0, 
        sDir: 0, 
        eTime: 1552287684000, 
        eLat: 30584419, 
        eLong: 104062333, 
        eHeight: 535, 
        eSpeed: 0, 
        eDir: 0,  
        dur: 361000,      //形式时长 格式化好了，10小时10分钟10秒
        sLc01: 510100, 
        eLc01: 510100, 
        sLc02: 510000, 
        eLc02: 510000, 
        sWload: 0, 
        eWload: 10, 
        sWloadType: 0, 
        eWloadType: 0, 
        tripType: 2, 
        wloadNo: "牵引|6*4", 
        fullLoad: 50, 
        exceedFullLoad: 88.4, 
        vin: "H8042249", 
        carNumber: "皖AA6895", 
        carId: "100609", 
        wloadTypeText: '超载 - 正常', 
        areaText: "成都市",
        sFormatTime: '2019-03-01 00:00:00',
        eFormatTime: '2019-03-15 11:38:00',
        sLocation: '四川省眉山市仁寿县钟祥镇黄家坝',
        eLocation: '四川省眉山市仁寿县钟祥镇黄家坝',
        maxLoad: '62.5',
        maxOverLoad: '12.5'
    };

function setDateRange() {
	$('input[name="singledatePicker"]').daterangepicker({
        timePicker: true, //显示时间
        timePicker24Hour: true, //时间制
        timePickerSeconds: true, //时间显示到秒
        startDate: moment().hours(0).minutes(0).seconds(0), //设置开始日期
        endDate: moment(new Date()), //设置结束器日期
        maxDate: moment(new Date()), //设置最大日期
        "opens": "left",
        showWeekNumbers: true,
        locale: {
            format: "YYYY-MM-DD HH:mm:ss", //设置显示格式
            applyLabel: '确定', //确定按钮文本
            cancelLabel: '取消', //取消按钮文本
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'
            ],
            firstDay: 1
        },
    }, function(start, end, label) {
    	var sTime = start.format('YYYY-MM-DD HH:mm:ss'),
    		eTime = end.format('YYYY-MM-DD HH:mm:ss');
        $('#singledatePicker').val(sTime + ' - ' + eTime);
        $("#sTime").text(sTime);
   	 	$("#eTime").text(eTime);
        
        jiashuju.sFormatTime = sTime;
        jiashuju.eFormatTime = eTime;
        
        isInit = false;
        
        getHistory(sTime, eTime);
        getOverloadRecord(false);
    });
}
function getLocalTime(nS) {
    var unixTimestamp = new Date(nS);
    var qqq = unixTimestamp.getFullYear() + "/" + (unixTimestamp.getMonth() + 1) + "/" + unixTimestamp.getDate() + " " + unixTimestamp.getHours() + ":" + unixTimestamp.getMinutes() + ":" + unixTimestamp.getSeconds();
    return qqq
}
function monthNowTime(){
    var date = new Date();
    var month = parseInt(date.getMonth()+1);
    var day = date.getDate();
    var min = date.getMinutes();
    var hours = date.getHours();
    var sec = date.getSeconds();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hours < 10) {
        hours = '0' + hours
    }
    if (min < 10) {
        min = '0' + min
    }
    if (sec < 10) {
        sec = '0' + sec
    }
    return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + min + ":" + sec;
}
function monthTime(){
    var date = new Date();
    date.setDate(1);
    var month = parseInt(date.getMonth()+1);
    var day = date.getDate();
    var min = date.getMinutes();
    var hours = date.getHours();
    var sec = date.getSeconds();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + "-" + month + "-" + day + " 00:00:00";
}

var details = function () {
    $("#chepai").text(jiashuju.carNumber || '');
    $("#fullLoad").text(jiashuju.fullLoad + "吨"|| '');
    $("#wloadNo").text(jiashuju.wloadNo || '');
    
    $("#sTime").text(jiashuju.sFormatTime);
    $("#eTime").text(jiashuju.eFormatTime);
    $("#sAddr").text(jiashuju.sLocation || '');
    $("#eAddr").text(jiashuju.eLocation || '');
    $("#zaizhong").text(jiashuju.wloadTypeText || ''); //载重状态
    $("#areaText").text(jiashuju.areaText || ''); //途径区域
    $("#chaozai").text(jiashuju.maxOverLoad + "吨" || ''); //最大超载
    $("#wload").text(jiashuju.maxLoad + "吨"|| ''); //最大载重
    
    if (jiashuju.sLocation) {
    	if (jiashuju.sLocation.length >= 12) {
    		$('#sAddr').tooltip({ title: jiashuju.sLocation });
    	}
    }
    if (jiashuju.eLocation) {
    	if (jiashuju.eLocation.length >= 12) {
    		$('#eAddr').tooltip({ title: jiashuju.eLocation });
    	}
    }
};

function getHistory(sTime, eTime) {
	$.ajax({
        type: "POST",
        dataType: "json",
        url: RPRESET_Url + "getWloadTripList",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
//			"start": "2019-03-01 00:00:00",
//			"end": "2019-03-23 11:11:57",
//			"tids": ["18855181170"],
			"tids": [jiashuju.tid],
			"start": sTime,
			"end": eTime
		}),
        success: function (data) {
        	if (data.resultCode === 200) {
                var data = data.data.data;
                //因为数据业务处理多半在前端，所以较复杂
                if (data.length === 1) { //只有一条载重行程
                	var obj = data[0];
					obj.maxOverLoad = 0;
					if(obj.eWload != 0) obj.eWload = obj.eWload / 10;
					if(obj.fullLoad != 0) obj.fullLoad = obj.fullLoad / 10;
					if(obj.exceedFullLoad != 0) obj.exceedFullLoad = obj.exceedFullLoad / 10;
					if(obj.maxLoad && obj.maxLoad != 0) obj.maxLoad = obj.maxLoad / 10;
					if (obj.maxLoad > 0 && obj.fullLoad > 0) {
						if ((obj.maxLoad - obj.fullLoad) > 0) {										
							obj.maxOverLoad = obj.maxLoad - obj.fullLoad;
							item.maxOverLoad = item.maxOverLoad.toFixed(1);
						}
					}
					$("#wload").text(obj.maxLoad + '吨');
					$("#chaozai").text(obj.maxOverLoad + '吨');
					if (obj.nodes) {
						if (obj.nodes.length === 1) {
							var nodeObj = obj.nodes[0];
							$("#areaText").text(getCityByCode(nodeObj.lc01));
							$("#zaizhong").text(getLoadTypeText(nodeObj.wtype));
						}
					}
                } else if (data.length > 1) { //多条一条载重行程
                	var firstObj = data[data.length - 1],
                		lastObj = data[0],
                		maxLoad = 0,
                		maxOverLoad = 0,
                		maxLoadArr = [];
                		fullLoad = lastObj.fullLoad/10,
                		wloadTypeText = '',
                		wloadArr = [],
                		areaText = '',
                		areaArr = [],
                		areaAllSame = true,
                		loadAllSame = true;
                	data.forEach(function(item) {
						if (item.maxLoad && item.maxLoad != 0) item.maxLoad = item.maxLoad/10;
                		maxLoadArr.push(item.maxLoad);
                		if (item.nodes) {
                			if (item.nodes.length > 0) {
                				areaArr.push(getCityByCode(item.nodes[0].lc01));
								wloadArr.push(getLoadTypeText(item.nodes[0].wtype));
                			}
                		}
                	});
                	if (areaArr.length > 0) {
						for (var i=0; i<areaArr.length; i++) {
							if (areaArr.indexOf(areaArr[i]) != 0) {
								areaAllSame = false;
								break;
							}
						}
						if (!areaAllSame) {
							areaArr = uniqueArr(areaArr);
						}
						areaText = areaAllSame ? areaArr[0] : areaArr.join(' - ');
					}
					if (wloadArr.length > 0) {
						for (var i=0; i<wloadArr.length; i++) {
							if (wloadArr.indexOf(wloadArr[i]) != 0) {
								loadAllSame = false;
								break;
							}
						}
						wloadTypeText = loadAllSame ? wloadArr[0] : wloadArr.join(' - ');
					}
					$("#areaText").text(areaText);
					$('#areaText').tooltip('destroy');
					if (areaText.length > 12) {
						$('#areaText').tooltip({ title: areaText });
					}
					$("#zaizhong").text(wloadTypeText);
					$('#zaizhong').tooltip('destroy');
					if (wloadTypeText.length > 12) {
						$('#zaizhong').tooltip({ title: wloadTypeText });
					}
                	maxLoad = _.max(maxLoadArr);
					if ((maxLoad - fullLoad) > 0) {						
						maxOverLoad = maxLoad - fullLoad;
						maxOverLoad = maxOverLoad.toFixed(1);
					}
                	$("#wload").text(maxLoad + '吨');
					$("#chaozai").text(maxOverLoad + '吨');

//					pMap.addOverlay(new BMap.Marker(new BMap.Point( gcj02tobd09(firstObj.sLong/1000000, firstObj.sLat/1000000)[0], gcj02tobd09(firstObj.sLong/1000000, firstObj.sLat/1000000)[1] )));
//					pMap.addOverlay(new BMap.Marker(new BMap.Point( gcj02tobd09(lastObj.eLong/1000000, lastObj.eLat/1000000)[0], gcj02tobd09(lastObj.sLong/1000000, lastObj.sLat/1000000)[1] )));
                } else {
                	resetTable()
                }
        	}
        },
        error: function() {}
    });
}

function getOverloadRecord(isFirst) {
	pMap.clearOverlays();
	loading();
	$.ajax({
        type: "POST",
        dataType: "json",
        url: RPRESET_Url + "getWloadList",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
//          "end": '2019-03-21 14:22:12',
//          "start": '2019-03-21 13:47:22',
            "start":  jiashuju.sFormatTime || monthTime(),
            "end": jiashuju.eFormatTime || monthNowTime(),
            "tids": [jiashuju.tid.toString()],
//          "tids": ["18855181170"],
            "page_size": 1000, 
            "page_number": 1
        }),
        success: function (data) {
        	if (data.resultCode === 200) {
        		if (isFirst) {
        			details(jiashuju)
        		}
                var dat = data.data.data
                dat.forEach(function (item, index) {
					item.date = moment(item.sTime).format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment(item.eTime).format('YYYY-MM-DD HH:mm:ss');
                });
                
                var param =  _.filter(dat, function(item) {
                	return item.eLat != 0 || item.eLong != 0 || item.sLat != 0 || item.sLong != 0;
                });
                
                var orderParam  = {};
                if (param.length > 0) {
                	orderParam.beginDate = moment(param[0].sTime).format('YYYY-MM-DD HH:mm:ss');
                	orderParam.endDate = moment(param[param.length-1].eTime).format('YYYY-MM-DD HH:mm:ss');
                }
                
                if (dat.length > 0) {		                	
                	getTrack(param, orderParam);
                } else {
                	toastr.warning("该时间段内，暂无载重数据！");
                	removeLoading('test');
                }
        	} else {
        		removeLoading('test');
        	}
        },
        error: function() {
        	removeLoading('test');
        }
    });
}
function getTrack(param, orderParam) {
//	var testData = [];
//	param.forEach(function(item, index, list) {
//		testData.push({
//			stime: moment(item.sTime).format('YYYY-MM-DD HH:mm:ss'),
//			stimes: item.sTime,
//			etime: moment(item.eTime).format('YYYY-MM-DD HH:mm:ss'),
//			etimes: item.eTime,
//			lat: item.eLat * 1000000,
//			lon: item.eLong * 1000000
//		});
//		testData.push(moment(item.eTime).format('YYYY-MM-DD HH:mm:ss'));
//		testData.push(item.eTime);
//	});
//	console.info(testData);
	
	var traceParam = {
		carId: jiashuju.carId,
		beginDate: jiashuju.sFormatTime,
		endDate: jiashuju.eFormatTime,
		level: 7
//		beginDate: '2019-03-21 13:47:22',
//		endDate: '2019-03-21 14:22:12',
//		carId: jiashuju.carId,
//		carNumbar: jiashuju.carNumber,
//		carId: '100007',
//		carNumbar: '皖AA6175',
//		zoom: '9',
//		token: token,
//		versionNo: '1.1.00'
	};
	$.ajax({
	    type: "POST",
	    dataType: "json",
	    headers: {
	    	token: token
	    },
	    url: SERVICE_Url + "/monitor/car/trackVacuate", //测试环境
	    contentType: "application/json;charset=utf-8",
	    data: JSON.stringify(traceParam),
	    success: function (data) {
	    	if (data.resultCode === 200) {
	    		if (data.data !== null) {
//      	    	var trackPoints = traceDecrypt(data.data) || [], //需要解密
        	    	var trackPoints = data.data || [],
        	    		indexArr = [],
        	    		bMapPoints = [];
        	    		
//      	    	var trackTimeData = [];
//      	    	trackPoints.forEach(function(item, index, list) {
//						trackTimeData.push(moment(item.gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf());
//						trackTimeData.push(item.gpsdate);
//						trackTimeData.push({
//							time: item.gpsdate,
//							times: moment(item.gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf(),
//							lat: item.lat,
//							lng: item.lng
//						});
//					});
//					console.info(trackTimeData);
        	    	
        	    	for (var i=0, j=trackPoints.length-1; i<j; i++) {
        	    		bMapPoints.push(new BMap.Point( gcj02tobd09(trackPoints[i]['lng'], trackPoints[i]['lat'])[0], gcj02tobd09(trackPoints[i]['lng'], trackPoints[i]['lat'])[1] ));
        	    		for (var k=0; k<param.length; k++) {
//      	    			console.info(param[k].eTime)
//      	    			console.info(moment(trackPoints[i].gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf())
//      	    			console.info(moment(trackPoints[i+1].gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf())
        	    			if (param[k].eTime > moment(trackPoints[i].gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf() && param[k].eTime <= moment(trackPoints[i+1].gpsdate, 'YYYY-MM-DD HH:mm:ss').valueOf()) {
        	    				indexArr.push({
        	    					i: i,
        	    					wloadType: param[k].wloadType
        	    				});
        	    			}
        	    		}
        	    	}
        	    	if (trackPoints.length > 0) {        	    		
        	    		bMapPoints.push(new BMap.Point( gcj02tobd09(trackPoints[trackPoints.length-1]['lng'], trackPoints[i]['lat'])[0], gcj02tobd09(trackPoints[trackPoints.length-1]['lng'], trackPoints[i]['lat'])[1] ));
        	    	}
        	    	
        	    	indexArr.push({
        	    		i: trackPoints.length - 1,
        	    		wloadType: param[param.length - 1]['wloadType']
        	    	});
        	    	if (indexArr[0]['i'] !== 0) {
        	    		indexArr.unshift({
        	    			i: 0,
	        	    		wloadType: param[0]['wloadType']
	        	    	})
        	    	}
        	    	var trace2dArr = [];
        	    	for (var i=0; i<indexArr.length-1; i++) {
    	    			trace2dArr.push({
    	    				pointArr: bMapPoints.slice(indexArr[i]['i'], indexArr[i+1]['i'] + 1),
    	    				wloadType: indexArr[i + 1]['wloadType']
    	    			});
        	    	}
        	    	console.info(indexArr)
        	    	console.info(trace2dArr)
        	    	console.info(bMapPoints)
        	    	var iconStart = new BMap.Icon('./app/img/icon_199.png', new BMap.Size(40, 51), {
	                    anchor: new BMap.Size(20, 42)
	                });
	                var iconEnd = new BMap.Icon('./app/img/icon_201.png', new BMap.Size(40, 51), {
	                    anchor: new BMap.Size(20, 42), // 指定定位位置   
	                });
        	    	trace2dArr = _.filter(trace2dArr, function(e) {
        	    		return e.pointArr.length !== 0
        	    	});
        	    	trace2dArr.forEach(function(item, index, list) {
        	    		if (index < list.length-1) {
        	    			item.pointArr.push(list[index + 1].pointArr[0])
        	    		}
        	    	});
        	    	trace2dArr.forEach(function(item, index, list) {
        	    		var strokeColor;
	                    if (item.wloadType == 0) {
	                        strokeColor = "#09ff6b"
	                    } else if (item.wloadType == 1) {
	                        strokeColor = "#0cb5ec"
	                    } else if (item.wloadType == 2) {
	                        strokeColor = "#5b00c2"
	                    } else if (item.wloadType == 3) {
	                        strokeColor = "#E42889"
	                    }
	                    if (index === 0) {
	                        markerStart = new BMap.Marker(item.pointArr[0], { icon: iconStart });
	                        pMap.addOverlay(markerStart);
	                        if (!isInit) {
		                        geoc.getLocation(item.pointArr[0], function(rs) {
									$("#sAddr").text(rs.address);
									$('#sAddr').tooltip('destroy');
									if (rs.address.length >= 12) {
										$('#sAddr').tooltip({ title: rs.address });
									}
								});
	                        }
	                    }
	                    if (index === list.length - 1) {
	                        markerEnd = new BMap.Marker(item.pointArr[item.pointArr.length - 1], { icon: iconEnd });
	                        pMap.addOverlay(markerEnd);
	                        if (!isInit) {
		                        geoc.getLocation(item.pointArr[item.pointArr.length - 1], function(rs) {
									$("#eAddr").text(rs.address);
									$('#eAddr').tooltip('destroy');
									if (rs.address.length >= 12) {
										$('#eAddr').tooltip({ title: rs.address });
									}
								});
	                        }
	                    }
	                    var polyline = new BMap.Polyline(item.pointArr,
                        {
                            strokeColor: strokeColor,//设置颜色
                            strokeWeight: 4, //宽度  
                            strokeOpacity: 0.9
                        })
                    	pMap.addOverlay(polyline);
        	    	});
        	    	pMap.setViewport(bMapPoints);
        	    	removeLoading('test');
	    		} else {
	    			toastr.info("暂无轨迹数据！");
	    			removeLoading('test');
	    		}
	    	} else if (data.resultCode === 509) {
	    		removeLoading('test');
	    		toastr.error("当前登录状态失效，请重新登入！");
                setTimeout(function(){
                	window.location.href = WEB_HOME_PAGE;
                }, 2000);
	    	} else {
	    		removeLoading('test');
	    	}
	    },
	    error: function(err) {
	    	removeLoading('test');
		}
	});
}

function loading() {
	$('body').loading({
		loadingWidth: 240,
		title: '',
		name: 'test',
		discription: '数据加载中，请稍后...',
		direction: 'column',
		type: 'origin',
		// originBg:'#71EA71',
		originDivWidth: 40,
		originDivHeight: 40,
		originWidth: 6,
		originHeight: 6,
		smallLoading: false,
		loadingMaskBg: 'rgba(0,0,0,0.2)'
	});
}

function qvToken() {
	var token = localStorage.getItem('overloadToken') ? localStorage.getItem('overloadToken') : '';
    if(!token) {
    	toastr.error("当前登录状态失效，请重新登入！");
        setTimeout(function(){
        	window.location.href = WEB_HOME_PAGE;
        }, 2000);
    }
    return token || '';
}
    
var init = function() {
	toastr.options = {  
        closeButton: false,  
        debug: false,  
        progressBar: true,  
        positionClass: "toast-top-center",  
        onclick: null,  
        showDuration: "300",  
        hideDuration: "1000",  
        timeOut: "2000",  
        extendedTimeOut: "1000",  
        showEasing: "swing",  
        hideEasing: "linear",  
        showMethod: "fadeIn",  
        hideMethod: "fadeOut"  
    };
    setDateRange();
	token = qvToken();
	if (token === '') {
		return false;
	}
    // 百度地图API功能
    pMap = new BMap.Map("map", {
        enableMapClick: false
    });
    // 创建Map实例
    pMap.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5);  // 初始化地图,设置中心点坐标和地图级别
    pMap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    getOverloadRecord(true);
};

init();

function resetTable() {
	$("#sAddr").text('');
    $("#eAddr").text('');
    $("#zaizhong").text(''); //载重状态
    $("#areaText").text(''); //途径区域
    $("#chaozai").text(''); //最大超载
    $("#wload").text(''); //最大载重
}

function uniqueArr(arr) {
	var o3 = [];
	var t = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] != arr[i - 1]) {
			o3[t] = arr[i];
			t++;
		}
	}
	arr.length = 0;
	for (var j = 0; j < o3.length; j++) {
		arr[j] = o3[j];
	}
	return o3;
}
