import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BreakCodeService } from '../../../service/BreakCodeService';
import { CommonProvider } from '../../../providers/common';
import { CodePage } from './code-info';

@IonicPage()
@Component({
  	selector: 'page-break-code',
  	template: `
			<ion-header>
			<ion-navbar>
				<ion-title>故障码查询</ion-title>
			</ion-navbar>
			</ion-header>
			<ion-content padding>
			<ion-row>
				<input placeholder="请输入故障码" col-9 [(ngModel)]="faultCode" />
				<button ion-button color="primary" (tap)="searchCode()" col-2>查询</button>
			</ion-row>
			<p class="tip">故障码由SPN和FMI组成</p>
			</ion-content>`
})
export class BreakCodePage {
	faultCode: string = '';
  	constructor(
		  public navCtrl: NavController, 
		  public navParams: NavParams, 
		  private breakCodeService: BreakCodeService, 
		  private commonProvider: CommonProvider) {
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad BreakCodePage');
	}

	public searchCode() {
		if(this.faultCode != '') {
			this.breakCodeService.getCodeInfo(this.faultCode)
			.then(data => {
				if(!data.faltInfo) { data.faltInfo = '';}
				this.navCtrl.push(CodePage, data.faltInfo)
			})
			.catch(err => {
				this.commonProvider.presentToast(err.message);
			})
		}else{
			this.commonProvider.presentToast('请输入要搜索的故障码！');
		}
	}
}


