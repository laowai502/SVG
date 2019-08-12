import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CouponService } from '../../../../../service/CouponService';
import { CommonProvider } from '../../../../../providers/common';

@IonicPage()
@Component({
	selector: 'page-coupon-detail',
	templateUrl: 'coupon-detail.html',
})
export class CouponDetailPage {
	couponData: any = [];
	queryCoupon: any = {
		stationId: '',
		activityId: '',
		state: '',
		stationType: ''
	};
	subTitle: string = '兑换记录';
	flag: boolean = false;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		private couponService: CouponService, 
		private commonProvider: CommonProvider) {
		
	}
	ngOnInit(): void {
		this.queryCoupon.stationId = this.navParams.get('stationId');
		this.queryCoupon.activityId = this.navParams.get('activityId');
		this.queryCoupon.state = this.navParams.get('state');
		this.queryCoupon.stationType = this.navParams.get('stationType');
		let flag = this.navParams.get('flag');
		if(flag == '1') {
			this.subTitle = '发放记录';
			this.flag = true;
			this.getGrantCouponsDetail();
		}else{
			this.flag = false;
			this.getExchangeCouponsDetail();
		}
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad CouponDetailPage');
	}

	//获取发放信息详情
	private getGrantCouponsDetail() {
		this.couponService.queryGrantInfo(this.queryCoupon)
		.then(data => {
			if(data) {
				this.couponData[0] = data;
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}
	//获取兑换信息详情
	private getExchangeCouponsDetail() {
		this.couponService.queryExchangeInfo(this.queryCoupon)
		.then(data => {
			if(data) {
				this.couponData[0]= data;
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}
	//跳转到记录页面
	public toRecord() {
		this.navCtrl.push('CouponRecordPage', {activityId: this.queryCoupon.activityId, stationId: this.queryCoupon.stationId,flag: this.flag});
	}
}
