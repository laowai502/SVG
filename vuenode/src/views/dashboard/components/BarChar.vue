<template>
	<div :style="{height: height, width: width}"></div>
</template>

<script>
import echarts from 'echarts'
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
			chart: null
		}
	},
	mounted() {
	    this.initChart()
	    if (this.autoResize) {
	      	this._resizeHanlder = throttle(() => {
	      		console.info(1)
	        	if (this.chart) {
	          		this.chart.resize()
		       	}
	      	}, 100)
	      	window.addEventListener('resize', this._resizeHanlder)
	    }
	    // 监听侧边栏的变化
	    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
	    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
	},
	beforeDestroy() {
		if (!this.chart) {
			return
		}
		window.removeEventListener('resize', this._resizeHanlder)
		this.chart.dispose()
    	this.chart = null
	},
	methods: {
		initChart() {
			this.chart = echarts.init(this.$el)

			this.chart.setOption({
				color: ['#3398DB'],
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			    	height: '330',
			        left: '3%',
			        right: '4%',
			        bottom: '0',
			        containLabel: true
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: this.data.x,
			            axisTick: {
			                alignWithLabel: true
			            }
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value'
			        }
			    ],
			    series: [
			        {
			            name: '业务数量',
			            type: 'bar',
			            data: this.data.y,
			            barWidth: 80
			        }
			    ]
			})
		}
	}
}
</script>

<style>
</style>