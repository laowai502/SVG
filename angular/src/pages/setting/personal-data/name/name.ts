import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../../providers/common';
import { MineService } from '../../../../service/MineService';
import { ChangeInfoProvider } from '../../../../providers/change-info/change-info';

@IonicPage()
@Component({
	selector: 'page-name',
	templateUrl: 'name.html',
	providers: [MineService, ChangeInfoProvider]
})
export class NamePage {
	name: string = '';
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public commonProvider: CommonProvider, 
		public mineService: MineService, 
		public changeInfoProvider: ChangeInfoProvider) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NamePage');
	}
	submit(): void {
		if (this.name != '') {
			this.mineService.changeInfo({ rName: this.name })
				.then(data => {
					this.changeInfoProvider.setInfo('userInfo','accountName',this.name);
					this.navCtrl.pop();
				})
				.catch(err => {
					this.commonProvider.presentToast(err.message);
				})
		} else {
			this.commonProvider.presentToast('请输入姓名');
		}
	}
}
