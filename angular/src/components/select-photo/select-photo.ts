import { Component, Input } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CommonProvider } from '../../providers/common';

import { BaiduMapProvider } from '../../providers/baidu-map/baidu-map';

import moment from 'moment';

@Component({
	selector: 'select-photo',
	template: `
  		<ion-thumbnail class="photo" *ngFor="let photo of photoes" (press)="showDelete()" (tap)="browse()">
			  <img class="native-img" [src]="photo">
			  <div *ngIf="showRemove" class="remove" (tap)="delete(photo)"><ion-icon name="md-close" color="danger" item-end></ion-icon></div>
		</ion-thumbnail>
		<ion-thumbnail class="photo" *ngIf="showBtn" (tap)="openCamera()">
			<img src="assets/images/img-position.png">	
		</ion-thumbnail>
		<div class="browse-img-bg" *ngIf="showBigImg">
		</div>
		<ion-slides class="browse-img" *ngIf="showBigImg">
			<ion-slide *ngFor="let photo of photoes" (tap)="closeBrowse()">
				<ion-thumbnail class="photo">
					<img [src]="photo" class="big-img">	
				</ion-thumbnail>
			</ion-slide>
		</ion-slides>`,
	providers: [Camera]
})
export class SelectPhotoComponent {

	photoes: any = [];
	showBtn: boolean = true;
	actionSheet: any;
	showRemove: boolean = false;
	showBigImg: boolean = false;

	@Input()
	public max: string;
	@Input()
	public selector: string;
	@Input()
	public type: string; //0: 只允许拍照

	constructor(public actionSheetCtrl: ActionSheetController, public bMap: BaiduMapProvider,
		public camera: Camera, public commonProvider: CommonProvider) {
		this.actionSheet = {
			cssClass: 'action-sheets-basic-page',
			buttons: [{
				text: '拍照',
				handler: () => {
					this.getPhoto()
						.then((imageData) => {
							this.photoes.push('data:image/jpeg;base64,' + imageData);
							this.showBtn = this.photoes.length != this.max ? true : false;
						}, () => {
							//this.commonProvider.presentToast('未获取到相机权限，请开启相机权限！');
						});
				}
			}, {
				text: '从相册选择',
				handler: () => {
					this.selectImg()
						.then((imageData) => {
							this.photoes.push('data:image/jpeg;base64,' + imageData);
							this.showBtn = this.photoes.length != this.max ? true : false;
						}, () => {
							//this.commonProvider.presentToast('未获取到相机权限，请开启相机权限！');
						});
				}
			}]
		}
	}
	
	ngOnInit(){
		moment.locale('zh-CN');
		this.showBigImg = false;
		document.querySelector(this.selector).addEventListener('touchend', (e:any) => {
			if(e.target.getAttribute('class') !== 'native-img') this.showRemove = false;
		});
	}
	
	public openCamera() {
		this.actionSheet.buttons[2] = {
			text: '取消',
			role: 'cancel'
		};
		if(this.type !== '0'){
			this.actionSheetCtrl.create(this.actionSheet).present();			
		}else{
			this.getPhoto().then(imageData => {
				this.addPicFlag('data:image/jpeg;base64,' + imageData);
			}).catch(() => {});
		}
	}
	//拍照
	private getPhoto() {
		const options: CameraOptions = {
			quality: 50,
			allowEdit: true,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG
		}
		return this.camera.getPicture(options);
	}
	//从相册选择
	private selectImg() {
		const options: CameraOptions = {
			quality: 50,
			allowEdit: true,
			saveToPhotoAlbum: true,
			sourceType: 0,
			destinationType: this.camera.DestinationType.DATA_URL
		}
		return this.camera.getPicture(options);
	}
	/**
	 * 删除图片
	 * @param photo 要删除的照片 
	 */
	public delete(photo) {
		this.photoes.forEach((element, index) => {
			if(element == photo) {
				this.photoes.splice(index, 1);
			}
		});
		this.showBtn = true;
	}
	//长按图片展示删除按钮
	public showDelete(){
		this.showRemove = true;
	}

	//浏览图片
	public browse() {
		this.showBigImg = true;
	}
	//关闭浏览图片
	public closeBrowse() {
		this.showBigImg = false;
	}
	
	//图片加水印
	addPicFlag(base64Image) {
		let loading = this.commonProvider.createLoading(),
			date: string = moment().format('LLL'),
			canvas = document.createElement('canvas'),
			cxt = canvas.getContext('2d'),
			img = new Image();
		loading.present();
		cxt.fillStyle = 'green';
		cxt.fillRect(10, 10, 100, 100);
		img.src = base64Image;
		img.onload = () => {
			canvas.height = img.height;
			canvas.width = img.width;
			cxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
			cxt.save();
			cxt.font = 60 + "px Arial";
			cxt.fillStyle = "#bd1313";
			this.bMap.getCurrentLocation(data => {
				cxt.fillText(date, 0, 60);
				cxt.fillText(data.addr.replace(/中国/, ''), 0, canvas.height-30);
				this.photoes.push(canvas.toDataURL("image/jpeg", 0.5));
				loading.dismiss();
				this.showBtn = this.photoes.length != this.max ? true : false;
			});
		}
	}
}