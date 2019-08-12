import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { DealPage } from './deal';
import { RepairHistory } from './repair-history';
import { OrderNoPage } from './order-no';
import { OrderYesPage } from './order-yes';
import { OutConfirmPage } from './out-confirm';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../service/OrderService';

@IonicPage()
@Component({
	selector: 'page-detail',
	templateUrl: 'detail.html'
})
export class DetailPage {

	detail: any = {};
	order: any = {};
	car: any = {};
	dealBtn: any = '';
	nextBtn: string = '';
	showBtn: boolean = false;
	
	items: any = [];

	constructor(public navCtrl: NavController, public navParams: NavParams,
				public common: CommonProvider, public orderService: OrderService,
				public events: Events, public bMap: BaiduMapProvider) {
		this.detail = this.navParams.data;
	}

	ionViewDidLoad() {
		this.init();
	}

	init() {
		if(!(this.detail.status === '2' || this.detail.status === '3')) {
			this.dealBtn = '申请关闭';
		}
		switch(this.detail.status) {
			case '2':
				this.nextBtn = '确认出发';
				break;
			case '3':
				this.nextBtn = '扫码接车';
				break;
			case '4':
				this.nextBtn = '开始检查';
				break;
			case '5':
				this.nextBtn = this.detail.secRepaire !== '' ? '继续维修 ' : '开始维修';
				break;
			default:
				break;
		}
		this.getData();
	}

	ionViewWillLeave() {
		this.showBtn = false;
	}

	getData() {
		let loading = this.common.createLoading();
		loading.present();
		this.orderService.getOrderDetail(this.detail.woCode).then(data => {
			if(data) {
				this.order = data;
				this.orderService.getCarDetail(data.vinCode).then(data => {
					loading.dismiss();
					this.car = data;
				}).catch(err => {
					loading.dismiss();
					this.common.alert('获取车辆信息失败', err.message);
				});
			}
		}).catch(err => {
			loading.dismiss();
			this.common.alert('获取工单信息失败', err.message);
		});
		this.orderService.operateRecord(this.detail.woCode).then(data => {
			this.items = data.record;
			if(data) this.events.publish('data:reset', data);
		}).catch(err => {
			console.log(err);
		});
	}

	deal() {
		if(!(this.detail.status === '2' || this.detail.status === '3')) {
			this.toDealPage('1');
		} else {
			this.showBtn = !this.showBtn;
		}
	}

	toDealPage(type) {
		this.detail.type = type;
		this.navCtrl.push(DealPage, this.detail);
	}

	toRepairHistory() {
		this.navCtrl.push(RepairHistory, {vin: this.order.vinCode});
	}

	refuse() {
		this.navCtrl.push(OrderNoPage, this.detail);
	}

	next() {
		switch(this.detail.status) {
			case '1':
				this.navCtrl.push(OrderYesPage, this.detail);
				break;
			case '2':
				this.navCtrl.push(OutConfirmPage, this.detail);
				break;
			case '3':
				this.common.recvCar(this.success.bind(this), {type: 0});
				break;
			case '4':
				this.navCtrl.push('OrderCheckPage', this.detail);
				break;
			case '5':
				this.navCtrl.push('OrderRepairPage', this.detail);
				break;
			default:
				break;
		}
	}

	success(data) {
		if(data.type === 0) {
			this.bMap.getCurrentLocation(data => {
				let point = this.bMap.baiduToGoogle(data.longitude, data.latitude),
					loading = this.common.createLoading(),
					obj:any = {
						vin: data.text,
						lon: point.lng,
						lat: point.lat
					};
				loading.present();
				this.orderService.vinInput(obj).then(data => {
					if(data) {
						this.detail.woCode = data.woId;
						obj.woCode = data.woId;
						this.orderService.recComCar(obj).then(data => {
							loading.dismiss();
							this.common.alert('接车成功', '已确认接车');
							this.detail.status = '4';
							this.init();
						}).catch(err => {
							loading.dismiss();
							this.common.alert('接车失败', err.message);
						});
					} else {
						loading.dismiss();
						let buttonArr = [
							{
								text: '取消',
								role: 'cancel'
							},
							{
								text: '新建工单',
								handler: () => {
									this.navCtrl.push('NewOrderPage', {vin: obj.vin});
								}
							}
						];
						this.common.alert(null, '车辆在本服务站无在途工单，开始新建工单？', buttonArr);
					}
				}).catch(err => {
					loading.dismiss();
					this.common.alert('扫码失败', err.message);
				});
			});
		} else if(data.type === 1) {
			setTimeout(() => {
				this.navCtrl.push('VinInputPage');
			}, 300);
		}
	}

}