import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

import 'rxjs/add/operator/map';

@Injectable()
export class CityService {
	
	constructor(private feth: FetchService){}
	
	public getCity(code: string) :any{
        return this.feth.postBody('/regionInfoByParentCode',{
            parentCode: code
        })
    }
}