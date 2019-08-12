import RequestService from '@/utils/request'

export function login(username, password) {
	const data = {
		username,
		password,
		grant_type: 'password'
	}
	return RequestService.post('/auth/oauth/token', data)
}

export function logout(token) {
	return RequestService.request({
		url: '/auth/oauth/token',
		method: 'delete',
		data: {
			access_token: token
		}
	})
}

export function getInfo() {
	return RequestService.request({
		url: '/admin/user/front/info',
		method: 'get'
	})
}
//
//export function getMenus() {
//	return request({
//		url: '/admin/user/front/menus',
//		method: 'get'
//	})
//}
//
//export function getAllMenus() {
//	return request({
//		url: '/admin/user/front/menu/all',
//		method: 'get'
//	})
//}