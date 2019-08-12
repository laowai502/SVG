import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

@Injectable()
export class DealService {

	constructor(private fetch: FetchService) {}
	/*
	 * 申请修改工单
	 */
	public changeOrder(obj) :any {
		return this.fetch.postBody('/applyChangeOrder', obj);
	}
	/*
	 * 申请关闭工单
	 */
	public closeOrder(obj) :any {
		return this.fetch.postBody('/applyCloseOrder', obj);
	}
	/*
	 * 拒绝接单
	 */
	public reOrder(obj) :any {
		return this.fetch.postBody('/refuseOrder', obj);
	}
}