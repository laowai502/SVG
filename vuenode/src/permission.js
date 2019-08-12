import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
//import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
	NProgress.start()
	if (getToken()) {
		if (to.path === '/login') {
			next({
				path: '/'
			})
			NProgress.done()
		} else {
			if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
				store.dispatch('GetInfo').then(() => { // 拉取user_info
					next()
//					const menus = {}
//					for(let i = 0; i < info.menus.length; i++) {
//						menus[info.menus[i].code] = true
//					}
//					store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
//						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//						next({ ...to,
//							replace: true
//						}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//					})
				}).catch(() => {
					store.dispatch('FedLogOut').then(() => {
						next({
							path: '/login'
						})
					})
				})
			} else {
				next()
			}
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			next('/login')
			NProgress.done()
		}
	}
})

router.afterEach(() => {
	NProgress.done() // 结束Progress
})