import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../../providers/common';
import { MineService } from '../../../../service/MineService';
import { ChangeInfoProvider } from '../../../../providers/change-info/change-info';

@IonicPage()
@Component({
	selector: 'page-tel',
	templateUrl: 'tel.html',
	providers: [MineService, ChangeInfoProvider]
})
export class TelPage {
	tel: string = '';
	reg: RegExp = /^1[35784]\d{9}$/;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public commonProvider: CommonProvider,
		public mineService: MineService,
		public changeInfoProvider: ChangeInfoProvider) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TelPage');
	}
	submit(): void {
		this.tel = this.tel.trim();
		if (this.tel != '') {
			if (this.reg.test(this.tel)) {
				this.mineService.changeInfo({ phone: this.tel })
					.then(data => {
						this.changeInfoProvider.setInfo('userInfo', 'phone', this.tel);
						this.navCtrl.pop();
					})
					.catch(err => {
						this.commonProvider.presentToast(err.message);
					})
			} else {
				this.commonProvider.presentToast('手机号格式错误')
			}
		} else {
			this.commonProvider.presentToast('请填写预约人手机号')
		}
	}
}
