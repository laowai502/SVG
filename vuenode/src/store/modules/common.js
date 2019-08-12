/**
 * @description 存储工具栏数据
 */
const common = {
	state: {
		allDate: null,
		allReset: 0,
		resData: null,
		resBehavior: null,
		resWarning: null,
		vx_uid: null
	},
	mutations: {
		SET_QUERY_DATE: (state, time) => {
			state.allDate = time
		},
		SET_RES_DATA: (state, obj) => {
			state.resData = obj
		},
		SET_RES_BEHAVIOR: (state, obj) => {
			state.resBehavior = obj
		},
		SET_RES_WARNING: (state, obj) => {
			state.resWarning = obj
		},
		RESET_ALL: state => {
			state.allReset++
		},
		SET_VX_UID: (state, data) => {
			state.vx_uid = data
		}
	},
	actions: {
		SetQueryDate({ commit }, time) {
			commit('SET_QUERY_DATE', time)
		},
		SetResData({ commit }, data) {
			commit('SET_RES_DATA', data)
		},
		SetBehaviorResData({ commit }, data) {
			commit('SET_RES_BEHAVIOR', data)
		},
		SetWarningResData({ commit }, data) {
			commit('SET_RES_WARNING', data)
		},
		ClearResData({ commit }) {
			commit('SET_RES_DATA', null)
		},
		ResetAll({ commit }) {
			commit('RESET_ALL')
		},
		SetVxUid({ commit }, data) {
			commit('SET_VX_UID', data)
		}
	}
}

export default common