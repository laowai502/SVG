import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';

import { DealService } from '../../../service/DealService';
import { CommonService } from '../../../service/CommonService';

@Component({
	selector: 'page-deal',
	templateUrl: 'deal.html'
})
export class DealPage {
	
	pageAttr: any;
	reason: string = '';
	row: any = {};
	baseData: any = [];
	amount: number = 0;
	
	
	constructor(public navParams: NavParams, public navCtrl: NavController,
				public deal: DealService, public common: CommonService, 
				public cp: CommonProvider, public bMap: BaiduMapProvider){
		this.pageAttr = this.navParams.data;
		this.row.woCode = this.pageAttr.woCode;
	}

	ionViewDidLoad(){
		if(this.pageAttr.type == '1'){
			this.common.getBaseData('A','A052').then(data => {
				if(data){
					this.baseData = data.list;
				}
			});
		}
	}
	
	textChange(){
		this.amount = this.reason.length;
	}
	
	commit(){
		this.bMap.getCurrentLocation(data => {
			let point = this.bMap.baiduToGoogle(data.longitude, data.latitude),
				loading = this.cp.createLoading(),
				method = this.pageAttr.type == '1' ? 'closeOrder' : 'changeOrder';
			if(this.pageAttr.type == '1'){	//1申请关闭,2申请修改
				this.row.closeReasonNotes = this.reason;
				for(let i=0; i<this.baseData.length; i++){
					if(this.row.closeReasonType == this.baseData[i].value){
						this.row.closeReasonTypeName = this.baseData[i].name;
					}
				}
			}else{
				this.row.changeReason = this.reason;
			}
			this.row.opPos = point.lng +','+ point.lat;
			loading.present();
			this.deal[method].apply(this.deal, [this.row]).then(data => {
				loading.dismiss();
				this.cp.alert('提交成功', '申请已成功提交，请关注审核结果');
				this.navCtrl.popToRoot();
				
			}).catch(err => {
				loading.dismiss();
				this.cp.alert('提交失败', err.message);
			});
		});
	}
}