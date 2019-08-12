import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponRecordPage } from './coupon-record';
import { CouponService } from '../../../../../../service/CouponService';

@NgModule({
	declarations: [
		CouponRecordPage,
	],
	imports: [
		IonicPageModule.forChild(CouponRecordPage),
	],
	providers: [CouponService]
})
export class CouponRecordPageModule { }
