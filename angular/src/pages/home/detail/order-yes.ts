import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { CitySearchComponent } from '../../../components/city-search/city-search';

import { CommonProvider } from '../../../providers/common';
import { StorgeProvider } from '../../../providers/storge';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../service/OrderService';

@Component({
	selector: 'order-yes',
	templateUrl: 'order-yes.html'
})
export class OrderYesPage {
	
	assigners: any;
	typeText: string = '';
	showPosition: any = null;
	pos: any = {
		addr: ''
	};
	row: any = {};
	
	constructor(public navParams: NavParams, public navCtrl: NavController,
				public order: OrderService, public common: CommonProvider,
				public storge: StorgeProvider, public modalCtrl: ModalController,
				public bMap: BaiduMapProvider){
		this.row.woCode = navParams.data.woCode;
		this.row.woType = navParams.data.woType;
		this.row.type = navParams.data.woType;
		if(this.row.woType) this.typeText = this.row.woType === '1' ? '进出站' : '外出救援';
	}
				
	ionViewDidLoad() {
		this.getMembers();
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude);
			this.pos = data;
			this.pos.addr = data.addr.replace(/中国/, '');
			this.row.opPos = point.lng + ',' + point.lat;
			this.row.repairLon = point.lng;
			this.row.repairLat = point.lat;
			this.bMap.getAddress(data.latitude, data.longitude, 'bd09ll')
				.map(result => result.json())
				.subscribe(data => this.pos.areaCode = data.result.addressComponent.adcode);
		});
	}
				
	openCity(){
		const modal = this.modalCtrl.create(CitySearchComponent, {
			lat: this.pos.latitude || 41.776795, 
			lon: this.pos.longitude || 123.439162, 
			city: this.pos.city, 
			adcode: this.pos.areaCode
		});
		modal.onDidDismiss(data => {
			if(data.lat && data.address !== '') {
				let point = this.bMap.baiduToGoogle(data.lon, data.lat);
				this.row.repairLon = point.lat;
				this.row.repairLat = point.lng;
				this.pos.areaCode = data.adcode;
				this.pos.addr = data.city+data.address;
			}
		})
		modal.present();
	}		
	changeOrderType(){
		this.showPosition = this.row.woType == 2 ? true : false;
	}
	getMembers() {
		this.storge.getStorage('stationInfo').then(data => {			
			this.order.getAssigners(data.serverStationId).then(data => {
				this.assigners = data || [];
			}).catch(err => {
				this.common.alert(null, err.message);
			})
		});
	}
	
	commit(){
		let routeParam = Object.assign({}, this.navParams.data),
			loading = this.common.createLoading();
		routeParam.woType = this.row.woType;
		routeParam.status = this.row.woType == 2 ? '2' : '3';
		routeParam.statusName = this.row.woType == 2 ? '待出发' : '待接车';
		this.row.repairAdd = this.pos.addr;
		loading.present();
		this.order.confirmOrder(this.row).then(data => {
			loading.dismiss();
			this.common.alert('确认接单', this.row.woType == 2 ? '已确认成功，请及时出发' : '已确认成功，请准备接车');
			this.navCtrl.push('OrderListPage', routeParam).then(() => {
				this.navCtrl.remove(1, this.navCtrl.length()-2);
			});
		}).catch(err => {
			loading.dismiss();
			this.common.alert('接单失败', err.message);
		});
	}
	
}