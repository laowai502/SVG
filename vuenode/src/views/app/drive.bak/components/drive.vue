<template>
	<org-char :option="option"></org-char>
</template>
<script>
import { mapGetters } from 'vuex'
import OrgChar from '@/components/Chars/OrgChar'

export default {
	components: {
		'org-char': OrgChar
	},
	data() {
		return {
			option: {
				series: []
			}
		}
	},
	mounted() {
		if (this.resData) {
			this._initChar()
		}
	},
	methods: {
		_initChar() {
			const series = [
				{
		            name: '运行',
		            type: 'line',
		            key: 'drive',
		            data: this.resData.drive.y,
		            smooth: true,
		            markLine: {
						silent: true,
						label: {
							position: 'end',
							formatter: '{c}'
						},
						data: [{
							type: 'average',
							name: '平均值',
							lineStyle: {
								color: '#2DCA93',
								width: 1
							}
						}]
					}
		        }
			]
			this.option = this._setOption('车辆运行', this.$store.getters.allDate)
			this.option.xAxis[0].data = this.resData.x
			this.option.series = series
		},
		_setOption(title, time) {
			return {
				title: {
					text: title + '统计',
					textStyle: {
						fontSize: '15'
					},
        			subtext: time
				},
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data: []
			    },
			    grid: {
			    	top: '80',
			        left: '20',
			        right: '50',
			        bottom: '5',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: [
			        {
			        	name: '日期',
			            type: 'category',
			            boundaryGap: true,
			            data: [],
			            axisTick: {
			                alignWithLabel: true
			            },
			            axisLine: {
							lineStyle: {
								color: '#999'
							}
						},
						axisLabel: {
							fontSize: 12,
							color: '#999'
						},
						nameGap: '10'
			        }
			    ],
			    yAxis: [
			        {
			        	name: '运行时长',
			            type: 'value',
			            splitLine: {
			            	lineStyle: {
			            		type: 'dashed'
			            	}
		            	},
			            axisLine: {
							lineStyle: {
								color: '#999'
							}
						},
						axisLabel: {
							fontSize: 12,
							color: '#999'
						},
						nameGap: '15'
			        }
			    ]
			}
		},
		_setMerge(data) {
			this.option = this._setOption('车辆运行-怠速', this.$store.getters.allDate)
			this.option.xAxis[0].data = this.resData.x
			this.option['legend']['data'] = ['运行时长', '怠速时长']
			const series = [
				{
		            name: '运行时长',
		            type: 'line',
		            key: 'idle',
		            data: this.resData.drive.y,
		            smooth: true,
		            markLine: {
						silent: true,
						label: {
							position: 'end',
							formatter: '{c}'
						},
						data: [{
							type: 'average',
							name: '平均值',
							lineStyle: {
								color: '#2DCA93',
								width: 1
							}
						}]
					}
		        },
				{
		            name: '怠速时长',
		            type: 'line',
		            key: 'idle',
		            data: this.resData.idle.y,
		            smooth: true,
		            markLine: {
						silent: true,
						label: {
							position: 'end',
							formatter: '{c}'
						},
						data: [{
							type: 'average',
							name: '平均值',
							lineStyle: {
								width: 1
							}
						}]
					}
		        }
			]
			this.option.series = series
		},
		_setData(data) {
			this.option.xAxis[0].data = data.x
			this.option.title.subtext = this.$store.getters.allDate
			const length = this.option.series.length
			for (let i = 0; i < length; i++) {
				this.option.series[i].data = data[this.option.series[i].key].y
			}
		}
	},
	computed: {
		...mapGetters(['mergeDataCollection', 'resData', 'allReset'])
    },
    watch: {
        mergeDataCollection: {
        	handler(n) {
        		if (n && n.driveIdle) {
        			this._setMerge(n.driveIdle)
        		}
        	},
        	deep: true
        },
        resData: {
        	handler(n, o) {
        		if (n && n.oil) {
        			if (!o) { //判断首次
        				this._initChar()
        			} else {
        				this._setData(n)
        			}
        		}
        	},
        	deep: true
        },
        allReset(n) {
        	if (n > 0) {
        		this._initChar()
        	}
        }
    }
}
</script>