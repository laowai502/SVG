const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.name,
	roles: state => state.user.roles,
	menus: state => state.user.menus,
	elemnts: state => state.user.elemnts,
	//数据分析统计项
	allDate: state => state.common.allDate,
	resData: state => state.common.resData,
	resBehavior: state => state.common.resBehavior,
	resWarning: state => state.common.resWarning,
	vx_uid: state => state.common.vx_uid,
	allReset: state => state.common.allReset,
	saleOrderRouteParam: state => state.saleOrder.saleOrderRouteParam,
	mergeDataCollection: state => state.drive.mergeDataCollection
}
export default getters