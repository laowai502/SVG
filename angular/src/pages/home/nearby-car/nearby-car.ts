import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';
import { LoginService } from '../../../service/LoginService';
import { NearbyCarService } from '../../../service/NearbyCarService';
//declare let BMap;

@IonicPage()
@Component({
	selector: 'page-nearby-car',
	templateUrl: 'nearby-car.html',
	providers: [LoginService, NearbyCarService]
})
export class NearbyCarPage {
	map:any;
	distance: string = '5';
	carInfo: any = {};
	point: any;
	circle: any;
	preMarkers: any = [];
	constructor(
			public navCtrl: NavController, 
			public navParams: NavParams, 
			public baiduMapProvider: BaiduMapProvider, 
			public commonProvider: CommonProvider, 
			public loginService: LoginService, 
			public nearbyCarService: NearbyCarService) {

				this.init();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NearbyCarPage');
	}
	//页面初始化
	private init() {
		//加载地图		
		setTimeout(() => {
			this.map = this.baiduMapProvider.creatMap('map');
			//获取服务站信息
			this.loginService.getInfo('stationInfo')
			.then(data => {
				if(data) {
					this.point = this.baiduMapProvider.googleToBaidu(data.lon,data.lat);
					//添加服务站位置点
					this.baiduMapProvider.setMark(this.point,this.map,'assets/images/location-center.png',33.5,40.5);
					//添加服务站区域遮罩
					this.circle = this.baiduMapProvider.addMark(this.point,Number(this.distance)*1000,this.map,12);
					this.getCars();
				}
			})
		}, 500);
	}
	//获取附近车辆
	private getCars() {
		let vm = this;
		console.log(this.preMarkers,2)
		this.nearbyCarService.getsurroundCar(this.distance)
		.then(data => {
			//清除之前的车辆覆盖物
			if(this.preMarkers.length!=0) {
				this.preMarkers.forEach(item => {
					this.map.removeOverlay(item);
					return false;
				})
				this.preMarkers = [];
			}
			if(data && Object.prototype.toString.call(data) == '[object Array]') {
				data.forEach(element => {
					let point = this.baiduMapProvider.googleToBaidu(element.carLon,element.carLat);
					let marker = this.baiduMapProvider.setMark(point,this.map,'assets/images/car-location.png',17.5,23);
					this.preMarkers.push(marker);
					let id = element.carId;
					marker.addEventListener('click', function() {
						vm.getCarInfo(id);
					},false);
				});
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})	
	}

	//获取车辆的详细信息
	private getCarInfo(id) :any{
		this.nearbyCarService.carInfo(id)
		.then(data => {
			if(data) {
					this.carInfo = data;
			
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}

	public changeDistance() {
		console.log(this.circle)
		let zoom;
		switch(this.distance) {
			case '5': zoom = 12;
				break;
			case '10': zoom = 11;
				break;
			case '50': zoom = 9;
				break;
			case '100': zoom = 8;
				break;
			default: zoom = 11;
		}
		this.map.removeOverlay(this.circle);
		this.circle = this.baiduMapProvider.addMark(this.point,Number(this.distance)*1000,this.map,zoom);
		this.getCars()
	}

}
