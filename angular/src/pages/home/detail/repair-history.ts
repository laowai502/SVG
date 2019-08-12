import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { CommonProvider } from '../../../providers/common';

import { OrderService } from '../../../service/OrderService';

@Component({
	selector: 'repair-history',
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>维修历史</ion-title>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<ion-grid>
				<ion-row *ngFor="let obj of list; let idx = index">
					<ion-col col-12>维修历史-{{idx+1}}</ion-col>
					<ion-col col-12>处理方式 : {{obj.maintenanceWay}}</ion-col>
					<ion-col col-12>处理过程 : {{obj.maintenanceProcess}}</ion-col>
					<ion-col col-12>处理时间 : {{obj.maintenanceTime}}</ion-col>
					<ion-col col-12>行驶里程 : {{obj.dirveMile}}</ion-col>
				</ion-row>
			</ion-grid>
			<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
				<ion-infinite-scroll-content loadingSpinner="bubbles" loadingText={{loadMoreText}}></ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</ion-content>
	`
})
export class RepairHistory {
	
	list: any = [];
	page: any = {
		page_number: 1,
		page_size: 3
	};
	loadMore: boolean = true;
	loadMoreText: string = '上拉加载更多...';

	constructor(private order: OrderService, private navParams: NavParams,
				private common: CommonProvider) {
		this.getData(0);
	}
	
	getData(flag){
		let load = this.common.createLoading();
		this.loadMore = true;
		this.loadMoreText  = '上拉加载更多...';
		if(flag === 0) {
			load.present();
			this.page.page_number = 1;
		}
		this.order.getReHistory(Object.assign({}, {vin: this.navParams.data.vin}, this.page)).then(data => {
			load.dismiss();
			if(data && data.list){
				if(flag === 1){
					if(data.list.length === 0){
						this.loadMore = false;
					}else{
						if(data.page_total <= this.page.page_number) {
							this.loadMore = false;
						}
						this.list = this.list.concat(data.list);
					}
				}else{
					this.list = data.list;
				}
			}
		}).catch(err => {
			load.dismiss();
			this.common.alert('维修历史获取失败', err.message);
		});
	}
	
	doInfinite(eve){
		if(this.loadMore == false) {
			this.loadMoreText = '没有更多数据了...';
		}else{
			this.page.page_number += 1;
			this.getData(1);
		}
		setTimeout(() => {
			eve.complete();
		}, 1000);
	}

}