import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OutSecondPage } from '../../detail/out-second';

import { BaiduMapProvider } from '../../../../providers/baidu-map/baidu-map';
import { CommonProvider } from '../../../../providers/common';

import { OrderService } from '../../../../service/OrderService';
import { CommonService } from '../../../../service/CommonService';
import { SelectPhotoComponent } from '../../../../components/select-photo/select-photo';

@IonicPage()
@Component({
	selector: 'page-order-repair',
	templateUrl: 'order-repair.html',
	providers: [OrderService]
})
export class OrderRepairPage {
	
	@ViewChild(SelectPhotoComponent) child: SelectPhotoComponent;
	
	filePath: any = [];
	baseData: any = [];
	amount: number = 0;
	showMavin: boolean = false;
	row: any = {
		opProcess: '',
		pageAttr: ''
	};
	
	constructor(public navCtrl: NavController, public navParams: NavParams,
				public cp: CommonProvider, public bMap: BaiduMapProvider,
				public order: OrderService, public common: CommonService,
				public ele: ElementRef) {
	}

	ionViewDidLoad() {
		this.init();
		this.getDealType();
	}
	
	init(){
		this.row.woCode = this.navParams.data.woCode;
		this.row.pageAttr = this.navParams.data.woType;
	}
	
	getDealType(){
		this.common.getBaseData('A','A025').then(data => {
			if(data) this.baseData = data.list;
		});
	}
	changeDealType(index, value){
		let currentLis = this.ele.nativeElement.querySelectorAll('.deal-type'),
			currentLi = currentLis[index],
			currentLabel = currentLi.querySelector('label');
		this.showMavin = (value === 4 && currentLabel.className === 'default') ? true : false;
		if(currentLabel.className === 'default') {
			for(let i=0; i<currentLis.length; i++){
				currentLis[i].querySelector('input').checked = false;
				this.cp.removeClass(currentLis[i].querySelector('label'),'active');
			}
			this.cp.addClass(currentLabel, 'active');
			this.row.maintenanceWay = value;
		}else{
			this.cp.removeClass(currentLabel, 'active');
			this.row.maintenanceWay = null;
		}
	}
	textChange(){
		this.amount = this.row.opProcess.length;
	}
	
	beforeCommit(type){
		if(!this.row.maintenanceWay){
			this.cp.httpToast('请选择维修方式');
			return;
		}
		if(this.row.opProcess.length < 5){
			this.cp.httpToast('处理过程最少不少于五个字');
			return;
		}
		if(this.child.photoes.length < 2){
			this.cp.httpToast('添加照片最少2张，最多8张');
			return;
		}
		let loading = this.cp.createLoading();
		loading.present();
		for(let i=0; i<this.child.photoes.length; i++){			
			this.cp.uploadFile(this.child.photoes[i]).then(data => {
				if(data && data.status === 200){	
					this.filePath.push(data.data.fullPath);
					if(this.child.photoes.length === this.filePath.length){
						this.row.picUrl = this.filePath.join(';');
						this.row.failFlag = '2';
						this.bMap.getCurrentLocation(data => {
							let point = this.bMap.baiduToGoogle(data.longitude, data.latitude);
							this.row.lon = point.lng; 
							this.row.lat = point.lat;
							if(type === 0){
								this.row.opType = '2';
								this.order.secRepair(this.row).then(data => {
									loading.dismiss();
									this.addRepair();
								}).catch(err => {
									loading.dismiss();
									this.cp.alert('提交失败', err.message);
								});
							}else{
								this.order.repairComplete(this.row).then(data => {
									loading.dismiss();
									this.cp.alert('提交成功', '车辆维修结束');
									this.repairEnd();
								}).catch(err => {
									loading.dismiss();
									this.cp.alert('提交失败', err.message);
								});
							}
						});
					}
				}
			}).catch(() => {
				loading.dismiss();
				this.filePath = [];
				this.cp.httpToast('图片上传失败,请重试');
			});
		}
	}
	
	addRepair(){
		this.child.photoes = [];
		this.changeDealType(this.row.maintenanceWay-1, this.row.maintenanceWay);
		this.row = {
			opProcess: '',
			pageAttr: ''
		};
		this.init();
	}
	repairEnd(){
		let routeParam = Object.assign({}, this.navParams.data);
		routeParam.status = '5';
		routeParam.statusName = '维修中';
		this.navCtrl.push('OrderListPage', routeParam).then(() => {
			this.navCtrl.remove(1, this.navCtrl.length()-2);
		});
	}
	outSecond(){
		this.navCtrl.push(OutSecondPage, this.navParams);
	}

}