import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OrderNoPage } from '../detail/order-no';
import { OrderYesPage } from '../detail/order-yes';
import { OutConfirmPage } from '../detail/out-confirm';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../service/OrderService';
import { AuthService } from '../../../service/AuthService';

@IonicPage()
@Component({
	selector: 'page-order-list',
	templateUrl: 'order-list.html',
	providers: [OrderService]
})
export class OrderListPage {
	
	btnName: string;
	roleCode: string;
	pageAttr: any;
	oldToRepare: string = '';
	title: any;
	list: any = [];
	page: any = {
		page_number: 1,
		page_size: 4
	};
	loadEve: any = null;
	loadMore: boolean = true;
	loadMoreText: string = '上拉加载更多...';
	
	constructor(public navCtrl: NavController, public navParams: NavParams,
				public orderService: OrderService, public common: CommonProvider,
				public auth: AuthService, public bMap: BaiduMapProvider) {
		this.oldToRepare = navParams.data.statusName;
	}

	ionViewDidLoad(){
		this.pageAttr = this.navParams.data;
		this.roleCode = this.auth.getRoleCode();
		if((this.roleCode === '2' && this.pageAttr.status === '1')
			||(this.roleCode === '1' && this.pageAttr.status !== '1')){
			this.page.page_size = 5;
		}
		this.getData(0);
	}
	
	ionViewWillEnter(){
		if(this.pageAttr.status === '1'){
			this.title = this.pageAttr.statusName;
		}else{			
			this.title = (this.pageAttr.woType === '1' ? '进出站' : '外出救援') + this.pageAttr.statusName;
		}
		this.btnName = this.buttonName(this.pageAttr.status);
		if(this.oldToRepare !== this.navParams.data.statusName){
			this.getData(0);
		}
	}
	
	getData(flag) :any {
		let load = this.common.createLoading();
		if(flag === 0) {			
			load.present();
			this.page.page_number = 1;
		}else{
			this.loadMore = true;
			this.loadMoreText  = '上拉加载更多...';
		}
		return new Promise(resolve => {			
			this.orderService.getQueryJobList(Object.assign({woType:this.pageAttr.woType, status:this.pageAttr.status},this.page)).then(data => {
				load.dismiss();
				if(data){				
					if(flag !== 0){
						if(data.list.length === 0){
							this.loadMore = false;
						}else{
							if(data.page_total <= this.page.page_number) {
								this.loadMore = false;
							}
							this.list = flag === 1 ? this.list.concat(data.list) : data.list;
						}
					}else{
						this.list = data.list;
					}
				}
				resolve();
			}).catch(err => {
				load.dismiss();
				this.common.alert('获取工单列表失败', err.message);
			});
		});
	}
	doRefresh(eve){
		this.page.page_number = 1;
		this.getData(2).then(() => {	
			setTimeout(() => {				
				eve.complete();
				if(this.loadEve) this.loadEve.enable(this.loadMore);
			}, 500);
		});
	}
	doInfinite(eve){
		if(this.loadMore) {
			this.page.page_number += 1;
			eve.waitFor(this.getData(1));
		}else{
			this.common.httpToast('没有更多数据了...');
			eve.enable(this.loadMore);	
			if(!this.loadEve) this.loadEve = eve;
		}
	}
	buttonName(type): string {
		let text = '';
		switch(type) {
			case '2':
				text = '确认出发';
				break;
			case '3':
				text = '扫码接车';
				break;
			case '4':
				text = '开始检查';
				break;
			case '5':
				text = this.pageAttr.secRepaire !== '' ? '继续维修' : '开始维修';
				break;
			default: 
				break;
		}
		return text;
	}
	toDetail(obj:any){
		this.pageAttr.woCode = obj.woCode;
		this.pageAttr.woType = obj.woType;
		this.pageAttr.roleCode = this.roleCode;
		this.pageAttr.secRepaire = obj.secRepaire;
		this.navCtrl.push('DetailPage', this.pageAttr);
	}
	confirm(woCode, woType){
		this.pageAttr.woCode = woCode;
		this.pageAttr.woType = woType;
		this.navCtrl.push(OrderYesPage, this.pageAttr);
	}
	
	continue(woCode){
		this.pageAttr.woCode = woCode;
		switch(this.pageAttr.status){
			case '1': this.navCtrl.push(OrderNoPage, this.pageAttr);
				break;
			case '2': this.navCtrl.push(OutConfirmPage, this.pageAttr);
				break;
			case '3': 
				this.common.recvCar(this.success.bind(this), {type: 0});
				break;
			case '4': this.navCtrl.push('OrderCheckPage', this.pageAttr);
				break;
			case '5': this.navCtrl.push('OrderRepairPage', this.pageAttr);
				break;
			default:
				break;
		}
	}
	
	success(data){
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
						this.pageAttr.status = '4';
						this.pageAttr.woCode = data.woId;
						this.pageAttr.roleCode = this.roleCode;
						obj.woCode = data.woId;
						this.orderService.recComCar(obj).then(data => {
							loading.dismiss();
							this.common.alert('接车成功', '已确认接车');
							this.navCtrl.push('DetailPage', this.pageAttr);
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
			this.navCtrl.push('VinInputPage');
		}
	}
	
	
}