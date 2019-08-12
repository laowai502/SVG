import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
	selector: 'help-place',
	template: `
		<ion-content>
			<ion-row>
				<ion-col col-12></ion-col>
				<ion-col col-12>车身位置示意图一</ion-col>
				<ion-col col-12>底盘号是您车辆Vin的后8位，</ion-col>
				<ion-col col-12>重卡车VIN号在车架右前方。</ion-col>
				<ion-col col-12></ion-col>
				<ion-col col-12>车身位置示意图二</ion-col>
				<ion-col col-12>底盘号是您车辆Vin的后8位，</ion-col>
				<ion-col col-12>中卡和中置轴车VIN号在车架右中部。</ion-col>
				<ion-col col-12><a (click)="cancel()">知道了</a></ion-col>
			</ion-row>
		</ion-content>
	`
})
export class HelpPlaceComponent {
	
	constructor(private viewCtrl: ViewController){}
	
	cancel(){
		this.viewCtrl.dismiss();
	}
}