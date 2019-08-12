import BaiduMap from './map/Map.vue'

export default {
	install(Vue, options) {
		const { ak } = options
		Vue.prototype._BMap = () => ({ ak })

		Vue.component('baidu-map', BaiduMap)
	}
}