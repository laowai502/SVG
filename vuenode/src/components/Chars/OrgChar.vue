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
	      	default: '330px'
	    },
	    autoResize: {
	      	type: Boolean,
	      	default: true
	    },
	    option: {
	    	type: Object,
	    	default: null
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
	      	}, 10)
	      	window.addEventListener('resize', this._resizeHanlder)
	    }
	    // 监听侧边栏的变化
	    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
	    sidebarElm.addEventListener('transitionend', this._resizeHanlder)
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
			this.chart.setOption(this.option)
		}
	},
	watch: {
		option: {
			handler(val) {
				if (val) {
					this.chart.setOption(val, true)
				}
			},
			deep: true
		}
	}
}
</script>

<style>
</style>