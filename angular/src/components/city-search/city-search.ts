import { Component, ElementRef } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { BaiduMapProvider } from '../../providers/baidu-map/baidu-map';
import { CommonProvider } from '../../providers/common';
import { CityService } from '../../service/CityService';

declare let BMap;
//declare let BMAP_STATUS_SUCCESS;

@Component({
	selector: 'city-search',
	templateUrl: 'city-search.html',
	providers: [CityService]
})
export class CitySearchComponent {
	map: any;
	showList: boolean = true;
	showResult: boolean = false;
	provinces: any = [];
	city: string = '北京';
	cities: any = [];
	curCode: any;
	myInput: string = '';
	query: any;
	searchResult: any = [];
	tip: string = '';

	constructor(
		public viewCtrl: ViewController,
		private baiduMapProvider: BaiduMapProvider,
		public commonProvider: CommonProvider,
		public ele: ElementRef,
		private params: NavParams,
		public cityService: CityService) {
			
	}
	ionViewDidLoad() {
		this.init();
	}

	//初始化
	private init() {
		this.map = this.baiduMapProvider.creatMap('cityMap');
		//获取上一个页面传过来的数据经纬度，城市名，行政编码
		let lon = this.params.get('lon'), 
			lat = this.params.get('lat'),
			city = this.params.get('city'),
			adcode = this.params.get('adcode');
		//保存行政编码
		this.curCode = adcode ? adcode : '110000';
		//保存城市名
		this.city = city ? city : '北京';
		//地图打点
		if(lat && lon) this.baiduMapProvider.setMark(new BMap.Point(lon, lat), this.map, 'assets/images/car-icon.png', 24, 28);
	}
	//展示省
	public openCityList() {
		this.showList = !this.showList;
		this.cityService.getCity('0')
			.then(data => {
				if(data) {
					this.provinces = data;
					let cityCode = this.curCode.substring(0, 2) + '0000';
					for(let i = 0; i < data.length; i++) {
						if(data[i].regionCode == cityCode) {
							//设置默认显示的城市列表
							data[i].flag = true;
							this.getCityList(cityCode);
							return;
						} else {
							data[i].flag = false;
						}
					}

				}
			})
			.catch(err => {
				this.commonProvider.presentToast(err.message);
			})
	}
	//给当前选中的省添加点击效果
	public changeClass(data) {
		if(data.flag && data.flag == true) {
			return 'active';
		} else {
			return '';
		}
	}
	//展示省下面的市
	public getCityList(code, index ? : any) {
		//给省的dom添加点击效果
		if(index != undefined) {
			let Oul = this.ele.nativeElement.querySelector('.province');
			let Olis = Oul.querySelectorAll('li');
			let Oli = Olis[index];
			for(let i = 0; i < Olis.length; i++) {
				Olis[i].className = '';
			}
			Oli.className = 'active';
		}
		this.cityService.getCity(code)
			.then(data => {
				if(data) {
					this.cities = data;
					console.log(data)
				}
			})
			.catch(err => {
				this.commonProvider.presentToast(err.message);
			})
	}
	//改变当前城市
	public changeCity(data) {
		this.city = data.regionName;
		this.curCode = data.regionCode;
		this.showList = true;
	}
	//搜索框的输入事件
	public onInput(e) {
		let that = this;
		this.query = '';
		let local;
		let options = {
			onSearchComplete: function(results) {
				// 判断状态是否正确
				if(results) {
					that.showResult = true;
					console.log(results.getCurrentNumPois())
					if(results.getCurrentNumPois() != 0) {
						for(var i = 0; i < results.getCurrentNumPois(); i++) {
							that.searchResult.push({
								title: results.getPoi(i).title,
								address: results.getPoi(i).address,
								point: results.getPoi(i).point,
								city: results.getPoi(i).city
							});
						}
					} else {
						that.searchResult = [];
					}
				}
			}
		};
		local = new BMap.LocalSearch(this.map, options);
		local.setLocation(this.city);
		local.search(this.myInput);
	}
	//搜索框的取消事件
	public onCancel(e) {
		this.myInput = '';
	}
	//关闭弹窗
	public closeModal(data ?: any) {
		this.query = {
			lon: this.params.get('lon'),
			lat: this.params.get('lat'),
			address: '',
			adcode: this.curCode
		}
		if(data) {
			this.query.lon = data.point.lng;
			this.query.lat = data.point.lat;
			this.query.address = data.address;
			this.query.city = data.city;
		}
		this.viewCtrl.dismiss(this.query);
	}

}