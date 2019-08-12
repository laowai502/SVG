import RequestService from '@/utils/request'

export default {
	getCount: () => RequestService.get('/getCount'),
	getLineCount: () => RequestService.get('/getLineCount'),
	getBarCount: () => RequestService.get('/getBarCount'),
	getPieCount: () => RequestService.get('/getPieCount')
}
