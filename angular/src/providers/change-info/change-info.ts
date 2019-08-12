import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { StorgeProvider } from '../storge'
import 'rxjs/add/operator/map';

@Injectable()
export class ChangeInfoProvider {

	constructor(public http: Http, public storge: StorgeProvider) {
		console.log('Hello ChangeInfoProvider Provider');
	}
	/**
	 * 
	 * @param data 要获取的信息集合
	 * @param key 要设置的key
	 * @param value 要设置的value
	 */
	public setInfo(data: string, key: string, value: any): void {
		this.storge.getStorage(data)
		.then(infos => {
			if(infos && Object.prototype.toString.call(infos) == '[object Object]'){
				for(let attr in infos) {
					if(attr == key) {
						infos[attr] = value;
					}
				}
			}
			this.storge.saveStorage(data,infos);
		});
		
	}

}
