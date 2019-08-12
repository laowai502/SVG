import { Injectable } from '@angular/core';
import { Platform, ToastController, LoadingController, AlertController} from 'ionic-angular';

import ServerConfig from '../constants/serviceConfig';

import { Network } from '@ionic-native/network';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

declare let cordovaQcScan;

@Injectable()
export class CommonProvider {

	constructor(
		public platform: Platform, public loadCtl: LoadingController, 
		public toastCtrl: ToastController, public alertCtrl: AlertController,
		public network: Network, public transfer: FileTransfer) {}

	/**
	 * 是否真机环境
	 */
	public isMobile(): boolean {
		return this.platform.is('mobile') && !this.platform.is('mobileweb');
	}
	/**
	 * 是否android真机环境
	 */
	public isAndroid(): boolean {
		return this.isMobile() && this.platform.is('android');
	}
	/**
	 * 是否ios真机环境
	 */
	public isIos(): boolean {
		return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
	}
	public isWeb(): boolean {
		return this.platform.is('mobileweb');
	}
	/**
	 * 
	 * @param str loading内容
	 */
	public createLoading(str?:string) {
		let loader;
		loader = this.loadCtl.create({
			content: str ? str : '',
			dismissOnPageChange: true
		});
		return loader;
	}
	public presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 1500
		});
		toast.present();
	}
	public httpToast(msg:string,time?:number): void {
		this.toastCtrl.create({
			message: msg,
			cssClass: 'httpToast',
			duration: time || 1000
		}).present();
	}
	public alert(t?:string, msg?:string, btn?:any, cssClass?:string): void {
		this.alertCtrl.create({title: t, message: msg, buttons: btn || ['确定'], cssClass: cssClass || 'service-fail'}).present();
	}
	/**
	 * 添加类名
	 * @param ele 元素 
	 * @param attr 要添加的类名
	 */
	public addClass(ele:any, attr:string): void {
		let attrAry = [];
		let curClass = ele.className;
		if(curClass) {
			attrAry.push(curClass);
		}
		if(attr) {
			attrAry.push(attr);
		}
		let newClass = attrAry.join(' ');
		ele.className = newClass;
	}
	/**
	 * 移除类名
	 * @param ele 元素 
	 * @param attr 要移除的类名
	 */
	public removeClass(ele:any, attr:string): void {
		let attrAry = [];
		let curClass = ele.className;
		let newClass;
		if(curClass) {
			attrAry = curClass.split(' ');
		}
		if(attr) {
			let index = attrAry.indexOf(attr);
			if(index != -1) {
				attrAry.splice(index,1);
				newClass = attrAry.join(' ');
			}else{
				newClass = curClass;
			}
		}
		ele.className = newClass;
	}
	/**
	 * 获取字符串的长度，汉字是两个字符长度
	 * @param attr 输入的字符串
	 */
	public getStrLength(attr:string) {
		let reg = /[^\x00-\xff]/,
			lan = attr.length,
			ary = attr.split('');
		if(ary.length!=0){
			for(let i=0;i<ary.length;i++) {
				if(reg.test(ary[i])) {
					lan = lan+1;
				}
			}
		}
		return lan;
	}
	/**
	 * 扫码接车cordova插件
	 */
	public recvCar(suc, arg){
		if(this.isMobile()){
			cordovaQcScan.scan(suc, () => {
				this.httpToast('扫描错误,请重新扫码');
			}, arg);
		}else{
			this.httpToast('使用真机或虚拟机');
		}
	}
	/*
	 * 网络监控
	 */
	public onDisconnect() :void {
		this.network.onDisconnect().subscribe(() => {
			let ele = document.querySelector('.network-toast');
			if(!ele){
				this.toastCtrl.create({
					message: '未检测到网络,请连接网络',
	                showCloseButton: true,
	                closeButtonText: '确定',
	                cssClass:'network-toast'
				}).present();
			}
		});
		this.network.onConnect().subscribe(() => {
			console.info('网络已连接, 照片该补传补传, 位置该上报上报');
		});
	}
	/*
	 * 文件服务器上传
	 */
	public uploadFile(url?:any, opts?:any) :Promise<any> {
		const fileTransfer: FileTransferObject = this.transfer.create();
		return new Promise((resolve, reject) => {			
			fileTransfer.upload(url, ServerConfig.uploadUrl, opts).then((data:any) => {
				if(data && data.response){		
					resolve(JSON.parse(data.response));
				}else{
					reject();
				}
			}).catch(err => {
				//网络异常,存储数据,用于图片补传
				reject();
			});
		});
	}
}