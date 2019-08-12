import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
	selector: 'page-code',
	template: `
		  <ion-header>
		  <ion-navbar>
			  <ion-title>故障说明</ion-title>
		  </ion-navbar>
		  </ion-header>
		  <ion-content padding>
		  <ion-item>
		  	<p>{{info}}</p>
		  </ion-item>
		  </ion-content>`,
})
export class CodePage {
    info: string = '未查询到对应的故障说明！';
	constructor( 
		public navParams: NavParams,) {
            if(navParams.data != ''){
                this.info = navParams.data;
            }
	}

	ionViewDidLoad() {}
}