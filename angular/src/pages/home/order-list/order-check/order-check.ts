import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CommonProvider } from '../../../../providers/common';
import { BaiduMapProvider } from '../../../../providers/baidu-map/baidu-map';

import { OrderService } from '../../../../service/OrderService';
import { SelectPhotoComponent } from '../../../../components/select-photo/select-photo';

@IonicPage()
@Component({
	selector: 'page-order-check',
	templateUrl: 'order-check.html',
	providers: [OrderService]
})
export class OrderCheckPage {
	
	@ViewChild(SelectPhotoComponent) child: SelectPhotoComponent;
	
	filePath: any = [];
	amount: number = 0;
	row: any = {
		notes: ''
	};
	
	constructor(public navCtrl: NavController, public navParams: NavParams,
				public common: CommonProvider, public bMap: BaiduMapProvider,
				public order: OrderService) {	
		this.row.woCode = navParams.data.woCode;
	}

	
	textChange(){
		this.amount = this.row.notes.length;
	}
	
	submit(){
		if(this.child.photoes.length < 3){
			this.common.httpToast('添加照片最少3张，最多8张');
			return;
		}
		let loading = this.common.createLoading();
		loading.present();
		for(let i=0; i<this.child.photoes.length; i++){			
			this.common.uploadFile(this.child.photoes[i]).then(data => {
				if(data && data.status === 200){	
					this.filePath.push(data.data.fullPath);
					if(this.child.photoes.length === this.filePath.length){
						this.row.picUrl = this.filePath.join(';');
						this.row.failFlag = '2';	
						this.bMap.getCurrentLocation(data => {
							let point = this.bMap.baiduToGoogle(data.longitude, data.latitude);
							this.row.opLon = point.lng; 
							this.row.opLat = point.lat;
							this.order.startRepair(this.row).then(() => {
								loading.dismiss();
								this.navParams.data.statusName = '维修中';
								this.navParams.data.status = '5';
								this.navCtrl.push('OrderRepairPage', this.navParams.data).then(() => {
									this.navCtrl.remove(2, this.navCtrl.length()-3);
								});
							}).catch(err => {
								loading.dismiss();
								this.common.alert('提交失败', err.message);
							});
						});
					}
				}
			}).catch(() => {
				//记录次数
				loading.dismiss();
				this.filePath = [];
				this.common.httpToast('图片上传失败,请重试');
			});
		}
	}

}
