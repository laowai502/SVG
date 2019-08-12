import Vue from 'vue'
import Router from 'vue-router'
import DriveRouter from './drive'
import InfoRouter from './information'
import DischargeRouter from './discharge'
import Chat from './chat'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
	{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/404'),
		hidden: true
	},
	{
		path: '',
		component: Layout,
		redirect: '/middle/Koa-test',
		name: 'Dashboard'
//		hidden: true,
//		children: [{
//			path: 'dashboard',
//			meta: {
//				title: '首页',
//				icon: 'guide'
//			},
//			component: () =>
//				import('@/views/dashboard/index')
//		}]
	},
	{
		path: '/slot',
		component: Layout,
		meta: {
			title: 'slot-demo',
			icon: 'fa-go'
		},
		children: [
			{
				path: 'index',
				name: 'slot',
				component: () =>
					import('@/views/test/slot/index'),
				meta: {
					title: 'slot'
				}
			}
		]
	},
	{
		path: '/middle',
		component: Layout,
		meta: {
			title: 'node-middleware',
			icon: 'fa-play'
		},
		children: [
			{
				path: 'Koa-test',
				name: 'Koa-test',
				component: () =>
					import('@/views/test/middle/KoaTest'),
				meta: {
					title: 'Koa-test'
				}
			},
			{
				path: 'Node-upload',
				name: 'Node-upload',
				component: () =>
					import('@/views/test/middle/Upload'),
				meta: {
					title: 'Node-upload'
				}
			},
			{
				path: 'Mysql',
				name: 'Mysql',
				component: () =>
					import('@/views/test/middle/MySql'),
				meta: {
					title: 'Mysql'
				}
			},
			{
				path: 'Example',
				name: 'Example',
				component: () =>
					import('@/views/test/middle/Example'),
				meta: {
					title: 'Example'
				}
			}
		]
	},
	{
		path: '/test',
		component: Layout,
		meta: {
			title: 'test',
			icon: 'fa-car'
		},
		children: [{
				path: 'index',
				name: 'Test',
				component: () =>
					import('@/views/test/index'),
				meta: {
					title: 'Test',
					icon: 'fa-car'
				}
			},
			{
				path: 'mtree',
				name: 'Mtree',
				component: () =>
					import('@/views/test/Mtree'),
				meta: {
					title: 'Mtree',
					icon: 'fa-tree'
				}
			},
			{
				path: 'bmap',
				name: 'bmap',
				component: () =>
					import('@/views/test/BMap'),
				meta: {
					title: 'BMap',
					icon: 'fa-example'
				}
			},
			{
				path: 'dyncComponent',
				name: 'dyncComponent',
				component: () =>
					import('@/views/test/DyncComponent'),
				meta: {
					title: '动态组件',
					icon: 'fa-cogs'
				}
			}
//			{
//				path: 'drag',
//				name: 'drag',
//				component: () =>
//					import('@/views/test/Drag'),
//				meta: {
//					title: '拖放案例',
//					icon: 'fa-car'
//				}
//			}
		]
    },
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

export default new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
		.concat(DriveRouter)
		.concat(DischargeRouter)
        .concat(InfoRouter)
        .concat(Chat)
})
