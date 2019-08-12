import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CouponService } from '../../../../service/CouponService'

@IonicPage()
@Component({
	selector: 'page-handle-coupon',
	templateUrl: 'handle-coupon.html',
	providers: [CouponService]
})
export class HandleCouponPage {

	title:string = '';
	pageAttr:any;

	constructor(private navCtrl: NavController, private navParams: NavParams,
				private coupon: CouponService) {
		this.pageAttr = navParams.data;
		this.title = (this.pageAttr.type === '1' || this.pageAttr.type === '3') ? '发券' : '兑换';
	}

	ionViewDidLoad() {
		
	}

}