<template>
	<el-row>
		<el-col :span="12">
			<div id="pieChartOne" :style="{height: height, width: width}"></div>
		</el-col>
		<el-col :span="12">
			<div id="pieChartTwo" :style="{height: height, width: width}"></div>
		</el-col>
	</el-row>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/shine') // echarts 主题
import { throttle } from '@/utils'

export default {
	props: {
		width: {
	      	type: String,
	      	default: '100%'
	    },
	    height: {
	      	type: String,
	      	default: '350px'
	    },
	    autoResize: {
	      	type: Boolean,
	      	default: true
	    },
	    data: {
	      	type: Object
	    }
	},
	data() {
		return {
			chartOne: null,
			chartTwo: null
		}
	},
	mounted() {
	    this.initChart()
	    if (this.autoResize) {
	      	this._resizeHanlder = throttle(() => {
	        	if (this.chartOne) {
	          		this.chartOne.resize()
		       	}
	        	if (this.chartTwo) {
	          		this.chartTwo.resize()
		       	}
	      	}, 100)
	      	window.addEventListener('resize', this._resizeHanlder)
	    }
	    // 监听侧边栏的变化
	    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
	    sidebarElm.addEventListener('transitionend', this._resizeHanlder)
	},
	beforeDestroy() {
		if (!this.chartOne && !this.chartTwo) {
			return
		}
		window.removeEventListener('resize', this._resizeHanlder)
		this.chartOne.dispose()
		this.chartTwo.dispose()
    	this.chartOne = null
    	this.chartTwo = null
	},
	methods: {
		initChart() {
			this.chartOne = echarts.init(document.getElementById('pieChartOne'), 'shine')
			this.chartTwo = echarts.init(document.getElementById('pieChartTwo'), 'shine')

			const charOptions = {
				title: {
			        text: '',
			        x: 'center'
			    },
			    tooltip: {
			        trigger: 'item',
			        formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    legend: {
//			        orient: 'vertical',
			        bottom: '5',
			        data: this.data.a.x
			    },
			    series: [
			        {
			            name: '本月新增信贷业务',
			            type: 'pie',
			            radius: '60%',
			            center: ['50%', '50%'],
			            data: this.data.a.y,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			}
			charOptions.legend.data = this.data.a.x
			charOptions.series[0].data = this.data.a.y
			charOptions.title.text = '本月新增信贷业务'
			this.chartOne.setOption(charOptions)
			charOptions.legend.data = this.data.b.x
			charOptions.series[0].data = this.data.b.y
			charOptions.title.text = '本月信贷简评'
			this.chartTwo.setOption(charOptions)
		}
	}
}
</script>

<style>
</style>