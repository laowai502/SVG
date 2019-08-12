import { Injectable } from '@angular/core';
import { FetchService } from './FetchService';
import { StorgeProvider } from '../providers/storge';

@Injectable()
export class LoginService {
	
	constructor(private fetch: FetchService, public storage: StorgeProvider){}
	
	public login(data):any{
		return this.fetch.postBody('/login', data);
	}
	public logout():any{
		return this.fetch.postBody('/logOut');
	}
	public delLoginInfo():any{
		return this.storage.cleanStorage();
	}
	public getInfo(data):any{
		return this.storage.getStorage(data);
	}
	
}
