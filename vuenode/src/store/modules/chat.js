import { chatLogin, chatLogout } from '@/api/chat'
import { Message } from 'element-ui'
import io from 'socket.io-client'

const SOCKET_URL = process.env.SOCKET_URL

const chat = {
	state: {
        userList: [],
        userId: '',
        socket: null
	},
	mutations: {
        CONNECT_SOCKET: (state, user) => {
            state.socket = io.connect(SOCKET_URL)
            state.socket.emit('login', user)
            state.socket.on('userList', list => {
                console.log(list)
                state.userList = list
            })
        },
        DIS_CONNECT_SOCKET: (state, user) => {
            console.log(state)
            state.socket.emit('logout', user)
            state.socket.on('userList', list => {
                state.userList = list
            })
            state.socket.disconnect()
            state.socket = null
        }
	},

	actions: {
		// 登录
		chatLogin({ commit, state }, userInfo) {
			const username = userInfo.username.trim()
			return new Promise((resolve, reject) => {
				chatLogin(username, userInfo.password).then(response => {
                    const user = { username: username, userId: response.userId, status: true }
                    commit('CONNECT_SOCKET', user)
                    state.userId = response.userId
                    resolve()
				}).catch(error => {
					Message({ message: '账号或密码错误！', type: 'error' })
					reject(error)
				})
			})
		},
		// 登出
		chatLogout({ commit, state }, user) {
			return new Promise((resolve, reject) => {
				chatLogout(user.userId).then(() => {
                    console.log(user)
                    user.status = false
                    commit('DIS_CONNECT_SOCKET', user)
                    state.userId = ''
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
        }
	}
}

export default chat
