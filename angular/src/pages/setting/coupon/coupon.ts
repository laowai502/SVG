import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { StorgeProvider } from '../../../providers/storge';
import { CommonProvider } from '../../../providers/common';



@IonicPage()
@Component({
	selector: 'page-coupon',
	templateUrl: 'coupon.html'
})
export class CouponPage {
	
	stationId:string = '';
	
	constructor(public navCtrl: NavController, private common: CommonProvider,
				private storage: StorgeProvider) {}

	ionViewDidLoad() {
		this.storage.getStorage('stationInfo').then(data => {
			this.stationId = data.serverStationId;
		});
	}
	
	//type:2 兑券,1发券
	scanCoupons(type){
		this.common.recvCar((data) => {
			let pageType = null;
			if(data.type === 0){
				pageType = type === 2 ? '0' : '1';
			}else{
				pageType = type === 2 ? '2' : '3';
			}
			this.navCtrl.push('HandleCouponPage', {
				type: pageType,
				stationId: this.stationId
			});
		}, {type: type});
	}
	//兑换管理
	public exchangeManagement() {
		this.navCtrl.push('ManagementPage', 2);
	}
	//发放管理
	public grandManagement() {
		this.navCtrl.push('ManagementPage', 1);
	}

}
