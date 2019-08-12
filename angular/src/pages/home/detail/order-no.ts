import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { DealService } from '../../../service/DealService';

@Component({
	selector: 'order-no',
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>拒绝接单</ion-title>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<ion-row>
				<ion-col col-12>
					<textarea maxlength="100" [(ngModel)]="row.refuseReason" (ngModelChange)="textChange()"
						  	  placeholder="请输入拒绝理由"></textarea>
					<span [ngClass]="{'show-orange': (amount==100)}">{{amount}}/100</span>
				</ion-col>
				<ion-col col-12>
					<button ion-button block (click)="ok()">提 交</button>
				</ion-col>
			</ion-row>
		</ion-content>
	`
})
export class OrderNoPage {
	
	amount: number = 0;
	row: any = {
		refuseReason: '',
		opPos: ''
	};
	
	constructor(private navParams: NavParams, public navCtrl: NavController,
				private deal: DealService, private common: CommonProvider,
				public bMap: BaiduMapProvider) {
		this.row.woCode = navParams.data.woCode;
	}
	
	textChange(){
		this.amount = this.row.refuseReason.length;
	}
	
	ok(){
		if(this.row.refuseReason.length < 5){
			this.common.httpToast('拒绝理由最少不少于五个字');
			return;
		}
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude), 
				loading = this.common.createLoading();
			loading.present();
			this.row.opPos = point.lng +','+ point.lat;
			this.deal.reOrder(this.row).then(() => {
				loading.dismiss();
				this.common.alert('提交成功', '已提交成功，请关注审核结果！');
				this.navCtrl.push('OrderListPage', this.navParams.data).then(() => {
					this.navCtrl.remove(1, this.navCtrl.length()-2);
				});
			}).catch(err => {
				loading.dismiss();
				this.common.alert('提交失败', err.message);
			});
		});
	}
	
}