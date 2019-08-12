import { Pipe, PipeTransform } from '@angular/core';
import { Jsonp } from '@angular/http';
import ServerConfig  from '../../constants/serviceConfig';

import 'rxjs/add/operator/map';

@Pipe({
	name: 'address',
	pure: false
})
export class AddressPipe implements PipeTransform {

	private cachedUrl = '';
	private cachedData: any = null;

	constructor(private jsonp: Jsonp) {}
	/**
	 * 
	 * @param value 纬度
	 * @param lng 经度
	 */
	transform(value: string, lng: string): any {
		let params = ServerConfig.baidu_reserve +'&output=json&location=' +value+','+lng+'&coordtype=gcj02ll&callback=JSONP_CALLBACK';
		
		if(params !== this.cachedUrl){
			this.cachedData = null;
      		this.cachedUrl = params;
			this.jsonp.request(params)
			.map(result => result.json())
			.subscribe(result => this.cachedData = result);
		}
		return this.cachedData;
	}
}