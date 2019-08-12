import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { HelpPlaceComponent } from '../../../home/detail/help-place';

import { CommonProvider } from '../../../../providers/common';
import { BaiduMapProvider } from '../../../../providers/baidu-map/baidu-map';

import { AuthService } from '../../../../service/AuthService';
import { OrderService } from '../../../../service/OrderService';

@IonicPage()
@Component({
	selector: 'page-vin-input',
	templateUrl: 'vin-input.html',
	providers: [OrderService]
})
export class VinInputPage {
	
	indexInput: any;
	row: any = {
		vin: ''
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public common: CommonProvider, public order: OrderService, 
				public bMap: BaiduMapProvider, public auth: AuthService,
				public modal: ModalController) {}

	ionViewDidLoad() {
		this.indexInput = document.querySelector('.bogusInput').querySelectorAll('input');
	}
	
	inputChange(){
		for(let i=0; i<8; i++){
			this.indexInput[i].setAttribute('value', this.row.vin[i] || '');
		}
	}
	pressKeyboard(e){
		if(!(/^[a-zA-Z0-9]+$/.test(e.key)))	e.returnValue = false; 
	}
	showTip(){
		const modal = this.modal.create(HelpPlaceComponent, null, {
			showBackdrop: true,
			enableBackdropDismiss: true,
			cssClass: 'help-modal'
		});
		modal.present();
	}
	ok(){
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude),
				loading = this.common.createLoading();
			this.row.lon = point.lng;
			this.row.lat = point.lat;
			loading.present();
			this.order.vinInput(this.row).then(data => {
				if(data) {
					let routeParam = {
						status: '4',
						woCode: data.woId,
						woType: data.woType,
						roleCode: this.auth.getRoleCode(),
					};
					this.row.woCode = data.woId;
					this.order.recComCar(this.row).then(data => {
						loading.dismiss();
						this.common.alert('接车成功', '已确认接车');
						this.navCtrl.push('DetailPage', routeParam).then(() => {
							this.navCtrl.remove(1, this.navCtrl.length()-2);
						});
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
								this.navCtrl.push('NewOrderPage', {vin: this.row.vin});
							}
						}
					];
					this.common.alert(null, '车辆在本服务站无在途工单，开始新建工单？', buttonArr);
				}
			}).catch(err => {
				loading.dismiss();
				this.common.alert(null, err.message);
			});
		});
	}
}