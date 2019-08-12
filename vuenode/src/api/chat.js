import RequestService from '@/utils/request'

const makeUrl = url => process.env.MIDDLE_API + url

export function chatLogin(username, password) {
	const data = {
		username: username,
		password: password
	}
	return RequestService.post(makeUrl('chat/login'), data)
}
export function chatLogout(userId) {
	const data = {
		userId: userId
	}
	return RequestService.post(makeUrl('chat/logout'), data)
}
export function getUserInfo(userId) {
	const data = {
		userId: userId
	}
	return RequestService.get(makeUrl('chat/getUserInfo'), data)
}

