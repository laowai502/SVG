import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

@Injectable()
export class CouponService {
	
	constructor(private fetchService: FetchService){}
	
	/**
	 * 兑换扫码
	 */
	public exchangeScanCode(stId:string, code:string) :Promise<any> {
		return this.fetchService.postBody('/coupon/exchangeScanCode', {
			consumerCode: code,
			stationId: stId,
			stationType: '2'
		});
	}
	/**
	 * 发放扫码
	 */
	public grantScanCode(stId:string, vin:string) :Promise<any> {
		return this.fetchService.postBody('/coupon/grantScanCode', {
			vin: vin,
			stationId: stId,
			stationType: '2'
		});
	}
	/**
	 * 发券列表接口
	 * @param query 
	 */
	public queryGrantList(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryGrantList', query);
	}
	/**
	 * 兑券列表接口
	 * @param query 
	 */
	public queryExchangeList(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryExchangeList', query);
	}
	/**
	 * 发券信息详情
	 * @param query 
	 */
	public queryGrantInfo(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryGrantInfo', query);
	}
	/**
	 * 兑券信息详情
	 * @param query 
	 */
	public queryExchangeInfo(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryExchangeInfo', query);
	}
	/**
	 * 兑券记录
	 * @param query 
	 */
	public queryExchangeRecord(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryExchangeStationRecordList', query);
	}
	/**
	 * 发放记录
	 * @param query 
	 */
	public queryGrantRecord(query:any) :Promise<any> {
		return this.fetchService.postBody('/coupon/queryGrantStationRecordList', query);
	}
	
}
