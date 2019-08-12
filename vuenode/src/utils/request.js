import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import { purifyObject, purifyObjectPost, dealParams } from '@/utils'
import { Message, MessageBox, Notification } from 'element-ui'
import Crypto from 'crypto.js'

const BASE_URL = process.env.BASE_API
const MIDDLE_API = process.env.MIDDLE_API

const key = 'lao@wai_!643399Z7dwWEAC' //密钥

const makeUrl = url => /^(http|https):\/\//.test(url) ? url : (BASE_URL + url)

const service = axios.create({
//	'headers': 'XMLHttpRequest',
	'timeout': 10000
})

service.interceptors.request.use(config => {
	if (config.url.startsWith(BASE_URL)) {
		if (store.getters.token) {
			config.headers.Authorization = getToken()
		} else {
			config.headers.Authorization = 'Basic dnVlOnZ1ZQ=='
		}
	} else if (config.url.startsWith(MIDDLE_API)) {
        //中间件接口处理
        const middlePath = config.url.replace(MIDDLE_API, '')
		config.url = MIDDLE_API + Crypto.cipher('aes-128-cbc', middlePath, key, 'utf8', 'hex')
        if (config.method.toLowerCase() === 'get') {
            const getQuery = dealParams(config.params)
            config.url = config.url + '?GET_QUERY=' + Crypto.cipher('aes-128-cbc', getQuery, key, 'utf8', 'hex')
            config.params = undefined
        }else if(config.method.toLowerCase() === 'post') {
            const postQuery = dealParams(config.data)
            config.data = '{"POST_QUERY":"' + Crypto.cipher('aes-128-cbc', postQuery, key, 'utf8', 'hex') + '"}'
        }
    }
	return config
}, error => {
	Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
	response => {
		const res = response
		if (res.status !== 200) {
			Message({
				message: res.message,
				type: 'error',
				duration: 5 * 1000
			})
			if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
				MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
					confirmButtonText: '重新登录',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					store.dispatch('FedLogOut').then(() => {
						location.reload() // 为了重新实例化vue-router对象 避免bug
					})
				})
			}
			return Promise.reject('error')
		} else {
			return response.data.data
		}
	},
	error => {
		const response = error.response
		if (!response) {
			Message({
				message: '服务请求超时！',
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(error)
		}
		if (response.status === 400) {
			Message({
				message: '账户或密码错误！',
				type: 'warning'
			})
			return Promise.reject('error')
		}
		const info = response.data
		if (response.status === 401 && info.status === 40101) {
			MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
				confirmButtonText: '重新登录',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				store.dispatch('LogOut').then(() => {
					location.reload() // 为了重新实例化vue-router对象 避免bug
				})
			})
		}
//		if (response.status === 401 && info.status === 40001) {
//			Notification.warning({
//				title: '禁止',
//				message: info.message,
//				type: 'error',
//				duration: 2 * 1000
//			})
//			return Promise.reject('error')
//		}
		if (response.status === 403) {
			Notification.warning({
				title: '禁止',
				message: info.message,
				type: 'error',
				duration: 2 * 1000
			})
			return Promise.reject('error')
		}
		if (info.status === 30101) {
			Notification.warning({
				title: '失败',
				message: info.message,
				type: 'error',
				duration: 2 * 1000
			})
			return Promise.reject('error')
		}
		if (response.status === 504) {
			Message({
				message: '后端服务异常，请联系管理员！',
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(error)
		}
		Message({
			message: info.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

const RequestService = {
	post: (url, data, isUpload = false, opts) => {
		const options = {
			method: 'post',
			url: makeUrl(url),
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}
		if (!isUpload) {
			options.data = purifyObjectPost(data)
		} else {
			options.headers = {
				'Content-Type': 'multipart/form-data'
			}
		}
		return service(options)
	},
	get: (url, params) => {
		params = purifyObject(params)
		return service({
			method: 'get',
			url: makeUrl(url),
			params
		})
	},
	put: (url, data) => {
		const options = {
			method: 'put',
			url: makeUrl(url),
			data,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}
		options.data = purifyObjectPost(data)
		return service(options)
	},
	request: opts => {
		opts.url = makeUrl(opts.url)
		return service(opts)
	}
}

export default RequestService
