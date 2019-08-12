import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, Platform } from 'ionic-angular';
import { BackProvider } from '../../providers/back';


@IonicPage()
@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {

	@ViewChild('mainTabs') mainTabs: Tabs;
	private tabs: Object[];

	constructor(private back: BackProvider, private platform: Platform) {
		this.tabs = [
			{
				root: 	  'HomePage',
				tabTitle: '首页',
				tabIcon:  'home'
			},
			{
				root: 	  'MessagePage',
				tabTitle: '消息',
				tabIcon:  'home'
			},
			{
				root: 	  'HistoryPage',
				tabTitle: '历史工单',
				tabIcon:  'home'
			},
			{
				root: 	  'SettingPage',
				tabTitle: '我的',
				tabIcon:  'home'
			}
		];
		
		this.platform.ready().then(() => {
			this.back.registerBackButtonAction(this.mainTabs);
		});
	}
}