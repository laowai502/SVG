$(document).ready(function () {






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
                    5: '#FF0000'
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
    var init = function() {
        // 百度地图API功能
        var map = new BMap.Map("map", {
            enableMapClick: false
        });
        map.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        map.setMapStyle(dataMapStyle);
        bigData(map);
    }
    init()
});
