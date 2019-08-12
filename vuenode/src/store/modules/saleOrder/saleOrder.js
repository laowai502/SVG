/**
 * @description 页面跳转需要传Object参数，为了净化浏览器URl，
 * 防止出现类似不雅的http://localhost:9528/saleOrder/add?type=add&cust=%5Bobject%20Object%5D，
 * 固把入参放入vuex中，在跳转到的页面销毁时，清空相应的vuex项
 */
const saleOrder = {
	state: {
		saleOrderRouteParam: null
	},
	mutations: {
		SET_SALE_ROUTE_PARAM: (state, obj) => {
			state.saleOrderRouteParam = obj
		}
	},
	actions: {
		SaveSaleRouteParam({ commit }, custObj) {
			commit('SET_SALE_ROUTE_PARAM', custObj)
		},
		ClearSaleRouteParam({ commit }) {
			commit('SET_SALE_ROUTE_PARAM', null)
		}
	}
}

export default saleOrder