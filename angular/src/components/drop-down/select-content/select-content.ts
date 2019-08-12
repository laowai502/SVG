import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common';
import moment from 'moment';

@Component({
	selector: 'select-content',
	template: `
	<ul class="select-list">
		<li *ngFor="let obj of options">
			<button (tap)="select(obj)">{{obj.name}}</button>
			<ion-icon name="ios-checkmark" color="primary" *ngIf="obj.checked"></ion-icon>
		</li>
		<li>
			<button (tap)="selectOther()">选择查询区间</button>
		</li>
		<li class="select-date-range" *ngIf="showDate">
			<span>从：</span>
			<ion-datetime 
				displayFormat="YYYY-MM-DD" 
				[(ngModel)]="startDate" 
				[max]="endDate!=''?endDate:maxDate"
				cancelText="取消"
				doneText="确定">
			</ion-datetime>
			<span>到：</span>
			<ion-datetime 
				displayFormat="YYYY-MM-DD" 
				[(ngModel)]="endDate" 
				[min]="startDate!=''?startDate:'1917-01-01'"
				[max]="maxDate"
				cancelText="取消"
				doneText="确定" >
			</ion-datetime>
			<button ion-button (tap)="select()" [disabled]="startDate==''||endDate==''">确定</button>
		</li>
	</ul>
	  `
})
export class SelectContentComponent {

	options: any = [];
	showDate: boolean = false;
	startDate: string = '';
	endDate: string = '';
	maxDate: string = moment().format('YYYY');
	constructor(
		private navParams: NavParams, 
		public viewCtrl: ViewController, 
		public events: Events, 
		public commonProvider: CommonProvider) {
		console.log('Hello SelectContentComponent Component');
		
	}
	ngOnInit() {
		if (this.navParams.data) {
			this.navParams.data.baseData.forEach(element => {
				if(this.navParams.data.text == element.name) {
					element.checked = true;
				}else{
					element.checked = false;
				}
			});
			this.options = this.navParams.data.baseData;
		}
	}

	public select(data) {
		if(data) {
			this.events.publish('getData', data);
			this.viewCtrl.dismiss();
		}else{
			let mulYear = moment(this.endDate).diff(moment(this.startDate), 'year')
			if(mulYear>1){
				this.commonProvider.presentToast('最大时间跨度为一年');
			}else{
				let data = this.startDate + '至' + this.endDate;
				this.events.publish('getData', data);
				this.viewCtrl.dismiss();
			}
		}
	}

	public selectOther() {
		this.showDate = true;
	}
}
