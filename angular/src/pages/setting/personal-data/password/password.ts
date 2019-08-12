import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../../providers/common';
import { MineService } from '../../../../service/MineService';

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
  providers: [MineService]
})
export class PasswordPage {
  oldTel: string = '';
  newTel: string = '';
  againNewTel: string = '';
  reg: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*`\(\)])[a-zA-Z~!@#$%^&*`]{6,}$/;
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonProvider: CommonProvider, public mineService: MineService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }
  submit() :void{
    this.oldTel = this.oldTel.trim();
    this.newTel = this.newTel.trim();
    this.againNewTel = this.againNewTel.trim();
    if(this.oldTel == '') {
		this.commonProvider.presentToast('请输入旧密码');
    }else{
		if(this.newTel == '') {
			this.commonProvider.presentToast('请输入新密码');
		}else{
			if(this.newTel != this.againNewTel) {
				this.commonProvider.presentToast('2次新密码输入不一致');
			}else{
				this.mineService.changePassword({oldPassword: this.oldTel, newPassword: this.newTel})
				.then(data => {
					this.navCtrl.pop();
				})
				.catch(err => {
					this.commonProvider.presentToast(err.message);
				})
			}
		}
	}
    
  }

}
