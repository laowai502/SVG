import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import ServerConfig from '../constants/serviceConfig';
import ResultCode from '../constants/resultCode';

import { CommonProvider } from '../providers/common';
import { StorgeProvider } from '../providers/storge';

import { AuthService } from './AuthService';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FetchService {

	public serviceUrl;
	public resultCode;
	private logSuc: boolean = true;
	private token: string;

	constructor(private http: Http, private common: CommonProvider, 
				private auth: AuthService, private app: App,
				private storge: StorgeProvider) {
		this.serviceUrl = common.isMobile() ? ServerConfig.SERVICE_PATH : ServerConfig.LOCAL_SERVICE_PATH;
		this.resultCode = ResultCode;
	}

	public get(url: string, params ? : any): any {
		return this.http.get(this.makeUrl(url) + this.toQueryString(params, 'get'), new RequestOptions({
				headers: this.setHeaders()
			}))
			.toPromise()
			.then(res => this.handleSuccess(res.json()))
			.catch(res => this.handleError(res));
	}
	public getJSON(url: string, params ? : any): any {
		return this.http.get(url + this.toQueryString(params, 'get'), new RequestOptions({
				headers: this.setHeaders()
			}))
			.toPromise()
			.then(res => this.handleSuccess(res.json()))
			.catch(res => this.handleError(res));
	}
	public post(url: string, params ? : any) {
		return this.http.post(this.makeUrl(url), this.toQueryString(params, 'post'), new RequestOptions({
				headers: this.setHeaders('post')
			}))
			.toPromise()
			.then(res => this.handleSuccess(res.json()))
			.catch(res => this.handleError(res));
	}
	public postBody(url: string, params ? : any) {
		return this.http.post(this.makeUrl(url), this.setToken(params), new RequestOptions({
				headers: this.setHeaders('postBody')
			}))
			.toPromise()
			.then(res => this.handleSuccess(res.json()))
			.catch(error => this.handleError(error));
	}

	private handleSuccess(res) {
		//todo
		return new Promise((resolve, reject) => {
			if(res.resultCode == 200) {
				resolve(res.data);
			} else if(res.resultCode == 509) { //登入状态异常
				reject(res);
			} else {
				reject(res);
			}
		})
	}
	private handleError(err: Response | any) {
		let msg = '请求失败';
		if(err.message){	//业务错误
			if(err.resultCode === this.resultCode.LOGIN_FAIL){
				this.loginFail();
			}else{				
				throw(err);
			}
		}else{		
			let toast = document.querySelectorAll('.toast-ios') || [];
			switch(err.status) {
				case this.resultCode.NO_FOUND:
					msg = '资源路径无效';
					break;
				case this.resultCode.SEVER_ERROR:
					msg = '系统错误';
					break;
				case this.resultCode.PARAMS_ERROR:
					msg = '无效的请求';
					break;
				case this.resultCode.FORBIDDEN:
					msg = '被禁止访问';
					break;
				case this.resultCode.NOT_ALLOWED:
					msg = '方法被禁用';
					break;
				case this.resultCode.AUTH_ERROR:
					msg = '未授权,请联系管理员';
					break;
				default:
					msg = '网络或服务器异常';
			}
			if(toast.length === 0){				
				this.common.httpToast(msg);
			}
		}
	}

	/*
	 * pinning 参数
	 * eg: let obj= {'name':'汉字', age:23} => toQueryString(obj) => "?name=%E5%B0%8F%E5%86%9B&age=23"
	 */
	private toQueryString(obj, type) {
		let ret = [];
		for(let key in obj) {
			key = encodeURIComponent(key);
			let values = obj[key];
			if(values && values.constructor == Array) {
				let queryValues = [];
				for(let i = 0, len = values.length, value; i < len; i++) {
					value = values[i];
					queryValues.push(this.toQueryPair(key, value));
				}
				ret = ret.concat(queryValues);
			} else {
				ret.push(this.toQueryPair(key, values));
			}
		}
		return type == 'post' ? ret.join('&') : '?' + ret.join('&');
	}

	private toQueryPair(key, value) {
		if(typeof value == 'undefined') {
			return key;
		}
		return key + '=' + encodeURIComponent(value === null ? '' : String(value));
	}
	/*
	 * 处理url,根据路径判断哪些接口需要token
	 */
	private makeUrl(str: string) {
		let url = /^(http|https):\/\//.test(str) ? str : (this.serviceUrl + str);
		if(url.startsWith(this.serviceUrl) && str.indexOf('login') === -1) {
			this.token = this.auth.getToken();
		} else {
			this.logSuc = true;
			this.token = null;
		}
		return url;
	}
	/*
	 * 设置header
	 */
	private setHeaders(type?) {
		let headers = new Headers({
			"Accept": "application/json"
		});
		if(type === 'post') {
			headers.set('Content-Type', 'application/x-www-form-urlencoded');
		} else {
			headers.set('Content-Type', 'application/json;charset=utf-8');
		}
		return headers;
	}
	/*
	 * 设置token
	 */
	private setToken(opts?) {
		if(this.token) {
			if(opts) {
				opts['token'] = this.token;
			} else {
				opts = {
					token: this.token
				};
			}
		}
		return opts;
	}
	/**
	 * 登入异常
	 */
	private loginFail(){
		if(this.logSuc){
			this.logSuc = false;
			this.common.httpToast('登入异常, 请重新登入', 2000);
			this.storge.removeStorage('userInfo');
			setTimeout(() => {
				this.app.getRootNav().setRoot('LoginPage', null, {animate: true, animation: 'ios-transition' , direction: 'back'});
			}, 300);
		}
	}
}