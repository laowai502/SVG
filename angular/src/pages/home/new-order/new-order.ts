import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
//import { SubmitNewOrder } from '../../../model/OrderModel';
import { OrderService } from '../../../service/OrderService';
import { LoginService } from '../../../service/LoginService';
import { AuthService } from '../../../service/AuthService';
import { CommonProvider } from '../../../providers/common';
import { BaiduMapProvider } from '../../../providers/baidu-map/baidu-map';
import { CitySearchComponent } from '../../../components/city-search/city-search';
import { SelectPhotoComponent } from '../../../components/select-photo/select-photo';
import moment from 'moment';


@IonicPage()
@Component({
	selector: 'page-new-order',
	templateUrl: 'new-order.html',
	providers: [OrderService, LoginService]
})
export class NewOrderPage {
	maintainList: any = [];//后台获取的保养数据
	repairList: any = [];//后台获取的维修数据
	orderTypeList: any = [{id:1,itemName:'进出站'}, {id:2,itemName:'外出救援'}];//工单类型列表
	assigners: any = [];//指派人员列表
	query: any =  {
		 //预约方式
		 orderWay: '3',
		 //服务站ID
		 serviceStationId: '',
		 //服务站code
		 stationCode: '',
		 //服务站地址
		 serviceStationAdd: '',
		 //服务站名
		 serviceStationName: '',
		 //服务站经度
		 serviceStationLon: '',
		 //服务站纬度
		 serviceStationLat: '',
		 //服务站电话
		 serviceStationTel: '',
		 //工单类型
		 woType: 0,
		 //报修人
		 repairName: '',
		 //手机
		 repairTel: '',
		 //预约时间
		 orderTime: '',
		 //车辆位置
		 repairAdd: '',
		 //车辆经度
		 repairLon: '',
		 //车辆纬度
		 repairLat: '',
		 //报修地的行政编码
		 areaCode: '',
		 //保养code
		 matainCode: '',
		 //保养名称
		 matainName: '',
		 //维修code
		 repairItemCode: '',
		 //维修名称
		 repairItemName: '',
		 //故障描述
		 userFeedback: '',
		 //图片地址
		 fileUrls: '',
		 //指派人员
		 assignPersion: '',
		 //vin码
		 vinCode: ''
	} //回传给后台的数据
	minDate: any = moment().format('YYYY-MM-DD');//日历最小时间
	positionObj: any = {};//车辆位置详细信息
	currentLat: string = '';//当前位置的纬度
	currentLon: string = '';//当前位置的纬经度
	repairItemCode: any = [];//维修项code
	repairItemName: any = [];//维修项name
	showTip: boolean = false;//显示提示信息
	orderTime: string = moment().format('YYYY-MM-DD');//预约时间
	serviceName: string = '';//非管理员下的指派人员
	@ViewChild(SelectPhotoComponent) selectPhoto: SelectPhotoComponent;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public modalCtrl: ModalController, 
		public orderService: OrderService, 
		public loginService: LoginService, 
		public authService: AuthService, 
		public commonProvider: CommonProvider, 
		public baiduMapProvider: BaiduMapProvider, 
		public ele: ElementRef) {
			this.loginService.getInfo('stationInfo')
			.then(data => {
				if(data) {
					this.query.serviceStationId = data.serverStationId;
					this.query.serviceStationAdd = data.stationAddr;
					this.query.serviceStationName = data.stationName
					this.query.serviceStationLon = data.lon;
					this.query.serviceStationLat = data.lat;
					this.query.serviceStationTel = data.stationTel;
					this.init(this.authService.getRoleCode());
				}
			})
			
	}
	ngOnInit(){
		document.querySelector('page-new-order').addEventListener('touchend', (e:any) => {
			if(e.target.getAttribute('class') !== 'selectPonsition') this.showTip = false;
		});
	}
	ionViewDidLoad() {
		this.getMaintainList();
		this.getRepairList();
	}
	ionViewDidEnter() {
		
	}
	private init(user) {
		if(user) {
			if(user == '2') {
				this.loginService.getInfo('userInfo')
				.then(data => {
					if(data) {
						this.query.stationCode = data.serviceCode;
						this.serviceName = data.accountName;
						this.query.assignPersion = data.accountId;
					}
				})
				
			}else{
				this.getMembers();
			}
		}
		
	}
	//获取车辆位置成功的回调
	private addressSuccess(data) {
		this.query.repairAdd = data.addr.replace(/中国/, '');
		this.positionObj = data;
		this.currentLat = data.latitude;
		this.currentLon = data.longitude;
		let point = this.baiduMapProvider.baiduToGoogle(data.longitude,data.latitude);
		this.positionObj.latitude = point.lat;
		this.positionObj.longitude = point.lng;
		this.query.repairLon = this.positionObj.latitude;
		this.query.repairLat = this.positionObj.longitude;
		this.baiduMapProvider.getAddress(data.latitude,data.longitude,'bd09ll')
		.map(result => result.json())
		.subscribe(data => this.query.areaCode = data.result.addressComponent.adcode);
	}
	
	//打开搜索地址页面
	public openCity() {
		const cityModal = this.modalCtrl.create(CitySearchComponent, 
			{
				lat: this.currentLat, 
				lon: this.currentLon, 
				city: this.positionObj.city, 
				adcode: this.query.areaCode
			});
		cityModal.onDidDismiss(data => {//获取modal消失后回传的数据
			if(data) {
				if(data.lon != '' || data.lat != ''){
					let point = this.baiduMapProvider.baiduToGoogle(data.lon,data.lat);
					this.positionObj.latitude = point.lat;
					this.positionObj.longitude = point.lng;
				}
				if(data.adcode != ''){
					this.query.areaCode = data.adcode;
				}
				if(data.address != ''){
					this.query.repairAdd = data.address;
				}	
			}
		})
		cityModal.present();
	}
	//获取保养项
	private getMaintainList() {
		this.orderService.getOrders('1')
		.then(data => {
			if(data) {
				this.maintainList = data.list;
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}
	//获取维修项
	private getRepairList() {
		this.orderService.getOrders('2')
		.then(data => {
			if(data) {
				this.repairList = data.list;
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}
	//获取指派人
	private getMembers() {
		this.orderService.getAssigners(this.query.serviceStationId)
		.then(data => {
			if(data) {
				if(data.length != 0) {
					this.assigners = data;
				}
			}
		})
		.catch(err => {
			this.commonProvider.presentToast(err.message);
		})
	}
	//监听工单类型切换的事件，无论任何类型都要获取当前的位置信息，分开写，不写在constructor中是因为进入页面加载慢，目前没有更好的方法
	public changeOrderType() {
		if(this.query.woType == 2) {
			this.showTip = true;
			this.baiduMapProvider.getCurrentLocation(this.addressSuccess.bind(this));
		}
	}
	
	//保养项目数据处理
	public changeService(index,data) {
		let currentLis = this.ele.nativeElement.querySelectorAll('.service');
		let currentLi = currentLis[index];
		let currentLabel = currentLi.querySelector('label');
		let labelClass = currentLabel.className;
		if(labelClass == 'default') {
			for(let i=0;i<currentLis.length;i++){
				let otherLabel = currentLis[i].querySelector('label');
				let inputEle = currentLis[i].querySelector('input');
				inputEle.checked = false;
				this.commonProvider.removeClass(otherLabel,'active');
			}
			this.commonProvider.addClass(currentLabel,'active');
			this.query.matainCode = data.id;
			this.query.matainName = data.itemName;
		}else{
			this.commonProvider.removeClass(currentLabel,'active');
			this.query.matainCode = null;
			this.query.matainName = null;
		}
	}
	//维修项目数据处理
	public changeRepair(index,data) {
		let currentLis = this.ele.nativeElement.querySelectorAll('.repair');
		let currentLi = currentLis[index];
		let currentLabel = currentLi.querySelector('label');
		let labelClass = currentLabel.className;
		if(labelClass == 'default') {
			this.commonProvider.addClass(currentLabel,'active');
			this.repairItemCode.push(data.id);
			this.repairItemName.push(data.itemName);
			
		}else{
			this.commonProvider.removeClass(currentLabel,'active');
			let i = this.query.repairItemCode.indexOf(data.id);
			this.repairItemCode.splice(i,1);
			this.repairItemName.splice(i,1);
		}
	}
	//提交
	public submit() {
		if(this.query.woType == 1) {//进出站，此处请求当前位置的信息
			this.baiduMapProvider.getCurrentLocation((data)=> {
				alert(JSON.stringify(data))
				this.query.repairAdd = data.addr.replace(/中国/, '');
				this.positionObj = data;
				this.currentLat = data.latitude;
				this.currentLon = data.longitude;
				let point = this.baiduMapProvider.baiduToGoogle(data.longitude,data.latitude);
				this.positionObj.latitude = point.lat;
				this.positionObj.longitude = point.lng;
				this.query.repairLon = this.positionObj.latitude;
				this.query.repairLat = this.positionObj.longitude;
				this.baiduMapProvider.getAddress(data.latitude,data.longitude,'bd09ll')
				.map(result => result.json())
				.subscribe(data => this.query.areaCode = data.result.addressComponent.adcode);
				this.doUpload();//执行上传图片
			});
		}else{//外出救援,外出救援需要在页面中显示当前位置的信息
			this.doUpload();
		}
	}
	//上传图片
	private doUpload() {
		let fileUrls = [];
		if(this.selectPhoto&&this.selectPhoto.photoes){
			if(this.selectPhoto.photoes.length == 0) {
				this.query.fileUrls = '';
				this.doCheckout('');
			}else{
				for(let i=0;i<this.selectPhoto.photoes.length;i++) {
					this.commonProvider.uploadFile(this.selectPhoto.photoes[i])
					.then(data => {
						if(data) {
							if(data.status == 200) {
								fileUrls.push(data.data.fullPath);
								this.doCheckout(fileUrls);
							}
						}
					})
					.catch(err => {
						this.commonProvider.presentToast(err);
					})
				}
			}
		}else{//没选择图片
			this.doCheckout('');
		}
	}
	//校验，提交
	private doCheckout(fileUrls) {
		this.query.vinCode = this.navParams.get('vin');
		this.query.repairItemCode = this.repairItemCode.join(',');
		this.query.repairItemName = this.repairItemName.join(',');
		this.query.orderTime = this.orderTime + ' 23:59:59';
		if(fileUrls.length == 0) {
			this.query.fileUrls = '';
		}else{
			this.query.fileUrls = fileUrls.join(';');
		}

		if(this.query.repairItemCode == '') {
			this.query.repairItemCode = null;
			this.query.repairItemName = null;
		}
		
		if(this.query.woType == undefined){
			this.commonProvider.presentToast('请选择工单类型');
		}else if(this.query.repairName == '') {
			this.commonProvider.presentToast('请填写报修人姓名');
		}else if(this.query.repairTel == '') {
			this.commonProvider.presentToast('请填写预约人手机号');
		}else if(/^1[35784]\d{9}$/.test(this.query.repairTel) == false){
			this.commonProvider.presentToast('手机号格式错误');
		}else if(this.query.repairItemCode == null && this.query.matainCode == null) {
			this.commonProvider.presentToast('请选择预约项目');
		}else if(this.query.repairAdd == '') {
			this.commonProvider.presentToast('请点击选择车辆位置');
		}else{
			if(this.query.woType == 1) {
				this.query.areaCode = null;
			}
			let loader = this.commonProvider.createLoading('提交中');
			loader.present();
			console.log(this.query)
			this.orderService.pushOrderData(this.query)
			.then(data => {
				alert(JSON.stringify(data))
				loader.dismiss();
				this.commonProvider.presentToast('工单已创建成功！');
				if(this.query.woType == 1) {//进出站跳转到
					this.pushPage({status: "3", statusName: "待接车", woType: "1"});
				}else{
					this.pushPage({status: "2", statusName: "待出发", woType: "2"});
				}
			})
			.catch(err => {
				loader.dismiss();
				this.commonProvider.presentToast(err.message);
			})
		}
	}
	//提交后的页面跳转
	private pushPage(obj) {
		this.navCtrl.push('OrderListPage', obj
		).then(() => {
			this.navCtrl.remove(1, this.navCtrl.length()-2);
		});
	}
}
