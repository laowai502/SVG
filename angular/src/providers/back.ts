import { Injectable } from '@angular/core';
import { Platform, App, NavController, Tabs } from 'ionic-angular';

import { CommonProvider } from './common';

@Injectable()
export class BackProvider {

	private backButtonPressed: boolean = false;

	constructor(public app: App, public platform: Platform, public common: CommonProvider) {}

	public registerBackButtonAction(tabRef: Tabs): void {
		this.platform.registerBackButtonAction(() => {
			//获取NavController
			let activeNav: NavController = this.app.getActiveNav();
			if(activeNav.canGoBack()) {
				activeNav.pop();
			} else {
				if(tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
					this.exit();
				} else {
					tabRef.select(0);
				}
			}
		});
	}

	public exit(): void {
		if(this.backButtonPressed) {
			this.platform.exitApp();
		} else {
			this.common.httpToast('再按一次退出应用', 2000);
			this.backButtonPressed = true;
			setTimeout(() => this.backButtonPressed = false, 2000);
		}
	}

}