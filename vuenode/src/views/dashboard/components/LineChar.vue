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
			this.chart = echarts.init(this.$el, 'light')

			this.chart.setOption({
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data: ['重汽', '青汽', '东风', '江淮']
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name: '重汽',
			            type: 'line',
			            stack: '总量',
			            data: [50, 320, 214, 56, 90, 112, 50]
			        },
			        {
			            name: '青汽',
			            type: 'line',
			            stack: '总量',
			            data: [10, 111, 122, 133, 144, 155, 166]
			        },
			        {
			            name: '东风',
			            type: 'line',
			            stack: '总量',
			            data: [20, 50, 50, 41, 123, 365, 220]
			        },
			        {
			            name: '江淮',
			            type: 'line',
			            stack: '总量',
			            data: [30, 100, 56, 77, 88, 14, 25]
			        }
			    ]
			})
		}
	}
}
</script>

<style>
</style>