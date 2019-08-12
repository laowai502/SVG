import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';
/**
 * 附近车辆有关的接口
 */
@Injectable()
export class NearbyCarService {

	constructor(private fetchService: FetchService) {}
	/**
	 * 服务站附近车辆
	 */
	public getsurroundCar(distance) :any{
		return this.fetchService.postBody('/nearByCarList', {
            distance: distance
        });
	}
    /**
     * 车辆详情
     */
	public carInfo(carId) :any{
		return this.fetchService.postBody('/getNearByCarInfo', {
            carId: carId
        })
	}
	
}