import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';
/**
 * 所有和工单有关的接口
 */
@Injectable()
export class OrderService {

	constructor(private fetchService: FetchService) {}

/*****************************************************历史工单********************************************************************/
	
	/*
	 * 获取工单列表
	 */
	public getHistoryList(query) :any{
		return this.fetchService.postBody('/hisOrderList',query);
	}
	/*
	 * 获取工单列表
	 */
	public getQueryJobList(obj) :any {
		return this.fetchService.postBody('/queryJobList', obj);
	}
	/*
	 * 工单详情
	 */
	public getOrderDetail(woCode: string) :any {
		return this.fetchService.postBody('/getOrderDetail',
			{
				woCode: woCode
			}
		)
	}
	/*
	 * 服务流程记录
	 */
	public operateRecord(woCode: string) :any {
		return this.fetchService.postBody('/woOperateRecord',
			{
				woCode: woCode
			}
		)
	}
	/*
	 * 获取车辆信息
	 */
	public getCarDetail(vin: string) :any {
		return this.fetchService.postBody('/carDetail',
			{
				carId: vin
			}
		)
	}
	/*
	 * 维修历史
	 */
	public getReHistory(obj) :any {
		return this.fetchService.postBody('/repairHis', obj);
	}
	
/*************************************************************新建工单*********************************************************/

	/**
	 * 保养/维修项目项目
	 * type: 1保养，2维修
	 */
	public getOrders(type:string) :any{
		return this.fetchService.postBody('/queryCommonParamList', {
			type: type
		})
	}
	/**
	 * 获取指派人员
	 * @param stationId 服务站ID
	 */
	public getAssigners(stationId:string) :any{
		return this.fetchService.postBody('/stationServiceAccountList', {
			stationId: stationId
		})
	}
	/**
	 * 提交工单
	 * @param query 提交的参数 
	 */
	public pushOrderData(query) :any {
		return this.fetchService.postBody('/woAdd', query)
	}
	
//==================工单流程-start=========================================//

	/*
	 * 确认接单
	 */
	public confirmOrder(obj) :any {
		return this.fetchService.postBody('/takeOrder', obj);
	};
	/*
	 * 外出救援出发
	 */
	public setOutRepair(obj) :any {
		return this.fetchService.postBody('/setOutRepair', obj);
	}
	/*
	 * 检查开始维修
	 */
	public startRepair(obj) :any {
		return this.fetchService.postBody('/startRepair', obj);
	}
	/*
	 * 增加维修项
	 */
	public secRepair(obj) :any {
		return this.fetchService.postBody('/secRepair', obj);
	}
	/*
	 * 维修结束
	 */
	public repairComplete(obj) :any {
		return this.fetchService.postBody('/repairComplete', obj);
	}
	/*
	 * 二次外出接口
	 */
	public secOutRepair(obj) :any {
		return this.fetchService.postBody('/secOutRepair', obj);
	}
	/*
	 * 扫码接口
	 */
	public vinInput(obj) :Promise<any> {
		return this.fetchService.postBody('/vinInput', obj);
	}
	/*
	 * 确认接车
	 */
	public recComCar(obj) :Promise<any> {
		return this.fetchService.postBody('/recComCar', obj);
	}
	
//==================工单流程-end===========================================//

}