import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

@Injectable()
export class MineService {

	constructor(private fetchService: FetchService) {}

	public getServiceStation() {
		return this.fetchService.postBody('/queryStationInfo');
	}

	public changeInfo(query:{}) {
		return this.fetchService.postBody('/updateUserInfo', query)
	}
	public changePassword(query:{}) {
		return this.fetchService.postBody('/updatePassword', query)
	}
}