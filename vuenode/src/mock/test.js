import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { restfulApi } from '@/utils/restful'
import jsonData from '../../static/test.json'

const List = []
const count = 100
const pvData = [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]

for (let i = 0; i < count; i++) {
	List.push(Mock.mock({
	    id: '@increment',
	    timestamp: '@date("yyyy-MM-dd HH:mm:ss")',
	    author: '@first',
	    reviewer: '@first',
	    title: '@title(5, 10)',
	    forecast: '@float(0, 100, 2, 2)',
	    importance: '@integer(1, 3)',
	    'type|1': ['CN', 'US', 'JP', 'EU'],
	    'status|1': ['published', 'draft', 'deleted'],
	    display_time: '@datetime',
	    pageviews: '@integer(300, 5000)'
//		id: '@guid', //id 自增
//		title: '@title', //模拟名称
//		author: '@cparagraph()', //模拟文本
//		'pageviews|1-10000': 10000, //模拟数字(1-10000)
//		status: '@string("lower", 5)', //模拟字符串
//		display_time: '@date("yyyy-MM-dd HH:mm:ss")'
	}))
}

export default {
	localJson: config => {
//		const { type } = JSON.parse(config.body)
//		if (type === 'basic') {
//			return jsonData
//		} else if (type === 'behavior') {
//			return jsonBehaviorData
//		} else {
			return jsonData
//		}
	},
	getTestList: config => {
		const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)	//JSON.parse(config.body)

	    let mockList = List.filter(item => {
	    	if (importance && item.importance !== +importance) return false
	    	if (type && item.type !== type) return false
	    	if (title && item.title.indexOf(title) < 0) return false
	     	return true
	    })

	    if (sort === '-id') {
	    	mockList = mockList.reverse()
    	}

    	const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
		return restfulApi({
			list: pageList,
			total: count
		})
	},
	getById: config => {
		const { id } = param2Obj(config.url)
		for (const row of List) {
			if (row.id === +id) {
				return restfulApi(row, 'detail')
			}
		}
	},
	getPv: () => restfulApi(pvData),
	createArticle: () => restfulApi(),
	updateArticle: () => restfulApi()
}
