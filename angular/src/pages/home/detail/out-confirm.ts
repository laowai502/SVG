import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../service/OrderService';

@Component({
	selector: 'out-confirm',
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>救援人员信息</ion-title>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<ion-row>
				<ion-col col-12>
					<ion-input type="text" placeholder="请填写外出人员姓名" [(ngModel)]="row.outRescueName" clearInput></ion-input>
				</ion-col>
				<ion-col col-12>
					<ion-input type="tel"  placeholder="请填写外出人员手机" [(ngModel)]="row.outRescuePhone" clearInput></ion-input>
				</ion-col>
				<ion-col col-12>
					<button ion-button block (click)="commit()">提 交</button>
				</ion-col>
			</ion-row>
		</ion-content>
	`
})
export class OutConfirmPage {
	
	row: any = {
		outRescueName: '',
		outRescuePhone: ''
	};
	
	constructor(public order: OrderService, public navParams: NavParams,
				public navCtrl: NavController, public common: CommonProvider,
				public bMap: BaiduMapProvider) {
		this.row.woCode = navParams.data.woCode;
	}

	commit(){
		let routeParam = Object.assign({}, this.navParams.data);
		routeParam.status = '3';
		routeParam.statusName = '待接车';
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude),
				loading = this.common.createLoading();
			this.row.phoneLon = point.lng;
			this.row.phoneLat = point.lat;
			loading.present();
			this.order.setOutRepair(this.row).then(data => {
				loading.dismiss();
				this.common.alert('提交成功', '距离故障地点【'+data.distance+'】km,预计【'+data.arriveTime+'】到达', ['确定']);
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