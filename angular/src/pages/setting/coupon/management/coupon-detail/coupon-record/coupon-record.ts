import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CouponService } from '../../../../../../service/CouponService';
import { CommonProvider } from '../../../../../../providers/common';

@IonicPage()
@Component({
	selector: 'page-coupon-record',
	templateUrl: 'coupon-record.html',
})
export class CouponRecordPage {
	queryRecord: any = {
		activityId: '',
		stationId: '',
		stationType: '2',
		page_size: '4',
		page_number: '1'
	};
	recordData: any = {};
	recordList = [1, 2, 3];
	flag: boolean = true;
	title: string = '兑换记录';
	loadeMore: boolean = true;
	loadEve: any = null;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private couponService: CouponService,
		private commonProvider: CommonProvider) {

	}
	ngOnInit(): void {
		this.queryRecord.stationId = this.navParams.get('stationId');
		this.queryRecord.activityId = this.navParams.get('activityId');
		let flag = this.navParams.get('flag');
		if (flag) {//发放
			this.title = '发放记录';
			this.flag = false;
			this.getGrantRecord(1);
		} else {//兑换
			this.getExchangeRecord(1);
		}
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad CouponRecordPage');
	}

	//获取兑换记录
	private getExchangeRecord(flag) {
		let loader = this.commonProvider.createLoading(null);
		this.loadeMore = true;
		if (flag == 1) {
			loader.present();
			this.queryRecord.page_number = 1;
		}
		return new Promise(resolve => {
			this.couponService.queryExchangeRecord(this.queryRecord)
				.then(data => {
					if (data) {
						loader.dismiss();
						if (data && data.list) {
							if (flag == 3) {
								if (data.list.length == 0) {
									this.loadeMore = false;
								} else {
									if (data.page_total <= this.queryRecord.page_number) {
										this.loadeMore = false;
									}
									this.recordList = this.recordList.concat(data.list);
								}
							} else {
								this.recordList = data.list;
							}
						} else {
							this.recordList = [];
						}
						this.recordData = data;
					}
					resolve();
				})
				.catch(err => {
					loader.dismiss();
					this.commonProvider.presentToast(err.message);
				})
		})
	}
	//获取发放记录
	private getGrantRecord(flag) {
		let loader = this.commonProvider.createLoading(null);
		this.loadeMore = true;
		if (flag == 1) {
			loader.present();
			this.queryRecord.page_number = 1;
		}
		return new Promise(resolve => {
			this.couponService.queryGrantRecord(this.queryRecord)
				.then(data => {
					if (data) {
						loader.dismiss();
						if (data && data.list) {
							if (flag == 3) {
								if (data.list.length == 0) {
									this.loadeMore = false;
								} else {
									if (data.page_total <= this.queryRecord.page_number) {
										this.loadeMore = false;
									}
									this.recordList = this.recordList.concat(data.list);
								}
							} else {
								this.recordList = data.list;
							}
						} else {
							this.recordList = [];
						}
						this.recordData = data;
					}
					resolve();
				})
				.catch(err => {
					loader.dismiss();
					this.commonProvider.presentToast(err.message);
				})
		})
	}
	//下拉刷新
	doRefresh(refresher) {
		this.queryRecord.page_number = 1;
		if (this.flag) {//兑换
			this.getExchangeRecord(2).then(() => {
				setTimeout(() => {
					refresher.complete();
					if (this.loadEve) this.loadEve.enable(this.loadeMore);
				}, 500);
			});
		} else {//发放
			this.getGrantRecord(2).then(() => {
				setTimeout(() => {
					refresher.complete();
					if (this.loadEve) this.loadEve.enable(this.loadeMore);
				}, 500);
			});
		}
	}
	//上拉获取
	doInfinite(infiniteScroll) {
		if (this.loadeMore) {
			this.queryRecord.page_number += 1;
			if (this.flag) {//兑换
				infiniteScroll.waitFor(this.getExchangeRecord(3));
			} else {//发放
				infiniteScroll.waitFor(this.getGrantRecord(3));
			}
		} else {
			this.commonProvider.httpToast('没有更多数据了...');
			infiniteScroll.enable(this.loadeMore);
			if (!this.loadEve) this.loadEve = infiniteScroll;
		}
	}
}
