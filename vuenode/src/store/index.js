import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import chat from './modules/chat'
import common from './modules/common'
import drive from './modules/drive'
import getters from './getters'
import saleOrder from './modules/saleOrder/saleOrder'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		app,
        user,
        chat,
		common,
		saleOrder,
		drive
	},
	getters
})

export default store
