import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

@Injectable()
export class HomeService {
	
	constructor(private fetch: FetchService){}
	
	public queryStationInfo() :any {
		return this.fetch.postBody('/queryStationInfo');
	}
	
	public countWithStatus(type:string) :any {
		return this.fetch.postBody('/countWithStatus', 
			{ type: type }
		)
	}
	
	public orderAnalyse(cycleType:string, stationId:string) :any {
		return this.fetch.postBody('/orderAnalyse', {
			cycleType: cycleType,
			stationId: stationId
		})
	}
	
	public acceptOrder(id:string) :any {
		return this.fetch.postBody('/stationToAcceptOrderCnt', {
			serviceStationId: id
		})
	}
	
}