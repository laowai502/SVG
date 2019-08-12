import Layout from '@/views/layout/Layout'

export default {
	id: 'discharge',
	path: '/discharge',
	component: Layout,
	redirect: '/discharge/dischargeCar',
	name: 'discharge',
	meta: {
		title: '排放情况统计',
		icon: 'fa-bar-chart-o'
	},
	children: [
		{
			id: 'dischargeCar',
			path: 'dischargeCar',
			name: 'dischargeCar',
			component: () =>
				import('@/views/app/discharge/dischargeCar/index'),
			meta: {
				title: '单车排放指标',
				icon: 'fa-share-alt'
			}
		}
//		{
//			id: 'muliteCar',
//			path: 'mulite',
//			name: 'muliteCar',
//			component: () =>
//				import('@/views/app/drive/MuliteCar/index'),
//			meta: {
//				title: '聚合统计',
//				icon: 'fa-share-alt'
//			}
//		}
	]
}