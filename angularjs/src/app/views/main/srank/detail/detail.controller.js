(function() {
	'use strict';

	angular
		.module('WeViews')
		.controller('MainSafeRankDetailController', function MainSafeRankDetailController($stateParams, $scope, SrankService, EchartsOptionsUtils, Message,CarService) {
		    /* 截止日期 */
            $scope.nowTime = moment().add(-1, 'days').format('YYYY-MM-DD');

            /* 接受列表页参数 */
            $scope.carVin = $stateParams.carVin;
            $scope.carNum = $stateParams.carNum;
            $scope.driver = $stateParams.driver;
            $scope.type = $stateParams.type;
            $scope.detailTime  = $stateParams.queryDate;

            $scope.query = {
                carId : $stateParams.carId,
                dateCondition: '',        //查询日期类型
                time: $scope.detailTime
            };
            $scope.list = [];

            $scope.preCompareInfo = {};
            $scope.preCompareChar = null;
            $scope.preCompareloading = true;

            $scope.safeChar = null;
            $scope.safeCharloading = true;

            $scope.singleGradeloading = true;

            /* 用来控制有无数据时的显隐 */
            $scope.showLeft = false;
            $scope.showRight = false;

            $scope.queryRange = [{
                type:'日期查询',
                value:'0'
            },{
                type:'月度查询',
                value:'1'
            }]

            /* 设置查询时间格式 */
            function setDate(format,minView,dateCondition) {
                $scope.formatSrank = format;
                $scope.minViewSrank = minView;
                $scope.query.dateCondition = dateCondition;
            }
            /* 保留两位小数 */
            function toFixed(item){
                if(item !== null){
                    return item.toFixed(2);
                }
            }

			if($scope.type == 0){
                setDate('yyyy-mm-dd','day','1');
            }else{
                setDate('yyyy-mm','month','2');
			}

            $scope.changePro = function(data){
                if(data.value==0){
                    setDate('yyyy-mm-dd','day','1');
                    $scope.detailTime = moment().add(-1, 'days').format('YYYY-MM-DD');
                }else{
                    setDate('yyyy-mm','month','2');
                    $scope.detailTime = moment().add(-1, 'days').format('YYYY-MM');
                }
                $scope.type = data.value;
            }

            var queryDate = function() {
                SrankService.getDate($scope.query).then(function(data) {
                    if (data) {
                        var list = data.queryPointPojoList;

                        /* 是否达到安全评分 */
                        list[0].point == null ? $scope.standard = true : $scope.standard = false;

                        /* 左上角排名 */
                        $scope.preCompareInfo.mainGrade = toFixed(list[0].point);
                        $scope.preCompareInfo.rank = list[0].rank;

                        if(data.pointCompare >= 0){
                            $scope.preCompareInfo.grade = toFixed(data.pointCompare);
                            $scope.preCompareInfo.gradeIcon = 'up';
                        }else {
                            $scope.preCompareInfo.grade = toFixed(-data.pointCompare);
                            $scope.preCompareInfo.gradeIcon = 'down';
                        }

                        if(data.rankCompare >= 0){
                            $scope.preCompareInfo.rankCompare = data.rankCompare
                            $scope.preCompareInfo.rankIcon = 'up';
                        }else{
                            $scope.preCompareInfo.rankCompare = -data.rankCompare
                            $scope.preCompareInfo.rankIcon = 'down';
                        }

                        /* 左上角echart */
                        var preToday = [toFixed(list[1].point),toFixed(list[2].point)], preYestoday = [list[1].rank,list[2].rank];
                        if(preToday[0]||preToday[1]||preYestoday[0]||preYestoday[1]){
                            if($scope.query.dateCondition == 1) {
                                $scope.preCompareChar.yAxis.data = ['昨天', '前天'];
                            }else{
                                $scope.preCompareChar.yAxis.data = ['上月', '上上月']
                            }
                            $scope.preCompareChar.series = EchartsOptionsUtils.setSeriers([{
                                name:'分数',
                                data: preToday,
                            },{
                                name:'排名',
                                data: preYestoday,
                            }], 'bar','right');
                            $scope.showLeft = false;
                        }else {
                            $scope.showLeft = true;
                        }

                        /* 右上角echart */
                        var safeCharxAixs = [], safeCharPoint = [], safeCharRank = [];
                        
                        for (var i=list.length-1; i>=0; i--) {
                        	safeCharxAixs.push($scope.type === '0' ? moment(list[i].date, 'YYYYMMDD').format('MM/DD') : moment(list[i].date, 'YYYYMM').format('YY/MM'));
                            safeCharPoint.push(list[i].point);
                            safeCharRank.push(list[i].rank);
                        }
                        
                        if ( safeCharPoint.length > 0 && safeCharRank.length > 0) {
                            $scope.safeChar.xAxis.data = safeCharxAixs;
                            $scope.safeChar.xAxis.interval = 0;
                            $scope.safeChar.yAxis = [ {}, { axisLine: { onZero: false },  inverse: true }]
                            $scope.safeChar.legend.data = ['安全分数','安全排名']
                            $scope.safeChar.series = [{
                                name: '安全分数',
                                type: 'bar',
                                yAxisIndex: 0,
                                data: safeCharPoint,
                                barWidth : 30,
                            },{
                                name: '安全排名',
                                type: 'line',
                                itemStyle : { normal: {label : {show: true}}},
                                yAxisIndex: 1,
                                data: safeCharRank,
                            }];
                            $scope.showRight = false;
                        } else {
                            $scope.showRight = true;
                        }

                        /* 表格 */
                        var fcwCount,ufcwCount,hmwCount,ldw_lCount,ldw_rCount;
                        if(list[0].point !== null){
                            fcwCount = list[0].fcwCount
                            ufcwCount = list[0].ufcwCount
                            hmwCount = list[0].hmwCount
                            ldw_lCount = list[0].ldw_lCount
                            ldw_rCount = list[0].ldw_rCount
                        }else{
                            fcwCount = 0;
                            ufcwCount = 0;
                            hmwCount = 0;
                            ldw_lCount = 0;
                            ldw_rCount = 0;
                        }
                        var tableDate = [{
                            mailCompare: 'FCW 前车碰撞'+fcwCount+'次',
                            grade:data.fcw,
                            single:list[0].fcw,
                        },{
                            mailCompare: 'UFCW 城市前车碰撞'+ufcwCount+'次',
                            grade:data.ufcw,
                            single:list[0].ufcw,

                        },{
                            mailCompare: 'HMW 车距过近'+hmwCount+'次',
                            grade:data.hmw,
                            single:list[0].hmw,
                        },{
                            mailCompare: 'LDW-L 左车道偏离'+ldw_lCount+'次',
                            grade:data.ldw_l,
                            single:list[0].ldw_l,

                        },{
                            mailCompare: 'LDW-R 右车道偏离'+ldw_rCount+'次',
                            grade:data.ldw_r,
                            single:list[0].ldw_r,

                        }]
                        $scope.list = tableDate;

                        /* 3D echart图 */
                        var series = [],seriesData = [list[0].fcw,list[0].ufcw,list[0].hmw,list[0].ldw_l,list[0].ldw_r];
                        var legend = ['FCW 前车碰撞','UFCW 城市前车碰撞','HMW 车距过近','LDW-L 左车道偏离','LDW-R 右车道偏离']
                        for(var i = 0; i < seriesData.length; i++) {
                            series.push({
                                type: 'bar3D',
                                name: legend[i],
                                data: [[0, 0, seriesData[i]]],
                                stack: 'stack',
                                shading: 'lambert',
                                emphasis: {
                                    label: {
                                        show: false
                                    }
                                }
                            });
                        }

                        $scope.ThreeDChart = {
                            tooltip:{
                                formatter:function(p){
                                    return p.value[2]
                                },
                            },
                            legend:{
                                data:legend
                            },
                            xAxis3D: {
                                type: 'category'
                            },
                            yAxis3D: {
                                type: 'category'
                            },
                            zAxis3D: {
                                type: 'value'
                            },
                            grid3D: {
                                light: {
                                    main: {
                                        shadow: true,
                                        quality: 'ultra',
                                        intensity: 1.5
                                    }
                                }
                            },
                            series: series
                        };
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                }).finally(function() {
                    $scope.preCompareloading = true;
                });
            };

            var init = function () {
                $scope.preCompareChar = EchartsOptionsUtils.charCommon('','',true);
                $scope.safeChar = EchartsOptionsUtils.charCommon();
                queryDate();
            };
            init();

            var listener = $scope.$watch('detailTime' , function(n, o) {
                if (n && n != o) {
                    $scope.query.time = n;
                    init();
                }
            });
            $scope.$on('$destroy', function() {
                listener()
            });
	});
})();
