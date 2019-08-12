<template>
	<div>
		<div v-if="!hasBmView" ref="view" style="width: 100%; height: 100%"></div>
		<slot></slot>
	</div>
</template>

<script>
import bindEvents from '../base/bindEvent.js'
import { checkType } from '@/utils'

export default {
	name: 'bm-map',
	props: {
		ak: {
			type: String
		},
		center: {
			type: [Object, String]
		},
		zoom: {
			type: Number
		},
		minZoom: {
			type: Number
		},
		maxZoom: {
			type: Number
		},
		highResolution: { //处理iphone高分屏模式
			type: Boolean,
			default: true
		},
		mapClick: {
			type: Boolean,
			default: true
		},
		mapType: {
			type: String
		},
		dragging: {
			type: Boolean,
			default: true
		},
		scrollWheelZoom: {
			type: Boolean,
			default: false
		},
		doubleClickZoom: {
			type: Boolean,
			default: true
		},
		keyboard: {
			type: Boolean,
			default: true
		},
		inertialDragging: { //允许惯性拖拽
			type: Boolean,
			default: true
		},
		continuousZoom: { //允许无限缩放
			type: Boolean,
			default: true
		},
		pinchToZoom: {
			type: Boolean,
			default: true
		},
		autoResize: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			hasBmView: false
		}
	},
	mounted() {
		this.reset()
	},
	methods: {
		setMapOptions() {
			const { map, minZoom, maxZoom, mapType, dragging, scrollWheelZoom, doubleClickZoom, keyboard, inertialDragging,
				continuousZoom, pinchToZoom, autoResize } = this
			minZoom && map.setMinZoom(minZoom)
			maxZoom && map.setMaxZoom(maxZoom)
			mapType && map.setMapType(global[mapType])
			dragging ? map.enableDragging() : map.disableDragging()
			scrollWheelZoom ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
			doubleClickZoom ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom()
			keyboard ? map.enableKeyboard() : map.disableKeyboard()
			inertialDragging ? map.enableInertialDragging() : map.disableInertialDragging()
			continuousZoom ? map.enableContinuousZoom() : map.disableContinuousZoom()
			pinchToZoom ? map.enablePinchToZoom() : map.disablePinchToZoom()
			autoResize ? map.enableAutoResize() : map.disableAutoResize()
		},
		init(BMap) {
			if (this.map) {
				return
			}
			let $el = this.$refs.view
			for (const $node of this.$slots.default || []) {
				if ($node.componentOptions && $node.componentOptions.tag === 'bm-view') {
					this.hasBmView = true
					$el = $node.elm
				}
			}
			const map = new BMap.Map($el, {
				enableHighResolution: this.highResolution,
				enableMapClick: this.mapClick
			})
			this.map = map
			const { setMapOptions, zoom, getCenterPoint, theme, mapStyle } = this
			theme ? map.setMapStyle({
				styleJson: theme
			}) : map.setMapStyle(mapStyle)
			setMapOptions()
			bindEvents.call(this, map) //绑定事件
			// 此处强行初始化一次地图 回避一个由于错误的 center 字符串导致初始化失败抛出的错误
			map.reset()
			map.centerAndZoom(getCenterPoint(), zoom)
			this.$emit('ready', { BMap, map })
		},
		getCenterPoint() {
			const { center, BMap } = this
			switch (checkType(center)) {
				case 'String':
					return center
				case 'Object':
					return new BMap.Point(center.lng, center.lat)
				default:
					return new BMap.Point()
			}
		},
		initMap(BMap) {
			this.BMap = BMap
			this.init(BMap)
		},
		getMapScript() {
			if (!global.BMap) {
				const ak = this.ak || this._BMap().ak
				global.BMap = {}
				global.BMap._preloader = new Promise((resolve, reject) => {
					global._initBaiduMap = function() {
						resolve(global.BMap)
						global.document.body.removeChild($script)
						global.BMap._preloader = null
						global._initBaiduMap = null
					}
					const $script = document.createElement('script')
					global.document.body.appendChild($script)
					$script.src = `https://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBaiduMap`
				})
				return global.BMap._preloader
			} else if (!global.BMap._preloader) {
				return Promise.resolve(global.BMap)
			} else {
				return global.BMap._preloader
			}
		},
		reset() {
			const { getMapScript, initMap } = this
			getMapScript().then(initMap)
		}
	},
	computed: {
		centerLngChange() {
			return this.center.lng
		},
		centerLatChange() {
			return this.center.lat
		}
	},
	watch: {
		center(val, oldVal) {
			const { map, zoom } = this
			if (checkType(val) === 'String' && val !== oldVal) {
				map.centerAndZoom(val, zoom)
			}
		},
		centerLngChange(val, oldVal) {
			const { BMap, map, zoom, center } = this
			if (val !== oldVal && val >= -180 && val <= 180) {
				map.centerAndZoom(new BMap.Point(val, center.lat), zoom)
			}
		},
		centerLatChange(val, oldVal) {
			const { BMap, map, zoom, center } = this
			if (val !== oldVal && val >= -74 && val <= 74) {
				map.centerAndZoom(new BMap.Point(center.lng, val), zoom)
			}
		},
		zoom(val, oldVal) {
			const { map } = this
			if (val !== oldVal && val >= 3 && val <= 19) {
				map.setZoom(val)
			}
		},
		minZoom(val) {
			const { map } = this
			map.setMinZoom(val)
		},
		maxZoom(val) {
			const { map } = this
			map.setMaxZoom(val)
		},
		highResolution() {
			this.reset()
		},
		mapClick() {
			this.reset()
		},
		mapType(val) {
			const { map } = this
			map.setMapType(global[val])
		},
		dragging(val) {
			const { map } = this
			val ? map.enableDragging() : map.disableDragging()
		},
		scrollWheelZoom(val) {
			const { map } = this
			val ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
		},
		doubleClickZoom(val) {
			const { map } = this
			val ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom()
		},
		keyboard(val) {
			const { map } = this
			val ? map.enableKeyboard() : map.disableKeyboard()
		},
		inertialDragging(val) {
			const { map } = this
			val ? map.enableInertialDragging() : map.disableInertialDragging()
		},
		continuousZoom(val) {
			const { map } = this
			val ? map.enableContinuousZoom() : map.disableContinuousZoom()
		},
		pinchToZoom(val) {
			const { map } = this
			val ? map.enablePinchToZoom() : map.disablePinchToZoom()
		},
		autoResize(val) {
			const { map } = this
			val ? map.enableAutoResize() : map.disableAutoResize()
		}
	}
}
</script>