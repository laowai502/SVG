import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserModel } from  '../../model/UserModel';

import { StorgeProvider } from '../../providers/storge';
import { BackProvider } from '../../providers/back';
import { CommonProvider } from '../../providers/common';

import { LoginService } from '../../service/LoginService';
import { AuthService } from '../../service/AuthService';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [LoginService]
})
export class LoginPage {
	
	private username: string = 'laowang';
	private password: string = 'Aa123456';
	
	constructor(private navCtrl: NavController, 
				private platform: Platform,
				private back: BackProvider,
				private common: CommonProvider,
				private storge: StorgeProvider,
				private auth: AuthService, 
				private loginService: LoginService,
				private splashScreen: SplashScreen) {
		this.platform.ready().then(() => {
	        this.back.registerBackButtonAction(null);
	        this.splashScreen.hide();
	   	}); 
	}
	ionViewDidLoad() {
		let elements = document.querySelectorAll(".tabbar");
		if (elements.length > 0) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'none';
			});
		} 
	}
	userlogin(username, password): void {
		let loading = this.common.createLoading(),
			data = {
				"userName": username,
				"password": password,
				"deviceId": "1",	//爱心推token
				"deviceType": this.common.isAndroid() ? "1" : "2"
			}
		loading.present();
		this.loginService.login(data).then(data => {
			loading.dismiss();
			if(data){				
				let user: UserModel = {
					serviceStationName: data.serviceStationName,
					serviceCode: data.serviceCode,
					accountId: data.accountId,
					accountName: data.accountName,
					phone: data.phone,
					address: data.address,
					roleCode: data.roleCode,
					deviceId: data.deviceId,
					token: data.token
				};
				this.auth.setToken(data.token);
				this.auth.setRoleCode(data.roleCode);
				this.storge.saveStorage('userInfo', user).then(() => {					
					this.navCtrl.setRoot('TabsPage', null, {animate: true, animation: 'ios-transition' , direction: 'forward'});
				});
			}
		}).catch(err => {
			loading.dismiss();
			this.common.alert('登入失败', err.message);
		});
	}


}