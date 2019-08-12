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
		            name: '里程',
		            type: 'bar',
		            key: 'mile',
		            data: this.resData.mile.y,
		            barMaxWidth: 30
		        }
			]
			this.option = this._setOption('车辆里程', this.$store.getters.allDate)
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
//				color: ['#008cff', '#00da9c'],
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
			        	name: '里程',
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
			this.option = this._setOption('车辆里程-油耗', this.$store.getters.allDate)
			this.option.xAxis[0].data = this.resData.x
			this.option['legend']['data'] = ['里程', '油耗']
			const series = [
				{
					name: '里程',
		            type: 'bar',
		            key: 'mile',
		            data: data.mile.y,
		            barMaxWidth: 30
				},
				{
					name: '油耗',
		            type: 'bar',
		            key: 'oil',
		            data: data.oil.y,
		            barMaxWidth: 30
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
        		if (n && n.mileOil) {
        			this._setMerge(n.mileOil)
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