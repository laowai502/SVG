import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TicketComponent } from '../../../../components/ticket/ticket';
import { CouponService } from '../../../../service/CouponService';
import { LoginService } from '../../../../service/LoginService';
import { CommonProvider } from '../../../../providers/common';
import moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-management',
	templateUrl: 'management.html',
})
export class ManagementPage {
	title: string = '兑换管理';
	couponState: any = [
		{ id: '0', name: '可兑换' },
		{ id: '1', name: '未开始' },
		{ id: '2', name: '兑换完' }
	];
	coupon: string = '0';
	recordPlaceholder: string = '兑换记录';
	records: any = [
		{ id: '0', name: '无兑换记录' },
		{ id: '1', name: '有兑换记录' }
	];
	activityDateRun: string = '';
	activityDateEnd: string = '';//活动创建日期
	activityDateList: any = [
		{ id: '0', name: '最近一个月' },
		{ id: '1', name: '最近三个月' },
		{ id: '2', name: '最近六个月' },
		{ id: '3', name: '最近一年' }
	];
	couponRun: any = [];//进行中
	couponUnstart: any = [];//未开始
	couponEnd: any = [];//已结束
	queryCouponRun: any = {
		stationId: '',
		state: '0',
		stationType: '2',
		page_size: '4',
		page_number: '1'
	}//传给后台的数据进行中
	queryCouponUnstart: any = {
		stationId: '',
		state: '1',
		stationType: '2',
		page_size: '4',
		page_number: '1'
	}//传给后台的数据未开始
	queryCouponEnd: any = {
		stationId: '',
		state: '2',
		stationType: '2',
		page_size: '4',
		page_number: '1'
	}//传给后台的数据已结束
	loadeMore: boolean = true;
	loadEve: any = null;
	@ViewChild(TicketComponent) ticket: TicketComponent;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public ele: ElementRef,
		private couponService: CouponService,
		private loginService: LoginService,
		private commonProvider: CommonProvider) {
		if (this.navParams.data) {
			if (this.navParams.data == 1) {
				this.title = '发券管理';
				this.couponState = [
					{ id: '0', name: '进行中' },
					{ id: '1', name: '未开始' },
					{ id: '2', name: '已结束' }
				];
				this.records = [
					{ id: '0', name: '无发放记录' },
					{ id: '1', name: '有发放记录' }
				]
				this.recordPlaceholder = '发放记录';

			}
		}
		this.loginService.getInfo('stationInfo')
			.then(data => {
				if (data) {
					this.queryCouponRun.stationId = data.serverStationId;
					this.queryCouponUnstart.stationId = data.serverStationId;
					this.queryCouponEnd.stationId = data.serverStationId;
					if (this.navParams.data) {
						if (navParams.data == 1) {//发放管理
							this.getGrantCoupons(this.queryCouponRun, 1);
						} else {//兑换管理
							this.getExchangeCoupons(this.queryCouponRun, 1);
						}
					}
				}
			})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ManagementPage');
	}
	//改变优惠券列表,未开始，结束三个tab页的数据，有数据时不进行查询
	public couponStateChanged(e) {
		switch (e.value) {
			case '0': if (this.couponRun.length == 0) {
				this.getTabData(this.queryCouponRun, 1);
			};
				break;
			case '1': if (this.couponUnstart.length == 0) {
				this.getTabData(this.queryCouponUnstart, 1);
			};
				break;
			case '2': if (this.couponEnd.length == 0) {
				this.getTabData(this.queryCouponEnd, 1);
			};
				break;
		}
	}
	//兑换/发放记录
	public changeStateList() {
		switch (this.coupon) {
			case '0': this.getTabData(this.queryCouponRun, 1);
				break;
			case '2': this.getTabData(this.queryCouponEnd, 1);
				break;
		}
	}
	//活动日期
	public changeActivityDate(data) {
		switch (this.coupon) {
			case '0': this.getDateRange(this.queryCouponRun, data);
				break;
			case '2': this.getDateRange(this.queryCouponEnd, data);
				break;
		}
	}
	//获得活动创建日期的区间
	private getDateRange(query, date) {
		switch (date) {
			case '0':
				query.createTimeStart = moment().subtract(1, "months").format("YYYY-MM-DD");
				query.createTimeEnd = moment().format('YYYY-MM-DD');
				break;
			case '1':
				query.createTimeStart = moment().subtract(3, "months").format("YYYY-MM-DD");
				query.createTimeEnd = moment().format('YYYY-MM-DD');
				break;
			case '2':
				query.createTimeStart = moment().subtract(6, "months").format("YYYY-MM-DD");
				query.createTimeEnd = moment().format('YYYY-MM-DD');
				break;
			case '3':
				query.createTimeStart = moment().subtract(1, "years").format("YYYY-MM-DD");
				query.createTimeEnd = moment().format('YYYY-MM-DD');
				break;
			default:
				date = date.split('至');
				query.createTimeStart = date[0];
				query.createTimeEnd = date[1];
		}
		this.getTabData(query, 1)
	}
	//查询优惠券列表数据
	private getTabData(data, flag) {
		if (this.navParams.data == 1) {
			this.getGrantCoupons(data, flag);
		} else {
			this.getExchangeCoupons(data, flag);
		}
	}
	
	/**
	 * 获取发放券列表
	 * @param query 查询数据
	 * @param flag 1查询和初始化，2刷新，3加载更多
	 */
	private getGrantCoupons(query, flag) {
		this.loadeMore = true;
		if (flag == 1) {
			let loader = this.commonProvider.createLoading(null);
			query.page_number = 1;
			loader.present()
			.then(() => {
				return new Promise(resolve => {
					this.couponService.queryGrantList(query)
						.then(data => {
							loader.dismiss();
							if (data) {
								data.list = (data.list && data.list.length != 0) ? data.list : [];
								this.bindData(data, flag);
							}
							resolve();
						})
						.catch(err => {
							loader.dismiss();
							this.bindData([], flag);
							this.commonProvider.presentToast(err.message);
						})
				})
			} );
		}else{
			return new Promise(resolve => {
				this.couponService.queryGrantList(query)
					.then(data => {
						if (data) {
							data.list = (data.list && data.list.length != 0) ? data.list : [];
							this.bindData(data, flag);
						}
						resolve();
					})
					.catch(err => {
						this.bindData([], flag);
						this.commonProvider.presentToast(err.message);
					})
			})
		}
		
	}
	/**
	 * 获取兑换券列表
	 * @param query 查询数据
	 * @param flag 1查询和初始化，2刷新，3加载更多
	 */
	private getExchangeCoupons(query, flag) {
		this.loadeMore = true;
		if (flag == 1) {
			let loader = this.commonProvider.createLoading(null);
			query.page_number = "1";
			loader.present().then(() => {
				return new Promise(resolve => {
					this.couponService.queryExchangeList(query)
						.then(data => {
							loader.dismiss();
							if (data) {
								data.list = (data.list && data.list.length != 0) ? data.list : [];
								this.bindData(data, flag);
							}
							resolve();
						})
						.catch(err => {
							loader.dismiss();
							this.bindData([], flag);
							this.commonProvider.presentToast(err.message);
						})
				})
			});
		}else{
			return new Promise(resolve => {
				this.couponService.queryExchangeList(query)
					.then(data => {
						if (data) {
							data.list = (data.list && data.list.length != 0) ? data.list : [];
							this.bindData(data, flag);
						}
						resolve();
					})
					.catch(err => {
						this.bindData([], flag);
						this.commonProvider.presentToast(err.message);
					})
			})
		}
		
	}
	
	//数据绑定
	private bindData(data, flag) {
		switch (this.coupon) {
			case '0': this.couponRun = this.toLoadMore(flag, this.couponRun, data, this.queryCouponUnstart);
				break;
			case '1': this.couponUnstart = this.toLoadMore(flag, this.couponUnstart, data, this.queryCouponUnstart);
				break;
			case '2': this.couponEnd = this.toLoadMore(flag, this.couponEnd, data, this.queryCouponUnstart);
				break;
		}
	}
	//加载更多及其他请求的数据绑定
	private toLoadMore(flag, beforeData, data, query) {
		if (flag == 3) {
			if (data.list.length == 0) {
				this.loadeMore = false;
			} else {
				if (data.page_total <= query.page_number) {
					this.loadeMore = false;
				}
				beforeData = beforeData.concat(data.list);
			}
		} else {
			beforeData = data.list;
		}
		return beforeData;
	}
	//下拉刷新
	doRefresh(refresher) {
		let query;
		if (this.coupon == '0') {
			query = this.queryCouponRun;
		} else if (this.coupon == '1') {
			query = this.queryCouponUnstart;
		} else if (this.coupon == '2') {
			query = this.queryCouponEnd;
		}
		query.page_number = 1;
		if (this.navParams.data == 1) {
			this.getGrantCoupons(query, 2).then(() => {
				setTimeout(() => {
					refresher.complete();
					if (this.loadEve) this.loadEve.enable(this.loadeMore);
				}, 500);
			});
		} else {
			this.getExchangeCoupons(query, 2).then(() => {
				setTimeout(() => {
					refresher.complete();
					if (this.loadEve) this.loadEve.enable(this.loadeMore);
				}, 500);
			});
		}
	}
	//上拉获取
	doInfinite(infiniteScroll) {
		let query;
		if (this.coupon == '0') {
			query = this.queryCouponRun;
		} else if (this.coupon == '1') {
			query = this.queryCouponUnstart;
		} else if (this.coupon == '2') {
			query = this.queryCouponEnd;
		}
		if (this.loadeMore) {
			query.page_number  = Number(query.page_number) + 1;
			query.page_number = query.page_number + "";
			if (this.navParams.data == 1) {
				infiniteScroll.waitFor(this.getGrantCoupons(query, 3));
			} else {
				infiniteScroll.waitFor(this.getExchangeCoupons(query, 3));
			}
		} else {
			this.commonProvider.httpToast('没有更多数据了...');
			infiniteScroll.enable(this.loadeMore);
			if (!this.loadEve) this.loadEve = infiniteScroll;
		}
	}

	//打开优惠券详情
	public openDetail(activityId, state) {
		this.navCtrl.push('CouponDetailPage', { stationId: this.queryCouponRun.stationId, activityId: activityId, state: state, flag: this.coupon, stationType: '2' });
	}
}
