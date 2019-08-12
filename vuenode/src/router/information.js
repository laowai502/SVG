import Layout from '@/views/layout/Layout'

export default {
	id: 'information',
	path: '/info',
	component: Layout,
	redirect: '/info/operate',
	name: 'information',
	meta: {
		title: '车辆信息统计',
		icon: 'fa-line-chart'
	},
	children: [
		{
			id: 'operate',
			path: 'operate',
			name: 'operate',
			component: () =>
				import('@/views/app/searchChars/index'),
			meta: {
				title: '操作类型统计',
				icon: 'fa-share-alt',
                type: 'operate'
			}
		},
		{
			id: 'warning',
			path: 'warning',
			name: 'warning',
			component: () =>
				import('@/views/app/searchChars/index'),
			meta: {
				title: '报警类型统计',
				icon: 'fa-share-alt',
                type: 'warning'
			}
		}
	]
}
