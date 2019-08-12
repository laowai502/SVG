import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { MineService } from '../../service/MineService';
import { LoginService } from '../../service/LoginService';
import { CommonProvider } from '../../providers/common';

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
	providers: [MineService, LoginService]
})
export class SettingPage {
	
	serviceData: any = {};
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public mineService: MineService, public app: App,
		public loginService: LoginService, 
		public commonProvider: CommonProvider) {
		this.onInit();
	}

	private onInit(): void {
		this.loginService.getInfo('stationInfo').then((data) => {
			if (data) {
				this.serviceData = data;
			}
		});
	}
	myCoupon(): void {
		this.navCtrl.push('CouponPage');
	}
	update(): void {
		return;
	}
	//个人信息
	editPersonalData(item): void {
		this.navCtrl.push('PersonalDataPage');
	}
	//退出登录
	logout() {
		this.loginService.logout().then(data => {
			this.loginService.delLoginInfo();
			this.app.getRootNav().setRoot('LoginPage', null, {animate: true, animation: 'ios-transition' , direction: 'back'});
		}).catch(err => {
			this.commonProvider.presentToast(err.message);
		});
	}
}
