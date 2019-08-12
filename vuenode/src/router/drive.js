import Layout from '@/views/layout/Layout'

export default {
	id: 'drive',
	path: '/drive',
	component: Layout,
	redirect: '/drive/single',
	name: 'drive',
	meta: {
		title: '行驶情况统计',
		icon: 'fa-dashboard'
	},
	children: [
		{
			id: 'singleCar',
			path: 'single',
			name: 'singleCar',
			component: () =>
				import('@/views/app/searchChars/index'),
			meta: {
				title: '车辆行驶统计',
				icon: 'fa-share-alt',
                type: 'vehicle'
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
