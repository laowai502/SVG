import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';

import 'rxjs/add/operator/map';

@Injectable()
export class BreakCodeService {
	
	constructor(private feth: FetchService){}
	
	public getCodeInfo(code: string) :any{
        return this.feth.postBody('/faultInfo',{
            faultCode: code
        })
    }
}