import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../service/OrderService';

@Component({
	selector: 'out-second',
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>二次外出</ion-title>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<ion-row>
				<ion-col col-12>申请原因</ion-col>
				<ion-col col-12>
					<textarea maxlength="100" [(ngModel)]="row.content" (ngModelChange)="textChange()"
						  	  placeholder="请填写申请原因"></textarea>
					<span [ngClass]="{'show-orange': (amount==100)}">{{amount}}/100</span>
				</ion-col>
				<ion-col col-12>
					<button ion-button block (click)="commit()">提 交</button>
				</ion-col>
			</ion-row>
		</ion-content>
	`,
})
export class OutSecondPage {
	
	row: any = {
		content: ''
	};
	amount: number = 0;
	
	constructor(public order: OrderService, public navParams: NavParams,
				public navCtrl: NavController, public common: CommonProvider,
				public bMap: BaiduMapProvider) {
		this.row.woCode = navParams.data.woCode;
	}
	
	
	textChange(){
		this.amount = this.row.content.length;
	}
	
	commit(){
		if(this.row.content.length < 5){
			this.common.httpToast('申请原因最少不少于五个字');
			return;
		}
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude),
				routeParam = Object.assign({}, this.navParams.data),
				loading = this.common.createLoading();
			this.row.lon = point.lng;
			this.row.lat = point.lat;
			routeParam.status = '2';
			routeParam.statusName = '待出发';
			loading.present();
			this.order.setOutRepair(this.row).then(data => {
				loading.dismiss();
				this.common.alert('提交成功', '申请成功，请尽快出发');
				this.navCtrl.push('OrderListPage', routeParam).then(() => {
					this.navCtrl.remove(1, this.navCtrl.length()-2);
				});
			}).catch(err => {
				loading.dismiss();
				this.common.alert('提交失败', err.message);
			});
		});
	}
}