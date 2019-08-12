import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../../service/LoginService';

@IonicPage()
@Component({
	selector: 'page-personal-data',
	templateUrl: 'personal-data.html',
	providers: [LoginService]
})
export class PersonalDataPage {
	query: any = {};
	constructor(public navCtrl: NavController, public navParams: NavParams, public loginService: LoginService) {
		
	}
	ionViewWillEnter() {
		this.loginService.getInfo('userInfo')
		.then((data) => {
			if (data) {
				this.query = data;
			}
		});
	}
	editName(): void {
		this.navCtrl.push('NamePage')
	}
	editTel(): void {
		this.navCtrl.push('TelPage')
	}
	editPassword(): void {
		this.navCtrl.push('PasswordPage')
	}

}
