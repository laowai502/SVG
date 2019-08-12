import Mock from 'mockjs'
import { restfulApi } from '@/utils/restful'

const Random = Mock.Random

const list = Mock.mock({
	'list': [{
		treeId: 1,
		label: () => 'levelOne1' + Random.ctitle(2),
		shopId: 1,
		'children|2': [{
			treeId: 2,
			'shopId|+1': 2,
			label: () => 'levelTwo1-1' + Random.ctitle(2),
			'children|2': [{
				treeId: 3,
				'shopId|+1': 2000,
				label: () => 'levelThree1-1-1' + Random.ctitle()
			}]
		}]
	}]
})

export default {
	getTreeDate: () => restfulApi(list)
}
