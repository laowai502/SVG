import store from '@/store'
/**
 * @description 存储动态报表聚合数据
 */
const drive = {
	state: {
		mergeDataCollection: { //合并数据项集合，业务处理做case
			mileOil: null,
			driveIdle: null
		}
	},
	mutations: {
		SET_MILE_OIL: (state, obj) => {
			state.mergeDataCollection.mileOil = obj
		},
		SET_DRIVE_IDLE: (state, obj) => {
			state.mergeDataCollection.driveIdle = obj
		},
		CLEAR_DRIVE_MERGE_DATA_A: state => {
			state.mergeDataCollection = {
				mileOil: null,
				driveIdle: null
			}
		}
	},
	actions: {
		SetMileOile({ commit }) {
			const data = {
				oil: {},
				mile: {}
			}
			const resData = store.getters.resData
			data.oil = resData.oil
			data.mile = resData.mile
			commit('SET_MILE_OIL', data)
		},
		SetDriveIdle({ commit }) {
			const data = {
				drive: {},
				idle: {}
			}
			const resData = store.getters.resData
			data.drive = resData.drive
			data.idle = resData.idle
			commit('SET_DRIVE_IDLE', data)
		},
		ClearDriveMergeDataCollection({ commit }) {
			commit('CLEAR_DRIVE_MERGE_DATA_A')
		}
	}
}

export default drive