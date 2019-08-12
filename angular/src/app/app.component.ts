import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { StorgeProvider } from '../providers/storge';
import { CommonProvider } from '../providers/common';

import { AuthService } from '../service/AuthService';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	
	rootPage: any = null;

	constructor(platform: Platform, statusBar: StatusBar,
			    private storge: StorgeProvider, private auth: AuthService,
				private common: CommonProvider) {
		platform.ready().then(() => {
			statusBar.backgroundColorByHexString('#4287ff');
			statusBar.overlaysWebView(false);
			this.common.onDisconnect();
			this.isLogin();
		});

	}
				
	isLogin():void {
//		this.rootPage = 'TabsPage';
		this.storge.getStorage('userInfo').then(data => {
			if(data){
				this.auth.setRoleCode(data.roleCode);
				this.auth.setToken(data.token);
				this.rootPage = 'TabsPage';
			}else{
				this.rootPage = 'LoginPage';
			}
		}).catch(() => {
			this.rootPage = 'LoginPage';
		});
	}
	
}