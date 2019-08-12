import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';

import { HomeService } from '../../service/HomeService';
import { OrderService } from '../../service/OrderService';
import { AuthService } from '../../service/AuthService';

import { StorgeProvider } from '../../providers/storge';
import { CommonProvider } from '../../providers/common';
import { BaiduMapProvider } from '../../providers/baidu-map/baidu-map';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [HomeService,OrderService]
})
export class HomePage {
	
	private cycleType: string = '1';
	private stationId: string;
	private outStat;
	private inStat;
	private cycle;
	private first: number = 0;
	
	constructor(public navCtrl: NavController, public common: CommonProvider,
				public homeService: HomeService, public storge: StorgeProvider, 
				public splashScreen: SplashScreen, public order: OrderService,
				public bMap: BaiduMapProvider, public auth: AuthService) {
	}

	ionViewDidLoad(){
		let loading = this.common.createLoading();
		loading.present();
		this.homeService.queryStationInfo().then(data => {
			loading.dismiss();
			if(data){
				this.storge.saveStorage('stationInfo', data);
				this.stationId = data.serverStationId;
				this.getCycle(this.cycleType, this.stationId);
				this.acceptOrder(this.stationId);
			}
		}).catch(err => {
			loading.dismiss();
			this.common.alert(null, err.message);
		});
		this.initBind();
	}
	ionViewDidEnter(){
		this.splashScreen.hide();
		this.homeService.countWithStatus("1").then(data => {
			this.inStat = data || [];
		});
		this.homeService.countWithStatus("2").then(data => {
			this.outStat = data || [];
		});
		if(this.stationId){
			this.getCycle(this.cycleType, this.stationId);
			this.acceptOrder(this.stationId);
		}
	}
	
	initBind(){
		document.querySelector('page-home').addEventListener('touchend', (e) => {
			//隐藏角标
		}, false);
	}
	
	change(){
		this.getCycle(this.cycleType, this.stationId);
	}
	getCycle(cycleType, stationId){
		this.homeService.orderAnalyse(cycleType, stationId).then(data => {
			this.cycle = data || [];
		});
	}
	acceptOrder(stationId){
		this.homeService.acceptOrder(stationId).then(data => {
			if(data){				
				this.first = data.cnt;
			}
		});
	}
	toBreak(){
		this.navCtrl.push('BreakCodePage');
	}
	toNewOrder(){
		this.common.recvCar(this.success.bind(this), {type: 0});
	}
	toNearbyCar(){
		this.navCtrl.push('NearbyCarPage');
	}
	toOrder(obj:any){
		if(!obj){
			obj = {
				status: "1",
				statusName: "待接受工单",
				woType: "0"
			}
		}
		this.navCtrl.push('OrderListPage', obj);
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
				this.order.vinInput(obj).then(data => {
					if(data) {
						let routeParam = {
							status: '4',
							woCode: data.woId,
							woType: data.woType,
							roleCode: this.auth.getRoleCode(),
						};
						obj.woCode = data.woId;
						this.order.recComCar(obj).then(data => {
							loading.dismiss();
							this.common.alert('接车成功', '已确认接车');
							this.navCtrl.push('DetailPage', routeParam);
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