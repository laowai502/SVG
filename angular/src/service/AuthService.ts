import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
	
	private token: string;
	private code: string;
	
	constructor(){}
	
	public setToken(token){
    	this.token = token;
  	}

  	public getToken():string {
   		return this.token;
    }

	public setRoleCode(code){
		this.code = code;
	}
	
	public getRoleCode():string {
   		return this.code;
    }
}