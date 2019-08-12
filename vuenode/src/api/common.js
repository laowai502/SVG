import RequestService from '@/utils/request'

export default {
	//图片上传
	upload: data => RequestService.post(process.env.UPLOAD_URL, data, true),
	//查询单车统计信息（单项集合）
	getCarDataByItem: data => RequestService.post('/single/statisticscol', data),
	//查询单车统计信息（子分类集合）
	getCarDataBySub: data => RequestService.post('/single/statisticschd', data),
	//查询单车统计信息（子分类集合）
	getCarDataByParents: data => RequestService.post('/single/statisticsparents', data)
}
