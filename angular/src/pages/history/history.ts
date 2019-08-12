import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderService } from '../../service/OrderService';
import { OrderModel } from '../../model/OrderModel';
import { LoginService } from '../../service/LoginService';
import { AuthService } from '../../service/AuthService';
import { CommonProvider } from '../../providers/common';

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
	providers: [OrderService, LoginService]
})
export class HistoryPage {
	searchQuery: string = '';
	workOrderList: any = [];
	page_size: number = 4;
	page_number: number = 1;
	stationId: string;
	loader: any;
	loadeMore: boolean = true;
	loadEve: any = null;
	loadeMoreText: string = '上拉加载更多...';
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public orderService: OrderService,
		public loginService: LoginService,
		public auth: AuthService,
		public commonProvider: CommonProvider) {
	}

	ionViewDidLoad() {
		this.loginService.getInfo('stationInfo').then((data) => {
			if(data){
				this.stationId = data.serverStationId;
				this.initializeItems(1);
			}
		});
	}
	/**
	 * @param flag 1查询和初始化，2刷新，3加载更多
	 */
	initializeItems(flag) {
		this.loader = this.commonProvider.createLoading(null);
		this.loadeMore = true;
		this.loadeMoreText  = '上拉加载更多...';
		if(flag == 1) {
			this.loader.present();
			this.page_number = 1;
		}
		let query: OrderModel = {
			stationId: this.stationId,
			carId: this.searchQuery,
			page_number: this.page_number,
			page_size: this.page_size
		}
		return new Promise(resolve => {			
			this.orderService.getHistoryList(query)
			.then(data => {
				this.loader.dismiss();
				if (data && data.list) {
					if(flag == 3) {
						if (data.list.length == 0) {
							this.loadeMore = false;
						}else{
							if(data.page_total <= this.page_number) {
								this.loadeMore = false;
							}
							this.workOrderList = this.workOrderList.concat(data.list);
						} 
					}else{
						this.workOrderList = data.list;
					}
				}else{
					this.workOrderList = [];
				}
				resolve();
			}).catch(err => {
				this.loader.dismiss();
				this.commonProvider.alert('获取工单列表失败', err.message);
			});
		});
	}
	//下拉刷新
	doRefresh(refresher) {
		this.page_number = 1;
		this.initializeItems(2).then(() => {	
			setTimeout(() => {				
				refresher.complete();
				if(this.loadEve) this.loadEve.enable(this.loadeMore);
			}, 500);
		});
	}
	//上拉获取
	doInfinite(infiniteScroll) {
		if(this.loadeMore) {
			this.page_number += 1;
			infiniteScroll.waitFor(this.initializeItems(3));
		}else{
			this.commonProvider.httpToast('没有更多数据了...');
			infiniteScroll.enable(this.loadeMore);	
			if(!this.loadEve) this.loadEve = infiniteScroll;
		}
	}
	//跳转到工单详情
	toDetail(obj:any){
		let pageAttr = {
			woCode: obj.woCode,
			woType: obj.woType,
			roleCode: this.auth.getRoleCode(),
			secRepaire: obj.secRepaire,
			status: '6'
		};
		this.navCtrl.push('DetailPage', pageAttr);
	}

}
