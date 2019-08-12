import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';

import { FetchService } from './FetchService';

import ServerConfig  from '../constants/serviceConfig';

import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
	
	constructor(private jsonp: Jsonp, private fetch: FetchService){}
	
	public reverseAddress(location:any) :any {
		let loc = null;
		if(location){
			loc = [location.split(',')[1],location.split(',')[0]];
		}
		return this.jsonp.request(ServerConfig.baidu_reserve+'&output=json&location='+loc+'&coordtype=gcj02ll&callback=JSONP_CALLBACK')
			.map(result => result.json());	
	}
	
	public getBaseData(type, code) :any {
		return this.fetch.postBody('/common/basedata', 
			{
				type: type,
				code: code
			}
		);
	}
}