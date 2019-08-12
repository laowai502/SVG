import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule }    from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { DetailPageModule }  from '../pages/home/detail/detail.module';
import { BreakCodePageModule }  from '../pages/home/break-code/break-code.module';

import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { FileTransfer } from '@ionic-native/file-transfer';

import { BackProvider } from '../providers/back';
import { CommonProvider } from '../providers/common';
import { StorgeProvider } from '../providers/storge';
import { BaiduMapProvider } from '../providers/baidu-map/baidu-map';

import { FetchService } from '../service/FetchService';
import { CommonService } from '../service/CommonService';
import { AuthService } from '../service/AuthService';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		HttpModule,
		JsonpModule,
		BrowserModule,
		IonicStorageModule.forRoot(),
		IonicModule.forRoot(MyApp, {
			pageTransition: 'ios-transition',
			tabsHideOnSubPages: true,
			backButtonText: '',
			iconMode: 'ios',
			mode: 'ios'
		}),
		DetailPageModule,
		BreakCodePageModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		StatusBar,
		SplashScreen,
		NativeStorage,
		Network,
		FileTransfer,
		{
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		},
		
		BackProvider,
    	CommonProvider,
		StorgeProvider,	
		BaiduMapProvider,
		
    	FetchService,
    	CommonService,
    	AuthService
	]
})
export class AppModule {}