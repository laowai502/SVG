import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'font-awesome/scss/font-awesome.scss'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import Moment from 'moment'
import BaiduMap from '@/components/BMap/index'
import Rules from '@/utils/rules'

import '@/icons' // icon
import '@/permission' // permission control

//process.env.NODE_ENV === 'mock' && require('./mock')
import './mock'

Vue.use(ElementUI, {
	locale
})
Vue.use(BaiduMap, {
  	ak: 'fQOBYAhOTulu2sRlf4iSRkzFheEiW0Rz'
})

Vue.component('tree-select', Treeselect)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})

Vue.prototype.RULE = Rules
Vue.prototype.$moment = Moment
Vue.prototype.UPLOAD_URL = process.env.MIDDLE_API + 'upload'
