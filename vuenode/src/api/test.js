/**
 * Created by laowai on 2018/06/11.
 */
import RequestService from '@/utils/request'

export function getList(params) {
	return RequestService.request({
		url: '/test/list',
		method: 'post',
		params
	})
}

export function getById(id) {
	return RequestService.request({
		url: '/test/getById',
		method: 'get',
		params: {
			id
		}
	})
}

export function getReadCount(num) {
	return RequestService.request({
		url: '/test/getReadCount',
		method: 'get',
		params: {
			num
		}
	})
}

export function add(data) {
	return RequestService.request({
		url: '/test/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return RequestService.request({
		url: '/test/update',
		method: 'post',
		data
	})
}

export function getTreeData() {
	return RequestService.request({
		url: '/test/tree',
		method: 'post'
	})
}