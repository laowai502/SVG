import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import Vue from 'vue'

const TOKEN_PREFIX = 'Bearer ' //token访问前缀，区分访问终端

const user = {
	state: {
		token: getToken(),
		name: '',
		avatar: '',
		roles: '',
		menus: undefined,
    	elemnts: undefined,
    	permissionMenus: undefined
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, name) => {
			state.name = name
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
		},
		SET_MENUS: (state, menus) => {
			state.menus = menus
		},
		SET_ELEMENTS: (state, elements) => {
			state.elements = elements
		},
		SET_PERMISSION_MENUS: (state, permissionMenus) => {
			state.permissionMenus = permissionMenus
		}
	},

	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			const username = userInfo.username.trim()
			return new Promise((resolve, reject) => {
				login(username, userInfo.password).then(response => {
					const data = response
					if (data.access_token === '' || !data.access_token) {
						Message({ message: '账户或密码错误！', type: 'error' })
						return Promise.reject('error')
					} else {
						const token = TOKEN_PREFIX + data.access_token
						setToken(token)
						commit('SET_TOKEN', token)
						commit('SET_ROLES', data.isSuperAdmin)
						resolve()
					}
				}).catch(error => {
					Message({ message: '账户或密码错误！', type: 'error' })
					reject(error)
				})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				getInfo().then(response => {
					const data = response
					commit('SET_NAME', data.username)
					commit('SET_AVATAR', data.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
//			        for (let i = 0; i < data.menus.length; i++) {
//			            menus[data.menus[i].code] = true
//			        }
			        commit('SET_MENUS', data.menus)
//			        for (let i = 0; i < data.elements.length; i++) {
//			            elements[data.elements[i].code] = true
//			        }
			        commit('SET_ELEMENTS', data.elements)
			        Vue.prototype.USER_INFO = data
					resolve(response)
				}).catch(error => {
					reject(error)
				})
//				getMenus().then(response => {
//					commit('SET_PERMISSION_MENUS', response.data)
//				})
			})
		},

		// 登出
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				const token = state.token
				commit('SET_TOKEN', '')
				logout(token).then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', '')
					commit('SET_MENUS', undefined)
					commit('SET_ELEMENTS', undefined)
					Vue.prototype.USER_INFO = {}
//					commit('SET_PERMISSION_MENUS', undefined)
					removeToken()
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 前端 登出
		FedLogOut({
			commit
		}) {
			return new Promise(resolve => {
				commit('SET_TOKEN', '')
		        commit('SET_ROLES', '')
		        commit('SET_MENUS', undefined)
		        commit('SET_ELEMENTS', undefined)
		       	Vue.prototype.USER_INFO = {}
//		        commit('SET_PERMISSION_MENUS', undefined)
				removeToken()
				resolve()
			})
		}
	}
}

export default user