import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import { CommonProvider } from './common';

@Injectable()
export class StorgeProvider {

	constructor(public storage: Storage, public native: NativeStorage, public common: CommonProvider) {}

	public saveStorage(key: string, value: any): Promise < any > {
		if(this.common.isMobile()) {
			return this.native.setItem(key, value);
		} else {
			return this.storage.set(key, value);
		}
	}
	public getStorage(key: string): Promise < any > {
		if(this.common.isMobile()) {
			return this.native.getItem(key);
		} else {
			return this.storage.get(key);
		}
	}
	public removeStorage(key: string): Promise < any > {
		if(this.common.isMobile()) {
			return this.native.remove(key);
		} else {
			return this.storage.remove(key);
		}
	}
	public cleanStorage(): Promise < any > {
		if(this.common.isMobile()) {
			return this.native.clear();
		} else {
			return this.storage.clear();
		}
	}

}